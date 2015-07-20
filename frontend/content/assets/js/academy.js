(function(jz) {

    function academy() {
	attachScrollListener();
    }

    function attachScrollListener() {
	var nav = document.querySelector('.nav')
	document.addEventListener('scroll', _.throttle(function() {
	    var height = document.querySelector('.mood').clientHeight;
	    var scrolled = document.body.scrollTop;
	    if (scrolled > height && !nav.classList.contains('bg')) {
		nav.classList.add('bg');
	    } else if (scrolled < height) {
		nav.classList.remove('bg');
	    }
	}, 100));
    }

    jz.academy = academy;

})(window.jz = window.jz || {});