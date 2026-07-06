/**
 * Plugin Expo : correctifs Gradle pour monorepo pnpm (export:embed / Metro serverRoot).
 * Appliqué au prebuild Android — persiste les patches au-delà de `expo prebuild --clean`.
 */
const {
  withAppBuildGradle,
  withGradleProperties,
} = require('expo/config-plugins');

const MONOREPO_ENTRY = 'apps/mobile/index.js';

function withMonorepoAndroidGradle(config) {
  config = withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (!contents.includes('extraPackagerArgs')) {
      contents = contents.replace(
        /react\s*\{/,
        `react {
    root = file("../../")
    extraPackagerArgs = ["--entry-file", "${MONOREPO_ENTRY}"]`,
      );
    }
    if (contents.includes('def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()')) {
      contents = contents.replace(
        'def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()',
        'def projectRoot = rootDir.getAbsoluteFile().getParentFile().getParentFile().getAbsolutePath()',
      );
    }
    if (contents.includes("require('expo/scripts/resolveAppEntry')")) {
      contents = contents.replace(
        /entryFile = file\(\["node".*?\)\)/s,
        'entryFile = file("../../index.js")',
      );
    }
    cfg.modResults.contents = contents;
    return cfg;
  });

  config = withGradleProperties(config, (cfg) => {
    const props = cfg.modResults;
    const setProp = (key, value) => {
      const idx = props.findIndex((p) => p.type === 'property' && p.key === key);
      if (idx >= 0) {
        props[idx].value = value;
      } else {
        props.push({ type: 'property', key, value });
      }
    };
    setProp('android.minSdkVersion', '24');
    return cfg;
  });

  config = withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (!contents.includes('keystorePropertiesFile')) {
      contents = contents.replace(
        "def jscFlavor = 'io.github.react-native-community:jsc-android:2026004.+'",
        `def jscFlavor = 'io.github.react-native-community:jsc-android:2026004.+'

def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}`,
      );
      contents = contents.replace(
        /signingConfigs \{\s*debug \{/,
        `signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
        debug {`,
      );
      contents = contents.replace(
        /release \{\s*\/\/ Caution! In production[\s\S]*?signingConfig signingConfigs\.debug/,
        `release {
            signingConfig keystorePropertiesFile.exists()
                ? signingConfigs.release
                : signingConfigs.debug`,
      );
    }
    cfg.modResults.contents = contents;
    return cfg;
  });

  return config;
}

module.exports = withMonorepoAndroidGradle;
