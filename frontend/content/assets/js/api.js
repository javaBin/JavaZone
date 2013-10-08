jz.api.cache = {};

jz.api.get = function(url) {
    if(url.indexOf("http") === 0) {
        url = "/api/" + url.split("/api/")[1];
    }
    var def = new $.Deferred();
    var data = jz.api.cache[url];
    if(data) return def.resolve(data);
    $.ajax({
        url: url,
        headers: {
            "X-Jz-Secret": $.cookie("jz.secret") || "?"
        }
    }).done(function(data) {
        jz.api.cache[url] = data;
        def.resolve(data);
    });
    return def;
};

jz.api.tweets = function() {
    return jz.api.get("/api/tweets");
};

jz.api.parseSession = function(d) {
    d.uri   = jz.api.link(d, 'details');
    d.id    = d.uri ? _.last(d.uri.split("/")).substr(0, 8) : 1;
    d.slugs = _.map(d.keywords, jz.utils.slug);
    d.names = _.pluck(d.speakers, "name").join(", ");
    d.imgs  = _.pluck(d.speakers, "gravatarUrl");
    d.date  = jz.date.parse(d.start);
    d.day   = parseInt(d.date.day, 10);
    d.sessionlength = d.format === "presentation" ? "60 min" : "10 min";
    d.language = d.lang === "no" ? "Norwegian" : "English";
    d.level = d.level === 'intermediate-advanced' ? 'advanced' : d.level;
    d.rating = parseInt(jz.api.rating(d.id), 10);
    return d;
};

jz.api.groupSlots = function(day) {
    var slots = [[]], prev;

    // Group into time slots
    _.each(day, function(session) {
        var index = slots.length - 1;
        if (!slots[index]) slots[index] = [];
        if (session.format === 'lightning-talk') return slots[index].push(session);
        if (!prev || prev.start === session.start) slots[index].push(session);
        else slots.push([session]);
        prev = session;
    });

    // Sort presentations by room number
    _.each(slots, function(slot, index) {
        slots[index] = _.sortBy(slots[index], 'room');
    });

    return slots;
};

jz.api.groupSessions = function(data) {
    var sorted = _.chain(data).sortBy(jz.api.string_comparator('-format')).sortBy('start').groupBy('day').value();
    sorted = _.map(sorted, jz.api.groupSlots);
    return sorted;
};

jz.api.link = function(data, rel) {
    if (!data.links) return false;
    var link = _.find(data.links, function(link) {
        return link.rel.indexOf(rel) > -1;
    });
    return link ? link.uri : false;
};

jz.api.sessions = function() {
    return jz.api.sessionsByUrl("/api/sessions");
};

jz.api.adminsessions = function() {
    if(!$.cookie("jz.secret")) {
        var secret = prompt('Passord:');
        $.cookie("jz.secret", secret, { path: '/', expires: 1 });
    }
    return jz.api.sessionsByUrl("/api/admin/sessions");
};

jz.api.sessionsByUrl = function(url) {
    var def = new $.Deferred();
    jz.api.get(url).then(function(data) {
        _.each(data, jz.api.parseSession);

        // Remove invalid sessions
        data = _.reject(data, function(d) {
            return !d.start || !d.title || !d.room;
        });

        var c = _.chain(data), parsed = {
            tags: c.pluck("keywords").flatten().uniq().value().sort(),
            rooms: c.pluck("room").uniq().value().sort(),
            langs: c.pluck("language").uniq().value().sort(),
            levels: c.pluck("level").uniq().value(),
            formats: c.pluck("format").uniq().value().reverse(),
            sessions: jz.api.groupSessions(data)
        };
        parsed.slugs = _.map(parsed.formats, jz.utils.slug);
        def.resolve(parsed);
    });
    return def;
};

jz.api.session = function(id) {
    var def = new $.Deferred();
    jz.api.get("/api/sessions/" + id).then(function(data) {
        def.resolve(jz.api.parseSession(data));
    });
    return def;
};

jz.api.details = function(url) {
    var def = new $.Deferred();
    jz.api.get(url).then(function(data) {
        jz.api.template("details", data).then(function(html) {
            def.resolve(html);
        });
    });
    return def;
};

jz.api.rate = function(id, url, rating, comment) {
    if (!rating && !comment) return;
    var data = {};
    if (rating) data.rating = parseInt(rating, 10);
    if (comment) data.comment = comment;
    $.cookie(id, rating, { path: '/', expires: 365 });
    jz.api.post(url, data);
};

jz.api.post = function(url, data) {
    return $.ajax({
        url: url,
        contentType: "application/json",
        method: "post",
        data: JSON.stringify(data)
    });
};

jz.api.rating = function(id) {
    if (!id) return 0;
    return $.cookie(id) || 0;
};

jz.api.template = function(name, data) {
    var def = new $.Deferred();
    jz.api.get("/assets/templates/" + name + ".html").then(function(html) {
        def.resolve(_.template(html)(data || {}));
    });
    return def;
};

jz.api.string_comparator = function(param_name, compare_depth) {
    if (param_name[0] == '-') {
        param_name = param_name.slice(1),
        compare_depth = compare_depth || 10;
        return function (item) {
             return String.fromCharCode.apply(String,
                _.map(item[param_name].slice(0, compare_depth).split(""), function (c) {
                    return 0xffff - c.charCodeAt();
                })
            );
        };
    } else {
        return function (item) {
            return item[param_name];
        };
    }
};
