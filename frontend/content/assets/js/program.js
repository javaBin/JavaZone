(function(_, request, Handlebars, jz) {

    //var getTopic = _.partial(_.startsWith, _, 'topic:');
    var getTopic = function (n) { return n.indexOf('topic:') >= 0 };

    function program() {
        request('http://test.javazone.no/javazone-web-api/event/javazone_2015/sessions')
        .end(render);
    }

    function transformToDays(res) {
        return _(parse(res))
            .groupBy(day)
            .transform(function(result, day, date) {
                result.push({date: date, presentations: day});
            }, [])
            .value();
    }

    function transformToCategories(res) {
        return _(parse(res))
            .map(extractTopic)
            .groupBy('topic')
            .transform(function(result, submissions, topic) {
                result.push({topic: topic, submissions: submissions});
            }, [])
            .value();
    }

    function extractTopic(submission) {
        console.log(submission.nokkelord);
        var topic = _.find(submission.nokkelord, getTopic);
        console.log(topic);
        if (topic)
            submission.topic = _.trimLeft(topic, 'topic:');

        return submission;
    }

    function render(err, res) {
        if (err) {
            renderError(err);
            return;
        }

        renderProgram(transformToCategories(res));
    }

    function renderProgram(program) {
        console.log(program);
        var template = Handlebars.compile(document.querySelector('.program-categories-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template({topics: program});
    }

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

    function day(talk) {
        var d = new Date(talk.starter).getDate();
        return d;
    }

    function parse(res) {
        return JSON.parse(res.text);
    }

	jz.program = program;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});