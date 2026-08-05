const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        util: require.resolve("util/"),
        url: require.resolve("url/"),
        buffer: require.resolve("buffer/"),
        assert: require.resolve("assert/"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        path: require.resolve("path-browserify"),
        zlib: require.resolve("browserify-zlib"),
      };
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser.js",
          Buffer: ["buffer", "Buffer"],
        }),
      ]);
      return webpackConfig;
    },
  },
};
