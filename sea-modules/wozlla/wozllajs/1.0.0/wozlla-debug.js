define("wozlla/wozllajs/1.0.0/wozlla-debug", [ "./assets/AsyncImage-debug", "./utils/Arrays-debug", "./assets/Texture-debug", "./utils/Objects-debug", "./assets/loader-debug", "./utils/Strings-debug", "./utils/Promise-debug", "./utils/Ajax-debug", "./assets/objLoader-debug", "./core/Component-debug", "./utils/uniqueKey-debug", "./core/GameObject-debug", "./core/CachableGameObject-debug", "./core/UnityGameObject-debug", "./math/Rectangle-debug", "./math/Matrix2D-debug", "./core/AbstractGameObject-debug", "./events/EventTarget-debug", "./events/Event-debug", "./core/events/GameObjectEvent-debug", "./core/Transform-debug", "./core/Behaviour-debug", "./core/Animation-debug", "./core/Time-debug", "./core/Renderer-debug", "./core/Layout-debug", "./core/HitDelegate-debug", "./core/Mask-debug", "./utils/createCanvas-debug", "./core/Filter-debug", "./core/events/TouchEvent-debug", "./core/Collider-debug", "./core/Engine-debug", "./utils/Tuple-debug", "./core/Stage-debug", "./core/Touch-debug" ], function(require) {
    return {
        assets: {
            AsyncImage: require("./assets/AsyncImage-debug"),
            Texture: require("./assets/Texture-debug"),
            loader: require("./assets/loader-debug"),
            objLoader: require("./assets/objLoader-debug")
        },
        core: {
            events: {
                GameObjectEvent: require("./core/events/GameObjectEvent-debug"),
                TouchEvent: require("./core/events/TouchEvent-debug")
            },
            AbstractGameObject: require("./core/AbstractGameObject-debug"),
            Animation: require("./core/Animation-debug"),
            Behaviour: require("./core/Behaviour-debug"),
            CachableGameObject: require("./core/CachableGameObject-debug"),
            Collider: require("./core/Collider-debug"),
            Component: require("./core/Component-debug"),
            Engine: require("./core/Engine-debug"),
            Filter: require("./core/Filter-debug"),
            GameObject: require("./core/GameObject-debug"),
            HitDelegate: require("./core/HitDelegate-debug"),
            Layout: require("./core/Layout-debug"),
            Mask: require("./core/Mask-debug"),
            Renderer: require("./core/Renderer-debug"),
            Stage: require("./core/Stage-debug"),
            Time: require("./core/Time-debug"),
            Touch: require("./core/Touch-debug"),
            Transform: require("./core/Transform-debug"),
            UnityGameObject: require("./core/UnityGameObject-debug")
        },
        events: {
            Event: require("./events/Event-debug"),
            EventTarget: require("./events/EventTarget-debug")
        },
        math: {
            Matrix2D: require("./math/Matrix2D-debug"),
            Rectangle: require("./math/Rectangle-debug")
        },
        utils: {
            Ajax: require("./utils/Ajax-debug"),
            Arrays: require("./utils/Arrays-debug"),
            createCanvas: require("./utils/createCanvas-debug"),
            Objects: require("./utils/Objects-debug"),
            Promise: require("./utils/Promise-debug"),
            Strings: require("./utils/Strings-debug"),
            Tuple: require("./utils/Tuple-debug"),
            uniqueKey: require("./utils/uniqueKey-debug")
        }
    };
});

define("wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", [ "wozlla/wozllajs/1.0.0/utils/Arrays-debug" ], function(require, exports, module) {
    var Arrays = require("wozlla/wozllajs/1.0.0/utils/Arrays-debug");
    var AsyncImage = function(resourceId, image) {
        this.resourceId = resourceId;
        this.image = image;
        this.src = image && image.src;
    };
    var p = AsyncImage.prototype;
    p.draw = function(context) {
        // TODO optimize performance for slice and unshift
        var args = Arrays.slice(arguments, 1);
        var image = this.image;
        if (image) {
            args.unshift(image);
            context.drawImage.apply(context, args);
        }
    };
    p.drawAs9Grid = function(context, region, grid, width, height) {
        if (!region || !grid || !width || !height) return;
        var rx = region.x;
        var ry = region.y;
        var ow = region.w;
        var oh = region.h;
        var gl = grid.left;
        var gr = grid.right;
        var gt = grid.top;
        var gb = grid.bottom;
        var ctx = context;
        // top left
        this.draw(context, rx, ry, gl, gt, 0, 0, gl, gt);
        // top
        this.draw(context, rx + gl, ry + 0, ow - gl - gr, gt, gl, 0, width - gl - gr, gt);
        // top right
        this.draw(context, rx + ow - gr, ry + 0, gr, gt, width - gr, 0, gr, gt);
        // left
        this.draw(context, rx + 0, ry + gt, gl, oh - gt - gb, 0, gt, gl, height - gt - gb);
        // left bottom
        this.draw(context, rx + 0, ry + oh - gb, gl, gb, 0, height - gb, gl, gb);
        // bottom
        this.draw(context, rx + gl, ry + oh - gb, ow - gl - gr, gb, gl, height - gb, width - gl - gr, gb);
        // right bottom
        this.draw(context, rx + ow - gr, ry + oh - gb, gr, gb, width - gr, height - gb, gr, gb);
        // right
        this.draw(context, rx + ow - gr, ry + gt, gr, oh - gt - gb, width - gr, gt, gr, height - gt - gb);
        // center
        this.draw(context, rx + gl, ry + gt, ow - gl - gr, oh - gt - gb, gl, gt, width - gl - gr, height - gt - gb);
    };
    p.dispose = function() {
        this.image && this.image.dispose && this.image.dispose();
        this.image = null;
    };
    module.exports = AsyncImage;
});

define("wozlla/wozllajs/1.0.0/utils/Arrays-debug", [], function(require, exports, module) {
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    exports.is = function(test) {
        return toString.call(test) === "[object Array]";
    };
    exports.isArray = function(test) {
        return exports.is(test);
    };
    exports.slice = function(args) {
        return slice.apply(args, slice.apply(arguments, [ 1 ]));
    };
});

define("wozlla/wozllajs/1.0.0/assets/Texture-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug" ], function(require, exports, module) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var AsyncImage = require("wozlla/wozllajs/1.0.0/assets/AsyncImage-debug");
    var Texture = function(resourceId, image, frames) {
        AsyncImage.apply(this, arguments);
        this.frames = frames;
    };
    var p = Objects.inherits(Texture, AsyncImage);
    p.getFrame = function(name) {
        var frameData = this.frames[name];
        if (frameData) {
            return frameData.frame;
        }
        return null;
    };
    p.getSpriteSourceSize = function(name) {
        var frameData = this.frames[name];
        if (frameData) {
            return frameData.spriteSourceSize;
        }
        return null;
    };
    p.drawFrame = function(context, name, x, y, w, h) {
        var f = this.getFrame(name);
        if (f) {
            this.draw(context, f.x, f.y, f.w, f.h, x || 0, y || 0, w || f.w, h || f.h);
        }
    };
    p.drawFrameAs9Grid = function(context, name, grid, width, height) {
        var f = this.getFrame(name);
        if (f) {
            this.drawAs9Grid(context, f, grid, width, height);
        }
    };
    module.exports = Texture;
});

