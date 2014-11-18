(function(_, jz) {

	var routes = {
		'partners': jz.partners
	};

	_(Object.keys(routes)).each(function(route) {
		if (new RegExp(route).test(location.pathname))
			routes[route]();
	});

})(window._, window.jz = window.jz || {});