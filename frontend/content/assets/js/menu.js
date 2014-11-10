(function(Velocity, svgAnimate) {

	var menu = document.querySelector('.nav-toggle');
	var nav = document.querySelector('.nav');

	function toggleMenu() {
		var top = window.getComputedStyle(nav).top === "0px" ? -80 : 0;
		Velocity(nav, { top: top }, { duration: 400, easing: 'easeInOutCirc' });
	}

	var mql = window.matchMedia("(min-width: 768px)");
	mql.addListener(function(mql) {
		if (mql.matches)
			nav.style.top = 0;
		else
			nav.style.top = "-80px";
	});

	var props = {
		action: toggleMenu,
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
					duration: 400
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
					duration: 400
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
					duration: 400
				}
			}
		]
	}

	new svgAnimate(menu, props);

})(window.Velocity, window.svgAnimate);