define("wozlla/wozllajs/1.0.0/utils/Objects-debug", [], function(require, exports, module) {
    exports.each = function(target, iterator) {
        for (var p in target) {
            if (false === iterator(p, target[p])) return;
        }
    };
    exports.inherits = function(construct, superConstruct) {
        construct._super = superConstruct;
        return construct.prototype = Object.create(superConstruct.prototype, {
            constructor: {
                value: construct,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };
    exports.getSuperConstructor = function(construct) {
        if (typeof construct === "function") {
            return construct._super;
        }
        return null;
    };
});

/**
 *
 * loader.load('a.json', 'b.tt.json');
 *
 */
define("wozlla/wozllajs/1.0.0/assets/loader-debug", [ "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug" ], function(require, exports, module) {
    var Strings = require("wozlla/wozllajs/1.0.0/utils/Strings-debug");
    var Arrays = require("wozlla/wozllajs/1.0.0/utils/Arrays-debug");
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Promise = require("wozlla/wozllajs/1.0.0/utils/Promise-debug");
    var Ajax = require("wozlla/wozllajs/1.0.0/utils/Ajax-debug");
    var AsyncImage = require("wozlla/wozllajs/1.0.0/assets/AsyncImage-debug");
    var Texture = require("wozlla/wozllajs/1.0.0/assets/Texture-debug");
    var assetsMap = {};
    var assetsUsingCounter = {};
    var loaderMap = {};
    var loadQueue = [];
    var loading = false;
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
    loaderMap[".png"] = loaderMap[".jpg"] = loaderMap["image"] = function(item, callback) {
        loadImage(item.src, function(err, image) {
            if (err) {
                callback(err);
            } else {
                callback(null, new AsyncImage(item.id, image));
            }
        });
    };
    loaderMap["texture"] = function(item, callback) {
        var imgSrc = item.src.replace(".tt.json", ".tt.png");
        loadImage(imgSrc, function(err, image) {
            if (err) {
                callback(err);
            } else {
                Ajax.getJSON(item.src).then(function(data) {
                    callback(null, new Texture(item.id, image, data.frames));
                }).catchError(function(err) {
                    callback(err);
                });
            }
        });
    };
    loaderMap["json"] = loaderMap[".json"] = function(item, callback) {
        Ajax.getJSON(item.src).then(function(data) {
            callback(null, data);
        }).catchError(function(err) {
            callback(err);
        });
    };
    function matchLoader(item) {
        var loader;
        if (item.type) {
            return loaderMap[item.type];
        }
        Objects.each(loaderMap, function(k, v) {
            if (Strings.endWith(item.src, k)) {
                loader = v;
                return false;
            }
        });
        return loader;
    }
    function loadNext() {
        var i, len, item, itemId, items, promise, loadUnit, loadedCount, loadResult;
        if (loading || loadQueue.length === 0) return;
        loading = true;
        loadUnit = loadQueue.shift();
        promise = loadUnit.promise;
        items = loadUnit.items;
        loadResult = {};
        loadedCount = 0;
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (!item) continue;
            itemId = item.id;
            if (assetsMap[itemId]) {
                loadResult[itemId] = true;
                loadedCount++;
                if (loadedCount === items.length) {
                    promise.done(loadResult);
                    loading = false;
                    loadNext();
                }
            } else {
                (function(item) {
                    item.loader(item, function(err, result) {
                        item.error = err;
                        item.result = result;
                        assetsMap[item.id] = item;
                        loadResult[item.id] = true;
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
    exports.baseURL = "";
    exports.printAssets = function() {
        console.log(assetsMap);
    };
    exports.load = function(items, base) {
        var i, len, promise, item, loadItems;
        if (!Arrays.is(items)) {
            items = [ items ];
        }
        for (i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (Strings.is(item)) {
                item = {
                    id: item,
                    src: item
                };
            }
            if (!item.id) {
                item.id = item.src;
            }
            item.src = exports.baseURL + item.src;
            item.loader = matchLoader(item);
            items[i] = item;
        }
        promise = new Promise();
        loadQueue.push({
            items: items,
            promise: promise
        });
        loadNext();
        return promise;
    };
    exports.getItem = function(id) {
        return assetsMap[id];
    };
    exports.get = function(id) {
        var item = exports.getItem(id);
        if (!item) return null;
        assetsUsingCounter[id] = assetsUsingCounter[id] || 0;
        assetsUsingCounter[id]++;
        return item.result;
    };
    exports.remove = function(id) {
        var asset;
        if (assetsUsingCounter[id]) assetsUsingCounter[id]--;
        asset = assetsMap[id];
        if (assetsUsingCounter[id] === 0) {
            delete assetsMap[id];
            if (asset && asset.dispose && typeof asset.dispose === "function") {
                asset.dispose();
            }
        }
    };
});

define("wozlla/wozllajs/1.0.0/utils/Strings-debug", [], function(require, exports, module) {
    exports.endWith = function(test, suffix) {
        if (!exports.is(test)) {
            return false;
        }
        return test.lastIndexOf(suffix) === test.length - suffix.length;
    };
    exports.startWith = function(test, prefix) {
        if (!exports.is(test)) {
            return false;
        }
        return test.indexOf(prefix) === 0;
    };
    exports.is = function(test) {
        return typeof test === "string";
    };
});

define("wozlla/wozllajs/1.0.0/utils/Promise-debug", [ "wozlla/wozllajs/1.0.0/utils/Arrays-debug" ], function(require, exports, module) {
    var Arrays = require("wozlla/wozllajs/1.0.0/utils/Arrays-debug");
    var Promise = function() {
        this._thenQueue = [];
        this._errorQueue = [];
    };
    Promise.wait = function(promises) {
        var i, len;
        var p = new Promise();
        var doneNum = 0;
        var result = [];
        if (arguments.length === 1) {
            if (!Arrays.is(promises)) {
                promises = [ promises ];
            }
        } else {
            promises = Arrays.slice(arguments);
        }
        for (i = 0, len = promises.length; i < len; i++) {
            (function(idx, promiseLen) {
                promises[idx].then(function(r) {
                    doneNum++;
                    r = arguments.length > 1 ? Arrays.slice(arguments) : r;
                    result[idx] = r;
                    if (doneNum === promiseLen) {
                        p.done.apply(p, result);
                    }
                    return r;
                }).catchError(function(e) {
                    p.sendError(e);
                });
            })(i, len);
        }
        return p;
    };
    Promise.run = function(func) {
        var p;
        try {
            p = func(function() {
                var args = arguments;
                setTimeout(function() {
                    p.done.apply(p, args);
                }, 1);
            }, function(e) {
                p.sendError(e);
            });
            if (!p || !(p instanceof Promise)) {
                p = new Promise();
            }
        } catch (e) {
            if (!p || !(p instanceof Promise)) {
                p = new Promise();
            }
            setTimeout(function() {
                p.sendError(e);
            }, 1);
        }
        return p;
    };
    var p = Promise.prototype;
    p.then = function(callback, context) {
        this._thenQueue.push({
            callback: callback,
            context: context
        });
        return this;
    };
    p.catchError = function(callback, context) {
        this._errorQueue.push({
            callback: callback,
            context: context
        });
        return this;
    };
    p.done = function() {
        var me = this;
        var args = arguments;
        setTimeout(function() {
            me._nextThen.apply(me, args);
        }, 1);
        return this;
    };
    p.sendError = function(error) {
        var me = this;
        setTimeout(function() {
            me._nextError(error);
        }, 1);
        return this;
    };
    p._nextThen = function() {
        var then = this._thenQueue.shift();
        if (then) {
            var args = then.callback.apply(then.context || this, arguments);
            args = Arrays.isArray(args) ? args : [ args ];
            this._nextThen.apply(this, args);
        }
    };
    p._nextError = function() {
        var error = this._errorQueue.shift();
        if (error) {
            var args = error.callback.apply(error.context || this, arguments);
            args = Arrays.isArray(args) ? args : [ args ];
            this._nextError.apply(this, args);
        }
    };
    module.exports = Promise;
});

define("wozlla/wozllajs/1.0.0/utils/Ajax-debug", [ "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug" ], function(require, exports, module) {
    var Promise = require("wozlla/wozllajs/1.0.0/utils/Promise-debug");
    var param = {
        toString: function(query) {
            if (!query) {
                return "";
            }
            var i, str = "";
            for (i in query) {
                str += "&" + i + "=" + query[i];
            }
            if (str) {
                str = str.substr(1);
            }
            return str;
        },
        toQuery: function(str) {}
    };
    var GET = function(xhr, url, data, contentType, dataType, async) {
        url += "?" + param.toString(data);
        xhr.open("GET", url, async);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.send();
    };
    var POST = function() {};
    var createXHR = function() {
        return new XMLHttpRequest();
    };
    exports.param = param;
    exports.request = function(settings) {
        var p = new Promise();
        var xhr, now = Date.now();
        var url = settings.url, method = settings.method || "GET", data = settings.data, dataType = settings.dataType || "text", contentType = settings.contentType || "application/x-www-form-urlencoded; charset=UTF-8", async = settings.async;
        var mimeType = "text/plain";
        var responseField = "responseText";
        var parseResponse = function(text) {
            return text;
        };
        switch (dataType.toLowerCase()) {
          case "json":
            mimeType = "application/json";
            parseResponse = JSON.parse;
            break;

          case "script":
          case "js":
            mimeType = "text/javascript";
            break;

          case "xml":
            mimeType = "text/xml";
            responseField = "responseXML";
            break;
        }
        async = async === false ? async : true;
        if (data) {
            if (!data.t) {
                data.t = now;
            } else {
                data._ = now;
            }
        }
        xhr = createXHR();
        xhr.overrideMimeType && xhr.overrideMimeType(mimeType);
        try {
            switch (method.toUpperCase()) {
              case "GET":
                GET(xhr, url, data, contentType, dataType, async);
                break;

              case "POST":
                POST(xhr, url, data, contentType, dataType, async);
                break;

              default:
                p.sendError(new Error("Unknow request method: " + method));
                break;
            }
        } catch (e) {
            p.sendError(e);
        }
        xhr.onreadystatechange = function() {
            var status, responseData;
            if (xhr.readyState === 4) {
                try {
                    responseData = parseResponse(xhr[responseField]);
                } catch (e) {
                    p.sendError(e);
                    return;
                }
                p.done(responseData, xhr);
            }
        };
        return p;
    };
    exports.get = function(url, data) {
        return exports.request({
            url: url,
            method: "GET",
            data: data
        });
    };
    exports.getJSON = function(url, data) {
        return exports.request({
            url: url,
            method: "GET",
            data: data,
            dataType: "json"
        });
    };
    exports.post = function(url, data) {
        return exports.request({
            url: url,
            method: "POST",
            data: data
        });
    };
});

define("wozlla/wozllajs/1.0.0/assets/objLoader-debug", [ "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/core/GameObject-debug", "wozlla/wozllajs/1.0.0/core/CachableGameObject-debug", "wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug", "wozlla/wozllajs/1.0.0/core/Filter-debug" ], function(require, exports) {
    var loader = require("wozlla/wozllajs/1.0.0/assets/loader-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    var GameObject = require("wozlla/wozllajs/1.0.0/core/GameObject-debug");
    exports.buildGameObject = function(objData) {
        var i, len, comp;
        var gameObject, children, components;
        gameObject = new GameObject({
            name: objData.name
        });
        gameObject.setActive(objData.active);
        gameObject.setActive(objData.visible);
        gameObject.setWidth(objData.width || 0);
        gameObject.setHeight(objData.height || 0);
        gameObject.setInteractive(objData.interactive);
        gameObject.transform.applyTransform(objData.transform);
        children = objData.children;
        components = objData.components;
        for (i = 0, len = children.length; i < len; i++) {
            gameObject.addObject(exports.buildGameObject(children[i]));
        }
        for (i = 0, len = components.length; i < len; i++) {
            comp = exports.buildComponent(components[i]);
            if (comp) {
                gameObject.addComponent(comp);
            }
        }
        return gameObject;
    };
    exports.buildComponent = function(componentData) {
        var compCtor, properties, comp;
        compCtor = Component.getConstructor(componentData.id);
        properties = componentData.properties;
        if (compCtor) {
            comp = new compCtor();
            comp.properties = {};
            if (properties) {
                for (var i in properties) {
                    comp.properties[i] = properties[i];
                }
            }
        }
        return comp;
    };
    exports.initObjectData = function(objData) {};
    exports.loadObjFile = function(filePath) {
        return loader.load({
            id: filePath,
            src: filePath,
            type: "json"
        });
    };
    exports.loadAndInitObjFile = function(filePath) {
        return exports.loadObjFile(filePath).then(function() {
            var objData = loader.get(filePath);
            var obj = exports.buildGameObject(objData);
            loader.remove(filePath);
            return obj;
        });
    };
});

define("wozlla/wozllajs/1.0.0/core/Component-debug", [ "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var loader = require("wozlla/wozllajs/1.0.0/assets/loader-debug");
    var uniqueKey = require("wozlla/wozllajs/1.0.0/utils/uniqueKey-debug");
    var registry = {};
    function Component(properties) {
        this.UID = uniqueKey();
        this.gameObject = null;
        this.properties = properties || {};
    }
    Component.getConstructor = function(idOrAlias) {
        return registry[idOrAlias];
    };
    Component.getRegistry = function() {
        return registry;
    };
    Component.unregisterAll = function() {
        register = {};
    };
    Component.register = function(compCtor) {
        var id = compCtor.prototype.id;
        var alias = compCtor.prototype.alias;
        if (!id || !alias) {
            throw new Error("component must define id and alias.");
        }
        if (registry[id]) {
            throw new Error('component id "' + id + '" has been registered.');
        }
        if (registry[alias]) {
            throw new Error('component alias "' + alias + '" has been registered.');
        }
        registry[id] = compCtor;
        registry[alias] = compCtor;
    };
    var p = Component.prototype;
    p.id = undefined;
    p.alias = undefined;
    p.setGameObject = function(gameObject) {
        this.gameObject = gameObject;
    };
    p.initComponent = function() {};
    p.destroyComponent = function() {};
    p.on = function() {
        this.gameObject.addEventListener.apply(this.gameObject, arguments);
    };
    p.off = function() {
        this.gameObject.removeEventListener.apply(this.gameObject, arguments);
    };
    p.dispatchEvent = function(event) {
        this.gameObject.dispatchEvent(event);
    };
    p.getResource = function(id) {
        return loader.get(id);
    };
    p.loadResource = function(params, base) {
        return loader.load(params, base);
    };
    p.unloadResource = function(ids) {
        if (typeof ids === "string") {
            ids = [ ids ];
        }
        var i, len;
        for (i = 0, len = ids.length; i < len; i++) {
            loader.remove(ids[i]);
        }
    };
    p.isInstanceof = function(type) {
        return this instanceof type;
    };
    return Component;
});

define("wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", [], function() {
    var uniqueKeyIncrementor = 1;
    return function() {
        return uniqueKeyIncrementor++;
    };
});

define("wozlla/wozllajs/1.0.0/core/GameObject-debug", [ "wozlla/wozllajs/1.0.0/core/CachableGameObject-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug", "wozlla/wozllajs/1.0.0/core/Filter-debug" ], function(require) {
    return require("wozlla/wozllajs/1.0.0/core/CachableGameObject-debug");
});

define("wozlla/wozllajs/1.0.0/core/CachableGameObject-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug", "wozlla/wozllajs/1.0.0/core/Filter-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var UnityGameObject = require("wozlla/wozllajs/1.0.0/core/UnityGameObject-debug");
    var Filter = require("wozlla/wozllajs/1.0.0/core/Filter-debug");
    var createCanvas = require("wozlla/wozllajs/1.0.0/utils/createCanvas-debug");
    var CachableGameObject = function(param) {
        UnityGameObject.apply(this, arguments);
        this._cacheCanvas = null;
        this._cacheContext = null;
        this._cached = false;
        this._cacheOffsetX = 0;
        this._cacheOffsetY = 0;
    };
    var p = Objects.inherits(CachableGameObject, UnityGameObject);
    p.cache = function(x, y, width, height) {
        if (this._cacheCanvas) {
            this.uncache();
        }
        this._cacheOffsetX = x;
        this._cacheOffsetY = y;
        this._cacheCanvas = createCanvas(width, height);
        this._cacheContext = this._cacheCanvas.getContext("2d");
        this._cached = false;
    };
    p.updateCache = function(offsetX, offsetY) {
        this._cached = false;
        this._cacheOffsetX = offsetX || this._cacheOffsetX;
        this._cacheOffsetY = offsetY || this._cacheOffsetY;
    };
    p.translateCache = function(deltaX, deltaY) {
        this._cached = false;
        this._cacheOffsetX += deltaX;
        this._cacheOffsetY += deltaY;
    };
    p.uncache = function() {
        if (this._cacheCanvas) {
            this._cacheContext.dispose && this._cacheContext.dispose();
            this._cacheCanvas.dispose && this._cacheCanvas.dispose();
            this._cacheCanvas = null;
        }
        this._cached = false;
    };
    p._draw = function(context, visibleRect) {
        if (this._cacheCanvas) {
            if (!this._cached) {
                this._drawCache();
                this._cached = true;
            }
            context.drawImage(this._cacheCanvas, 0, 0);
        } else {
            UnityGameObject.prototype._draw.apply(this, arguments);
        }
    };
    p._drawCache = function(context, visibleRect) {
        var cacheContext = this._cacheContext;
        cacheContext.clearRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
        cacheContext = this._cacheContext;
        cacheContext.translate(-this._cacheOffsetX, -this._cacheOffsetY);
        UnityGameObject.prototype._draw.apply(this, [ cacheContext, visibleRect ]);
        cacheContext.translate(this._cacheOffsetX, this._cacheOffsetY);
        this._applyFilters(cacheContext, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
    };
    p._applyFilters = function(cacheContext, x, y, width, height) {
        var id, filter;
        var filters = this.getComponents(Filter);
        for (id in filters) {
            cacheContext.save();
            filter = filters[id];
            filter.applyFilter(cacheContext, x, y, width, height);
            cacheContext.restore();
        }
    };
    return CachableGameObject;
});

define("wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Rectangle = require("wozlla/wozllajs/1.0.0/math/Rectangle-debug");
    var Matrix2D = require("wozlla/wozllajs/1.0.0/math/Matrix2D-debug");
    var Promise = require("wozlla/wozllajs/1.0.0/utils/Promise-debug");
    var AbstractGameObject = require("wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    var Behaviour = require("wozlla/wozllajs/1.0.0/core/Behaviour-debug");
    var Animation = require("wozlla/wozllajs/1.0.0/core/Animation-debug");
    var Renderer = require("wozlla/wozllajs/1.0.0/core/Renderer-debug");
    var Layout = require("wozlla/wozllajs/1.0.0/core/Layout-debug");
    var HitDelegate = require("wozlla/wozllajs/1.0.0/core/HitDelegate-debug");
    var Mask = require("wozlla/wozllajs/1.0.0/core/Mask-debug");
    var GameObjectEvent = require("wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug");
    var createCanvas = require("wozlla/wozllajs/1.0.0/utils/createCanvas-debug");
    var testHitCanvas = createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext("2d");
    var helpRect = new Rectangle();
    var helpMatrix = new Matrix2D();
    var UnityGameObject = function(param) {
        AbstractGameObject.apply(this, arguments);
        this._active = true;
        this._visible = true;
        this._width = 0;
        this._height = 0;
        this._interactive = false;
        this._initialized = false;
        this._components = [];
        this._delayRemoves = [];
    };
    var p = Objects.inherits(UnityGameObject, AbstractGameObject);
    p.isActive = function(upWards) {
        if (upWards === false) {
            return this._active;
        }
        var active = true;
        var o = this;
        while (o) {
            active = active && o._active;
            if (!active) {
                return false;
            }
            o = o._parent;
        }
        return active;
    };
    p.setActive = function(active) {
        this._active = active;
    };
    p.isVisible = function(upWards) {
        if (upWards === false) {
            return this._visible;
        }
        var visible = true;
        var o = this;
        while (o) {
            visible = visible && o._visible;
            if (!visible) {
                return false;
            }
            o = o._parent;
        }
        return visible;
    };
    p.setVisible = function(visible) {
        this._visible = visible;
    };
    p.isInteractive = function() {
        return this._children.length > 0 || this._interactive;
    };
    p.setInteractive = function(interactive) {
        this._interactive = interactive;
    };
    p.getWidth = function() {
        return this._width;
    };
    p.setWidth = function(w) {
        this._width = w;
    };
    p.getHeight = function() {
        return this._height;
    };
    p.setHeight = function(h) {
        this._height = h;
    };
    p.getGlobalBounds = function(resultRect, print) {
        if (!resultRect) {
            resultRect = new Rectangle();
        }
        var t = this.transform;
        var concatenatedMatrix = this.transform.getConcatenatedMatrix(helpMatrix);
        var localA = t.localToGlobal(0, 0, concatenatedMatrix);
        var localB = t.localToGlobal(this._width, 0, concatenatedMatrix);
        var localC = t.localToGlobal(0, this._height, concatenatedMatrix);
        var localD = t.localToGlobal(this._width, this._height, concatenatedMatrix);
        print && console.log(localA, localB, localC, localD);
        resultRect.x = Math.min(localA.x, localB.x, localC.x, localD.x);
        resultRect.y = Math.min(localA.y, localB.y, localC.y, localD.y);
        resultRect.width = Math.max(localA.x, localB.x, localC.x, localD.x) - resultRect.x;
        resultRect.height = Math.max(localA.y, localB.y, localC.y, localD.y) - resultRect.y;
        return resultRect;
    };
    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };
    p.getComponent = function(type) {
        var i, len, comp;
        var components = this._components;
        var alias;
        if (typeof type === "string") {
            alias = type;
            for (i = 0, len = components.length; i < len; i++) {
                comp = components[i];
                if (comp.alias === alias) {
                    return comp;
                }
            }
        } else {
            for (i = 0, len = components.length; i < len; i++) {
                comp = components[i];
                if (comp.isInstanceof(type)) {
                    return comp;
                }
            }
        }
        return null;
    };
    p.getComponents = function(type) {
        var i, len, comp, alias;
        var components = this._components;
        var found = [];
        if (typeof type === "string") {
            alias = type.toLowerCase();
            for (i = 0, len = components.length; i < len; i++) {
                comp = components[i];
                if (comp.alias.toLowerCase() === alias) {
                    found.push(comp);
                }
            }
        } else {
            for (i = 0, len = components.length; i < len; i++) {
                comp = components[i];
                if (comp.isInstanceof(type)) {
                    found.push(comp);
                }
            }
        }
        return found;
    };
    p.removeComponent = function(component) {
        var i, len, comp;
        var components = this._components;
        for (i = 0, len = components.length; i < len; i++) {
            comp = components[i];
            if (comp === component) {
                components.splice(i, 1);
                comp.setGameObject(null);
                break;
            }
        }
    };
    p.delayRemoveComponent = function(component) {
        this._delayRemoves.push(component);
    };
    p.delayRemoveObject = function(gameObject) {
        this._delayRemoves.push(gameObject);
    };
    p.delayRemove = function() {
        this._parent.delayRemoveObject(this);
    };
    p.sendMessage = function(methodName, args, type) {
        var i, len, comp, method;
        var components = this._components;
        for (i = 0, len = components.length; i < len; i++) {
            comp = components[i];
            if (!type || type && comp.isInstanceof(type)) {
                method = comp[methodName];
                method && method.apply(comp, args);
            }
        }
    };
    p.broadcastMessage = function(methodName, args) {
        var i, len, child;
        var children = this._children;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.broadcastMessage(methodName, args);
        }
        this.sendMessage(methodName, args);
    };
    p.init = function() {
        var i, len, child;
        var children = this._children;
        this.sendMessage("initComponent");
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.init();
        }
        this.layout();
        this._doDelayRemove();
        this._initialized = true;
        this.dispatchEvent(new GameObjectEvent({
            type: GameObjectEvent.INIT,
            bubbles: true
        }));
    };
    p.destroy = function() {
        var i, len, child;
        var children = this._children;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.destroy();
        }
        this._doDelayRemove();
        this.sendMessage("destroyComponent");
        this.dispatchEvent(new GameObjectEvent({
            type: GameObjectEvent.DESTROY,
            bubbles: true
        }));
    };
    p.layout = function() {
        var layout = this.getComponent(Layout);
        var children = this._children;
        var i, len, child;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.layout();
        }
        layout && layout.doLayout();
    };
    p.update = function() {
        if (!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.update();
        }
        this.sendMessage("update", null, Behaviour);
        this._doDelayRemove();
    };
    p.lateUpdate = function() {
        if (!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child.lateUpdate();
        }
        this.sendMessage("lateUpdate", null, Behaviour);
        this._doDelayRemove();
    };
    p.draw = function(context, visibleRect) {
        if (!this._initialized || !this._active || !this._visible) return;
        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);
        context.restore();
        this._doDelayRemove();
    };
    p.testHit = function(x, y) {
        var hit = false, hitDelegate;
        if (!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if (hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        } else {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            this._draw(testHitContext, this.getStage().getVisibleRect());
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };
    p.getTopObjectUnderPoint = function(x, y, useInteractive) {
        var i, child, obj, localPoint;
        var children = this._children;
        if (useInteractive && !this.isInteractive()) {
            return null;
        }
        if (children.length > 0) {
            for (i = children.length - 1; i >= 0; i--) {
                child = children[i];
                obj = child.getTopObjectUnderPoint(x, y, useInteractive);
                if (obj) {
                    return obj;
                }
            }
        } else {
            localPoint = this.transform.globalToLocal(x, y);
            if (this.testHit(localPoint.x, localPoint.y)) {
                return this;
            }
        }
        return null;
    };
    p.animate = function(name, callback) {
        var animations = this.getComponents(Animation);
        var i, len, ani;
        for (i = 0, len = animations.length; i < len; i++) {
            ani = animations[i];
            if (ani.name === name) {
                ani.play(callback);
                break;
            }
        }
    };
    p.playEffect = function(effects) {};
    p._doDelayRemove = function() {
        var i, len, target;
        if (this._delayRemoves.length > 0) {
            for (i = 0, len = this._delayRemoves.length; i < len; i++) {
                target = this._delayRemoves[i];
                if (target instanceof AbstractGameObject) {
                    this.removeObject(target);
                } else if (target instanceof Component) {
                    this.removeComponent(target);
                }
            }
            this._delayRemoves.length = 0;
        }
    };
    p._draw = function(context, visibleRect) {
        var i, len, child, gBounds, mask;
        var children = this._children;
        if (children.length <= 0) {
            gBounds = this.getGlobalBounds(helpRect);
            if (gBounds.intersects(visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height)) {
                mask = this.getComponent(Mask);
                mask && mask.clip(context);
                this.sendMessage("draw", arguments, Renderer);
            }
        } else {
            mask = this.getComponent(Mask);
            mask && mask.clip(context);
            for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                child.draw(context, visibleRect);
            }
        }
    };
    return UnityGameObject;
});

define("wozlla/wozllajs/1.0.0/math/Rectangle-debug", [], function() {
    var Rectangle = function(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    };
    var p = Rectangle.prototype;
    p.top = function() {
        return this.y;
    };
    p.left = function() {
        return this.x;
    };
    p.right = function() {
        return this.x + this.width;
    };
    p.bottom = function() {
        return this.y + this.height;
    };
    p.contains = function(x, y) {
        return this.x <= x && this.y <= y && this.x + this.width > x && this.y + this.height > y;
    };
    p.containsPoint = function(point) {
        return this.contains(point.x, point.y);
    };
    p.intersects = function(x, y, w, h) {
        return this.x < x + w && this.x + this.width > x && this.y < y + h && this.y + this.height > y;
    };
    p.intersectRect = function(r) {
        return this.intersects(r.x, r.y, r.width, r.height);
    };
    Rectangle.MAX_RECT = new Rectangle(Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    return Rectangle;
});

/**
 * Copy from createjs
 * @see createjs.com
 */
define("wozlla/wozllajs/1.0.0/math/Matrix2D-debug", [], function() {
    /**
     * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrixes.
     * @class Matrix2D
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @constructor
     **/
    var Matrix2D = function(a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    };
    var p = Matrix2D.prototype;
    // static public properties:
    /**
     * An identity matrix, representing a null transformation.
     * @property identity
     * @static
     * @type Matrix2D
     * @readonly
     **/
    Matrix2D.identity = null;
    // set at bottom of class definition.
    /**
     * Multiplier for converting degrees to radians. Used internally by Matrix2D.
     * @property DEG_TO_RAD
     * @static
     * @final
     * @type Number
     * @readonly
     **/
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    // public properties:
    /**
     * Position (0, 0) in a 3x3 affine transformation matrix.
     * @property a
     * @type Number
     **/
    p.a = 1;
    /**
     * Position (0, 1) in a 3x3 affine transformation matrix.
     * @property b
     * @type Number
     **/
    p.b = 0;
    /**
     * Position (1, 0) in a 3x3 affine transformation matrix.
     * @property c
     * @type Number
     **/
    p.c = 0;
    /**
     * Position (1, 1) in a 3x3 affine transformation matrix.
     * @property d
     * @type Number
     **/
    p.d = 1;
    /**
     * Position (2, 0) in a 3x3 affine transformation matrix.
     * @property tx
     * @type Number
     **/
    p.tx = 0;
    /**
     * Position (2, 1) in a 3x3 affine transformation matrix.
     * @property ty
     * @type Number
     **/
    p.ty = 0;
    /**
     * Property representing the alpha that will be applied to a display object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
     * @property alpha
     * @type Number
     **/
    p.alpha = 1;
    /**
     * Property representing the shadow that will be applied to a display object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values.
     * @property shadow
     * @type Shadow
     **/
    p.shadow = null;
    /**
     * Property representing the compositeOperation that will be applied to a display object. This is not part of
     * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
     * compositeOperation values. You can find a list of valid composite operations at:
     * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
     * @property compositeOperation
     * @type String
     **/
    p.compositeOperation = null;
    // constructor:
    /**
     * Initialization method. Can also be used to reinitialize the instance.
     * @method initialize
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @return {Matrix2D} This instance. Useful for chaining method calls.
     */
    p.initialize = function(a, b, c, d, tx, ty) {
        this.a = a == null ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d == null ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    };
    // public methods:
    /**
     * Concatenates the specified matrix properties with this matrix. All parameters are required.
     * @method prepend
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prepend = function(a, b, c, d, tx, ty) {
        var tx1 = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            var a1 = this.a;
            var c1 = this.c;
            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
        }
        this.tx = tx1 * a + this.ty * c + tx;
        this.ty = tx1 * b + this.ty * d + ty;
        return this;
    };
    /**
     * Appends the specified matrix properties with this matrix. All parameters are required.
     * @method append
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.append = function(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.tx = tx * a1 + ty * c1 + this.tx;
        this.ty = tx * b1 + ty * d1 + this.ty;
        return this;
    };
    /**
     * Prepends the specified matrix with this matrix.
     * @method prependMatrix
     * @param {Matrix2D} matrix
     **/
    p.prependMatrix = function(matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.prependProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
        return this;
    };
    /**
     * Appends the specified matrix with this matrix.
     * @method appendMatrix
     * @param {Matrix2D} matrix
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendMatrix = function(matrix) {
        this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.appendProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
        return this;
    };
    /**
     * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
     * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
     * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method prependTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX;
            this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    };
    /**
     * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
     * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
     * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method appendTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single append?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    };
    /**
     * Applies a rotation transformation to the matrix.
     * @method rotate
     * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        return this;
    };
    /**
     * Applies a skew transformation to the matrix.
     * @method skew
     * @param {Number} skewX The amount to skew horizontally in degrees.
     * @param {Number} skewY The amount to skew vertically in degrees.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.skew = function(skewX, skewY) {
        skewX = skewX * Matrix2D.DEG_TO_RAD;
        skewY = skewY * Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    };
    /**
     * Applies a scale transformation to the matrix.
     * @method scale
     * @param {Number} x The amount to scale horizontally
     * @param {Number} y The amount to scale vertically
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.scale = function(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    };
    /**
     * Translates the matrix on the x and y axes.
     * @method translate
     * @param {Number} x
     * @param {Number} y
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.translate = function(x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    };
    /**
     * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
     * @method identity
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.identity = function() {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null;
        return this;
    };
    /**
     * Inverts the matrix, causing it to perform the opposite transformation.
     * @method invert
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    };
    /**
     * Returns true if the matrix is an identity matrix.
     * @method isIdentity
     * @return {Boolean}
     **/
    p.isIdentity = function() {
        return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
    };
    /**
     * Transforms a point according to this matrix.
     * @method transformPoint
     * @param {Number} x The x component of the point to transform.
     * @param {Number} y The y component of the point to transform.
     * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
     **/
    p.transformPoint = function(x, y, pt) {
        pt = pt || {};
        pt.x = x * this.a + y * this.c + this.tx;
        pt.y = x * this.b + y * this.d + this.ty;
        return pt;
    };
    /**
     * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
     * may not match the transform properties you used to generate the matrix, though they will produce the same visual
     * results.
     * @method decompose
     * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.decompose = function(target) {
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
        // even when scale is negative
        if (target == null) {
            target = {};
        }
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);
        if (skewX == skewY) {
            target.rotation = skewY / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += target.rotation <= 0 ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX / Matrix2D.DEG_TO_RAD;
            target.skewY = skewY / Matrix2D.DEG_TO_RAD;
        }
        return target;
    };
    /**
     * Reinitializes all matrix properties to those specified.
     * @method reinitialize
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @param {Number} [alpha=1] desired alpha value
     * @param {Shadow} [shadow=null] desired shadow value
     * @param {String} [compositeOperation=null] desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.reinitialize = function(a, b, c, d, tx, ty, alpha, shadow, compositeOperation) {
        this.initialize(a, b, c, d, tx, ty);
        this.alpha = alpha == null ? 1 : alpha;
        this.shadow = shadow;
        this.compositeOperation = compositeOperation;
        return this;
    };
    /**
     * Copies all properties from the specified matrix to this matrix.
     * @method copy
     * @param {Matrix2D} matrix The matrix to copy properties from.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.copy = function(matrix) {
        return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty, matrix.alpha, matrix.shadow, matrix.compositeOperation);
    };
    /**
     * Appends the specified visual properties to the current matrix.
     * @method appendProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.appendProperties = function(alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = shadow || this.shadow;
        this.compositeOperation = compositeOperation || this.compositeOperation;
        return this;
    };
    /**
     * Prepends the specified visual properties to the current matrix.
     * @method prependProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.prependProperties = function(alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = this.shadow || shadow;
        this.compositeOperation = this.compositeOperation || compositeOperation;
        return this;
    };
    /**
     * Returns a clone of the Matrix2D instance.
     * @method clone
     * @return {Matrix2D} a clone of the Matrix2D instance.
     **/
    p.clone = function() {
        return new Matrix2D().copy(this);
    };
    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
    };
    // this has to be populated after the class is defined:
    Matrix2D.identity = new Matrix2D();
    return Matrix2D;
});

define("wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var uniqueKey = require("wozlla/wozllajs/1.0.0/utils/uniqueKey-debug");
    var EventTarget = require("wozlla/wozllajs/1.0.0/events/EventTarget-debug");
    var GameObjectEvent = require("wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug");
    var Transform = require("wozlla/wozllajs/1.0.0/core/Transform-debug");
    /**
	 *
	 * @name AbstractGameObject
	 * @class AbstractGameObject 类是所以游戏对象的基类，其定义了树形结构，并继承 EventTarget 以实现游戏中的事件调度
	 * @constructor
	 * @abstract
	 * @extends EventTarget
	 * @param {Object} params
	 * @param {String} params.id
	 */
    var AbstractGameObject = function(params) {
        EventTarget.apply(this, arguments);
        this.name = params.name;
        this.UID = uniqueKey();
        this.transform = new Transform({
            gameObject: this
        });
        this._parent = null;
        this._children = [];
        this._childrenMap = {};
    };
    var p = Objects.inherits(AbstractGameObject, EventTarget);
    p.setName = function(name) {
        if (this._parent) {
            delete this._parent._childrenMap[this.name];
            this._parent._childrenMap[name] = this;
        }
        this.name = name;
    };
    p.getParent = function() {
        return this._parent;
    };
    p.getPath = function(seperator) {
        var o = this;
        var path = [];
        while (o && !o.isStage) {
            path.unshift(o.name);
            o = o._parent;
        }
        return path.join(seperator || "/");
    };
    p.getStage = function() {
        var o = this;
        while (o && !o.isStage) {
            o = o._parent;
        }
        return o.isStage ? o : null;
    };
    p.getChildren = function() {
        return this._children.slice();
    };
    p.sortChildren = function(func) {
        this._children.sort(func);
        this.dispatchEvent(new GameObjectEvent({
            type: GameObjectEvent.CHANGED,
            bubbles: false
        }));
    };
    p.getObjectByName = function(name) {
        return this._childrenMap[name];
    };
    p.addObject = function(obj) {
        this._childrenMap[obj.name] = obj;
        this._children.push(obj);
        obj._parent = this;
        this.dispatchEvent(new GameObjectEvent({
            type: GameObjectEvent.ADDED,
            bubbles: false,
            child: obj
        }));
    };
    p.insertObject = function(obj, index) {
        this._childrenMap[obj.name] = obj;
        this._children.splice(index, 0, obj);
        obj._parent = this;
        this.dispatchEvent(new GameObjectEvent({
            type: GameObjectEvent.ADDED,
            bubbles: false,
            child: obj
        }));
    };
    p.insertBefore = function(obj, objOrName) {
        var i, len, child;
        var index = 0;
        for (i = 0, len = this._children.length; i < len; i++) {
            child = this._children[i];
            if (child === objOrName || child.name === objOrName) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index);
    };
    p.insertAfter = function(obj, objOrName) {
        var i, len, child;
        var index = this._children.length;
        for (i = 0, len = this._children.length; i < len; i++) {
            child = this._children[i];
            if (child === objOrName || child.name === objOrName) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index + 1);
    };
    p.removeObject = function(objOrName) {
        var children = this._children;
        var obj = typeof objOrName === "string" ? this._childrenMap[objOrName] : objOrName;
        var idx = -1;
        var i, len;
        for (i = 0, len = children.length; i < len; i++) {
            if (obj === children[i]) {
                idx = i;
                children.splice(idx, 1);
                break;
            }
        }
        if (idx !== -1) {
            delete this._childrenMap[obj.name];
            obj._parent = null;
            this.dispatchEvent(new GameObjectEvent({
                type: GameObjectEvent.REMOVED,
                bubbles: false,
                child: obj
            }));
        }
        return idx;
    };
    p.remove = function(params) {
        this._parent && this._parent.removeObject(this);
        this._parent = null;
    };
    p.removeAll = function(params) {
        // event ?
        this._children = [];
        this._childrenMap = {};
    };
    p.findObjectByName = function(name) {
        var i, len, children;
        var obj = this.getObjectByName(name);
        if (!obj) {
            children = this._children;
            for (i = 0, len = children.length; i < len; i++) {
                obj = children[i].findObjectByName(name);
                if (obj) break;
            }
        }
        return obj;
    };
    p.findObjectByPath = function(path, seperator) {
        var i, len;
        var paths = path.split(seperator || "/");
        var obj = this.findObjectByName(paths[0]);
        if (obj) {
            for (i = 1, len = paths.length; i < len; i++) {
                obj = obj.getObjectByName(paths[i]);
                if (!obj) return null;
            }
        }
        return obj;
    };
    return AbstractGameObject;
});

define("wozlla/wozllajs/1.0.0/events/EventTarget-debug", [ "wozlla/wozllajs/1.0.0/events/Event-debug" ], function(require, exports, module) {
    var Event = require("wozlla/wozllajs/1.0.0/events/Event-debug");
    /**
     *
     * @name EventTarget
     * @class EventTarget 类是可调度事件的所有类的基类。
     * @constructor
     */
    var EventTarget = function() {
        this._captureListeners = {};
        this._listeners = {};
    };
    EventTarget.DEFAULT_ACTION_MAP = {
        touchstart: "onTouchStart",
        touchmove: "onTouchMove",
        touchend: "onTouchEnd",
        click: "onClick"
    };
    /**
     * @lends EventTarget.prototype
     */
    var p = EventTarget.prototype;
    /**
     *
     */
    p.addEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        var arr = listeners[eventType];
        if (arr) {
            this.removeEventListener(eventType, listener, useCapture);
        }
        arr = listeners[eventType];
        if (!arr) {
            listeners[eventType] = [ listener ];
        } else {
            arr.push(listener);
        }
        return listener;
    };
    p.removeEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) {
            return;
        }
        var arr = listeners[eventType];
        if (!arr) {
            return;
        }
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) {
                    delete listeners[eventType];
                } else {
                    arr.splice(i, 1);
                }
                break;
            }
        }
    };
    p.hasEventListener = function(eventType) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!(listeners && listeners[eventType] || captureListeners && captureListeners[eventType]);
    };
    p.dispatchEvent = function(event) {
        var i, len, list, object, defaultAction;
        event.target = this;
        if (false === event.bubbles) {
            event.eventPhase = Event.TARGET_PHASE;
            if (!this._dispatchEvent(event)) {
                defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            return;
        }
        list = this._getAncients();
        event.eventPhase = Event.CAPTURING_PHASE;
        for (i = list.length - 1; i >= 0; i--) {
            object = list[i];
            if (!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if (event._propagationStoped) {
                return;
            }
        }
        event.eventPhase = Event.TARGET_PHASE;
        if (!this._dispatchEvent(event)) {
            defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
            defaultAction && defaultAction(event);
        }
        if (event._propagationStoped) {
            return;
        }
        event.eventPhase = Event.BUBBLING_PHASE;
        for (i = 0, len = list.length; i < len; i++) {
            object = list[i];
            if (!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if (event._propagationStoped) {
                return;
            }
        }
    };
    p._getAncients = function() {
        var list = [];
        var parent = this;
        while (parent._parent) {
            parent = parent._parent;
            list.push(parent);
        }
        return list;
    };
    p._dispatchEvent = function(event) {
        var i, len, arr, allArr, listeners, handler;
        event.currentTarget = this;
        event._listenerRemoved = false;
        listeners = event.eventPhase === Event.CAPTURING_PHASE ? this._captureListeners : this._listeners;
        if (listeners) {
            arr = listeners[event.type];
            allArr = listeners["*"];
            if (arr && arr.length > 0) {
                arr = arr.slice();
                for (i = 0, len = arr.length; i < len; i++) {
                    event._listenerRemoved = false;
                    handler = arr[i];
                    handler(event);
                    if (event._listenerRemoved) {
                        this.removeEventListener(event.type, handler, event.eventPhase === Event.CAPTURING_PHASE);
                    }
                    if (event._immediatePropagationStoped) {
                        break;
                    }
                }
            }
            if (allArr && allArr.length > 0) {
                allArr = allArr.slice();
                for (i = 0, len = allArr.length; i < len; i++) {
                    event._listenerRemoved = false;
                    handler = allArr[i];
                    handler(event);
                    if (event._listenerRemoved) {
                        this.removeEventListener("*", handler, event.eventPhase === Event.CAPTURING_PHASE);
                    }
                }
            }
        }
        return event._defaultPrevented;
    };
    module.exports = EventTarget;
});

define("wozlla/wozllajs/1.0.0/events/Event-debug", [], function(require, exports, module) {
    /**
     * @name Event
     * @class Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * @constructor
     * @param {Object} params
     * @param {String} params.type 指定事件类型
     * @param {Boolean} params.bubbles 指定事件是否冒泡
     */
    var Event = function(params) {
        /**
         * [readonly] 事件类型
         * @type {String}
         */
        this.type = params.type;
        /**
         * [readonly] 事件目标
         * @type {EventTarget}
         */
        this.target = null;
        /**
         * [readonly] 当前正在使用某个事件侦听器处理 Event 对象的对象。
         * @type {EventTarget}
         */
        this.currentTarget = null;
        /**
         * [readonly] 事件流中的当前阶段。
         * @type {int}
         */
        this.eventPhase = null;
        /**
         * [只读] 表示事件是否为冒泡事件。
         * @type {Boolean}
         */
        this.bubbles = params.bubbles;
        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
        this._defaultPrevented = false;
        this._listenerRemoved = false;
    };
    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;
    /**
     * @lends Event.prototype
     */
    var p = Event.prototype;
    /**
     * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
     */
    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };
    /**
     * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
     */
    p.stopPropagation = function() {
        this._propagationStoped = true;
    };
    /**
     * 如果可以取消事件的默认行为，则取消该行为。
     */
    p.preventDefault = function() {
        this._defaultPrevented = true;
    };
    /**
     * 移除当前正在处理事件的侦听器。
     */
    p.removeListener = function() {
        this._listenerRemoved = true;
    };
    module.exports = Event;
});

