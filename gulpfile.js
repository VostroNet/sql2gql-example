"use strict"; //eslint-disable-line
require("babel-core/register");
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const del = require("del");
// const mocha = require("gulp-mocha");
const babel = require("gulp-babel");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackDevConfig = require("./webpack-dev.config");
const webpackProdConfig = require("./webpack-prod.config");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("webpack:dev-server", (callback) => {
  // Start a webpack-dev-server
  var compiler = webpack(webpackDevConfig);
  return new WebpackDevServer(compiler, {
    inline: true,
    noInfo: false,
    watchOptions: {
      aggregateTimeout: 10000,
      poll: 100,
    },
    publicPath: webpackDevConfig.output.publicPath,
    stats: {colors: true},
    proxy: {
      "*": {
        target: "http://127.0.0.1:4081",
        secure: false,
      },
    },
    disableHostCheck: true,
  }).listen(4080);

});
gulp.task("webpack:build", (callback) => {
  // run webpack
  var compiler = webpack(webpackProdConfig);
  compiler.run(function(err, stats) {
    console.log(stats.toString({
      assets: true,
      timings: true,
      chunks: true,
      modules: true,
      hash: true,
    }));
    callback();
  });
});

gulp.task("copy:public", ["clean:public"], () => {
  return gulp.src("src/public/**/*")
    .pipe(gulp.dest("build/public/"));
});

gulp.task("clean:server", () => {
  return del(["build/server/**/*"]);
});

gulp.task("clean:public", () => {
  return del(["build/public/**/*"]);
});

var babelOptions = {
  "presets": [[
    "env", {
      "targets": {
        "node": "current",
      },
      "useBuiltIns": true,
    },
  ], "stage-0"],
  "plugins": [[
    "module-resolver", {
      "root": ["./"],
      "alias": {
        "config": "./config.js",
        "server": "./src/server",
      },
    },
  ], "autobind-class-methods", "transform-class-properties"],
};

gulp.task("compile:server", ["lint:server"], () => {
  return gulp.src(["src/server/**/*"])
    .pipe(sourcemaps.init())
    // .pipe(sourcemaps.identityMap())
    .pipe(babel(babelOptions))
    .pipe(sourcemaps.write(".", {includeContent: false, sourceRoot: "../../src/server/"}))
    .pipe(gulp.dest("build/server"));
});

gulp.task("lint:server", ["clean:server"], () => {
  return gulp.src(["src/server/**/*.js"])
    .pipe(eslint({
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("watch", () => {
  gulp.watch(["src/server/**/*.*", "./config.js", "./*.config.js"], ["compile:server"]);
  gulp.watch("src/public/**/*.*", ["copy:public"]);
});

gulp.task("default", ["compile:server", "copy:public"]);
