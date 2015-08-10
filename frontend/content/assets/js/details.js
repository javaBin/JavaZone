(function(_, request, Handlebars, jz) {

    var languageMapping = {
        'en': 'English',
        'no': 'Norwegian'
    };

    var formatMapping = {
        'lightning-talk': 'icon-flash',
        'workshop': 'icon-wrench',
        'presentation': 'icon-easel'
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

    function getTalk() {
        var id = decodeURIComponent(location.search.substr(1).split('=')[1]);
        jz.data.talk(id)
        .then(renderSuccess)
        .fail(renderError);
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
        return submission;
    }

    function formatDate(start, end) {
        var d = new Date(start);
        var day = jz.data.days[d.getDay()];
        var date = d.getDate();
        var start = formatTime(d);
        var end = formatTime(new Date(end));

        return day + ', September ' + date + 'th 2015 at ' + start + '-' + end;
    }

    function formatTime(t) {
        var hours = t.getHours() + '';
        if (hours.length === 1)
            hours = 0 + hours;

        var minutes = t.getMinutes() + '';
        if (minutes.length === 1)
            minutes = 0 + minutes;

        return hours + ':' + minutes;
    }

    function renderSuccess(submission) {
        console.log(submission);

        submission = transform(submission);

        var template = Handlebars.compile(document.querySelector('.submission-details-template').innerHTML);
        var container = document.querySelector('.javazone-submission-details');
        container.innerHTML = template(submission);
    }

    function renderError(err) {
        console.log(err);
    }

    function parse(res) {
        return JSON.parse(res.text);
    }

    jz.details = getTalk;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});