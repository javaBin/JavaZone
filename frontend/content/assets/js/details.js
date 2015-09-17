(function(_, request, Handlebars, jz) {

    var id;

    var languageMapping = {
        'en': 'English',
        'no': 'Norwegian'
    };

    var formatMapping = {
        'lightning-talk': 'icon-flash',
        'workshop': 'icon-wrench',
        'presentation': 'icon-easel'
    };

    function mdate(d) {
        return moment(d).utcOffset(120);
    }

    function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

    var matcher = function(type) {
        return _.ary(_.partial(_.startsWith, _, type), 1);
    }
    var hasTopic = matcher('topic:');
    var hasType = matcher('type:');

    function extract(t, matcher) {
        return function(submission) {
            var result = _.find(submission.nokkelord, matcher);
            if (result)
                submission[t] = _.trimLeft(result, t + ':');

            return submission;
        }
    }

    function transformNokkelord(submission) {
        submission.nokkelord = [
            {c: 'difficulty-' + submission.niva, l: _.capitalize(submission.niva)},
            {c: _.kebabCase(submission.type), l: submission.type}
        ].concat(_.dropRight(submission.nokkelord, 2).map(function(n) {
            return {c: _.kebabCase(n), l: n};
        }));
        return submission;
    }

    function imageUrl(url) {
        var pixelRatio = window.devicePixelRatio || 1;
        var size = pixelRatio >= 2 ? 240 : 120;
        return url + '?size=' + size + '&d=mm';
    }

    function transform(submission) {
        submission.beskrivelse = submission.beskrivelse.replace(/\n/g, '<br />');
        submission.speakers = _.pluck(submission.foredragsholdere, 'navn').join(' & ');
        submission.images = _.map(submission.foredragsholdere, function(foredragsholder) {
            return imageUrl(foredragsholder.bildeUri);
        });
        extract('topic', hasTopic)(submission);
        extract('type', hasType)(submission);
        transformNokkelord(submission);
        submission.icon = formatMapping[submission.format];
        submission.format = _.capitalize(submission.format);
        submission.sprak = languageMapping[submission.sprak];
        submission.starter = formatDate(submission.starter, submission.stopper);
        submission.video = getVideo(submission);
        return submission;
    }

    function getVideo(submission) {
        var video = _.find(submission.links, {rel: 'video'});
        if (!video)
            return undefined;
        
        return video.href.split('/')[3];
    }

    function formatDate(start, end) {
        start = mdate(start);
        end = mdate(end);
        return start.format('dddd, MMMM Do 2015') + ' at ' + start.format('HH:mm') + '-' + end.format('HH:mm');
    }

    function getTalk() {
        id = decodeURIComponent(location.search.substr(1).split('=')[1]);
        jz.data.talk(id)
        .then(renderSuccess)
        .fail(renderError);
    }

    function renderSuccess(submission) {
        submission = transform(submission);
        console.log(submission);

        var template = Handlebars.compile(document.querySelector('.submission-details-template').innerHTML);
        var container = document.querySelector('.javazone-submission-details');
        container.innerHTML = template(submission);

        var stopper = submission.stopper;
        var now = mdate();
        var end = mdate(submission.stopper);
        var diff = end.diff(now, 'ms');
        var ratingActive = diff <= Math.max(300000, 0);
        var voteKey = 'voterId-' + id;
        var voterId = Cookies.get(voteKey);

        if (ratingActive && !voterId) {
            renderRating(submission);
        } else if (voterId) {
            renderFeedbackSuccess();
        }
    }

    function renderRating(submission) {
        console.log(submission);
        var feedbackLink = _.find(submission.links, function(link) {
            return link.rel === 'feedback';
        });
        if (!feedbackLink || !feedbackLink.href)
            console.log('Error: could not find feedback link');

        var template = Handlebars.compile(document.querySelector('.rating-template').innerHTML);
        var container = document.querySelector('.rating-container');
        container.innerHTML = template();

        var submit = $('.button.submit');

        $('input[type=radio]').on('click', function() {
            var relevance = parseInt($('.rating-relevance input:checked').val(), 10);
            var content = parseInt($('.rating-content input:checked').val(), 10);
            var quality = parseInt($('.rating-quality input:checked').val(), 10);
            var overall = parseInt($('.rating-overall input:checked').val(), 10);

            var allDone = _.compact([relevance, content, quality, overall]);
            console.log(allDone);
            if (allDone.length >= 4) {
                submit.attr('disabled', false);
            }

        });

        $('.button.submit').on('click', function(ev) {
            var relevance = parseInt($('.rating-relevance input:checked').val(), 10);
            var content = parseInt($('.rating-content input:checked').val(), 10);
            var quality = parseInt($('.rating-quality input:checked').val(), 10);
            var overall = parseInt($('.rating-overall input:checked').val(), 10);

            var allDone = _.compact([relevance, content, quality, overall]);
            if (allDone.length !== 4) {
                return;
            }

            var data = {
                template: {
                    data: [
                        {name: 'overall', value: overall},
                        {name: 'relevance', value: relevance},
                        {name: 'content', value: content},
                        {name: 'quality', value: quality}
                    ]
                }
            }
            var voterId = generateUUID();
            console.log(JSON.stringify(data));
            console.log(voterId);

            submit.attr('disabled', true);
            jz.data.feedback(feedbackLink.href, voterId, data)
            .fail(function() {
                renderFeedbackFailed();
            })
            .then(function() {
                var voteKey = 'voterId-' + id;
                var voterId = Cookies.get(voteKey);
                Cookies.set(voteKey, voterId);
                renderFeedbackSuccess();
            });
        });
    }

    function renderFeedbackSuccess() {
        var template = Handlebars.compile(document.querySelector('.feedback-success-template').innerHTML);
        var container = document.querySelector('.rating-container');
        container.innerHTML = template();
    }

    function renderFeedbackFailed() {
        var template = Handlebars.compile(document.querySelector('.feedback-failed-template').innerHTML);
        var container = document.querySelector('.rating-container');
        container.innerHTML = template();
    }

    function renderError(err) {
        console.log(err);
    }

    function parse(res) {
        return JSON.parse(res.text);
    }

    jz.details = getTalk;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});