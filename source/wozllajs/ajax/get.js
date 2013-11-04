define([
    './param'
], function(param) {

    return function(xhr, url, data, contentType, dataType, async) {
        url += '?' + param.toString(data);
        xhr.open('GET', url, async);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send();
    }
});