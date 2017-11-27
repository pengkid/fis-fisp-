var ua = navigator.userAgent;

var browser = {
    chrome: function (){
        return /\b(?:Chrome|CriOS)\/(\d+)/i.test(ua) ? +RegExp.$1 : undefined;
    },
    firefox: function (){
        return /\bFirefox\/(\d+)/i.test(ua) ? +RegExp.$1 : undefined;
    },
    ie: function (){
        return /\b(?:MSIE |rv:|Edge\/)(\d+)/i.test(ua) && !this.firefox() ? (document.documentMode || +RegExp.$1) : undefined;    // Firefox 某些版本的 ua 中含有和 IE 11 一样的 'rv:' 字段。
    },
    edge: function() {
        return /\bEdge\/(\d+)/i.test(ua) ? (document.documentMode || +RegExp.$1) : undefined;
    },
    safari: function (){
        return /\bSafari\/?(\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp.$1 || RegExp.$2) : undefined;
    },
    isStandard: function (){
        return document.compatMode == "CSS1Compat";
    },
    isGecko: function (){
        return /gecko/i.test(ua) && !/like gecko/i.test(ua);
    },
    isWebkit: function (){
        return /webkit/i.test(ua);
    },
    os: function() {
        var os = 'other';
        if (/\bMac/i.test(ua)) {
            if (/iPhone/i.test(ua)) {
                os = 'iphone os_' + (/iPhone OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown');
            } else if (/iPad/i.test(ua)) {
                os = 'ipad os_' + (/iPad.*OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown');
            } else {
                os = 'mac osx_' + (/Mac OS X (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown');
            }
        } else if (/Android/i.test(ua)) {
            os = 'android_' + (/Android (\d+(?:\.\d+)?)/i.test(ua) ? RegExp.$1 : 'unknown');
        } else if (/\bWindows/i.test(ua)) {
            os = 'windows ' + (/Windows NT (\d+)/i.test(ua) ? RegExp.$1 : 'unknown') + '_' + (/win64|x64|wow64/i.test(ua) ? '64' : '32') + 'bit';
        }
        return os;
    },
    kernel: function() {
        var browser = 'other';
        if (this.edge()) {
            browser = 'edge_' + this.edge();
        } else if (this.ie()) {
            browser = 'ie_' + this.ie();
        } else if (this.chrome()) {
            browser = 'chrome_' + this.chrome();
        } else if (this.safari()) {
            browser = 'safari_' + this.safari();
        } else if (this.firefox()) {
            browser = 'firefox_' + this.firefox();
        }
        return browser;
    }
};

module.exports = browser;