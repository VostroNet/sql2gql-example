const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    bundle: [
      path.resolve(__dirname, "./src/web/index.jsx"),
    ],
  },
  output: {
    path: path.resolve(__dirname, "./build/public/assets/"),
    publicPath: "/assets/",
    filename: "[name].js",
  },
  module: {
    rules: [{
      test: /\.js$|\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [[
            "env", {
              "targets": {
                "browsers": ["last 2 versions", "ie >= 9"],
              },
              "useBuiltIns": true,
            },
          ], "stage-0", "react"],
          "plugins": [[
            "module-resolver", {
              "root": ["./"],
              "alias": {
                "utils": "./src/utils",
                "web": "./src/web",
              },
            },
          ], "autobind-class-methods", "transform-class-properties"],
        },
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
        "BASEPATH": JSON.stringify("/"),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
