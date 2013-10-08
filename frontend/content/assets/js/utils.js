jz.utils.shuffle = function(array) {
    var i = array.length, j, tempi, tempj;
    if(i === 0) return false;
    while(--i) {
        j = Math.floor( Math.random() * ( i + 1 ) );
        tempi = array[i];
        tempj = array[j];
        array[i] = tempj;
        array[j] = tempi;
    }
    return array;
};

jz.utils.notify = function(text, displayMs) {
    clearTimeout(jz.utils.notify.timer);
    $(".notification").hide().text(text).fadeIn(200);
    jz.utils.notify.timer = setTimeout(function() { $(".notification").fadeOut(200); }, displayMs || 2000);
};

jz.utils.addSupportClasses = function() {
    var mobile   = jz.utils.agent("Android", "webOS", "iPhone", "iPod", "BlackBerry", "IEMobile");
    var handheld = jz.utils.agent("iPad", "Tablet") || mobile;
    if(mobile)   $("html").addClass("support-mobile");
    if(handheld) $("html").addClass("support-handheld");
    $("html").addClass("loaded");
};

jz.utils.agent = function() {
    return _.any(_.toArray(arguments), function(s) {
        return !!navigator.userAgent.match(s);
    });
};

jz.utils.urlify = function(string) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return string.replace(exp, "<a href='$1'>$1</a>");
};

jz.utils.param = function(name) {
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.href);
    if (!results) return false;
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
};

jz.utils.join = function(array) {
    return _.reduce(array, function(acc, next) { return (acc && acc + ", ") + next; }, "");
};

jz.utils.slug = function(str) {
    return 'slug-' + str.replace(/[ ]+/g, "-").toLowerCase();
};

jz.utils.title = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

jz.utils.paragraphs = function(str) {
    return "<p>" + str.replace(/[\r\n]+(?=[^\r\n])/g, '</p><p>') + "</p>";
};

jz.utils.randomColor = function() {
    var colors = [
        {
            f: "#ffffff",
            b: "#a10735"
        },
        {
            f: "#ffffff",
            b: "#fc4f4c"
        },
        {
            f: "#000000",
            b: "#f7813f"
        },
        {
            f: "#000000",
            b: "#f3a928"
        },
        {
            f: "#000000",
            b: "#f3a928"
        },
        {
            f: "#ffffff",
            b: "#266761"
        },
        {
            f: "#ffffff",
            b: "#1a0000"
        },
    ];
    return colors[_.random(colors.length-1)];
};
