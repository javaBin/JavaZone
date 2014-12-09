exports.config = function(pacbot) {

	var config = {
		port: 3000,
		ignore_build: ["bower_components"],
		ignore_processing: ["assets/templates", "assets/components"],
		assets: {}
	}

	config.assets.js = {
		all: [
			"bower_components/lodash/dist/lodash.min.js",
			"bower_components/velocity/velocity.min.js",
			"assets/js/modernizr.js",
			"assets/js/svg_animate.js",
			"assets/js/data.js",
			"assets/js/menu.js",
			"assets/js/menu_scroll.js",
			"assets/js/partners.js",
			"assets/js/main.js"
		]
	}

	config.assets.css = {
		all: [
			"assets/css/reset.css",
			"assets/css/base.css",
			"assets/css/framework.css",
			"assets/css/components.css",
			"assets/css/img.css",
			"assets/css/teaser.css",
			"assets/css/menu.css",
			"assets/css/interview.css",
			"assets/css/partners.css",
			"assets/css/contact.css"
		]
	};

	config.helpers = {
		settings: {
			partner_mail: 'partner@java.no'
		}
	};

	return config;
}