define("wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/events/Event-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Event = require("wozlla/wozllajs/1.0.0/events/Event-debug");
    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };
    GameObjectEvent.INIT = "init";
    GameObjectEvent.DESTROY = "destroy";
    GameObjectEvent.CHANGED = "changed";
    /**
     * fire when child game object added , removed
     * @type {string}
     */
    GameObjectEvent.ADDED = "added";
    GameObjectEvent.REMOVED = "removed";
    var p = Objects.inherits(GameObjectEvent, Event);
    return GameObjectEvent;
});

define("wozlla/wozllajs/1.0.0/core/Transform-debug", [ "wozlla/wozllajs/1.0.0/math/Matrix2D-debug" ], function(require) {
    var Matrix2D = require("wozlla/wozllajs/1.0.0/math/Matrix2D-debug");
    // 一个createjs类用于帮助从Transform到canvas的context中的transform参数
    var matrix = new Matrix2D();
    var Transform = function(params) {
        this.x = 0;
        this.y = 0;
        this.regX = 0;
        this.regY = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.skewX = 0;
        this.skewY = 0;
        this.alpha = 1;
        this.gameObject = params.gameObject;
    };
    Transform.prototype = {
        /**
         * Get the top parent of Transform
         * @return {*}
         */
        getRoot: function() {
            var o = this.gameObject;
            while (o && o._parent) {
                o = o._parent;
            }
            return o.transform;
        },
        /**
         * 将一个坐标点从相对于当前Transform转换成全局的坐标点
         * @param x
         * @param y
         * @return {*}
         */
        localToGlobal: function(x, y, concatenatedMatrix) {
            var mtx;
            if (concatenatedMatrix) {
                matrix.copy(concatenatedMatrix);
                mtx = matrix;
            } else {
                mtx = this.getConcatenatedMatrix();
            }
            if (mtx == null) {
                return null;
            }
            mtx.append(1, 0, 0, 1, x, y);
            return {
                x: mtx.tx,
                y: mtx.ty
            };
        },
        /**
         * 与localToGlobal相反
         * @param x
         * @param y
         * @return {*}
         */
        globalToLocal: function(x, y, concatenatedMatrix) {
            var mtx;
            if (concatenatedMatrix) {
                matrix.copy(concatenatedMatrix);
                mtx = matrix;
            } else {
                mtx = this.getConcatenatedMatrix();
            }
            if (mtx == null) {
                return null;
            }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return {
                x: mtx.tx,
                y: mtx.ty
            };
        },
        /**
         * 获取一个Matrix2D, 及联了所有它的parentTransform的属性, 通常很方便的用于转换坐标点
         * @return {createjs.Matrix2D}
         */
        getConcatenatedMatrix: function(resultMatrix) {
            var o = this;
            var mtx = resultMatrix || matrix;
            mtx.identity();
            while (o != null) {
                mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha);
                o = o.gameObject._parent;
                if (o) {
                    o = o.transform;
                }
            }
            return mtx;
        },
        /**
         * 获取当前Transform转换的Matrix2D
         * @return {Matrix2D}
         */
        getMatrix: function() {
            var o = this;
            return matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).appendProperties(o.alpha);
        },
        /**
         * 将当前的Transform应用到canvas的context上
         * @param context CanvasContextRenderer2d
         */
        updateContext: function(context) {
            var mtx, o = this;
            mtx = matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            context.globalAlpha *= o.alpha;
        },
        applyTransform: function(transform) {
            this.x = transform.x;
            this.y = transform.y;
            this.regX = transform.regX;
            this.regY = transform.regY;
            this.scaleX = transform.scaleX;
            this.scaleY = transform.scaleY;
            this.rotation = transform.rotation;
            this.alpha = transform.alpha;
            this.skewX = transform.skewX;
            this.skewY = transform.skewY;
        }
    };
    return Transform;
});

