const path = require("path");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = (remoteEntryConfig) => {
  return {
    entry: "./src",
    cache: false,

    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },

    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      chunkFilename: "[id].[contenthash].js",
      clean: true,
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
      alias: {
        "@Components": path.resolve(__dirname, "src/components/"),
        "@Contexts": path.resolve(__dirname, "src/contexts/"),
        "@Layouts": path.resolve(__dirname, "src/layouts/"),
        "@Pages": path.resolve(__dirname, "src/pages/"),
        "@Providers": path.resolve(__dirname, "src/providers/"),
        "@Utils": path.resolve(__dirname, "src/utils/"),
        "@Services": path.resolve(__dirname, "src/services/"),
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.(ts)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              options: { transpileOnly: true },
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[hash][ext][query]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[hash][ext][query]",
          },
        },
      ],
    },

    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
      new ModuleFederationPlugin({
        name: "internal-host",
        remotes: { ...remoteEntryConfig },
        shared: {
          //...depedencies
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };
};
