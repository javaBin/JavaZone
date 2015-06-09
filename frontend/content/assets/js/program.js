(function(_, request, Handlebars, jz) {

    var matcher = function(type) {
        return _.ary(_.partial(_.startsWith, _, type), 1);
    }
    var hasTopic = matcher('topic:');
    var hasType = matcher('type:');

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
            .map(_.compose(extract('topic', hasTopic), extract('type', hasType)))
            .groupBy('topic')
            .transform(toObject, [])
            .value();
    }

    function toObject(result, value, key) {
        result.push({
            key: key,
            value: value
        });
    }

    function extract(t, matcher) {
        return function(submission) {
            var result = _.find(submission.nokkelord, matcher);
            if (result)
                submission[t] = _.trimLeft(result, t + ':');

            return submission;
        }
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