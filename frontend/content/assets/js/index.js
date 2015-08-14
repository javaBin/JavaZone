(function(jz) {

    jz.index = function() {
        var movie2 = document.querySelector('.movie-2 .timer');
        var movie3 = document.querySelector('.movie-3 .timer');
        var release2 = new Date(2015, 7, 21, 12, 0, 0).getTime();
        var release3 = new Date(2015, 7, 28, 12, 0, 0).getTime();

        countdown(movie2, release2);
        countdown(movie3, release3);

        attachClickListeners();
    }

    function countdown(el, goal) {
        var now = Date.now();
        var d = diff(goal, now);

        if (d.days > 0)
            el.innerHTML = d.days + ' days';
        else if (d.hours > 0)
            el.innerHTML = d.hours + ' hours';
        else if (d.minutes > 0)
            el.innerHTML = d.minutes + ' minutes';
        else if (d.seconds > 0)
            el.innerHTML = d.seconds + ' seconds';
        else
            el.innerHTML = 'Is here!';

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

    function attachClickListeners() {
        var movie1 = document.querySelector('.movie-1 .play');
        movie1.addEventListener('click', function() {
            var size = getSize();
            var movieContainer = document.querySelector('.movie-container');
            movieContainer.style.width = size.width + 'px';
            movieContainer.style.height = size.height + 'px';
            Velocity(movieContainer, 'slideDown', {
                display: 'inline-block',
                duration: 250,
                complete: startMovie
            });
        });
    }

    function startMovie() {
        var tag = document.createElement('script');
        tag.src = 'http://www.youtube.com/player_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubePlayerAPIReady = function() {
            var size = getSize();
            console.log(size);
            var player = new YT.Player('movie', {
                height: size.height,
                width: size.width,
                videoId: 'V8BY9jdrCh0',
                events: {
                    'onReady': function(event) {
                        event.target.playVideo();
                    }
                }
            })
        }
    }

    function getSize() {
        var containerWidth = document.querySelector('.content .container').clientWidth;
        var width = Math.min(containerWidth, 640);
        var height = width * 0.5625;
        return {width: width, height: height};
    }

})(window.jz = window.jz || {});