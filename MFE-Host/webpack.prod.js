const merge = require("webpack-merge");

const common = require("./webpack.common");

const remoteEntryConfig = {
  usCoach: `userStoryCoach@https:fsdfsdfsd/remoteEntry.js`,
};

module.exports = merge(common(remoteEntryConfig), {
  mode: "production",
  devtool: "source-map",
});
