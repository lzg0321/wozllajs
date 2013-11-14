define([
    'require',
    './../var',
    './../promise',
    './ImageLoader',
    './StringLoader',
    './JSONLoader'
], function(require, W, Promise, ImageLoader, StringLoader, JSONLoader) {

    var baseUrl = '';
    var loaderMap = {
        'jpg' : ImageLoader,
        'png' : ImageLoader,
        'json' : JSONLoader
    };
    var cache = {},
        loadQueue = [],
        loading = false;

    var usingReferenceCounter = {};

    // TODO cancel operation
    var loadingMap = {}, cancelMap = {};

    function createLoader(item) {
        var type = item.type;
        var loaderConstructor = loaderMap[type];
        if(!loaderConstructor) {
            while(!loaderConstructor && type.indexOf('.') !== -1) {
                type = type.substr(type.indexOf('.')+1);
                loaderConstructor = loaderMap[type];
            }
            if(!loaderConstructor) {
                loaderConstructor = StringLoader;
            }
        }

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
                        loadedResult[id] = true;
                        if(typeof result === 'object' && result.hasOwnProperty('resourceId')) {
                            result.resourceId = id;
                        }
                    }).catchError(function(error) {
                        console.log(error);
                    });
                    promises.push(p);
                })(id, loader, item);
            } else {
                loadedResult[id] = true;
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
        load : function(items, base) {
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
                        src : (base || baseUrl) + src
                    };
                } else {
                    item.src = (base || baseUrl) + item.src
                }
                if(!item.type) {
                    item.type = src.substr(src.indexOf('.') + 1);
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
            var cached = cache[id];
            if(!cached) {
                return null;
            }
            usingReferenceCounter[id] = usingReferenceCounter[id] || 0;
            usingReferenceCounter[id] ++;
            return cached.result;
        },
        remove : function(id) {
            var cached = cache[id];
            var resource;
            if(!cached) return;
            resource = cached.result;
            if(usingReferenceCounter[id]) {
                usingReferenceCounter[id] --;
            }
            if(resource) {
                if(!usingReferenceCounter[id] || usingReferenceCounter[id] <= 0) {
                    delete cache[id];
                    if(resource.dispose && typeof resource.dispose === 'function') {
                        resource.dispose();
                    }
                }
            }
        },
        registerLoader : function(fileExtension, loaderConstructor) {
            loaderMap[fileExtension] = loaderConstructor;
        },
        unregisterLoader : function(fileExtension) {
            delete loaderMap[fileExtension];
        },
        setBaseUrl : function(base) {
            baseUrl = base;
        }
    };

});