jz.utils.shuffle = function(array) {
    var i = array.length, j, tempi, tempj;
    if(i === 0) return false;
    while(--i) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        tempi = array[i];
        tempj = array[j];
        array[i] = tempj;
        array[j] = tempi;
    }
    return array;
};

jz.utils.notify = function(text, displayMs) {
    clearTimeout(jz.utils.notify.timer);
    $(".notification").hide().text(text).fadeIn(200);
    jz.utils.notify.timer = setTimeout(function() { $(".notification").fadeOut(200); }, displayMs || 2000);
};

jz.utils.addSupportClasses = function() {
    var mobile   = jz.utils.agent("Android", "webOS", "iPhone", "iPod", "BlackBerry", "IEMobile");
    var handheld = jz.utils.agent("iPad", "Tablet") || mobile;
    if(mobile)   $("html").addClass("support-mobile");
    if(handheld) $("html").addClass("support-handheld");
    $("html").addClass("loaded");
};

jz.utils.removeAnimationClasses = function() {
    setTimeout(function() {
        $(".animated").removeClass("animated fadeInLeft fadeInUp fadeInRight bounceInRight");
    }, 2000);
};

jz.utils.agent = function() {
    return _.any(_.toArray(arguments), function(s) {
        return !!navigator.userAgent.match(s);
    });
};

jz.utils.urlify = function(string) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return string.replace(exp, "<a href='$1'>$1</a>");
};

jz.utils.param = function(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.href);
    if (!results) return false;
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
};

jz.utils.join = function(array) {
    return _.reduce(array, function(acc, next) { return (acc && acc + ", ") + next; }, "");
};

jz.utils.slug = function(str) {
    return 'slug-' + str.replace(/[ ]+/g, "-").toLowerCase();
};

jz.utils.title = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

jz.utils.paragraphs = function(str) {
    return "<p>" + str.replace(/[\r\n]+(?=[^\r\n])/g, '</p><p>') + "</p>";
};

jz.utils.randomColor = function() {
    var colors = [
        {
            f: "#ffffff",
            b: "#a10735"
        },
        {
            f: "#ffffff",
            b: "#fc4f4c"
        },
        {
            f: "#000000",
            b: "#f7813f"
        },
        {
            f: "#000000",
            b: "#f3a928"
        },
        {
            f: "#000000",
            b: "#f3a928"
        },
        {
            f: "#ffffff",
            b: "#266761"
        },
        {
            f: "#ffffff",
            b: "#1a0000"
        },
    ];
    return colors[_.random(colors.length-1)];
};


jz.utils.animateScrollTo = function(selector) {
    $('body').on('click', selector, function(event) {
        event.preventDefault();
        event.stopPropagation();

        var target = $(this).attr('href');
        if(target.substring(0,1) !== '#') return;

        var href = target.substring(1,target.length);
        var id = $('#' + href);
        var link = $('a[name=' + href + ']');
        var to = id.size() ? id : link;

        $('html, body').animate({ scrollTop: $(to).offset().top }, 500, 'swing');
    });
};


jz.utils.initVoting = function(voteFor) {
    $(".vote-for-game-of-codes").click(function(event) {
        event.preventDefault();
        window.location = "/i-would-kill-for-game-of-codes.html#share";
        jz.utils.shareheader();
    });
    $(".vote-for-house-of-codes").click(function(event) {
        event.preventDefault();
        window.location = "/i-will-vote-for-house-of-codes.html#share";
        jz.utils.shareheader();
    });
    $(".vote-for-writing-bad").click(function(event) {
        event.preventDefault();
        window.location = "/i-am-writing-bad.html#share";
        jz.utils.shareheader();
    });

    $(".close-shareinfo").click(function(event) {
        event.preventDefault();
        $(".shareinfo").addClass("hide");
        $(".shareinfo-backdrop").addClass("hide");
    });

    $(".shareicons .facebook").click(function() {
        event.preventDefault();
        jz.share.facebook(window.location, $(".shareicons .sharetext").text());
    });
    $(".shareicons .twitter").click(function() {
        event.preventDefault();
        jz.share.twitter(window.location, $(".shareicons .sharetext").text());
    });

    jz.api.videos(voteFor).then(function(result) {
        var formatNumber = function(number) {
            if (!number) return 0;
            return parseInt(number, 10)
                .toString(10)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        };
        var renderNumbers = function(videos, id) {
            $("." + id + " .stat-views span").text(formatNumber(videos[id].youtubeViews));
            $("." + id + " .stat-votes span").text(formatNumber(videos[id].youtubeViews + videos[id].youtubeInteractions + videos[id].webpageViews));
        };

        if(result && result.videos) {
            renderNumbers(result.videos, "writingbad");
            renderNumbers(result.videos, "houseofcodes");
            renderNumbers(result.videos, "gameofcodes");
        }
    });
};

jz.utils.shareheader = function() {
    if(window.location.hash === '#share') {
        window.location.hash = "";
        $(".shareinfo").removeClass("hide");
        $(".shareinfo-backdrop").removeClass("hide");
        $(".vote").addClass("hide");
    }
};