(function(jz) {

    jz.data = {};

    // 2014
    // jz.data.partners = [
    //     ["Scienta", "scienta_2014.jpg", "http://www.scienta.no/"],
    //     ["Conduct", "conduct_2012.jpg", "http://www.conduct.no"],
    //     ["DIPS", "dips_2013.jpg", "http://www.dips.no"],
    //     ["NETS", "nets_2012.jpg", "http://www.nets.no/"],
    //     ["Miles", "miles_2014.png", "http://www.miles.no/"],
    //     ["Arktekk", "arktekk_2012.jpg", "http://www.arktekk.no/"],
    //     ["Conax", "stolt_partner_conax.jpg", "http://www.conax.no/"],
    //     ["Skatteetaten", "skatteetaten_2012.jpg", "http://www.skatteetaten.no/"],
    //     ["Programutvikling", "programutvikling_2012.jpg", "http://www.put.no/"],
    //     ["Kantega", "kantega_2012.jpg", "http://www.kantega.no/"],
    //     ["Bekk", "bekk_2012.jpg", "http://www.bekk.no/"],
    //     ["Steria", "steria_2012.jpg", "http://www.steria.no/"],
    //     ["Systek", "systek_2013.jpg", "http://www.systek.no/"],
    //     ["Accenture", "accenture_2012.jpg", "http://www.accenture.no/"],
    //     ["Bouvet", "bouvet_2012.jpg", "http://www.bouvet.no/"],
    //     ["Kodemaker", "kodemaker_2012.jpg", "http://www.kodemaker.no/"],
    //     ["Mesan", "mesan_2012.jpg", "http://www.mesan.no/"],
    //     ["Evry", "evry_2013.jpg", "http://www.evry.no"],
    //     ["Finn.no", "finn_2012.jpg", "http://www.finn.no"],
    //     //["NITH", "nith_2012.jpg", "http://nith.no/"],
    //     ["Westerdals", "stolt_partner_westerdals2014_1.jpg", "http://www.westerdals.no"],
    //     ["CapGemini", "capgemini_2012.jpg", "http://www.capgemini.no/"],
    //     ["Itera", "stolt_partner_itera.jpg", "http://www.iteraconsulting.no/"],
    //     ["Inmeta Consulting", "stolt_partner_inmeta.jpg", "http://www.inmeta.no/"],
    //     ["Jetbrains", "Jetbrains.jpg", "http://www.jetbrains.com"],
    //     ["Cisco", "cisco_2012.jpg", "http://www.cisco.com/"],
    //     ["Microsoft", "Microsoft.jpg", "http://www.microsoft.no/"],
    //     ["Acando", "acando_2012.jpg", "http://www.acando.no/"],
    //     ["Schlumberger", "schlumberger_2012.jpg", "http://www.slb.com"],
    //     ["Visma", "visma_2012.jpg", "http://www.visma.no/"],
    //     ["Webstep", "webstep_2012.jpg", "http://www.webstep.no/"],
    //     ["Vaadin", "vaadin_2014.jpg", "https://vaadin.com/"],
    //     ["Iterate", "stolt_partner_iterate.jpg", "http://www.iterate.no/"],
    //     ["Computas", "computas_2012.jpg", "http://www.computas.no/"],
    //     ["Ciber", "ciber_2012.jpg", "http://www.ciber.no/"],
    //     ["KnowIT", "knowit_2012.jpg", "http://www.knowit.no/"],
    //     ["jPro", "jpro_2012.jpg", "http://www.jpro.no/"],
    //     ["embriq", "embriq_2014.png", "http://www.embriq.no/"],
    //     ["GitHub", "github_2014.png", "https://github.com/"],
    //     ["Greenbird", "greenbird_2014.png", "http://www.greenbird.com"],
    //     ["Altran", "stolt_partner_altran.jpg", "http://www.altran.no/"],
    //     ["NAV IKT", "nav_2014.png", "http://www.nav.no/"],
    //     ["IBM", "ibm_2014.png", "http://www.ibm.com/"]
    //     //["Atlassian", "stolt_partner_atlassian.jpg", "https://www.atlassian.com"]
    //     // ["Marcello", "marcello_2013.jpg", "http://www.marcello.no/"],
    //     // ["ViaNett", "vianett_2013ny.jpg", "http://www.vianett.no"],
    //     // ["Decisive", "stolt_partner_decisive.jpg", "http://www.decisive.no/"],
    //     // ["Esito", "stolt_partner_esito.jpg", "http://www.esito.no/"],
    //     // ["Antares", "antares_2013.jpg", "http://www.antares.no"],
    //     // ["Pluralsight", "pluralsight_2013.jpg", "http://www.pluralsight.com"],
    //     // ["Oracle", "oracle_2012.jpg", "http://www.oracle.com/no/index.html"],

    // ];

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
        ["NAV IKT", "nav_2014.png", "http://www.nav.no/"]
    ];

    jz.data.academypartners = [
        ["Accenture", "accenture_2012.jpg", "http://www.accenture.no/"],
        ["NETS", "nets_2012.jpg", "http://www.nets.no/"],
        ["Finn.no", "finn_2012.jpg", "http://www.finn.no"]
    ];

    jz.data.helter = [
        ["Helge Jenssen", "https://robohash.org/2", "https://twitter.com/hejens"],
        ["Espen Herseth Halvorsen", "/assets/img/javabin/espen_herseth_halvorsen.jpg", "https://twitter.com/espenhh"],
        ["Ole-Alexander Moy", "/assets/img/javabin/ole_alexander_moy.jpg", "https://twitter.com/olemoy"],
        ["Bendik Solheim", "/assets/img/javabin/bendik_solheim.jpg", ""],
        ["Livar Bergheim", "/assets/img/javabin/livar_bergheim.jpg", ""],
        ["Beate Myrvoll", "https://robohash.org/7", ""],
        ["Anders Karlsen", "/assets/img/javabin/anders_karlsen.jpg", ""],
        ["Janniche Haugen", "/assets/img/javabin/janniche_haugen.jpg", ""],
        ["Endre Stølsvik", "https://robohash.org/10", ""],
        ["Erik Drolshammer", "/assets/img/javabin/erik_drolshammer.jpg", ""],
        ["Rustam Mehmandarov", "/assets/img/javabin/rustam_mehmandarov.jpg", ""],
        ["Kjetil Valstadsve", "https://robohash.org/13", ""],
        ["Mark West", "/assets/img/javabin/mark_west.jpg", "https://twitter.com/markawest"],
        ["Markus Eisele", "https://robohash.org/15", ""],
        ["Ole Bakstad", "https://robohash.org/16", ""],
        ["Øyvind Løkling", "https://robohash.org/17", ""],
        ["Rafael Winterhalter", "https://robohash.org/18", ""],
        ["Martin Skarsaune", "/assets/img/javabin/martin_skarsaune.jpg", "https://twitter.com/mskarsaune"],
        ["Christian K. Wiik", "https://robohash.org/20", ""],
        ["Ingar Abrahamsen", "https://robohash.org/21", ""],
        ["Henrik Nordvik", "https://robohash.org/22", ""],
        ["Kjetil Valle", "/assets/img/javabin/kjetil_valle.jpg", ""],
        ["Sveinung Dalatun", "/assets/img/javabin/sveinung_dalatun.jpg", ""],
        ["Erlend Hamnaberg", "https://robohash.org/24", ""],
        ["Chris Searle", "https://robohash.org/25", ""],
        ["Ronnie Nessa", "https://robohash.org/26", ""],
        ["Alexander Stensby", "https://robohash.org/27", ""],
        ["Dervis Mansuroglu", "/assets/img/javabin/dervis_mansuroglu.jpg", ""],
        ["Håkon Botnmark Jahre", "/assets/img/javabin/haakon_jahre.jpg", ""],
        ["Jaran Nilsen", "https://robohash.org/30", ""],
        ["Maziar Ghahramani", "/assets/img/javabin/maziar_ghahramani.jpg", ""],
        ["Stian Nygaard", "https://robohash.org/32", ""],
        ["Stig Lau", "https://robohash.org/33", ""],
        ["Andreas Røe", "https://robohash.org/34", ""],
        ["Yvonne Edvartsen", "/assets/img/javabin/yvonne_edvartsen.jpg", ""],
        ["Bjørn Hamre", "/assets/img/javabin/bjorn_hamre.jpg", ""],
        ["Hallvard Nygård", "/assets/img/javabin/hallvard_nygaard.jpg", ""],
        ["Jan Fredrik Wedén", "/assets/img/javabin/jan_fredrik_weden.jpg", ""],
        ["Mikkel Dan Rognlie", "/assets/img/javabin/mikkel_dan_rognlie.jpg", ""],
        ["Narve Sætre", "/assets/img/javabin/narve_setre.jpg", ""],
        ["Paul Nyheim", "/assets/img/javabin/paul_nyheim.jpg", ""],
        ["Sten Aksel", "/assets/img/javabin/sten_aksel.jpg", ""],
        ["Kristian Berg", "https://robohash.org/77", ""],
        ["Erlend Birkenes", "https://robohash.org/88", ""],
    ];
})(window.jz = window.jz || {});