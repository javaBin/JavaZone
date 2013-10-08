/*global window, navigator, jz, $, _ */

$(function() {
    jz.utils.addSupportClasses();
    var path = window.location.pathname.replace(/\/$/, "").split(".")[0];
    var file = _.last(path.split("/")) || "program";
    var name = !(/^[a-z0-9_\-]+$/i).test(file) ? "program" : file;
    if(jz.routes[name]) jz.routes[name]();
});

jz.routes.index = function() {
    jz.api.tweets().then(function(tweets) {
        var tweetsDiv = $(".tweets");
        var tweet = tweets.tweets[0];
        var text = jz.utils.urlify(tweet.tweet);
        var icon = $("<i>").addClass("icon-twitter");
        var play = $("<i>").addClass("icon-play-sign");
        var next = $("<a>").addClass("next").attr("href", "https://twitter.com/javazone").html(play);
        if(tweet) $(".tweet").html($("<p>").append(icon, text, next));
    });
};

jz.routes.credits = function() {
    if($(".credits").size() === 0) return;
    $(".credits").empty().each(function(i, el) {
        var credits = jz.utils.shuffle(jz.data.credits);
        var limit = parseInt($(el).attr("data-limit"), 10) || 1000;
        _.each(credits, function(credit, i) {
            if(i + 1 > limit) return;
            var img = $("<img />").addClass("instagram").attr("src", credits[i][1]).attr("alt", credits[i][0]);
            var lnk = $("<a />").html(img).attr("href", credits[i][2]).attr("target", "_blank");
            $(el).prepend(lnk);
        });
    });
};

jz.routes.program = function() {
    jz.routes.index(); // Litt hacky, dra ut tweets-rendring i funksjon :)

    var show = function(event) {
        event.preventDefault();
        $(this).toggleClass("active");
        jz.api.details($(this).attr("data-url")).then(_.bind(function(html) {
            $(this).find(".details").html(html).slideToggle(200);
        }, this));
    };
    var filter = function(event) {
        event.preventDefault();
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).parents('ul').find('.active').removeClass('active');
            $(this).addClass("active");
        }
        var filters = $(".filters").find("a.active[rel]").map(function() {
            return $(this).attr("rel");
        });
        $("html").toggleClass("ui-filter", !!filters.length);
        $(".session").removeClass('hide');
        _.each(filters, function(name) {
            $(".session").not("." + name).addClass('hide');
        });
        $(".day").hide().each(function() {
            if ($(this).find('.session').not('.hide').size()) $(this).show();
        });
    };

    var stop = function() {
        return false;
    };
    var rateIn = function() {
        $(this).addClass("icon-star").removeClass("icon-star-empty");
        $(this).prevAll().addClass("icon-star").removeClass("icon-star-empty");
    };
    var rateOut = function() {
        $(this).addClass("icon-star-empty").removeClass("icon-star");
        $(this).prevAll().removeClass("icon-star").addClass("icon-star-empty");
    };
    var rateClick = function() {
        $(this).parents(".rate").find(".rate-icon").off();
        $(this).add($(this).prevAll()).removeClass("icon-star-empty").addClass("icon-star");
        $(this).parents(".rate").off().removeClass("rate-active").addClass("rate-inactive");
        var uri = $(this).parents("a").attr("data-feedback");
        var id = $(this).parents("a").attr("data-id");
        var rating = $(this).attr("data-rate");
        jz.api.rate(id, uri, rating);
        jz.utils.notify("Thanks for your feedback! You can add a comment as well.", 4000);
        return false;
    };

    var commentIn = function() {
        $(this).addClass("icon-comment").removeClass("icon-comment-alt");
    };
    var commentOut = function() {
        $(this).removeClass("icon-comment").addClass("icon-comment-alt");
    };
    var commentClick = function() {
        if ($(this).hasClass("active")) $(".feedback").addClass("hide");
        else $(".feedback").insertAfter($(this).parents('a')).removeClass('hide');
        $(this).toggleClass("active");
        $(".feedback").attr("data-id", $(this).parents('a').attr("data-id"));
        $(".feedback").attr("data-uri", $(this).parents('a').attr("data-feedback"));
        $(".feedback a").off().on("click", commentSubmit);
        $(".feedback textarea").focus();
        return false;
    };
    var commentSubmit = function() {
        $(".feedback").addClass("hide");
        var id = $(".feedback").attr("data-id");
        var uri = $(".feedback").attr("data-uri");
        jz.api.rate(id, uri, null, $(".feedback textarea").val());
        $(".feedback textarea").val("");
        $(".feedback").attr("data-id", "");
        $(".feedback").attr("data-uri", "");
        jz.utils.notify("Thanks for your feedback!");
        return false;
    };

    jz.api.sessions().then(function(data) {
        jz.api.template("filters", { data: data }).then(function(html) {
            $(".filters").html(html);
            $(".filters a").on("click", filter);
        });
        jz.api.template("sessions", { sessions: data.sessions }).then(function(html) {
            $(".program").html(html);
            $(".program li").on("click", show);
            $(".program .rate-inactive .rate-icon").on("click", stop);
            $(".program .rate-active .rate-icon").hover(rateIn, rateOut).on("click", rateClick);
            $(".program .comment-icon").hover(commentIn, commentOut).on("click", commentClick);
        });
    });
};

