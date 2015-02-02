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
        // TODO Politiets IKT-tjenester
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
        ["Bouvet", "bouvet_2012.jpg", "http://www.bouvet.no/"]
    ];

    jz.data.academypartners = [
        ["Accenture", "accenture_2012.jpg", "http://www.accenture.no/"],
        ["NETS", "nets_2012.jpg", "http://www.nets.no/"],
        ["Finn.no", "finn_2012.jpg", "http://www.finn.no"]
    ];

    // TODODODODODOD!!11one
    jz.data.credits = [
        ["Navn", "http://distilleryimage4.s3.amazonaws.com/07fa19b2d14a11e2866d22000a9f137d_7.jpg", "https://twitter.com/Espenhh"],
        ["Navn", "http://distilleryimage3.s3.amazonaws.com/c904f556d14911e292d022000a1fcc15_7.jpg", "https://twitter.com/vandelan"],
        ["Navn", "http://distilleryimage8.s3.amazonaws.com/c4125a36d14711e29b6422000aa80460_7.jpg", ""],
        ["Navn", "http://distilleryimage6.s3.amazonaws.com/8874eb8ad14511e285fc22000a1f96be_7.jpg", ""],
        ["Navn", "http://distilleryimage10.s3.amazonaws.com/b900e1a8d15111e285b022000a9f15de_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage4.s3.amazonaws.com/07fa19b2d14a11e2866d22000a9f137d_7.jpg", "https://twitter.com/Espenhh"],
        ["Navn", "http://distilleryimage3.s3.amazonaws.com/c904f556d14911e292d022000a1fcc15_7.jpg", "https://twitter.com/vandelan"],
        ["Navn", "http://distilleryimage8.s3.amazonaws.com/c4125a36d14711e29b6422000aa80460_7.jpg", ""],
        ["Navn", "http://distilleryimage6.s3.amazonaws.com/8874eb8ad14511e285fc22000a1f96be_7.jpg", ""],
        ["Navn", "http://distilleryimage10.s3.amazonaws.com/b900e1a8d15111e285b022000a9f15de_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage6.s3.amazonaws.com/8874eb8ad14511e285fc22000a1f96be_7.jpg", ""],
        ["Navn", "http://distilleryimage10.s3.amazonaws.com/b900e1a8d15111e285b022000a9f15de_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""],
        ["Navn", "http://distilleryimage8.s3.amazonaws.com/c4125a36d14711e29b6422000aa80460_7.jpg", ""],
        ["Navn", "http://distilleryimage6.s3.amazonaws.com/8874eb8ad14511e285fc22000a1f96be_7.jpg", ""],
        ["Navn", "http://distilleryimage10.s3.amazonaws.com/b900e1a8d15111e285b022000a9f15de_7.jpg", ""],
        ["Navn", "http://distilleryimage1.s3.amazonaws.com/85ffef08d06911e29f1422000a1fbc0e_7.jpg", ""]
    ];
})(window.jz = window.jz || {});