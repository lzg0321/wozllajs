this.wozllajs = this.wozllajs || {};

(function() {

    var Ajax = {

        getJSON : function(url, onComplete) {
            Ajax.ajax({
                url : url,
                onComplete: function(data) {
                    onComplete && onComplete(JSON.parse(data));
                }
            });
        },

        get : function(url, onComplete) {
            Ajax.ajax({
                url : url,
                onComplete: onComplete
            });
        },

        JSONP : function(url, onComplete) {
            var callbackId = 'wozllajs_callback_' + Date.now();
            window[callbackId] = onComplete;
            url += '&_=' + Date.now() + '&jsoncallback=' + callbackId;
            // TODO jsonp
        },

        ajax : function(params) {
            var xhr = new XMLHttpRequest();
            xhr.open(params.method || 'GET', params.url, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if(4 === xhr.readyState) {
                    params.onComplete && params.onComplete(xhr.responseText);
                }
            }
        }

    };

    wozllajs.Ajax = Ajax;

})();