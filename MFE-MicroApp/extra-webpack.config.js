const singleSpaAngularWebpack =
  require("single-spa-angular/lib/webpack").default;
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { merge } = require("webpack-merge");

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Feel free to modify this webpack config however you'd like to

  moduleFedConfig = {
    plugins: [
      new ModuleFederationPlugin({
        name: "mfeMicroApp",
        filename: "remoteEntry.js",
        exposes: {
          ".": ["./src/styles.scss", "./src/main.single-spa.ts"],
        },
      }),
    ],
  };
  const mergeConfig = merge(singleSpaWebpackConfig, moduleFedConfig);

  return mergeConfig;
};
