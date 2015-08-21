(function(jz, Handlebars) {

    var movies = {
        movie1: 'V8BY9jdrCh0',
        movie2: '2ftPLCpUsts'
    };

    jz.index = function() {
        var movie2 = document.querySelector('.movie-2 .timer');
        var movie3 = document.querySelector('.movie-3 .timer');
        var release2 = new Date(2015, 7, 21, 10, 0, 0).getTime();
        release2 = new Date(2015,7,21,9,0,0);
        var release3 = new Date(2015, 7, 28, 10, 0, 0).getTime();

        if (Date.now() > release2)
            attachMovie2ClickListener();
        else
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
        else {
            attachMovie2ClickListener();
            return
        }

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
            var movieContainer = document.querySelector('.youtube-container');
            movieContainer.innerHTML = Handlebars.compile(document.querySelector('.movie-template').innerHTML)();
            $('.youtube-script').remove();
            var size = getSize();
            var movieContainer = document.querySelector('.movie-container');
            movieContainer.style.width = size.width + 'px';
            movieContainer.style.height = size.height + 'px';
            Velocity(movieContainer, 'slideDown', {
                display: 'inline-block',
                duration: 250,
                complete: function() { startMovie(movies.movie1); }
            });
        });
    }

    function attachMovie2ClickListener() {
        var container = document.querySelector('.movie-2');
        container.classList.add('released');
        container.innerHTML = Handlebars.compile(document.querySelector('.play-template').innerHTML)();
        var movie = document.querySelector('.movie-2 .play');
        movie.addEventListener('click', function() {
            var movieContainer = document.querySelector('.youtube-container');
            movieContainer.innerHTML = Handlebars.compile(document.querySelector('.movie-template').innerHTML)();
            $('.youtube-script').remove();
            var size = getSize();
            var movieContainer = document.querySelector('.movie-container');
            movieContainer.style.width = size.width + 'px';
            movieContainer.style.height = size.height + 'px';
            Velocity(movieContainer, 'slideDown', {
                display: 'inline-block',
                duration: 250,
                complete: function() { startMovie(movies.movie2); }
            }); 
        })
    }

    function startMovie(movie) {
        var tag = document.createElement('script');
        tag.classList.add('youtube-script');
        tag.src = 'http://www.youtube.com/player_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var play = function() {
            var size = getSize();
            var player = new YT.Player('movie', {
                height: size.height,
                width: size.width,
                videoId: movie,
                events: {
                    'onReady': function(event) {
                        console.log(event.target);
                        event.target.playVideo();
                    }
                }
            });
        }

        if (window.YT && window.YT.Player)
            play();
        else
            window.onYouTubePlayerAPIReady = play;

    }

    function getSize() {
        var containerWidth = document.querySelector('.content .container').clientWidth;
        var width = Math.min(containerWidth, 640);
        var height = width * 0.5625;
        return {width: width, height: height};
    }

})(window.jz = window.jz || {}, window.Handlebars);