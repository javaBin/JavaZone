(function(_, jz) {;

    function mdate(d) {
        return moment(d).utcOffset(120);
    }

    var mapping = {
        "010f79f10ad3698c72c5920f4e667ff06f611feb1e571eee59a9abd8b01a65ad": "docker_for_java_developers",
        "a1142678fcf52c769f39bd48c52e1ec0b51a9187c1c65f25e3face4d487a55d4": "create_your_own_programming_lang",
        "ce5cb420b09fca71573c20bcb4805e51033c52dfc29f146d85275957de06b49c": "sanntidsovervkning_av_twitter_me",
        "fe2e3c6aecec2b248fb233f087dd6ce014711ca56ac5f6486b854d1bf3a7a950": "java_flight_recorder_hands_on_la",
        "5e5ae7dcff76fecf473c55017f5608d24bb1e729294de532f6fa4e45a94d2ec4": "lag_ditt_eget_kart",
        "1696e8818e8643888e6acba6a684ad3648fec9074cb49c1a4264b248592094cf": "android_101",
        "4ec8f9c9f9b79275e77fbe3e68fcff07b22a7d24fd278bac2139fdb5d057b9af": "practical_mutation_testing_with_",
        "022a500bd0b03f35720d23de768c83532fc3b040be7fff0ba4bc6875601f46f7": "iot_livehacking_with_tinkerforge",
        "e77bcf4c287316fd9b01538abab6c1451c9815a828810d8bfe2c958396d8faf2": "through_the_jmx_window",
        "01732b6c8fd0633cb5c974ee363822253c09d27361d0a529cf79bb3ed1706446": "lambdas_and_streams_hands_on_lab"
    }

    function transform(data, workshopList) {
        return _(data)
            .filter(_.matchesProperty('format', 'workshop'))
            .map(_.compose(speaker, timestamp, day, merge(workshopList), extractDetailsLink))
            .sortBy('timestamp')
            .value();
    }

    function merge(workshopList) {
        return function(workshop) {
            var workshopId = mapping[workshop.id];
            var status = _.find(workshopList, {'id': workshopId});
            workshop.workshopId = workshopId;
            workshop.description = status.description;
            workshop.status = jz.data.workshopStatus(status.status);
            return workshop;
        };
    }

    function timestamp(workshop) {
        var date = mdate(workshop.starter).unix();
        workshop.timestamp = date;
        return workshop;
    }

    function day(workshop) {
        var date = new Date(parseInt(workshop.timestamp, 10));
        workshop.when = formatDate(workshop.starter, workshop.stopper);
        return workshop;
    }

    function extractDetailsLink(workshop) {
        var linkParts = _.find(workshop.links, {rel: 'detaljer'});
        if (!linkParts) {
            return;
        }
        var id = _.last(linkParts.href.split('/'));
        workshop.detaljer = '/details.html?talk=' + encodeURIComponent(id);
        workshop.id = id;
        return workshop;
    }

    function speaker(workshop) {
        workshop.speakerTitle = workshop.foredragsholdere.length === 1 ? 'Speaker' : 'Speakers';
        return workshop;
    }

    function formatDate(start, end) {
        start = mdate(start);
        console.log(start);
        end = mdate(end);
        return start.format('dddd, MMMM Do YYYY') + ' at ' + start.format('HH:mm') + '-' + end.format('HH:mm');
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
        .then(function (program) {
            jz.data.workshops()
            .then(function(workshops) {
                renderSuccess(transform(program, workshops));
            })
        })
        .fail(renderError);
    }

})(_ ,window.jz = window.jz || {});