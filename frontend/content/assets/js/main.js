/*global window, navigator, jz, $, _ */

$(function() {
    jz.utils.addSupportClasses();
    jz.utils.removeAnimationClasses();
    jz.utils.animateScrollTo(".scroll");
    var path = window.location.pathname.replace(/\/$/, "").split(".")[0];
    var file = _.last(path.split("/")) || "index";
    var name = !(/^[a-z0-9_\-]+$/i).test(file) ? "index" : file;
    if(jz.routes[name]) jz.routes[name]();
});

jz.routes['i-am-writing-bad'] = function() {
    jz.routes.partners();
};

jz.routes['i-will-vote-for-house-of-codes'] = function() {
    jz.routes.partners();
};

jz.routes['i-would-kill-for-game-of-codes'] = function() {
    jz.routes.partners();
};

jz.routes.index = function() {
    //jz.routes.partners();
    //jz.utils.speakerPhotos();
};

jz.routes.info = function() {
    jz.routes.partners();
    jz.utils.speakerPhotos();
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
        jz.api.template("sessions", { 
            //sessions: data.sessions, 
            notScheduledSessions: data.notScheduledSessions,
            notScheduledPresentations: data.notScheduledPresentations,
            notScheduledLightning: data.notScheduledLightning, 
            //notScheduledWorkshops: data.notScheduledWorkshops,
            workshops: data.workshops
        }).then(function(html) {
            $(".program").html(html);
            $(".program li").on("click", show);
            $(".program .rate-inactive .rate-icon").on("click", stop);
            $(".program .rate-active .rate-icon").hover(rateIn, rateOut).on("click", rateClick);
            $(".program .comment-icon").hover(commentIn, commentOut).on("click", commentClick);
        });
    });
};














