(function(_, request, Handlebars, jz) {

    function program() {
        request('http://test.javazone.no/javazone-web-api/event/javazone_2014/sessions')
        .end(render);
    }

    function transform(res) {
        var data = JSON.parse(res.text);

        return _(data)
            .groupBy(day)
            .transform(function(result, day, date) {
                result.push({date: date, presentations: day});
            }, [])
            .value();
        // console.log(data);
        // return data;
    }

    function render(err, res) {
        if (err) {
            renderError(err);
            return;
        }

        renderProgram(transform(res));
    }

    function renderProgram(program) {
        console.log(program);
        var template = Handlebars.compile(document.querySelector('.program-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template({days: program});
    }

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

    function day(talk) {
        var d = new Date(talk.starter).getDate();
        return d;
    }

	jz.program = program;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});