define("wozlla/wozllajs/1.0.0/core/Behaviour-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Behaviour() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Behaviour, Component);
    p.update = function() {};
    p.lateUpdate = function() {};
    return Behaviour;
});

define("wozlla/wozllajs/1.0.0/core/Animation-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Time = require("wozlla/wozllajs/1.0.0/core/Time-debug");
    var Behaviour = require("wozlla/wozllajs/1.0.0/core/Behaviour-debug");
    function Animation() {
        Behaviour.apply(this, arguments);
        this.name = null;
        this.enabled = false;
        this.callbacks = [];
    }
    var p = Objects.inherits(Animation, Behaviour);
    p.update = function() {
        this.enabled && this.tick(Time.delta);
    };
    p.play = function(callback) {
        this.enabled = true;
        this.callbacks.push(callback);
    };
    p.stop = function() {
        this.enabled = false;
    };
    p.tick = function(delta) {
        throw new Error("abstract method");
    };
    p.done = function() {
        var cbs = this.callbacks;
        for (var i = 0, len = cbs.length; i < len; i++) {
            cbs[i]();
        }
    };
    return Animation;
});

define("wozlla/wozllajs/1.0.0/core/Time-debug", [], function() {
    return {
        delta: 0,
        now: 0,
        update: function() {
            var now = Date.now();
            if (this.now) {
                this.delta = now - this.now;
            }
            this.now = now;
        },
        reset: function() {
            this.delta = 0;
            this.now = 0;
        }
    };
});

