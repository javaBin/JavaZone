/*global exports */

exports.config = {

  ignore_build: ["bower_components"],
  ignore_processing: ["assets/templates", "assets/components"],

  assets: {

    js: {
      all: [
        "bower_components/lodash/dist/lodash.min.js",
        "assets/js"
      ]
    },

    css: {
      all: [
        "assets/css/reset.css",
        "assets/css/base.css",
        "assets/css/components.css",
        "assets/css/teaser.css",
        "assets/css/menu.css"
      ]
    }
  }
};