jz.routes.presentation = function() {
    jz.api.session(jz.utils.param("id")).then(function(data) {

        var stop = function() {
            return false;
        };
        var rateIn = function() {
            $(this).addClass("icon-star").removeClass("icon-star-empty");
            $(this).prevAll().addClass("icon-star").removeClass("icon-star-empty");
        };
        var rateOut = function() {
            $(this).addClass("icon-star-empty").removeClass("icon-star");
            $(this).prevAll().removeClass("icon-star").addClass("icon-star-empty");
        };
        var rateClick = function() {
            $(this).parents(".rate").find(".rate-icon").off();
            $(this).add($(this).prevAll()).removeClass("icon-star-empty").addClass("icon-star");
            $(this).parents(".rate").off().removeClass("rate-active").addClass("rate-inactive");
            var rating = $(this).attr("data-rate");
            jz.api.rate(data.id, jz.api.link(data, 'feedback'), rating);
            jz.utils.notify("Thanks for your feedback! You can add a comment as well.", 4000);
            $('.feedback').slideDown();
            return false;
        };
        var commentSubmit = function() {
            jz.api.rate(data.id, jz.api.link(data, 'feedback'), null, $(".feedback textarea").val());
            $(".feedback textarea").val("");
            jz.utils.notify("Thanks for your feedback!");
            $('.feedback').slideUp();
            return false;
        };

        $('title').text(data.title + ' - JavaZone 2013');
        jz.api.template("session", data).then(function(html) {
            $('.presentation').html(html);
            $(".presentation .rate-inactive .rate-icon").on("click", stop);
            $(".presentation .rate-active .rate-icon").hover(rateIn, rateOut).on("click", rateClick);
            $(".presentation .feedback a").off().on("click", commentSubmit);
        });
    });
};

jz.routes.partners = function() {
    if($(".partners").size() === 0) return;
    $(".partners").empty().each(function(i, el) {
        var partners = jz.utils.shuffle(jz.data.partners);
        var limit = parseInt($(el).attr("data-limit"), 10) || 1000;
        _.each(partners, function(partner, i) {
            if(i + 1 > limit) return;
            var img = $("<img />").attr("src", "/assets/img/partners/" + partners[i][1]).attr("alt", partners[i][0]);
            var lnk = $("<a />").html(img).attr("href", partners[i][2]).attr("target", "_blank");
            if($(el).attr("data-internal")) $(lnk).attr("href", "/partners.html").attr("target", "");
            $(el).prepend(lnk);
        });
    });
};

jz.routes.communities = function() {
    _.each($(".community"), function(a) {
        var color = jz.utils.randomColor();
        console.log(color);
        $(a).css("background", color.b);
        $(a).find("h3").css("color", color.f);
        $(a).css("color", color.f);
    });
};

jz.routes.feedback = function() {
    $(".submitform").on("click", function() {
        var data = {
            role: $("[name=role]:checked").val(),
            presentations_rating: $("[name=presentations_rating]:checked").val(),
            conference_rating: $("[name=conference_rating]:checked").val(),
            freetext: $("[name=freetext]").val()
        };
        if(data.role || data.presentations_rating || data.conference_rating || data.freetext) {
            jz.api.post("/api/generalfeedback", { feedback: data });
            window.scrollTo(0, 0);
            $("form")[0].reset();
            $("form").hide();
            $(".thanks").show();
        }
        return false;
    });
};

// Disse ligger under /admin, burde kanskje indikeres på noen måte? :P
jz.routes.sessions = function() {
    var lineClick = function() {
        var feedbackDiv = $(".feedback-" + $(this).attr("data-id"));
        feedbackDiv.toggleClass("hide");
        return false;
    };

    jz.api.adminsessions().then(function(data) {
        jz.api.template("adminsessions", { sessions: data.sessions }).then(function(html) {
            $(".program").html(html);
            $(".program a").on("click", lineClick);
        });
    });
};
