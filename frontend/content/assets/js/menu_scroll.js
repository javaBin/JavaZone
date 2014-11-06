(function() {

	var SCALE_FACTOR = 1;
	var MIN_ZOOM = .5;
	var MAX_ZOOM = 1;

	function style(el, style, val) {
		el.style[style] = val;
	}

	function scale(el, val) {
		['WebkitTransform', 'MozTransform', 'OTransform', 'transform'].forEach(function (s) {
			style(el, s, val);
		});
	}

	var menuContainer = document.querySelector('.nav');
	var logo = document.querySelector('.nav svg');
	var text = document.querySelector('.nav #javazone-text');

	window.addEventListener('scroll', function() {
		var scaleFactor = MAX_ZOOM - Math.min(
			Math.max(MAX_ZOOM, (window.scrollY / SCALE_FACTOR)) / 100, MIN_ZOOM
		);

		var opacity = 1 - (window.scrollY / 100) * 2;
		var height = scaleFactor * 98;

		requestAnimationFrame(function() {
			style(text, 'opacity', opacity);
			style(logo, 'height', height);
		});

	});

})();