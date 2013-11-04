define([
    './promise',
    './../wozllajs/ajax/param',
    './../wozllajs/ajax/xhr',
    './../wozllajs/ajax/transport',
    './../wozllajs/ajax/get',
    './../wozllajs/ajax/post'
], function(Promise, param, createXHR, ajaxTransport,GET, POST) {

    return {
        ajax : ajaxTransport,
        get : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data
            });
        },
        getJSON : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data,
                dataType : 'json'
            });
        },
        post : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'POST',
                data : data
            });
        }
    };

});