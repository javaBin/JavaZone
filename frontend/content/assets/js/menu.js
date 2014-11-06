(function(Velocity) {

	var menu = document.querySelector('.nav-toggle');
	menu.addEventListener('click', toggleMenu, false);
	var nav = document.querySelector('.nav');

	function toggleMenu() {
		var top = window.getComputedStyle(nav).top === "0px" ? -80 : 0;
		Velocity(nav, { top: top }, { duration: 200, easing: 'easeOutExpo' });
	}

	var mql = window.matchMedia("(min-width: 768px)");
	mql.addListener(function(mql) {
		if (mql.matches)
			nav.style.top = 0;
		else
			nav.style.top = "-80px";
	});

})(window.Velocity);