const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { getDefaultConfig: getMetroDefaultConfig } = require("metro-config");

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
const config = {};

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getMetroDefaultConfig();
  return mergeConfig(getDefaultConfig(__dirname), {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer")
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"]
    }
  });
})();
