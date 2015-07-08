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
        'workshop': 'icon-wrench',
        'presentation': 'icon-easel'
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

    var categoriesFilter = [];
    var difficultiesFilter = [];

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

    function transformToDays(res) {
        return _(parse(res))
            .groupBy(day)
            .transform(function(result, day, date) {
                result.push({date: date, presentations: day});
            }, [])
            .value();
    }

    function transformToCategories(program) {
        return _(program)
            .map(_.compose(flag, speaker, icon, extractDetailsLink, transformNokkelord, extract('topic', hasTopic), extract('type', hasType)))
            .groupBy('topic')
            .transform(toObject, [])
            .value();
    }

    function imageUrl(url) {
        var pixelRatio = window.devicePixelRatio || 1;
        var size = pixelRatio >= 2 ? 48 : 24;
        return url + '?size=' + size + '&d=mm';
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
            icon: iconMapping[key],
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

        return _(prog)
            .map(function(p) {
                if (categoriesFilter.length && categoriesFilter.indexOf(p.key) === -1) {
                    p.value = [];
                    return p;
                }

                p.value = _.filter(p.value, function(submission) {
                    var isActive = true;

                    if (difficultiesFilter.length)
                        isActive = isActive && difficultiesFilter.indexOf(_.capitalize(submission.niva)) >= 0;

                    return isActive;
                });
                return p;
            }).filter(function(category) {
                return category.value.length > 0;
            }).value();
    }

    function renderSuccess(data) {
        program = transformToCategories(data);
        categories = extractCategories(data);
        renderFilter();
        renderProgram();
    }

    function renderFilter() {
        var template = Handlebars.compile(document.querySelector('.program-filter').innerHTML);
        var container = document.querySelector('.javazone-program-filter');
        container.innerHTML = template(categories);
        attachListeners(container);
    }

    function renderProgram() {
        filteredProgram = filterProgram(_.cloneDeep(program));
        var template = Handlebars.compile(document.querySelector('.program-categories-template').innerHTML);
        var container = document.querySelector('.javazone-program');
        container.innerHTML = template({topics: filteredProgram});
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

    function renderError(err) {
        // TODO: actually do something
        console.error(err);
    }

    function day(talk) {
        var d = new Date(talk.starter).getDate();
        return d;
    }

    function parse(res) {
        return JSON.parse(res.text);
    }

	jz.program = getProgram;

})(window._, window.superagent, window.Handlebars, window.$, window.jz = window.jz || {});