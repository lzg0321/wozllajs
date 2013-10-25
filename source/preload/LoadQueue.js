define([
    'require',
    './../wozllajs',
    './../promise',
    './ImageLoader',
    './StringLoader',
    './JSONLoader'
], function(require, W, Promise, ImageLoader, StringLoader, JSONLoader) {

    var cache = {},
        loadQueue = [],
        loading = false;

    // TODO cancel operation
    var loadingMap = {}, cancelMap = {};

    function createLoader(item) {
        switch(item['type']) {
            case 'jpg':
            case 'png':
                return new ImageLoader(item);
            case 'json' :
                return new JSONLoader(item);
            case 'sprite' :
                // TODO
                return new SpriteLoader(item);
            default:
                return new StringLoader(item);
        }
    }

    function loadNext() {
        if(loading || loadQueue.length === 0) {
            return;
        }
        var loadUnit, promise, loads, item, id, loader;
        var i, len;
        var promises = [];
        loading = true;
        loadUnit = loadQueue.shift();
        promise = loadUnit.promise;
        loads = loadUnit.loads;
        for(i=0,len=loads.length; i<len; i++) {
            item = loads[i];
            id = item.id;
            if(!cache[id]) {
                loader = createLoader(item);
                (function(id, loader, item) {
                    var p = loader.load().then(function(result) {
                        item.result = result;
                        cache[id] = item;
                    }).catchError(function(error) {
                    });
                    promises.push(p);
                })(id, loader, item);
            }
        }
        Promise.wait(promises).then(function() {
            promise.done();
            loading = false;
            loadNext();
        });
    }

    return {
        load : function(items) {
            if(!W.isArray(items)) {
                items = [items];
            }
            var p = new Promise();
            var loads = [];
            var i, len, item, src;
            for(i=0,len=items.length; i<len; i++) {
                item = items[i];
                if(typeof item === 'string') {
                    src = item;
                    item = {
                        id : src,
                        src : src
                    };
                }
                if(!item.type) {
                    item.type = src.substr(src.lastIndexOf('.') + 1);
                }
                loads.push(item);
            }
            loadQueue.push({
                promise : p,
                loads : loads
            });
            loadNext();
            return p;
        },
        get : function(id) {
            return cache[id].result;
        },
        getAsyncImage : function(id) {
            var AsyncImage = require('./AsyncImage');
            var image = cache[id].result;
            if(W.isImage(image)) {
                return new AsyncImage(id);
            }
            return null;
        },
        remove : function(id) {
            var resource = cache[id].result;
            if(resource) {
                if(W.isImage(resource)) {
                    resource.dispose && resource.dispose();
                }
                delete cache[id];
            }
        }
    };

});