define("wozlla/wozllajs/1.0.0/core/Renderer-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Renderer() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Renderer, Component);
    p.draw = function(context, visibleRect) {};
    return Renderer;
});

define("wozlla/wozllajs/1.0.0/core/Layout-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Layout() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Layout, Component);
    p.doLayout = function() {};
    return Layout;
});

define("wozlla/wozllajs/1.0.0/core/HitDelegate-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function HitDelegate() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(HitDelegate, Component);
    p.testHit = function(x, y) {};
    return HitDelegate;
});

define("wozlla/wozllajs/1.0.0/core/Mask-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Mask() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Mask, Component);
    p.clip = function(context) {
        throw new Error("abstract method");
    };
    return Mask;
});

define("wozlla/wozllajs/1.0.0/utils/createCanvas-debug", [], function() {
    return function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
});

define("wozlla/wozllajs/1.0.0/core/Filter-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Filter() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Filter, Component);
    p.applyFilter = function(cacheContext, x, y, width, height) {};
    return Filter;
});

define("wozlla/wozllajs/1.0.0/core/events/TouchEvent-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/events/Event-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Event = require("wozlla/wozllajs/1.0.0/events/Event-debug");
    var TouchEvent = function(param) {
        Event.apply(this, arguments);
        this.x = param.x;
        this.y = param.y;
        this.touch = param.touch;
    };
    TouchEvent.TOUCH_START = "touchstart";
    TouchEvent.TOUCH_END = "touchend";
    TouchEvent.TOUCH_MOVE = "touchmove";
    TouchEvent.CLICK = "click";
    Objects.inherits(TouchEvent, Event);
    return TouchEvent;
});

