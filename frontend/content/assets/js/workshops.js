(function(_, jz) {

    var days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday'
    ];

    function transform(data) {
        return _(data)
            .filter(_.matchesProperty('format', 'workshop'))
            .map(function(workshop) {
                workshop.day = days[(new Date(workshop.starter)).getDay() - 1];
                return workshop;
            })
            .groupBy(_.property('day'))
            .transform(function(result, value, key) {
                result.push({key: key, value: value})
            }, [])
            .value();
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