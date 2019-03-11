"use strict";

const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = ({ config, mode }) => ({
  ...config,
  externals: {
    ...config.externals,
    cesium: "Cesium",
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /.(glb|pnts)$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify("/cesium"),
    }),
    ...(mode === "PRODUCTION"
      ? []
      : [
          new CopyPlugin([
            {
              from: "node_modules/cesium/Build/CesiumUnminified",
              to: "cesium",
            },
          ]),
        ]),
  ],
  resolve: {
    ...config.resolve,
    extensions: [...config.resolve.extensions, ".ts", ".tsx"],
  },
});