define("wozlla/wozllajs/1.0.0/core/Collider-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Component = require("wozlla/wozllajs/1.0.0/core/Component-debug");
    function Collider() {
        Component.apply(this, arguments);
    }
    var p = Objects.inherits(Collider, Component);
    return Collider;
});

define("wozlla/wozllajs/1.0.0/core/Engine-debug", [ "wozlla/wozllajs/1.0.0/utils/Tuple-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Stage-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/core/CachableGameObject-debug", "wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug", "wozlla/wozllajs/1.0.0/core/Filter-debug", "wozlla/wozllajs/1.0.0/core/Touch-debug", "wozlla/wozllajs/1.0.0/core/events/TouchEvent-debug" ], function(require) {
    var Tuple = require("wozlla/wozllajs/1.0.0/utils/Tuple-debug");
    var Time = require("wozlla/wozllajs/1.0.0/core/Time-debug");
    var Stage = require("wozlla/wozllajs/1.0.0/core/Stage-debug");
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(frameCall, intervalTime) {
        setTimeout(frameCall, intervalTime);
    };
    var ENGINE_EVENT_TYPE = "Engine";
    var engineEventListeners = new Tuple();
    var running = true;
    var frameTime;
    /**
     * 主循环中一帧
     */
    function frame() {
        if (!running) {
            Time.reset();
            return;
        }
        Time.update();
        fireEngineEvent();
        // is it good?
        Stage.root && Stage.root.tick();
        requestAnimationFrame(frame, frameTime);
    }
    function fireEngineEvent() {
        var i, len, listener, ret;
        var listeners = engineEventListeners.get(ENGINE_EVENT_TYPE);
        if (!listeners || listeners.length === 0) {
            return;
        }
        listeners = [].concat(listeners);
        for (i = 0, len = listeners.length; i < len; i++) {
            listener = listeners[i];
            listener.apply(listener, arguments);
        }
    }
    return {
        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener: function(listener) {
            engineEventListeners.push(ENGINE_EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener: function(listener) {
            engineEventListeners.remove(ENGINE_EVENT_TYPE, listener);
        },
        /**
         * 开始主循环或重新开始主循环
         */
        start: function(newFrameTime) {
            frameTime = newFrameTime || 10;
            running = true;
            requestAnimationFrame(frame, frameTime);
        },
        /**
         * 停止主循环
         */
        stop: function() {
            running = false;
        },
        /**
         * 运行一步
         */
        runStep: function() {
            Time.update();
            Time.delta = frameTime;
            fireEngineEvent();
        }
    };
});

define("wozlla/wozllajs/1.0.0/utils/Tuple-debug", [], function() {
    var Tuple = function() {
        this.data = {};
    };
    Tuple.prototype = {
        push: function(key, val) {
            this.data[key] = this.data[key] || [];
            this.data[key].push(val);
        },
        get: function(key) {
            if (key === undefined) {
                return this.data;
            }
            return this.data[key] || [];
        },
        sort: function(key, sorter) {
            this.data[key].sort(sorter);
            return this;
        },
        remove: function(key, val) {
            var idx, i, len;
            var array = this.data[key];
            if (!array) {
                return false;
            }
            for (i = 0, len = array.length; i < len; i++) {
                if (array[i] === val) {
                    idx = i;
                    break;
                }
            }
            if (idx !== undefined) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        clear: function(key) {
            if (key) {
                this.data[key] = undefined;
            } else {
                this.data = {};
            }
        }
    };
    return Tuple;
});

define("wozlla/wozllajs/1.0.0/core/Stage-debug", [ "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/math/Rectangle-debug", "wozlla/wozllajs/1.0.0/core/CachableGameObject-debug", "wozlla/wozllajs/1.0.0/core/UnityGameObject-debug", "wozlla/wozllajs/1.0.0/math/Matrix2D-debug", "wozlla/wozllajs/1.0.0/utils/Promise-debug", "wozlla/wozllajs/1.0.0/utils/Arrays-debug", "wozlla/wozllajs/1.0.0/core/AbstractGameObject-debug", "wozlla/wozllajs/1.0.0/utils/uniqueKey-debug", "wozlla/wozllajs/1.0.0/events/EventTarget-debug", "wozlla/wozllajs/1.0.0/events/Event-debug", "wozlla/wozllajs/1.0.0/core/events/GameObjectEvent-debug", "wozlla/wozllajs/1.0.0/core/Transform-debug", "wozlla/wozllajs/1.0.0/core/Component-debug", "wozlla/wozllajs/1.0.0/assets/loader-debug", "wozlla/wozllajs/1.0.0/utils/Strings-debug", "wozlla/wozllajs/1.0.0/utils/Ajax-debug", "wozlla/wozllajs/1.0.0/assets/AsyncImage-debug", "wozlla/wozllajs/1.0.0/assets/Texture-debug", "wozlla/wozllajs/1.0.0/core/Behaviour-debug", "wozlla/wozllajs/1.0.0/core/Animation-debug", "wozlla/wozllajs/1.0.0/core/Time-debug", "wozlla/wozllajs/1.0.0/core/Renderer-debug", "wozlla/wozllajs/1.0.0/core/Layout-debug", "wozlla/wozllajs/1.0.0/core/HitDelegate-debug", "wozlla/wozllajs/1.0.0/core/Mask-debug", "wozlla/wozllajs/1.0.0/utils/createCanvas-debug", "wozlla/wozllajs/1.0.0/core/Filter-debug", "wozlla/wozllajs/1.0.0/core/Touch-debug", "wozlla/wozllajs/1.0.0/core/events/TouchEvent-debug" ], function(require) {
    var Objects = require("wozlla/wozllajs/1.0.0/utils/Objects-debug");
    var Rectangle = require("wozlla/wozllajs/1.0.0/math/Rectangle-debug");
    var CachableGameObject = require("wozlla/wozllajs/1.0.0/core/CachableGameObject-debug");
    var Touch = require("wozlla/wozllajs/1.0.0/core/Touch-debug");
    var visibleRect = new Rectangle();
    var Stage = function(param) {
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
        this._width = param.width || param.canvas.width;
        this._height = param.height || param.canvas.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext("2d");
        Stage.root = this;
        Touch.init(this);
        this.init();
    };
    Stage.root = null;
    var p = Objects.inherits(Stage, CachableGameObject);
    p.isStage = true;
    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };
    p.draw = function() {
        this.autoClear && this.stageContext.clearRect(0, 0, this._width, this._height);
        CachableGameObject.prototype.draw.apply(this, [ this.stageContext, this.getVisibleRect() ]);
    };
    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this._width = width;
        this._height = height;
    };
    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this._width;
        visibleRect.height = this._height;
        return visibleRect;
    };
    return Stage;
});

