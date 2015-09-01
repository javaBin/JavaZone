(function(request, $, jz) {

    jz.data = {};

    jz.data.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // 2015:
    jz.data.partners = [
        ["Microsoft", "Microsoft.jpg", "http://www.microsoft.no/"],
        ["Jetbrains", "Jetbrains.jpg", "http://www.jetbrains.com"],
        ["Greenbird", "greenbird_2014.png", "http://www.greenbird.com"],
        ["Itera", "stolt_partner_itera.jpg", "http://www.iteraconsulting.no/"],
        ["Miles", "miles_2014.png", "http://www.miles.no/"],
        ["Kantega", "kantega_2012.jpg", "http://www.kantega.no/"],
        ["Webstep", "webstep_2012.jpg", "http://www.webstep.no/"],
        ["NETS", "nets_2012.jpg", "http://www.nets.no/"],
        ["Mesan", "mesan_2012.jpg", "http://www.mesan.no/"],
        ["Politiets IKT-tjenester", "politiet_2015.png", "https://www.politi.no/politiets_ikt-tjenester/"],
        ["CapGemini", "capgemini_2012.jpg", "http://www.capgemini.no/"],
        ["Conduct", "conduct_2012.jpg", "http://www.conduct.no"],
        ["Ciber", "ciber_2012.jpg", "http://www.ciber.no/"],
        ["Accenture", "accenture_2012.jpg", "http://www.accenture.no/"],
        ["Skatteetaten", "skatteetaten_2012.jpg", "http://www.skatteetaten.no/"],
        ["Sopra Steria", "soprasteria_2015.png", "http://www.steria.com/no/"],
        ["Finn.no", "finn_2012.jpg", "http://www.finn.no"],
        ["Visma", "visma_2012.jpg", "http://www.visma.no/"],
        ["Systek", "systek_2013.jpg", "http://www.systek.no/"],
        ["embriq", "embriq_2014.png", "http://www.embriq.no/"],
        ["GitHub", "github_2014.png", "https://github.com/"],
        ["Bouvet", "bouvet_2012.jpg", "http://www.bouvet.no/"],
        ["Acando", "acando_2015.png", "http://www.acando.no/"],
        ["Bekk", "bekk_2012.jpg", "http://www.bekk.no/"],
        ["jPro", "jpro_2012.jpg", "http://www.jpro.no/"],
        ["Westerdals", "stolt_partner_westerdals2014_1.jpg", "http://www.westerdals.no"],
        ["Kodemaker", "kodemaker_2012.jpg", "http://www.kodemaker.no/"],
        ["NAV IKT", "nav_2014.png", "http://www.nav.no/"],
        ["Evry", "evry_2013.jpg", "http://www.evry.no"],
        ["Computas", "computas_2012.jpg", "http://www.computas.no/"],
        ["Programutvikling", "programutvikling_2015.png", "http://www.put.no/"],
        ["Arktekk", "arktekk_2012.jpg", "http://www.arktekk.no/"],
        ["ZeroTurnaround", "zt_2015.png", "http://zeroturnaround.com"],
        ["KnowIT", "knowit_2012.jpg", "http://www.knowit.no/"],
        ["Tripletex", "tripletex_2015.png", "https://www.tripletex.no"],
        ["Enonic", "enonic_2015.png", "https://enonic.com"],
        ["Red Hat", "redhat_2015.png", "http://www.redhat.com/en"],
        ["Hazelcast", "hazelcast_2015.png", "http://hazelcast.com"],
        ["Schibsted", "schibsted_2015.png", "http://www.schibsted.com"],
        ["Sans", "sans_2015.png", "https://www.sans.org"],
        ["IBM", "ibm_2014.png", "http://www.ibm.com/no/no/"]
    ];

    jz.data.academypartners = [
        ["Accenture", "accenture_2012.jpg", "http://www.accenture.no/"],
        ["NETS", "nets_2012.jpg", "http://www.nets.no/"],
        ["Finn.no", "finn_2012.jpg", "http://www.finn.no"]
    ];

    jz.data.helter = [
        ["Helge Jenssen", "/assets/img/javabin/helge_jenssen.jpg", "https://twitter.com/hejens"],
        ["Espen Herseth Halvorsen", "/assets/img/javabin/espen_herseth_halvorsen.jpg", "https://twitter.com/espenhh"],
        ["Ole-Alexander Moy", "/assets/img/javabin/ole_alexander_moy.jpg", "https://twitter.com/olemoy"],
        ["Bendik Solheim", "/assets/img/javabin/bendik_solheim.jpg", "https://github.com/bendiksolheim"],
        ["Livar Bergheim", "/assets/img/javabin/livar_bergheim.jpg", "https://twitter.com/livarb"],
        ["Beate Myrvoll", "/assets/img/javabin/beate_myrvoll.jpg", "https://twitter.com/bmyrvoll"],
        ["Anders Karlsen", "/assets/img/javabin/anders_karlsen.jpg", "https://twitter.com/anderskar"],
        ["Janniche Haugen", "/assets/img/javabin/janniche_haugen.jpg", "https://twitter.com/miss_haugen"],
        ["Endre Stølsvik", "/assets/img/javabin/endre_stolsvik.jpg", "https://twitter.com/stolsvik"],
        ["Erik Drolshammer", "/assets/img/javabin/erik_drolshammer.jpg", "https://twitter.com/sherriff1"],
        ["Rustam Mehmandarov", "/assets/img/javabin/rustam_mehmandarov.jpg", "https://twitter.com/rmehmandarov"],
        ["Kjetil Valstadsve", "/assets/img/javabin/kjetil_valstadve.jpg", "https://twitter.com/kjetilv"],
        ["Mark West", "/assets/img/javabin/mark_west.jpg", "https://twitter.com/markawest"],
        ["Markus Eisele", "/assets/img/javabin/markus_eisele.jpg", "https://twitter.com/myfear"],
        ["Ole Bakstad", "/assets/img/javabin/ole_bakstad.jpg", "#"],
        ["Øyvind Løkling", "/assets/img/javabin/oyvind_lokling.jpg", "https://twitter.com/lokling"],
        ["Rafael Winterhalter", "/assets/img/javabin/rafael_winterhalter.jpg", "https://twitter.com/rafaelcodes"],
        ["Martin Skarsaune", "/assets/img/javabin/martin_skarsaune.jpg", "https://twitter.com/mskarsaune"],
        ["Christian K. Wiik", "/assets/img/javabin/christian_wiik.jpg", "#"],
        ["Ingar Abrahamsen", "/assets/img/javabin/ingar_abrahamsen.jpg", "#"],
        ["Henrik Nordvik", "/assets/img/javabin/henrik_nordvik.jpg", "#"],
        ["Kjetil Valle", "/assets/img/javabin/kjetil_valle.jpg", "https://github.com/kvalle"],
        ["Sveinung Dalatun", "/assets/img/javabin/sveinung_dalatun.jpg", "#"],
        ["Erlend Hamnaberg", "/assets/img/javabin/erlend_hamnaberg.jpg", "https://twitter.com/hamnis"],
        ["Chris Searle", "/assets/img/javabin/chris_searle.jpg", "https://twitter.com/chrissearle"],
        ["Ronnie Nessa", "/assets/img/javabin/ronnie_nessa.jpg", "#"],
        ["Alexander Stensby", "/assets/img/javabin/alexander_stensby.jpg", "https://twitter.com/astensby"],
        ["Dervis Mansuroglu", "/assets/img/javabin/dervis_mansuroglu.jpg", "#"],
        ["Håkon Botnmark Jahre", "/assets/img/javabin/haakon_jahre.jpg", "#"],
        ["Jaran Nilsen", "/assets/img/javabin/jaran_nilsen.jpg", "http://www.jarannilsen.com"],
        ["Maziar Ghahramani", "/assets/img/javabin/maziar_ghahramani.jpg", "#"],
        ["Stian Nygaard", "/assets/img/javabin/stian_nygaard.jpg", "#"],
        ["Stig Lau", "/assets/img/javabin/stig_lau.jpg", "https://twitter.com/stiglau"],
        ["Andreas Røe", "/assets/img/javabin/andreas_roe.jpg", "https://twitter.com/andreasroe"],
        ["Yvonne Edvartsen", "/assets/img/javabin/yvonne_edvartsen.jpg", "#"],
        ["Bjørn Hamre", "/assets/img/javabin/bjorn_hamre.jpg", "https://twitter.com/javaguruen"],
        ["Hallvard Nygård", "/assets/img/javabin/hallvard_nygaard.jpg", "https://twitter.com/hallny"],
        ["Jan Fredrik Wedén", "/assets/img/javabin/jan_fredrik_weden.jpg", "#"],
        ["Mikkel Dan Rognlie", "/assets/img/javabin/mikkel_dan_rognlie.jpg", "#"],
        ["Narve Sætre", "/assets/img/javabin/narve_setre.jpg", "#"],
        ["Paul Nyheim", "/assets/img/javabin/paul_nyheim.jpg", "#"],
        ["Sten Aksel Heien", "/assets/img/javabin/sten_aksel.jpg", "https://twitter.com/sten_aksel"],
        ["Ørjan Solli", "/assets/img/javabin/orjan_solli.jpg", "#"],
        ["Bendik Egenes Dyrli", "/assets/img/javabin/bendik_egenes_dyrli.jpg", "http://skandix.me/"],
        ["Kristian Berg", "/assets/img/javabin/kristian_berg.jpg", "#"],
        ["Erlend Birkenes", "/assets/img/javabin/erlend_birkenes.jpg", "#"],
        ["Trygve Laugstøl", "/assets/img/javabin/trygve_laugstol.jpg", "#"],
        ["Kristoffer Moum", "/assets/img/javabin/kristoffer_moum.jpg", "#"],
        ["Ole Christian Rynning", "/assets/img/javabin/ole_christian_rynning.jpg", "#"],
        ["Stian Alsos", "/assets/img/javabin/stian_alsos.jpg", "#"],
        ["Oddbjorn Kvalsund", "/assets/img/javabin/oddbjorn_kvalsund.jpg", "#"],
        ["Konrad Beiske", "/assets/img/javabin/konrad_beiske.jpg", "#"],
        ["Markus Krüger", "/assets/img/javabin/markus_kruger.jpg", "#"],
        ["Hans Ove Ringstad", "/assets/img/javabin/hans_ove_ringstad.jpg", "#"]
    ];

    var baseUrl = 'http://test.javazone.no/javazone-web-api/events/javazone_2015/sessions';
    //var baseUrl = 'http://dev.javazone.no/resources/program.json';

    jz.data.program = function() {
        var def = $.Deferred();

        function parse(err, res) {
            if (err) {
                def.rejectWith(err);
                return;
            }

            def.resolve(res.body);
        }

        request(baseUrl)
        .end(parse);

        return def;
    }

    jz.data.talk = function(id) {
        var def = $.Deferred();

        function parse(err, res) {
            if (err) {
                def.rejectWith(err);
                return;
            }

            def.resolve(res.body);
        }

        request(baseUrl + '/' + id)
        .end(parse);

        return def;
    }

    jz.data.workshops = function() {
        var def = $.Deferred();

        function parse(err, res) {
            if (err) {
                def.rejectWith(err);
                return;
            }

            def.resolve(JSON.parse(res.text));
        }

        request('http://javazone.no/moosehead/data/workshopList')
        .end(parse);

        return def;
    }

    jz.data.workshopStatus = function(status) {
        switch (status) {
            case 'FREE_SPOTS': return {className: 'free-spots', no: 'Ledige plasser', en: 'Free spots'};
            case 'FEW_SPOTS': return {className: 'few-spots', no: 'Få plasser', en: 'Few spots'};
            case 'FULL': return {className: 'waiting-list', no: 'Venteliste', en: 'Waiting list'};
            case 'VERY_FULL': return {className: 'full', no: 'Ingen ledige plasser', en: 'No free spots'};
            case 'CLOSED': return {className: 'closed', no: 'Stengt', en: 'Closed'};
            default: return {className: 'not-opened', no: 'Ikke åpnet', en: 'Not opened'};
        }
    }

    jz.data.feedback = function(id, voterId, data) {
        var def = $.Deferred();

        function parse(err, res) {
            console.log(err);
            console.log(res);
            if (err) {
                def.rejectWith(err);
                return;
            }

            def.resolve(res);
        }

        request
        .post('http://test.javazone.no/devnull/server/events/0e6d98e9-5b06-42e7-b275-6abadb498c81/sessions/' + id + '/feedbacks')
        .set('Content-Type', 'application/json')
        .set('Voter-ID', voterId)
        .set('User-Agent', navigator.userAgent)
        .send(data)
        .end(parse);
        setTimeout(function() {
            def.resolve();
        }, 3000);
        return def;
    }

})(window.superagent, window.$, window.jz = window.jz || {});