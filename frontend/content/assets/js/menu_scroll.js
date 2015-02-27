(function(_) {

	var SCALE_FACTOR = 1;
	var MIN_ZOOM = .5;
	var MAX_ZOOM = 1;

	function style(el, style, val) {
		if (!(el instanceof NodeList))
			el = [el];

		_(el).each(function(e) {
			e.style[style] = val;
		}).value();
	}

	function transform(el, val) {
		['WebkitTransform', 'MozTransform', 'OTransform', 'transform'].forEach(function (s) {
			style(el, s, val);
		});
	}

	var menuContainer = document.querySelector('.nav');
	var logo = document.querySelector('.nav svg');
	var text = document.querySelector('.nav #javazone-text');
	var leftItems = document.querySelectorAll('.nav-desktop .nav-item.left a');
	var rightItems = document.querySelectorAll('.nav-desktop .nav-item:not(.left) a');
	var menuToggle = document.querySelectorAll('.nav-toggle');

	window.addEventListener('scroll', function() {
		var scaleFactor = MAX_ZOOM - Math.min(
			Math.max(MAX_ZOOM, (window.scrollY / SCALE_FACTOR)) / 100, MIN_ZOOM
		);

		var opacity = Math.max(1 - (window.scrollY / 100) * 2, 0);
		var height = scaleFactor * 98;
		var translationX = 30 - (scaleFactor * 30);
		var translationY = 46 - (scaleFactor * 46);

		if (opacity < .01)
			style(text, 'height', 0);

		requestAnimationFrame(function() {
			style(text, 'opacity', opacity);
			style(logo, 'height', height);
			transform(leftItems, 'translate(' + translationX + 'px, -' + translationY + 'px)');
			// transform(leftItems, 'translateY(-' + translation + 'px)');
			transform(rightItems, 'translate(-' + translationX + 'px, -' + translationY + 'px)');
			// transform(rightItems, 'translateY(-' + translation + 'px)');
			transform(menuToggle, 'translateY(-' + translationY + 'px)');
		});

	});

})(window._);