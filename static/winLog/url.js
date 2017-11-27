var $ = require('./jqToNative.js');
var urlExt = {
    queryToJson: function(url, shouldDecode) {
        url = (url || window.location.href.replace(window.location.hash, '')) + '';
        shouldDecode = typeof shouldDecode == 'boolean' ? shouldDecode : true;

        var qJson = {},
            qList = url.substr(url.lastIndexOf('?') + 1).split('&');

        function getQueryValue(val){
            var _val = val;
            if (shouldDecode) {
                try {
                    _val = decodeURIComponent(val);
                } catch(ex){}
            }
            return _val;
        }

        for (var i = 0; i < qList.length; ++i) {
            if (qList[i]) {
                var _query = qList[i].split('=');
                if (_query.length > 1) {
                    var _key = _query[0],
                        _val = _query[1];
                    if (qJson[_key] === undefined) {
                        qJson[_key] = getQueryValue(_val);
                    } else {
                        if (!(qJson[_key] instanceof Array)) {
                            qJson[_key] = [qJson[_key]];
                        }
                        qJson[_key].push(getQueryValue(_val));
                    }
                }
            }
        }
        return qJson;
    },
    jsonToQuery: function(json, shouldEncode) {
        shouldEncode = typeof shouldEncode == 'boolean' ? shouldEncode : true;

        function getQuery(key, val){
            var _query;

            switch($.type(val)){
                case 'boolean':
                case 'number':
                case 'string':
                    _query = (key + '=' + (shouldEncode ? encodeURIComponent(val) : val));
                    break;
                case 'regexp':
                    _query = (key + '=' + (shouldEncode ? encodeURIComponent(val.source) : val.source));
                    break;
                case 'date':
                    _query = (key + '=' + val.getTime());
                    break;
                case 'array':
                    _query = [];
                    for (var i = 0; i < val.length; ++i) {
                        if (/^boolean|number|string|regexp|date$/.test($.type(val[i]))) {
                            _query.push(arguments.callee(key, val[i]));
                        }
                    }
                    break;
                default:
                    _query = undefined;
            }
            return _query;
        }

        var queries = [];
        if ($.type(json) == 'object' && $.isPlainObject(json)) {
            $.each(json, function(key, val){
                var query = getQuery(key, val);
                query && (queries = queries.concat(query));
            });
        }
        return queries.join('&');
    }
};

module.exports = urlExt;