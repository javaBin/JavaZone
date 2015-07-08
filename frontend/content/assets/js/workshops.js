(function(_, jz) {

    var days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday'
    ];

    function transform(data) {
        return _(data)
            .filter(_.matchesProperty('format', 'workshop'))
            .map(_.compose(day, extractDetailsLink))
            .groupBy(_.property('day'))
            .transform(function(result, value, key) {
                result.push({key: key, value: value})
            }, [])
            .value();
    }

    function day(workshop) {
        workshop.day = days[(new Date(workshop.starter)).getDay() - 1];
        return workshop;
    }

    function extractDetailsLink(workshop) {
        var linkParts = _.find(workshop.links, {rel: 'detaljer'});
        if (!linkParts) {
            return;
        }
        var id = _.last(linkParts.href.split('/'));
        workshop.detaljer = '/details.html?talk=' + encodeURIComponent(id);
        return workshop;
    }

    function renderSuccess(workshops) {
        console.log(workshops);
        var template = Handlebars.compile(document.querySelector('.template-workshops').innerHTML);
        var container = document.querySelector('.javazone-workshops');
        container.innerHTML = template(workshops);
    }

    function renderError(err) {
        console.log(err);
    }

    jz.workshops = function() {
        jz.data.program()
        .then(_.compose(renderSuccess, transform))
        .fail(renderError);
    }

})(_ ,window.jz = window.jz || {});