const path = require("path");

const argv = require("minimist")(process.argv.slice(2));
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

const targerPort = argv["port"] || 55000;

const remoteConfig = {
  mfeMicroApp: `mfeMicroApp@http://localhost:4200/remoteEntry.js`,
};

module.exports = merge(common(remoteConfig), {
  mode: "development",
  devtool: "inline-source-map",

  optimization: {
    minimize: false,
  },

  output: {
    publicPath: `http://localhost:${targerPort}/`,
  },

  devServer: {
    static: path.join(__dirname, "public"),
    port: targerPort,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
});
