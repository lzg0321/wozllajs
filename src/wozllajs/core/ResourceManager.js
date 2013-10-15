this.wozllajs = this.wozllajs || {};

this.wozllajs.ResourceManager = (function() {

    var queue = new createjs.LoadQueue();
    queue.setUseXHR(false);

    var handlerQueue = [];

    var loading = false;

    function loadNext() {
        if(loading) return;
        var handler = handlerQueue.shift();
        handler && handler()
    }

    return {

        getResource : function(id) {
            return queue.getResult(id);
        },

        removeResource : function(id, resource) {
            queue.remove(id);
            if(wozllajs.is(resource, 'Image')) {
                wozllajs.ResourceManager.disposeImage(resource);
            }
        },

        load : function(params) {
            var loadHandler = function() {
                var mark = {};
                var item;
                var i;
                loading = true;
//var start = Date.now();
//console.log('start ' + start);
                for(i= 0; i<params.items.length; i++) {
                    item = params.items[i];
                    if(typeof item === 'object') {
                        item = item.id;
                    }
                    if(mark[item] || wozllajs.ResourceManager.getResource(item)) {
                        params.items.splice(i, 1);
                        i--;
                    }
                    mark[item] = true;
                }

//console.log(params.items.length);
                if(params.items.length === 0) {
                    setTimeout(params.onProgress, 0);
                    setTimeout(params.onComplete, 1);
                    loading = false;
                    loadNext();
//console.log('end ' + (Date.now() - start));
                    return;
                }
                var total = params.items.length;
                var loaded = 0;
                queue.addEventListener('fileload', function(e) {
                    params.onProgress && params.onProgress({
                        total : total,
                        loaded : ++loaded,
                        progress : loaded/total
                    });
                });
                queue.addEventListener('complete', function() {
//console.log('end ' + (Date.now() - start));
                    queue.removeAllEventListeners();
                    params.onComplete && params.onComplete();
                    loading = false;
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