(function(jz, _, Handlebars) {

    function getTalk() {
        id = decodeURIComponent(location.search.substr(1).split('=')[1]);
        jz.data.talk(id)
        .then(getFeedback)
        .fail(renderError);
    }

    function getFeedback(submission) {
        var feedbackLink = _.find(submission.links, function(link) {
            return link.rel === 'feedback';
        });
        jz.data.getFeedback(feedbackLink.href)
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
                conference: feedback.conference.paper
            }
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