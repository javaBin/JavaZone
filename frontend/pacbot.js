exports.config = function(pacbot) {

	var config = {
		port: 3000,
		ignore_processing: ["assets/templates", "assets/components"],
		assets: {}
	}

	config.layouts = {
		'printprogram.html': '_layouts/stripped.html'
	};

	config.assets.js = {
		all: [
			"assets/js/lodash.min.js",
			"node_modules/velocity-animate/velocity.min.js",
			"node_modules/js-cookie/src/js.cookie.js",
			"node_modules/jquery/dist/jquery.min.js",
			"node_modules/handlebars/dist/handlebars.min.js",
			"node_modules/moment/min/moment.min.js",
			"assets/js/superagent.js",
			"assets/js/modernizr.js",
			"assets/js/svg_animate.js",
			"assets/js/data.js",
			"assets/js/menu.js",
			"assets/js/menu_scroll.js",
			"assets/js/partners.js",
			"assets/js/contact.js",
			"assets/js/info.js",
			"assets/js/program.js",
			"assets/js/details.js",
			"assets/js/journeyzone.js",
			"assets/js/workshops.js",
			"assets/js/kids.js",
			"assets/js/academy.js",
			"assets/js/index.js",
			"assets/js/printprogram.js",
			"assets/js/speakerinfo.js",
			"assets/js/feedback.js",
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
			"assets/css/spinner.css",
			"assets/css/footer.css",
			"assets/css/img.css",
			"assets/css/index.css",
			"assets/css/menu.css",
			"assets/css/interview.css",
			"assets/css/partners.css",
			"assets/css/contact.css",
			"assets/css/illustrations.css",
			"assets/css/speakers.css",
			"assets/css/tickets.css",
			"assets/css/info.css",
			"assets/css/toptalks.css",
			"assets/css/volunteer.css",
			"assets/css/program.css",
			"assets/css/details.css",
			"assets/css/workshops.css",
			"assets/css/journeyzone.css",
			"assets/css/kids.css",
			"assets/css/academy.css",
			"assets/css/speakerinfo.css",
			"assets/css/memories.css",
			"assets/css/feedback.css"
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
