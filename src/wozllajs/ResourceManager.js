Class.singleton('wozlla.ResourceManager', function() {

    var queue = new createjs.LoadQueue();

    return {

        getResource : function(id) {
            return queue.getResult(id);
        },

        load : function(params) {
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
            queue.addEventListener('complete', params.onComplete);
            queue.loadManifest(params.items);
        }
    }

});