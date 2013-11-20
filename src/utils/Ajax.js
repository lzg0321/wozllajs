define(function (require, exports, module) {

    var Promise = require('./Promise');

    var param = {
        toString : function(query) {
            if(!query) {
                return '';
            }
            var i, str = '';
            for(i in query) {
                str += '&' + i + '=' + query[i];
            }
            if(str) {
                str = str.substr(1);
            }
            return str;
        },
        toQuery : function(str) {
            // TODO
        }
    };

    var GET = function(xhr, url, data, contentType, dataType, async) {
        url += '?' + param.toString(data);
        xhr.open('GET', url, async);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send();
    };

    var POST = function() {
        // TODO
    };

    var createXHR = function() {
        return new XMLHttpRequest();
    };

    exports.param = param;

    exports.request = function(settings) {
        var p = new Promise();

        var xhr, now = Date.now();
        var url = settings.url,
            method = settings.method || 'GET',
            data = settings.data,
            dataType = settings.dataType || 'text',
            contentType = settings.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
            async = settings.async;

        var mimeType = 'text/plain';
        var responseField = 'responseText';
        var parseResponse = function(text) {
            return text;
        };

        switch (dataType.toLowerCase()) {
            case 'json' :
                mimeType = 'application/json';
                parseResponse = JSON.parse;
                break;
            case 'script' :
            case 'js' :
                mimeType = 'text/javascript';
                break;
            case 'xml' :
                mimeType = 'text/xml';
                responseField = 'responseXML';
                break;
        }

        async = async === false ? async : true;
        if(data) {
            if(!data.t) {
                data.t = now;
            } else {
                data._ = now;
            }
        }

        xhr = createXHR();
        xhr.overrideMimeType && xhr.overrideMimeType(mimeType);

        try {
            switch(method.toUpperCase()) {
                case 'GET' : GET(xhr, url, data, contentType, dataType, async); break;
                case 'POST' : POST(xhr, url, data, contentType, dataType, async); break;
                default : p.sendError(new Error('Unknow request method: ' + method)); break;
            }
        } catch(e) {
            p.sendError(e);
        }

        xhr.onreadystatechange = function() {
            var status, responseData;
            if(xhr.readyState === 4) {
                try {
                    responseData = parseResponse(xhr[responseField]);
                } catch(e) {
                    p.sendError(e);
                    return;
                }
                p.done(responseData, xhr);
            }
        };

        return p;
    };

    exports.get = function(url, data) {
        return exports.request({
            url : url,
            method : 'GET',
            data : data
        });
    };

    exports.getJSON = function(url, data) {
        return exports.request({
            url : url,
            method : 'GET',
            data : data,
            dataType : 'json'
        });
    };

    exports.post = function(url, data) {
        return exports.request({
            url : url,
            method : 'POST',
            data : data
        });
    };

});