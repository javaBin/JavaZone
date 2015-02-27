(function(_, jz) {

	function style(el, style, val) {
		if (!(el instanceof NodeList))
			el = [el];

		_(el).each(function(e) {
			e.style[style] = val;
		}).value();
	}

	function transitionDelay(el, val) {
		['WebkitTransitionDelay', 'MozTransitionDelay', 'OTransitionDelay', 'transitionDelay'].forEach(function (s) {
			style(el, s, val);
		});
	}

	var anim = function(x, y, max_x, max_y) {
		return (Math.sin((Math.PI * x) / (max_x * 2)) + Math.sin((Math.PI * y) / (max_y * 2))) / 4;
	}

	function getDelay(i, max_x, max_y) {
		var x = (i % max_x);
		var y = Math.floor(i / max_x);
		val = anim(x, y, max_x, max_y);
		return val;
	}

	if (!String.format) {
		String.format = function(format) {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

	jz.partners = function() {
		var partners = document.querySelector('.partner-list');
		var max = 42;
		var max_x = Math.floor(parseFloat(window.getComputedStyle(partners).width) / 140);
		var max_y = max / max_x;
		var imagePath = '/assets/img/partners/';
		var ul = document.querySelector('.partner-list ul');
		var i = 0;
		var partnerList = _(jz.data.partners)
			.shuffle()
			.map(function(partner) {
				var li = document.createElement('li');
				var a = document.createElement('a');
				var img = document.createElement('img');
				a.href = partner[2];
				a.target = '_blank';
				img.src = imagePath + partner[1];
				img.alt = partner[0];
				transitionDelay(img, (getDelay(i, max_x, max_y) + "s"));
				i++;
				a.appendChild(img);
				li.appendChild(a);
				ul.appendChild(li);
				return img;
			}).value();
		partners.appendChild(ul);
		setTimeout(function() {
			requestAnimationFrame(function() {
				_(partnerList).each(function(img) {
					img.classList.add('visible');
				}).value();
			});
		}, 250);
	}

})(window._, window.jz = window.jz || {});