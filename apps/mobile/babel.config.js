module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 3 (Expo 51 / RN 0.74) — pas de react-native-worklets natif (RN 0.75+ requis).
    plugins: ['react-native-reanimated/plugin'],
  };
};
