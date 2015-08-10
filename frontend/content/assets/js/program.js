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

    var program = {};
    var categories = {};
    var dates = [];

    var categoriesFilter = [];
    var difficultiesFilter = [];
    var dateFilter = '';

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

    function findInitialDate(dates) {
        var hash = window.location.hash.substr(1);
        if (hash !== '') {
            var date = _.find(dates, function(date) { return date.getDate() == hash; });
            if (_.isDate(date))
                return date;
        }

        var today = new Date();
        if (today.getMonth() !== 8)
            return _.first(dates);

        var date = _.find(dates, function(date) {
            return date.getDate() === today.getDate();
        });

        return _.isDate(date) ? date : _.first(dates);
    }

    function format(timestamp) {
        var d = new Date(timestamp);
        var hours = d.getHours() + '';
        if (hours.length === 1)
            hours = '0' + hours;

        var minutes = d.getMinutes() + '';
        if (minutes.length === 1)
            minutes = '0' + minutes;

        return hours + ':' + minutes;
    }

    var transformTalk = _.compose(_.compose(flag, speaker, icon, extractDetailsLink, transformNokkelord, transformStarter, extract('topic', hasTopic), extract('type', hasType)));

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
            .sortByOrder(['starter', 'format'], [true, false])
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
                var date = new Date(talk.starter).getDate();
                if (date < 10)
                    date = '0' + date;

                return new Date('2015-09-' + date);
            }).uniq(function(date) {
                return date.getTime();
            })
            .sortBy(function(date) {
                return date.getTime();
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
        talk.starter = new Date(talk.starter).getTime();
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
        if (!difficultiesFilter.length && !categoriesFilter.length)
            return prog;

        prog.presentations = _(prog.presentations)
            .map(function(p) {
                p.talks = _.filter(p.talks, function(talk) {
                    var isActive = true;

                    if (difficultiesFilter.length)
                        isActive = isActive && difficultiesFilter.indexOf(_.capitalize(talk.niva)) >= 0;

                    if (categoriesFilter.length)
                        isActive = isActive && hasCategory(talk, categoriesFilter);

                    return isActive;
                });

                return p;
            })
            .filter(function(p) {
                return p.talks.length > 0;
            })
            .value();

        return prog;
    }

    function hasCategory(talk, categories) {
        return _.intersection(_.pluck(talk.nokkelord, 'l'), categories).length > 0;
    }

    function filterDate(date) {
        return _.find(program, function(p) {
            return p.date == date.getDate();
        });
    }

    function attachListeners(container) {
        var $container = $(container);
        $container.find('.filter-difficulty').on('click', filterDifficulty);
        $container.find('.filter-category').on('click', filterCategory);
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
    }

    function renderSuccess(data) {
        program = transformToDays(data);
        dates = extractDates(data);
        dateFilter = findInitialDate(dates);
        categories = extractCategories(data);
        renderDates();
        renderFilter();
        listenForHashChange();
    }

    function renderDates() {
        var template = Handlebars.compile(document.querySelector('.program-days-template').innerHTML);
        var container = document.querySelector('.program-days');
        container.innerHTML = template(dates.map(function(date) {
            return {url: date.getDate(), text: jz.data.days[date.getDay()] + ' ' + date.getDate() + 'th'};
        }));
    }

    function renderFilter() {
        var template = Handlebars.compile(document.querySelector('.program-filter').innerHTML);
        var container = document.querySelector('.javazone-program-filter');
        container.innerHTML = template(categories);
        attachListeners(container);
    }

    function renderProgram() {
        var programForDate = filterDate(dateFilter);
        filteredProgram = filterProgram(_.cloneDeep(programForDate));
        var template = Handlebars.compile(document.querySelector('.program-day-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template(filteredProgram);
    }

    function listenForHashChange() {
        window.addEventListener('hashchange', function() {
            $('.active-day').removeClass('active-day');
            var hash = window.location.hash.substr(1);
            $('a[href="#' + hash + '"]').addClass('active-day');
            var d = _.find(dates, function(date) {
                return date.getDate() == hash;
            });
            dateFilter = d;
            renderProgram();
        });

        if (window.location.hash === '')
            window.location.hash = dateFilter.getDate();
        else {
            renderProgram();
            $('a[href="' + window.location.hash + '"]').addClass('active-day');
        }
    }

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

    function day(talk) {
        if (!talk.starter)
            return "-1";
        
        var d = new Date(talk.starter).getDate();
        return d;
    }

	jz.program = getProgram;

})(window._, window.superagent, window.Handlebars, window.$, window.jz = window.jz || {});