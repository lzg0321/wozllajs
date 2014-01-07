/**
 *
 * loader.load('a.json', 'b.tt.json');
 *
 */

define(function (require, exports, module) {

    var Strings = require('../utils/Strings');
    var Arrays = require('../utils/Arrays');
    var Objects = require('../utils/Objects');
    var Promise = require('../utils/Promise');
    var Ajax = require('../utils/Ajax');
    var AsyncImage = require('./AsyncImage');
    var Texture = require('./Texture');

    var loadingAssetsMap = {};
	var assetsMap = {};
    var assetsUsingCounter = {};
    var loaderMap = {};

    var loadQueue = [];
    var loading = false;


	var idleCallback;

    function loadImage(src, callback) {
        var img = new Image();
        img.src = src;
        img.onload = function() {
            callback(null, img);
        };
        img.onerror = function() {
            callback('Fail to load image "' + src + '"');
        };
    }

    loaderMap['.png'] =
    loaderMap['.jpg'] =
    loaderMap['image'] = function(item, callback) {
        loadImage(item.src, function(err, image) {
            if(err) {
                callback(err);
            } else {
                callback(null, new AsyncImage(item.id, image));
            }
        });
    };
    loaderMap['texture'] = function(item, callback) {
		var imgSrc = item.src.replace('.tt.json', '.tt.png');
        loadImage(imgSrc, function(err, image) {
            if(err) {
                callback(err);
            } else {
				Ajax.getJSON(item.src).then(function(data) {
					callback(null, new Texture(item.id, image, data.frames));
				}).catchError(function(err) {
						// try twice when fail
					Ajax.getJSON(item.src).then(function(data) {
						callback(null, new Texture(item.id, image, data.frames));
					}).catchError(function(err) {
						callback(err);
					});
				});

            }
        });
    };
    loaderMap['json'] =
    loaderMap['.json'] = function(item, callback) {
        Ajax.getJSON(item.src).then(function(data) {
            callback(null, data);
        }).catchError(function(err) {
            callback(err);
        });
    };


    function matchLoader(item) {
        var loader, src;
        if(item.type) {
            return loaderMap[item.type];
        }
        Objects.each(loaderMap, function(k, v) {
			src = item.src.substr(0, item.src.indexOf('?'));
            if(Strings.endWith(src, k)) {
                loader = v;
                return false;
            }
        });
        return loader;
    }

    function loadNext() {
        var i, len,
            item,
            itemId,
            items,
            promise,
            loadUnit,
            loadedCount,
            loadResult;

        if(loading || loadQueue.length === 0) {
			idleCallback && idleCallback();
			return;
		}
		loading = true;
        loadUnit = loadQueue.shift();
        promise = loadUnit.promise;
        items = loadUnit.items;
        loadResult = {};
        loadedCount = 0;
        for(i=0,len=items.length; i<len; i++) {
            item = items[i];
			if(!item) continue;
            itemId = item.id;
            if(assetsMap[itemId]) {
				delete loadingAssetsMap[item.id];
                loadResult[itemId] = true;
                loadedCount++;
				if(loadedCount === items.length) {
					promise.done(loadResult);
					loading = false;
					loadNext();
				}
            } else {
                (function(item) {
					if(!item.loader) {
						console.log('[Warn]: loader not found');
						item.error = 'loader not found';
						item.result = null;
						loadedCount++;
						if (loadedCount === items.length) {
							promise.done(loadResult);
							loading = false;
							loadNext();
						}
						return;
					}
					item.loader(item, function(err, result) {
						item.error = err;
						item.result = result;
						delete loadingAssetsMap[item.id];
						if(!err) {
							assetsMap[item.id] = item;
							loadResult[item.id] = true;
						}
						loadedCount++;
						if (loadedCount === items.length) {
							promise.done(loadResult);
							loading = false;
							loadNext();
						}
					});
                })(item);
            }
        }
    }

    exports.baseURL = '';

	exports.printLoadingAssets = function() {
		console.log(loadingAssetsMap);
	};

	exports.printUsingCounter = function() {
		console.log(assetsUsingCounter);
	};

	exports.printAssets = function() {
		console.log(assetsMap);
	};

	exports.setIdleCallback = function(callback) {
		idleCallback = callback;
	};

    exports.load = function(items, base) {
        var i, len,
            promise,
            item,
            loadItems;

        if(!Arrays.is(items)) {
            items = [items];
        }

		items = [].concat(items);

        for(i=0,len=items.length; i<len; i++) {
            item = items[i];
            if(Strings.is(item)) {
                item = {
                    id : item,
                    src : item
                };
            }
			if(!item.id) {
				item.id = item.src;
			}
            item.src = exports.baseURL + item.src + '?t=' + Date.now();
            item.loader = matchLoader(item);
            items[i] = item;
			loadingAssetsMap[item.id] = true;
        }

        promise = new Promise();

        loadQueue.push({
            items : items,
            promise : promise
        });
        loadNext();
        return promise;
    };

    exports.getItem = function(id) {
        return assetsMap[id];
    };

    exports.get = function(id) {
        var item = exports.getItem(id);
        if(!item) return null;
        assetsUsingCounter[id] = assetsUsingCounter[id] || 0;
        assetsUsingCounter[id] ++;
        return item.result;
    };

    exports.remove = function(id) {
        var item, asset;
        if(assetsUsingCounter[id])
            assetsUsingCounter[id] --;

		item = assetsMap[id];
        if(assetsUsingCounter[id] === 0) {
            delete assetsMap[id];
			asset = item.result;
			if(loadingAssetsMap[id]) {

				return;
			}
            if(asset && asset.dispose && typeof asset.dispose === 'function') {
                asset.dispose();
            }
        }
    };

	exports.computeImageMemory = function() {
		var id, item, img;
		var size = 0;

		var get2Pow = function(width) {
			var base = 2;
			while(width > base) {
				base *= 2;
			}
			return base;
		};

		for(id in assetsMap) {
			item = assetsMap[id];
			if(item && item.result instanceof AsyncImage) {
				img = item.result.image;
				size += get2Pow(img.width) * get2Pow(img.height);
			}
		}
		return size*4/1024/1024;
	};

});