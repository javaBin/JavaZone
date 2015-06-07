(function(_, request, Handlebars, jz) {

    function program() {
        request('http://test.javazone.no/javazone-web-api/event/javazone_2014/sessions')
        .end(render);
    }

    function transform(res) {
        var data = JSON.parse(res.text);

        return data;
    }

    function render(err, res) {
        if (err) {
            renderError(err);
            return;
        }

        renderProgram(transform(res));
    }

    function renderProgram(program) {
        var template = Handlebars.compile(document.querySelector('.program-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template({talks: program});
    }

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

	jz.program = program;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});