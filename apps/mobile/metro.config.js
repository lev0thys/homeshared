const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
/** Brique ads vendoree dans packages/tech-bricks-ads (sync depuis tech-bricks/ pour EAS). */
const techBricksAdsRoot = path.resolve(workspaceRoot, 'packages/tech-bricks-ads');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot, techBricksAdsRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// Une seule instance React/ReactDOM (évite « Cannot read properties of null (reading 'useMemo') » sur web).
const reactRoot = path.join(workspaceRoot, 'node_modules/react');
const reactDomRoot = path.join(workspaceRoot, 'node_modules/react-dom');

const singletonModules = {
  react: path.join(reactRoot, 'index.js'),
  'react-dom': path.join(reactDomRoot, 'index.js'),
  'react/jsx-runtime': path.join(reactRoot, 'jsx-runtime.js'),
  'react/jsx-dev-runtime': path.join(reactRoot, 'jsx-dev-runtime.js'),
};

config.resolver.extraNodeModules = {
  '@tech-bricks/ads': techBricksAdsRoot,
  react: reactRoot,
  'react-dom': reactDomRoot,
};
// true = ignore node_modules locaux des packages workspace (ex. tech-bricks-ads/node_modules/react).
config.resolver.disableHierarchicalLookup = true;

// @homeshared/shared utilise des imports ESM `.js` → fichiers `.ts` (Metro ne les trouve pas sinon)
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const singletonPath = singletonModules[moduleName];
  if (singletonPath) {
    return { type: 'sourceFile', filePath: singletonPath };
  }

  if (moduleName.startsWith('.') && moduleName.endsWith('.js')) {
    const withoutJs = moduleName.slice(0, -3);
    try {
      return context.resolveRequest(context, withoutJs, platform);
    } catch {
      /* fallback */
    }
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
