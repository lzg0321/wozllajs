this.wozllajs = this.wozllajs || {};

(function() {

    var Ajax = {

        getJSON : function(url, onComplete) {
            Ajax.ajax({
                url : url,
                onComplete: function(data) {
                    if(data) {
                        onComplete && onComplete(JSON.parse(data));
                    } else {
                        onComplete && onComplete({
                            fail : true,
                            status : -1
                        });
                    }
                },
                onFail : function(code) {
                    onComplete && onComplete({
                        fail : true,
                        status : code
                    });
                }
            });
        },

        get : function(url, onComplete) {
            Ajax.ajax({
                url : url,
                onComplete: onComplete
            });
        },

        ajax : function(params) {
            var xhr = new XMLHttpRequest();
            xhr.open(params.method || 'GET', params.url, true);
            try {
                xhr.send();
            } catch(e) {
                setTimeout(function() {
                    params.onFail && params.onFail(-1);
                }, 1);
            }
            xhr.onreadystatechange = function() {
                if(4 === xhr.readyState) {
                    if(xhr.status === 0 || xhr.status === 200) {
                        params.onComplete && params.onComplete(xhr.responseText);
                    } else {
                        params.onFail && params.onFail(xhr.status);
                    }
                }
            }
        }

    };

    wozllajs.Ajax = Ajax;

})();