(function(jz, _, $) {

    function kids() {
        attachScrollListener();
        getStatus();
    }

    function attachScrollListener() {
    	var nav = document.querySelector('.nav')
    	document.addEventListener('scroll', _.throttle(function() {
    	    var height = document.querySelector('.mood').clientHeight;
            var scrolled = window.scrollY;
    	    if (scrolled > height && !nav.classList.contains('bg')) {
    		nav.classList.add('bg');
    	    } else if (scrolled < height) {
    		nav.classList.remove('bg');
    	    }
    	}, 100));
    }

    function getStatus() {
        jz.data.workshops()
        .then(renderWorkshopStatus)
        .fail(function() {
            // Do something?
        });
    }

    function renderWorkshopStatus(workshops) {
        var $statuses = $('.workshop-registration');
        $statuses.each(function(status) {
            var registration = $(this);
            var id = registration.data('id');
            var workshop = _.find(workshops, function(workshop) {
                return workshop.id === id;
            });

            if (!workshop)
                return;
            
            var status = jz.data.workshopStatus(workshop.status);
            registration.find('.workshop-status').text(status.no);
            registration.addClass(status.className);
        });
    }

    jz.kids = kids;

})(window.jz = window.jz || {}, window._, window.jQuery);