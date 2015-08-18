(function(_, jz) {
	"use strict";

	var routes = {
		'.*': [jz.menu.setActive, jz.menu.initializeMenu],
        '^/$': jz.index,
		'partners': jz.partners,
		'tickets': jz.tickets,
		'contact': jz.contact,
		'^/info': [jz.info.initializeMap, jz.partners],
		'^/program': jz.program,
        'details': jz.details,
        'workshops': jz.workshops,
        'journeyzone': jz.journeyzone,
        'kids': jz.kids,
        'academy': jz.academy,
        'printprogram': jz.printprogram
	};

	_(Object.keys(routes)).each(function(route) {
		if (new RegExp(route).test(location.pathname)) {
			if (_.isFunction(routes[route]))
				routes[route]();
			else
				_.invoke(routes[route], Function.prototype.apply);
		}
	}).value();

})(window._, window.jz = window.jz || {});