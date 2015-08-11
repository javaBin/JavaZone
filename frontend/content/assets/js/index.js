(function(jz) {

    jz.index = function() {
        var movie2 = document.querySelector('.movie-2 .timer');
        var movie3 = document.querySelector('.movie-3 .timer');
        var release2 = new Date(2015, 7, 22, 12, 0, 0).getTime();
        var release3 = new Date(2015, 7, 29, 12, 0, 0).getTime();

        countdown(movie2, release2);
        countdown(movie3, release3);
    }

    function countdown(el, goal) {
        var now = Date.now();
        var d = diff(goal, now);

        if (d.days > 0)
            el.innerHTML = d.days + ' days';
        else
            el.innerHTML = d.days + ' days<br />' + d.hours + ' hours<br />' + d.minutes + ' minutes <br />' + d.seconds + ' seconds';

        setTimeout(function() {
            countdown(el, goal);
        }, 1000);
    }

    function diff(t1, t0) {
        var d = t1 - t0;
        return {
            days: Math.floor(d / 86400000),
            hours: Math.floor(d / 3600000 % 24),
            minutes: Math.floor(d / 60000 % 60),
            seconds: Math.floor(d / 1000 % 60)
        };
    }

})(window.jz = window.jz || {});