(function(_, jz) {

    var mapping = {
        
    }

    function transform(data) {
        return _(data)
            .filter(_.matchesProperty('format', 'workshop'))
            .map(_.compose(timestamp, extractDetailsLink))
            .groupBy(_.property('timestamp'))
            .transform(function(result, value, key) {
                result.push({key: key, value: value})
            }, [])
            .sortBy('key')
            .map(function(d) {
                d.key = day(d.key);
                return d;
            })
            .value();
    }

    function timestamp(workshop) {
        var date = new Date(workshop.starter);
        workshop.timestamp = new Date('2015-' + (date.getMonth() + 1) + '-' + date.getDate()).getTime();
        return workshop;
    }

    function day(timestamp) {
        var date = new Date(parseInt(timestamp, 10));
        return jz.data.days[date.getDay()] + ' ' + date.getDate() + 'th';
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