(function(_, request, Handlebars, $, jz) {

    var iconMapping = {
        'Java platforms': 'icon-home',
        'Architecture': 'icon-road',
        'Backend': 'icon-cog',
        'Craftmanship': 'icon-heart',
        'Theory': 'icon-book',
        'Frontend': 'icon-leaf',
        'Other Awesomeness': 'icon-smiley'
    };

    var formatMapping = {
        'lightning-talk': 'icon-flash',
        'presentation': undefined
    }

    var languageMapping = {
        'en': 'English',
        'no': 'Norwegian'
    };

    var flagMapping = {
        'en': '/assets/img/GB.png',
        'no': '/assets/img/NO.png'
    };

    function mdate(d) {
        return moment(d).utcOffset(120);
    }

    function munix(d) {
        return moment.unix(d).utcOffset(120);
    }

    var program = {};
    var categories = {};
    var dates = [];

    var categoriesFilter = [];
    var difficultiesFilter = [];
    var languageFilter = [];

    var matcher = function(type) {
        return _.ary(_.partial(_.startsWith, _, type), 1);
    }
    var hasTopic = matcher('topic:');
    var hasType = matcher('type:');

    function extract(t, matcher) {
        return function(submission) {
            var result = _.find(submission.nokkelord, matcher);
            if (result)
                submission[t] = _.trimLeft(result, t + ':');

            return submission;
        }
    }

    function getProgram() {
        jz.data.program()
        .then(renderSuccess)
        .fail(renderError);
    }

    function format(timestamp) {
        return munix(timestamp).format('HH:mm');
    }

    var transformTalk = _.compose(_.compose(room, flag, speaker, icon, extractVideoLink, extractDetailsLink, transformNokkelord, transformStarter, extract('topic', hasTopic), extract('type', hasType)));

    function createSlots(memo, current) {
        var timestamp = current.starter;
        if (current.format === 'Presentation') {
            var slot = _.find(memo, {timestamp:timestamp});
            if (slot)
                slot.talks.push(current);
            else
                memo.push({timestamp: timestamp, talks: [current], slot: format(timestamp)});
        } else {
            var slot = _(memo)
                .filter(function(slot) {
                    return slot.timestamp <= timestamp;
                })
                .last();
            slot.talks.push(current);
        }

        return memo;
    }

    function groupByTimeslots(date) {
        date.presentations = _(date.presentations)
            .sortByOrder(['starter', 'format', 'rom'], [true, false, true])
            .reduce(createSlots, []);

        return date;
    }

    function transformToDays(program) {
        return _(program)
            .filter(function(talk) {
                return talk.starter && talk.format !== 'workshop';
            })
            .map(transformTalk)
            .groupBy(day)
            .transform(function(result, presentations, date) {
                result.push({date: date, presentations: presentations});
            }, [])
            .map(groupByTimeslots)
            .value();
    }

    function transformToCategories(program) {
        return _(program)
            .map(transformTalk())
            .groupBy('topic')
            .transform(toObject, [])
            .value();
    }

    function imageUrl(url) {
        var pixelRatio = window.devicePixelRatio || 1;
        var size = pixelRatio >= 2 ? 48 : 24;
        return url + '?size=' + size + '&d=mm';
    }

    // This is seriously horrible. Thank you Javascript for your lack of date handling
    function extractDates(program) {
        return _(program)
            .filter(function(talk) {
                return talk.starter && talk.format !== 'workshop';
            })
            .map(function(talk) {
                return moment(munix(talk.starter).format('YYYY-MM-DD'));
            }).uniq(function(date) {
                return date.unix();
            })
            .sortBy(function(date) {
                return date.unix();
            })
            .value();
    }

    function extractCategories(program) {
        var categories = _(_(program)
            .map(_.compose(transformFilters, extract('topic', hasTopic), extract('type', hasType)))
            .reduce(function(result, cur) {
                return result.concat(cur.nokkelord);
            }, []))
            .uniq(function(n) {
                return n.l;
            })
            .partition(function(n) {
                return _.startsWith(n.c, 'difficulty-');
            })
            .value();

            return {difficulty: categories[0], categories: categories[1]};
    }

    function room(submission) {
        submission.roomNumber = _.last(submission.rom.split(' '));
        return submission;
    }

    function flag(submission) {
        submission.flag = flagMapping[submission.sprak];
        submission.sprak = languageMapping[submission.sprak];
        return submission;
    }

    function speaker(submission) {
        submission.foredragsholdere = _.map(submission.foredragsholdere, function(f) {
            f.bildeUri = imageUrl(f.bildeUri);
            return f;
        });
        return submission;
    }

    function icon(submission) {
        submission.icon = formatMapping[submission.format];
        submission.format = _.capitalize(submission.format);
        return submission;
    }

    function extractVideoLink(submission) {
        var video = _.find(submission.links, {rel: 'video'});
        if (!video)
            return video;

        submission.video = video.href;
        return submission;
    }

    function extractDetailsLink(submission) {
        var linkParts = _.find(submission.links, {rel: 'detaljer'});
        if (!linkParts) {
            return;
        }
        var id = _.last(linkParts.href.split('/'));
        submission.detaljer = '/details.html?talk=' + encodeURIComponent(id);
        return submission;
    }

    function toObject(result, value, key) {
        result.push({
            key: key,
            value: value
        });
    }

    function transformFilters(submission) {
        submission.nokkelord = [
            {c: 'difficulty-' + submission.niva, l: _.capitalize(submission.niva)},
            {c: _.kebabCase(submission.type), l: submission.type},
            {c: _.kebabCase(submission.topic), l: submission.topic}
        ];
        return submission;
    }

    function transformStarter(talk) {
        talk.starter = mdate(talk.starter).unix();
        return talk;
    }

    function transformNokkelord(submission) {
        submission.nokkelord = [
            {c: 'difficulty-' + submission.niva, l: _.capitalize(submission.niva)},
            {c: _.kebabCase(submission.type), l: submission.type}
        ].concat(_.dropRight(submission.nokkelord, 2).map(function(n) {
            return {c: _.kebabCase(n), l: n};
        }));
        return submission;
    }

    function filterProgram(prog) {
        if (!difficultiesFilter.length && !categoriesFilter.length && !languageFilter.length)
            return prog;

        _.each(prog, function(p) {
            p.presentations = _(p.presentations)
                .map(function(p) {
                    p.talks = _.filter(p.talks, function(talk) {
                        var isActive = true;

                        if (difficultiesFilter.length)
                            isActive = isActive && difficultiesFilter.indexOf(_.capitalize(talk.niva)) >= 0;

                        if (categoriesFilter.length)
                            isActive = isActive && hasCategory(talk, categoriesFilter);

                        if (languageFilter.length) {
                            isActive = isActive && languageFilter.indexOf(talk.sprak) >= 0;
                        }

                        return isActive;
                    });

                    return p;
                })
                .filter(function(p) {
                    return p.talks.length > 0;
                })
                .value();
        });

        return prog;
    }

    function hasCategory(talk, categories) {
        return _.intersection(_.pluck(talk.nokkelord, 'l'), categories).length > 0;
    }

    function attachListeners(container) {
        var $container = $(container);
        $container.find('.filter-difficulty').on('click', filterDifficulty);
        $container.find('.filter-category').on('click', filterCategory);
        $container.find('.filter-language').on('click', filterLanguage);
    }

    function filterDifficulty(ev) {
        var $el = $(ev.target);
        if(!$el.is('li'))
            return;

        $el.toggleClass('active');
        var difficulty = $el.text();
        if (_.includes(difficultiesFilter, difficulty))
            difficultiesFilter = _.reject(difficultiesFilter, _.matches(difficulty));
        else
            difficultiesFilter.push(difficulty);

        renderProgram();
        $el.blur();
    }

    function filterCategory(ev) {
        var $el = $(this);
        if(!$el.is('li'))
            return;

        $el.toggleClass('active');
        var category = $el.text();
        if (_.includes(categoriesFilter, category))
            categoriesFilter = _.reject(categoriesFilter, _.matches(category));
        else
            categoriesFilter.push(category);

        renderProgram();
        $el.blur();
    }

    function filterLanguage(ev) {
        var $el = $(this);
        if (!$el.is('li'))
            return;

        $el.toggleClass('active');
        var language = $el.attr('data-lang');
        if (_.includes(languageFilter, language))
            languageFilter = _.reject(languageFilter, _.matches(language));
        else
            languageFilter.push(language);

        renderProgram();
        $el.blur();
    }

    function renderSuccess(data) {
        program = transformToDays(data);
        program[0].firstDay = true;
        program[0].className = 'date-9';
        program[1].className = 'date-10';
        console.log(program);
        dates = extractDates(data);
        categories = extractCategories(data);
        renderDates();
        renderFilter();
        renderProgram();
    }

    function renderDates() {
        var template = Handlebars.compile(document.querySelector('.program-days-template').innerHTML);
        var container = document.querySelector('.program-days');
        container.innerHTML = template(dates.map(function(date) {
            return {url: date.date(), text: jz.data.days[date.day()] + ' ' + date.date() + 'th'};
        }));
    }

    function renderFilter() {
        var template = Handlebars.compile(document.querySelector('.program-filter').innerHTML);
        var container = document.querySelector('.javazone-program-filter .filters');
        container.innerHTML = template(categories);
        attachListeners(container);
    }

    function renderProgram() {
        filteredProgram = filterProgram(_.cloneDeep(program));
        var template = Handlebars.compile(document.querySelector('.program-day-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template(filteredProgram);
    }

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

    function day(talk) {
        if (!talk.starter)
            return "-1";

        return munix(talk.starter).format('dddd Do');
    }

	jz.program = getProgram;

})(window._, window.superagent, window.Handlebars, window.$, window.jz = window.jz || {});