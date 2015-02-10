(function(_, jz) {
	"use strict";

	var routes = {
		'.*': [jz.menu.setActive, jz.menu.initializeMenu],
		'partners': jz.partners,
		'tickets': jz.tickets,
		'contact': jz.contact
	};

	_(Object.keys(routes)).each(function(route) {
		if (new RegExp(route).test(location.pathname)) {
			if (typeof routes[route] === 'function')
				routes[route]();
			else
				_.invoke(routes[route], Function.prototype.apply);
		}
	});

})(window._, window.jz = window.jz || {});