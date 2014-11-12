exports.config = function(pacbot) {

	var config = {
		port: 3000,
		ignore_build: ["bower_components"],
		ignore_processing: ["assets/templates", "assets/components"],
		assets: {}
	};

	config.assets.js = {
		all: [
			"bower_components/lodash/dist/lodash.min.js",
			"bower_components/velocity/velocity.min.js",
			"assets/js/modernizr.js",
			"assets/js/svg_animate.js",
			"assets/js"
		]
	}

	config.assets.css = {
		all: [
			"assets/css/reset.css",
			"assets/css/teaser.css",
			"assets/css/interview.css"
		]
	};

	config.assets.less = {
		all: [
			"assets/less/base.less",
			"assets/less/components.less",
			"assets/less/menu.less",
		]
	};

	return config;
}
