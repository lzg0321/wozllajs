define([
    './../promise',
    './xhr',
    './get',
    './post'
], function(Promise, createXHR, GET, POST) {

    return function(settings) {
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
            var status, response;
            if(xhr.readyState === 4) {
                try {
                    response = parseResponse(xhr[responseField]);
                } catch(e) {
                    p.sendError(e);
                    return;
                }
                p.done(response, xhr);
            }
        };

        return p;
    };

});