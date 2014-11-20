(function(_, jz) {

	function style(el, style, val) {
		if (!(el instanceof NodeList))
			el = [el];

		_(el).each(function(e) {
			e.style[style] = val;
		});
	}

	function transitionDelay(el, val) {
		['WebkitTransitionDelay', 'MozTransitionDelay', 'OTransitionDelay', 'transitionDelay'].forEach(function (s) {
			style(el, s, val);
		});
	}

	var max = 42;
	var max_x = 6;
	var pi = Math.PI;

	var anim = function(x, y) {
		return (Math.sin((pi * x) / 10) + Math.sin((pi * y) / 12)) / 4;
	}

	function getDelay(i) {
		var x = (i % max_x);
		var y = Math.floor(i / max_x);
		//var val = .3 * ((x / max_x) + (y / 7));
		val = anim(x, y);
		console.log(val);
		console.log(String.format("[{0} {1}] = {2}", x, y, val));
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
		var imagePath = '/assets/img/partners/';
		var partners = document.querySelector('.partner-list');
		var ul = document.createElement('ul');
		ul.classList.add('cf');
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
				transitionDelay(img, (getDelay(i) + "s"));
				getDelay(i);
				i++;
				a.appendChild(img);
				li.appendChild(a);
				ul.appendChild(li);
				return img;
			});
			//.join('');
		partners.appendChild(ul);
		setTimeout(function() {
			requestAnimationFrame(function() {
				partnerList.each(function(img) {
					img.classList.add('visible');
				});
			});
		}, 250);
		//partners.innerHTML = String.format('<ul class="cf">{0}</ul>', partnerList);
	}

})(window._, window.jz = window.jz || {});