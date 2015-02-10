exports.config = function(pacbot) {

	var config = {
		port: 3000,
		ignore_build: ["bower_components"],
		ignore_processing: ["assets/templates", "assets/components"],
		assets: {}
	}

	config.assets.js = {
		all: [
			"bower_components/jquery/dist/jquery.min.js",
			"bower_components/lodash/dist/lodash.min.js",
			"bower_components/velocity/velocity.min.js",
			"assets/js/modernizr.js",
			"assets/js/svg_animate.js",
			"assets/js/data.js",
			"assets/js/menu.js",
			"assets/js/menu_scroll.js",
			"assets/js/partners.js",
			"assets/js/contact.js",
			"assets/js/main.js"
		]
	}

	config.assets.css = {
		all: [
			"assets/css/reset.css",
			"assets/css/base.css",
			"assets/fontello/css/fontello.css",
			"assets/css/framework.css",
			"assets/css/components.css",
			"assets/css/footer.css",
			"assets/css/img.css",
			"assets/css/index.css",
			"assets/css/menu.css",
			"assets/css/interview.css",
			"assets/css/partners.css",
			"assets/css/contact.css",
			"assets/css/illustrations.css",
			"assets/css/speakers.css",
			"assets/css/tickets.css"
		]
	};

	config.helpers = {
		settings: {
			general_mail: 'javazone@java.no',
			partner_mail: 'partner@java.no',
			program_mail: 'program@java.no',
			submitit_url: 'http://javazone.no/submitit/',
			javabin_membership_url: 'http://java.no/index.html?page=medlemskap',
			tickets_buy_url: 'https://www.eventsystems.no/es/event/javazone2015/',
			tickets_manage_url: 'https://www.eventsystems.no/es/event/javazone2015/'
		}
	};

	return config;
}
