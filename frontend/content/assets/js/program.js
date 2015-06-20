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

    var program = {};
    var categories = {};
    var active = [];

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
        request('http://test.javazone.no/javazone-web-api/event/javazone_2015/sessions')
        .end(render);
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
            .map(_.compose(transformNokkelord, extract('topic', hasTopic), extract('type', hasType)))
            .groupBy('topic')
            .transform(toObject, [])
            .value();
    }

    function extractCategories(program) {
        var categories = _(_(program)
            .map(_.compose(transformNokkelord, extract('topic', hasTopic), extract('type', hasType)))
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

    function toObject(result, value, key) {
        result.push({
            key: key,
            icon: iconMapping[key],
            value: value
        });
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
        if (active.length === 0)
            return prog;

        return _(prog)
            .map(function(p) {
                p.value = _.filter(p.value, function(submission) {
                    var isActive = _.intersection(active, _.pluck(submission.nokkelord, 'l'));
                    return isActive.length > 0;
                });
                return p;
            }).filter(function(category) {
                return category.value.length > 0;
            }).value();
    }

    function render(err, res) {
        if (err) {
            renderError(err);
            return;
        }

        program = transformToCategories(parse(res));
        categories = extractCategories(parse(res));
        var categoriesContainer = renderProgram();
        attachListeners(categoriesContainer);
    }

    function renderProgram() {
        filteredProgram = filterProgram(_.cloneDeep(program));
        var categoriesTemplate = Handlebars.compile(document.querySelector('.program-filter').innerHTML);
        var template = Handlebars.compile(document.querySelector('.program-categories-template').innerHTML);
        var categoriesContainer = document.querySelector('.javazone-program-filter');
        var container = document.querySelector('.javazone-program');
        categoriesContainer.innerHTML = categoriesTemplate(categories);
        container.innerHTML = template({topics: filteredProgram});

        return categoriesContainer;
    }

    function attachListeners(container) {
        $(container).on('click li', function(ev) {
            var el = $(ev.target);
            if (!el.is('li'))
                return;

            el.toggleClass('active');
            var category = el.text();
            if (_.includes(active, category)) {
                active = _.reject(active, _.matches(category));
            } else {
                active.push(category);
            }

            renderProgram();
        });
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