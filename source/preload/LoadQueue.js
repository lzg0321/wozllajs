define([
    'require',
    './../var',
    './../promise',
    './ImageLoader',
    './StringLoader',
    './JSONLoader'
], function(require, W, Promise, ImageLoader, StringLoader, JSONLoader) {

    var loaderMap = {
        'jpg' : ImageLoader,
        'png' : ImageLoader,
        'json' : JSONLoader
    };
    var cache = {},
        loadQueue = [],
        loading = false;

    // TODO cancel operation
    var loadingMap = {}, cancelMap = {};

    function createLoader(item) {
        var loaderConstructor = loaderMap[item.type] || StringLoader;
        return new loaderConstructor(item);
    }

    function loadNext() {
        if(loading || loadQueue.length === 0) {
            return;
        }
        var loadUnit, promise, loads, item, id, loader, cachedItem;
        var i, len;
        var promises = [];
        var loadedResult = {};
        loading = true;
        loadUnit = loadQueue.shift();
        promise = loadUnit.promise;
        loads = loadUnit.loads;
        for(i=0,len=loads.length; i<len; i++) {
            item = loads[i];
            id = item.id;
            cachedItem = cache[id];
            if(!cachedItem) {
                loader = createLoader(item);
                (function(id, loader, item) {
                    var p = loader.load().then(function(result) {
                        item.result = result;
                        cache[id] = item;
                        loadedResult[id] = result;
                    }).catchError(function(error) {
                        console.log(error);
                    });
                    promises.push(p);
                })(id, loader, item);
            } else {
                loadedResult[id] = cachedItem.result;
            }
        }
        if(promises.length === 0) {
            setTimeout(function() {
                promise.done(loadedResult);
                loading = false;
                loadNext();
            }, 1);
        } else {
            Promise.wait(promises).then(function() {
                promise.done(loadedResult);
                loading = false;
                loadNext();
            });
        }
    }

    return {
        load : function(items) {
            if(!W.isArray(items)) {
                items = [items];
            }
            var p = new Promise();
            var loads = [];
            var repeatTestFlag = {};
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
                if(!repeatTestFlag[item.id]) {
                    loads.push(item);
                    repeatTestFlag[item.id] = true;
                }
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
        remove : function(id) {
            var resource = cache[id].result;
            if(resource) {
                if(W.isImage(resource)) {
                    resource.dispose && resource.dispose();
                }
                delete cache[id];
            }
        },
        registerLoader : function(fileExtension, loaderConstructor) {
            loaderMap[fileExtension] = loaderConstructor;
        },
        unregisterLoader : function(fileExtension) {
            delete loaderMap[fileExtension];
        }
    };

});