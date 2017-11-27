// 需求：一个能在window-client项目上跑起来的前端打点工具
// 背景：原有的打点工具是基于jquery开发的，而在window上，jquery是跑不起来的，所以.....
// 思路：既然原有的打点工具是基于jquery开发的，而window不支持jquery，那么就把原来打点工具的jquery部分用原生js重写即可

/**
* //在Element.prototype上添加一个类似于jquery的data()方法，视情况而定用不用。
* Element.prototype.data = function(key, value){
*    var _this = this;
*    if(typeof key === 'undefined' && typeof value === 'undefined') return false;
*    if(typeof(value) !== 'undefined'){
*        var _type = typeof(value);
*        if(_type === 'string' || _type === 'number'){
*            _this.setAttribute(key, value);
*        }
*        return _this;
*    }
*    else return _this.getAttribute(key);
* };
*/

var urlExt = require('./url.js'),
    browser = require('./browser.js'),
    $ = require('./jqToNative.js');

var body = document.getElementsByTagName('body')[0],
    html = document.getElementsByTagName('html')[0],
    commonData = {};

function sendLog(data) {
    new Image().src = '//notice.zuoyebang.cc/napi/stat/addnoticev1?' + urlExt.jsonToQuery($.extend({
        page: html.getAttribute('page'),
        url: location.origin + location.pathname,
        os: browser.os(),
        browser: browser.kernel(),
        elapse: zybLog_pageStartTime ? (new Date() - zybLog_pageStartTime) : 0,
        screen: (screen.width || 0) + '_' + (screen.height || 0),
        type: 'custom'
    }, commonData, data), true);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PV log.
if (body.hasAttribute('zyb-log-pv')) {
    $.addHandler(document, "DOMContentLoaded", function() {
        sendLog($.extend({
            type: 'pv'
        }, urlExt.queryToJson(body.getAttribute('zyb-log-pv'))));
    })
}
/**
* if (body.is('[zyb-log-pv]')) {
*    $(document).ready(function() {
*        sendLog($.extend({
*            type: 'pv'
*        }, urlExt.queryToJson(body.attr('zyb-log-pv'))));
*    });
* }
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Click log.
$.addHandler(body, 'click', function(event){
    var e = event || window.event;
    var target = e.target;
    if(target.hasAttribute('zyb-log-click')) {
        target.setAttribute('zybLogClickHits', (parseInt(target.getAttribute('zybLogClickHits')) || 0) + 1);
        sendLog($.extend({
            type: 'click',
            offsetX: e.offsetX,
            offsetY: e.offsetY,
            hits: target.getAttribute('zybLogClickHits')
        }, urlExt.queryToJson(target.getAttribute('zyb-log-click'))));
    }
})
/**
* body.on('click', '[zyb-log-click]', function(e) {
*    var host = $(this);
*    host.data('zybLogClickHits', (parseInt(host.data('zybLogClickHits')) || 0) + 1);
*    sendLog($.extend({
*        type: 'click',
*        offsetX: e.offsetX,
*        offsetY: e.offsetY,
*        hits: host.data('zybLogClickHits')
*    }, urlExt.queryToJson(host.data('zyb-log-click'))));
* });
*/

module.exports = {
    send: function(data) {
        data && $.isPlainObject(data) && !$.isEmptyObject(data) && sendLog(data);
    },
    setCommonData: function(data, shouldOverride) {
        shouldOverride = $.type(shouldOverride) == 'boolean' ? shouldOverride : false;
        data && $.isPlainObject(data) && !$.isEmptyObject(data) && (commonData = $.extend(shouldOverride ? {} : commonData, data));
    }
};