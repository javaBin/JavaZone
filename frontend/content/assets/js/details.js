(function(_, request, Handlebars, jz) {

    function getTalk() {
        var url = decodeURIComponent(location.search.substr(1).split('=')[1]);
        console.log(url);
        request(url).end(render);
    }

    function render(err, res) {
        if (err) {
            renderError(err);
            return;
        }

        renderSubmission(parse(res));
    }

    function renderSubmission(submission) {
        console.log(submission);

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