define("wozlla/wozllajs/1.0.0/core/Touch-debug", [ "wozlla/wozllajs/1.0.0/core/events/TouchEvent-debug", "wozlla/wozllajs/1.0.0/utils/Objects-debug", "wozlla/wozllajs/1.0.0/events/Event-debug" ], function(require) {
    var TouchEvent = require("wozlla/wozllajs/1.0.0/core/events/TouchEvent-debug");
    var stage;
    var enabled = true;
    var touchstartTarget;
    var touchendTarget;
    var canvasOffsetCache;
    function getCanvasOffset() {
        if (canvasOffsetCache) return canvasOffsetCache;
        var obj = stage.stageCanvas;
        var offset = {
            x: obj.offsetLeft,
            y: obj.offsetTop
        };
        while (obj = obj.offsetParent) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        canvasOffsetCache = offset;
        return offset;
    }
    function onEvent(e) {
        if (!enabled) return;
        var canvasOffset, x, y, t;
        var type = e.type;
        var target;
        canvasOffset = getCanvasOffset();
        // mouse event
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        } else if (e.changedTouches) {
            t = e.changedTouches[0];
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }
        target = stage.getTopObjectUnderPoint(x, y, true);
        if (type === "mousedown" || type === TouchEvent.TOUCH_START) {
            type = TouchEvent.TOUCH_START;
            touchstartTarget = target;
            touchendTarget = null;
        } else if ((type === "mouseup" || type === TouchEvent.TOUCH_END) && touchstartTarget) {
            type = TouchEvent.TOUCH_END;
        } else if ((type === "mousemove" || type === TouchEvent.TOUCH_MOVE) && touchstartTarget) {
            type = TouchEvent.TOUCH_MOVE;
        }
        if (touchstartTarget) {
            touchstartTarget.dispatchEvent(new TouchEvent({
                type: type,
                x: x,
                y: y,
                bubbles: true,
                touch: target
            }));
            if (type === TouchEvent.TOUCH_END) {
                if (touchstartTarget && touchstartTarget === target) {
                    touchendTarget.dispatchEvent(new TouchEvent({
                        type: TouchEvent.CLICK,
                        x: x,
                        y: y,
                        bubbles: true,
                        touch: target
                    }));
                    touchstartTarget = null;
                    touchendTarget = null;
                }
            }
        }
    }
    return {
        init: function(theStage) {
            var canvas = theStage.stageCanvas;
            stage = theStage;
            if ("ontouchstart" in window) {
                canvas.addEventListener("touchstart", onEvent, false);
                canvas.addEventListener("touchend", onEvent, false);
                canvas.addEventListener("touchmove", onEvent, false);
            } else {
                var down = false;
                canvas.addEventListener("mousedown", function(e) {
                    down = true;
                    onEvent(e);
                }, false);
                canvas.addEventListener("mouseup", function(e) {
                    down = false;
                    onEvent(e);
                }, false);
                canvas.addEventListener("mousemove", function(e) {
                    if (down) {
                        onEvent(e);
                    }
                }, false);
            }
        },
        enable: function() {
            enabled = true;
        },
        disable: function() {
            enabled = false;
        }
    };
});
