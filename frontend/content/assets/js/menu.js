(function(Velocity, svgAnimate, jz) {

	jz.menu = {};

	jz.menu.setActive = function() {
		var menuItems = document.querySelectorAll('.nav .nav-item a');
		var active = _(menuItems).reduce(function(acc, a) {
			return a.pathname === location.pathname ? a : acc;
		}, null);
		if (active)
			active.classList.add('active');
	};


	jz.menu.initializeMenu = function() {
		var nav = document.querySelector('.nav-mobile-items');
		var props = {
			action: function() {
				var cmd = $(nav).is(':visible') ? 'fadeOut' : 'fadeIn';
				Velocity(nav, cmd);
			},
			animation: [
				{
					el: '.top',
					animation: {
						from: {
							x1: '0',
							y1: '16px',
							x2: '30px',
							y2: '16px',
						},
						to: {
							x1: '4px',
							y1: '19px',
							x2: '26px',
							y2: '1px'
						}
					},
					props: {
						easing: 'easeInOutCirc',
						duration: 200
					}
				},
				{
					el: '.bottom',
					animation: {
						from: {
							x1: '0',
							y1: '4px',
							x2: '30px',
							y2: '4px'
						},
						to: {
							x1: '4px',
							y1: '1px',
							x2: '26px',
							y2: '19px'
						}
					},
					props: {
						easing: 'easeInOutCirc',
						duration: 200
					}
				},
				{
					el: '.mid',
					animation: {
						from: {
							opacity: 1
						},
						to: {
							opacity: 0
						}
					},
					props: {
						easing: 'easeInOutCirc',
						duration: 200
					}
				}
			]
		}
		new svgAnimate(document.querySelector('.nav-toggle'), props);
	}

})(window.Velocity, window.svgAnimate, window.jz = window.jz || {});