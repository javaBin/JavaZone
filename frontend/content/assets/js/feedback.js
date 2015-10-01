(function(jz, _, Handlebars) {

    function getLink(submission, linkType) {
        var feedbackLink = _.find(submission.links, function(link) {
            return link.rel === linkType;
        });

        return feedbackLink.href;
    }

    function fixPaper(paper) {
        return {
            red: paper.red.toFixed(1),
            yellow: paper.yellow.toFixed(1),
            green: paper.green.toFixed(1)
        };
    }

    function getTalk() {
        id = decodeURIComponent(location.search.substr(1).split('=')[1]);
        jz.data.talk(id)
        .then(getFeedback)
        .fail(renderError);
    }

    function getFeedback(submission) {
        var feedbackLink = getLink(submission, 'feedback');
        jz.data.getFeedback(feedbackLink)
        .then(_.curry(renderSuccess)(submission))
        .fail(renderError);
    }

    function renderSuccess(submission, feedback) {
        console.log(submission);
        console.log(feedback);

        var data = {
            title: submission.tittel,
            speaker: _.pluck(submission.foredragsholdere, 'navn').join(', '),
            paper: {
                session: feedback.session.paper,
                conference: fixPaper(feedback.conference.paper)
            },
            hasParticipants: (feedback.session.participants > 0 && feedback.session.participants < 1000),
            participants: feedback.session.participants,
            averageParticipants: feedback.conference.participants,
            video: getLink(submission, 'video')
        };
        console.log(data);

        var template = Handlebars.compile(document.querySelector('.feedback-template').innerHTML);
        var container = document.querySelector('.feedback-container');
        container.innerHTML = template(data);
    }

    function renderError() {
        console.log(arguments);
    }

    jz.feedback = getTalk;

})(window.jz = window.jz || {}, window._, window.Handlebars);