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
          presets: ["stage-0", "react", [
            "env", {
              "targets": {
                "browsers": ["last 2 versions", "ie >= 9"],
              },
              "useBuiltIns": true,
            },
          ]],
          "plugins": [[
            "module-resolver", {
              "root": ["./"],
              "alias": {
                "web": "./src/web",
              },
            },
          ], "autobind-class-methods", "transform-class-properties"],
        },
      },
    }],
  },
  plugins: [new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("development"),
      "BASEPATH": JSON.stringify("/"),
      "DEBUG": JSON.stringify("*"),
    },
  })],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
