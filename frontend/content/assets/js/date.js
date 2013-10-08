jz.date.parse = function(date) {
    var    m = /(\d\d\d\d)-(\d\d)-(\d\d).(\d\d):(\d\d):(\d\d)/.exec(date);
    if(!m) m = /(\d\d\d\d)-(\d\d)-(\d\d)/.exec(date);
    if(!m) return "";
    var hourWithTimeZoneFixed = "" + (parseInt(m[4], 10) + 2);
    return { year: m[1], month: m[2], day: m[3], hour: hourWithTimeZoneFixed, min: m[5], sec: m[6] };
};

jz.date.date = function(date) {
    var m = jz.date.parse(date);
    return !m ? "" : m.day + "." + m.month + " " + m.year + " " + m.hour + "." + m.min;
};

jz.date.time = function(date) {
    var m = jz.date.parse(date);
    var h = m.hour.length === 1 ? "0" + m.hour : m.hour;
    return !m ? "" : h + ":" + m.min;
};

jz.date.weekday = function(date) {
    var d  = (new Date(date));
    var ds = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return ds[d.getDay()];
};

jz.date.day = function(date) {
    var d  = (new Date(date));
    var ms = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var month = ms[d.getMonth()];
    return d.getDate() + ' ' + month + ' ' + d.getFullYear();
};

jz.date.duration = function(start, stop) {
    var startDate = Date.parse(start);
    var stopDate = Date.parse(stop);
    return stopDate - startDate;
};
