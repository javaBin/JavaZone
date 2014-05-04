jz.share = {};

jz.share.facebook = function(link, pageTitle) {
    var base  = 'http://www.facebook.com/sharer/sharer.php?';
    var params = ['s=100'];
    jz.share.addParam(params, 'p[title]=', pageTitle);
    jz.share.addParam(params, 'p[url]=', link.href);

    window.open(base + params.join('&'), 'fbsharer', 'toolbar=0,status=0,width=626,height=436');
};

jz.share.twitter = function(link, pageTitle) {
    var base = 'https://twitter.com/intent/tweet?';
    var params = [];
    jz.share.addParam(params, 'text=', pageTitle);
    jz.share.addParam(params, 'url=', link.href);

    window.open(base + params.join('&'), 'twittersharer', 'toolbar=0,status=0,width=550,height=420');
};

jz.share.addParam = function (params, param, value) {
    if (_.isString(value) && !_.isEmpty(value)) {
        params.push(param + encodeURIComponent(value));
    }
};
