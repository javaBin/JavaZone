(function(_, request, Handlebars, jz) {

    _.templateSettings.variable = 'data';

    function program() {
        request('http://test.javazone.no/javazone-web-api/event/javazone_2014/sessions')
        .end(create);
    }

    function create(err, res) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(res);

        var data = JSON.parse(res.text);
        var template = Handlebars.compile(document.querySelector('.program-template').innerHTML);
        var program = document.querySelector('.javazone-program');

        console.log(data);

        program.innerHTML = template({talks: data});
    }

	jz.program = program;

})(window._, window.superagent, window.Handlebars, window.jz = window.jz || {});