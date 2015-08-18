(function(jz, _, Handlebars) {

    var transformTalk = _.compose(_.compose(room, speaker, transformStarter));

    function day(talk) {
        if (!talk.starter)
            return "-1";

        var d = new Date(talk.starter).getDate();
        return d;
    }

    function room(submission) {
        submission.roomNumber = _.last(submission.rom.split(' '));
        return submission;
    }

    function speaker(submission) {
        submission.foredragsholdere = _.pluck(submission.foredragsholdere, 'navn').join(', ');
        return submission;
    }

    function transformStarter(talk) {
        talk.starter = new Date(talk.starter).getTime();
        return talk;
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

    function slutter(date) {
        var timestamp = new Date(date).getTime();
        return format(timestamp);
    }

    function createSlots(memo, current) {
        var timestamp = current.starter;
        if (current.format === 'presentation') {
            var slot = _.find(memo, {timestamp:timestamp});
            if (slot)
                slot.talks.push(current);
            else
                memo.push({timestamp: timestamp, talks: [current], slot: format(timestamp), ends: slutter(current.stopper)});
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

    function render(program) {
        program = transformToDays(program);
        console.log(program);
        var template = Handlebars.compile(document.querySelector('.program-template').innerHTML);
        document.querySelector('.print-program').innerHTML = template(program);
    }

    jz.printprogram = function() {
        jz.data.program().then(render);
    }

})(window.jz = window.jz || {}, window._, window.Handlebars);