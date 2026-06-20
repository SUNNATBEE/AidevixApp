module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated v4 uses worklets instead of the old reanimated/plugin
    plugins: ['react-native-worklets/plugin'],
  };
};
