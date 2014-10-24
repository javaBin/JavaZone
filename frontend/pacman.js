/*global exports */

exports.config = {

  ignore_build: ["components"],
  ignore_processing: ["assets/templates", "assets/components"],

  assets: {

    js: {
      all: [
        "assets/js"
      ]
    },

    css: {
      all: [
        "assets/css/reset.css"
      ]
    }

  }

};