jz.routes.survey = function() {

    var stop = function() {
        return false;
    };
    var rateIn = function() {
        $(this).parent().find('.fa').addClass("fa-star-o").removeClass("fa-star yellow");
        $(this).addClass("fa-star yellow").removeClass("fa-star-o");
        $(this).prevAll().addClass("fa-star yellow").removeClass("fa-star-o");
    };
    var rateOut = function() {
        $(this).addClass("fa-star-o").removeClass("fa-star yellow");
        $(this).prevAll().addClass("fa-star-o").removeClass("fa-star yellow");
        var rating = $(this).parent().data('rating');
        var stars = $(this).parent().find('.fa');
        if(rating > 0) {
            $(stars[0]).addClass("fa-star yellow").removeClass("fa-star-o");
        }
        if(rating > 1) {
            $(stars[1]).addClass("fa-star yellow").removeClass("fa-star-o");
        }
        if(rating > 2) {
            $(stars[2]).addClass("fa-star yellow").removeClass("fa-star-o");
        }
    };
    var rateClick = function() {
        $(this).parent().data('rating', $(this).data('value'));
        return false;
    };


    $('.startfeedback').click(function(event) {
        $('.feedback-instructions').addClass('hide');
        $('.feedback-form').removeClass('hide');
        $('html, body').animate({ scrollTop: $('.feedback-form').offset().top }, 1000, 'swing');
        return false;
    });

    jz.api.sessions().then(function(data) {
        jz.api.template("sessionsurvey", { 
            sessions: data.sessions
        }).then(function(html) {
            $(".talkfeedback").html(html);

            $('textarea').on('focus', function(){
                $(this).autosize();
            });


            $(".rate-icon").hover(rateIn, rateOut).on("click", rateClick);


            $('.submitform').click(function(event) {
                event.preventDefault();
                var actualfeedback = [];
                $(".tosubmit").each(function(i, obj) {
                    var id = obj.id;
                    var value = obj.value;
                    if(value) {
                        actualfeedback.push({id: id, value: value});
                    }
                });
                $(".ratestars").each(function(i, obj) {
                    var id = obj.id;
                    var value = $(obj).data('rating');
                    if(value) {
                        actualfeedback.push({id: id, value: value});
                    }
                });
                jz.api.submitfeedback({feedback: actualfeedback}).always(function() {
                    window.location = "/surveythanks.html";
                });
                return false;
            });
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
        var workshopRegister = function() {
            if(data.format === 'workshop') {
                jz.api.workshop(data.slug).then(function(workshopdata) {
                    jz.api.template("workshop", workshopdata).then(function(html) {
                        $(".presentation .workshopinfo .tile-inner").html(html);
                        $(".presentation .workshopinfo").removeClass('hide');
                    });
                });
            }
        };

        $('title').text(data.title + ' - JavaZone 2014');
        jz.api.template("session", data).then(function(html) {
            $('.presentation').html(html);
            $(".presentation .rate-inactive .rate-icon").on("click", stop);
            $(".presentation .rate-active .rate-icon").hover(rateIn, rateOut).on("click", rateClick);
            $(".presentation .feedback a").off().on("click", commentSubmit);
            jz.utils.initSharing();
            workshopRegister();
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

jz.routes.academy = function() {
    if($(".partners").size() === 0) return;
    $(".partners").empty().each(function(i, el) {
        var partners = jz.utils.shuffle(jz.data.academypartners);
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

// jz.routes.tickets = function() {
//     //$("#ticket1").addClass("hide");
//     $("#ticket2").addClass("hide");
//     setTimeout(function() {
//         $("#ticket1").removeClass("hide").addClass("swing");
//         setTimeout(function() {
//             $("#ticket2").removeClass("hide").addClass("swing");
//         }, 500);
//     }, 500);
// };

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

jz.routes.talkfeedback = function() {
    var talkid = jz.utils.param("id");
    var secret = jz.utils.param("secret");
    jz.api.get("/api/restricted/feedback/" + talkid + "?secret=" + secret).then(function(data) {
        jz.api.template("talkfeedback", data).then(function(html) {
            $('.talkfeedback').html(html);

            jz.api.gauge('average-rating-gauge', data.avgRating);
            jz.api.gauge('avg-presentations-gauge', data.totalTalkRatings.avgPresentation);
            jz.api.gauge('avg-lightning-gauge', data.totalTalkRatings.avgLightning);
        });
    });
};

jz.routes.surveyresults = function() {
    jz.api.adminsurveyresults().then(function(data) {
        jz.api.template("adminsurveyresults", { feedback: data }).then(function(html) {
            $(".results").html(html);
            $(".deletedata").click(function(event) {
                event.preventDefault();
                var r = confirm("Slette?");
                if (r == true) {
                    var id = $(this).data("id");
                    console.log("sletter feedback med id: ", id);
                    jz.api.adminsurveyresultdelete(id);
                    $(this).parent().slideUp();
                }
                return false;
            });
        });
    });
};

jz.routes.speakerfeedback = function() {
    var talkid = jz.utils.param("id");
    var secret = jz.utils.param("secret");
    jz.api.get("/api/admin/newfeedback/talk?id=" + talkid + "&secret=" + secret).then(function(data) {
        var feedback = data.feedback;
        var avgPaper =  ((feedback.greenPaperfeedback + feedback.yellowPaperfeedback + feedback.redPaperfeedback) > 0) ?
                            ((feedback.greenPaperfeedback * 3 + feedback.yellowPaperfeedback * 2 + feedback.redPaperfeedback * 1) / 
                            (feedback.greenPaperfeedback + feedback.yellowPaperfeedback + feedback.redPaperfeedback))
                            .toFixed(2)
                        : 0;
        var avgWeb =    ((feedback.greenWeb + feedback.yellowWeb + feedback.redWeb) > 0) ?
                            (((feedback.greenWeb * 3 + feedback.yellowWeb * 2 + feedback.redWeb * 1) / 
                            (feedback.greenWeb + feedback.yellowWeb + feedback.redWeb))
                            .toFixed(2))
                        : 0;

        var avgAllPaper = ((data.greenPaperRatings + data.yellowPaperRatings + data.redPaperRatings) > 0) ?
                            ((data.greenPaperRatings * 3 + data.yellowPaperRatings * 2 + data.redPaperRatings * 1) / 
                            (data.greenPaperRatings + data.yellowPaperRatings + data.redPaperRatings))
                            .toFixed(2)
                         : 0;

        var avgAllWeb = ((data.greenWebRatings + data.yellowWebRatings + data.redWebRatings) > 0) ?
                            ((data.greenWebRatings * 3 + data.yellowWebRatings * 2 + data.redWebRatings * 1) / 
                            (data.greenWebRatings + data.yellowWebRatings + data.redWebRatings))
                            .toFixed(2)
                         : 0;


        jz.api.template("speakerfeedback", {all: data, avgPaper: avgPaper, avgWeb: avgWeb, avgAllPaper: avgAllPaper, avgAllWeb: avgAllWeb}).then(function(html) {

            var renderHistogram = function(selector, histoData) {
                var ctx = document.getElementById(selector).getContext("2d");

                var grouped = _.groupBy(histoData, function(num) { return num.toFixed(1); });

                var groupedvalues = [];
                for(var i = 1.0; i<3.1; i = i + 0.1) {
                    var n = grouped[i.toFixed(1)] ? grouped[i.toFixed(1)].length : 0;
                    groupedvalues.push({v: i.toFixed(1), n: n});
                }

                var keys = _.pluck(groupedvalues, 'v');
                var values = _.pluck(groupedvalues, 'n');

                var chartData = {
                    labels: keys,
                    datasets: [
                        {
                            label: "Histogram over all votes",
                            fillColor: "#BDE5F8",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "#BDE5F8",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: values
                        }
                    ]
                };
                var myBarChart = new Chart(ctx).Bar(chartData, {
                    barValueSpacing : 1,
                    barShowStroke : false
                });
            };


            $(".results").html(html);
            if(avgPaper > 0) {
                jz.api.gauge('average-rating-paper-gauge', avgPaper);
                jz.api.gauge('average-rating-paper-all-gauge', avgAllPaper);
                renderHistogram('paperHistogram', data.paperHistogramData);
            }
            if(avgWeb > 0) {
                jz.api.gauge('average-rating-web-gauge', avgWeb);
                jz.api.gauge('average-rating-web-all-gauge', avgAllWeb);
                renderHistogram('webHistogram', data.webHistogramData);
            }
        });
    });

};