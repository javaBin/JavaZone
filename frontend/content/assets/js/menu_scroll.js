(function(_) {

	var SCALE_FACTOR = 1;
	var MIN_ZOOM = .5;
	var MAX_ZOOM = 1;

	function style(el, style, val) {
		if (!(el instanceof NodeList))
			el = [el];

		_(el).each(function(e) {
			e.style[style] = val;
		});
	}

	function transform(el, val) {
		['WebkitTransform', 'MozTransform', 'OTransform', 'transform'].forEach(function (s) {
			style(el, s, val);
		});
	}

	var menuContainer = document.querySelector('.nav');
	var logo = document.querySelector('.nav svg');
	var text = document.querySelector('.nav #javazone-text');
	var leftItems = document.querySelectorAll('.nav-item.left a');
	var rightItems = document.querySelectorAll('.nav-item.right a');

	window.addEventListener('scroll', function() {
		var scaleFactor = MAX_ZOOM - Math.min(
			Math.max(MAX_ZOOM, (window.scrollY / SCALE_FACTOR)) / 100, MIN_ZOOM
		);

		var opacity = Math.max(1 - (window.scrollY / 100) * 2, 0);
		var height = scaleFactor * 98;
		var translation = 30 - (scaleFactor * 30);

		if (opacity < .01)
			style(text, 'height', 0);

		requestAnimationFrame(function() {
			style(text, 'opacity', opacity);
			style(logo, 'height', height);
			transform(leftItems, 'translateX(' + translation + 'px)');
			transform(rightItems, 'translateX(-' + translation + 'px)');
		});

	});

})(window._);