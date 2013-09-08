this.wozllajs = this.wozllajs || {};

this.wozllajs.ResourceManager = (function() {

    var queue = new createjs.LoadQueue();
    queue.setUseXHR(false);

    var handlerQueue = [];

    function loadNext() {
        var handler = handlerQueue.shift();
        handler && handler()
    }

    return {

        getResource : function(id) {
            return queue.getResult(id);
        },

        removeResource : function(id) {
            queue.remove(id);
        },

        load : function(params) {
            var loadHandler = function() {
                if(params.items.length === 0) {
                    setTimeout(params.onProgress, 0);
                    setTimeout(params.onComplete, 1);
                    return;
                }
                var total = params.items.length;
                var loaded = 0;
                queue.addEventListener('fileload', function() {
                    params.onProgress && params.onProgress({
                        total : total,
                        loaded : ++loaded,
                        progress : loaded/total
                    });
                });
                queue.addEventListener('complete', function() {
                    queue.removeAllEventListeners();
                    params.onComplete && params.onComplete();
                    loadNext();
                });
                queue.loadManifest(params.items);
            };
            handlerQueue.push(loadHandler);
            loadNext();
        },

        disposeImage : function(image) {
            image && image.dispose && image.dispose();
        }
    }

})();