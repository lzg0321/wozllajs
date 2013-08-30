/**!
 * @license PreloadJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011-2013 gskinner.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 **/this.createjs = this.createjs || {};
(function() {
    var Event = function(type, bubbles, cancelable) {
        this.initialize(type, bubbles, cancelable)
    };
    var p = Event.prototype;
    p.type = null;
    p.target = null;
    p.currentTarget = null;
    p.eventPhase = 0;
    p.bubbles = false;
    p.cancelable = false;
    p.timeStamp = 0;
    p.defaultPrevented = false;
    p.propagationStopped = false;
    p.immediatePropagationStopped = false;
    p.removed = false;
    p.initialize = function(type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = (new Date).getTime()
    };
    p.preventDefault = function() {
        this.defaultPrevented = true
    };
    p.stopPropagation = function() {
        this.propagationStopped = true
    };
    p.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = true
    };
    p.remove = function() {
        this.removed = true
    };
    p.clone = function() {
        return new Event(this.type, this.bubbles, this.cancelable)
    };
    p.toString = function() {
        return"[Event (type=" + this.type + ")]"
    };
    createjs.Event = Event
})();
this.createjs = this.createjs || {};
(function() {
    var EventDispatcher = function() {
        this.initialize()
    };
    var p = EventDispatcher.prototype;
    EventDispatcher.initialize = function(target) {
        target.addEventListener = p.addEventListener;
        target.on = p.on;
        target.removeEventListener = target.off = p.removeEventListener;
        target.removeAllEventListeners = p.removeAllEventListeners;
        target.hasEventListener = p.hasEventListener;
        target.dispatchEvent = p.dispatchEvent;
        target._dispatchEvent = p._dispatchEvent
    };
    p._listeners = null;
    p._captureListeners = null;
    p.initialize = function() {
    };
    p.addEventListener = function(type, listener, useCapture) {
        var listeners;
        if(useCapture) {
            listeners = this._captureListeners = this._captureListeners || {}
        }else {
            listeners = this._listeners = this._listeners || {}
        }
        var arr = listeners[type];
        if(arr) {
            this.removeEventListener(type, listener, useCapture)
        }
        arr = listeners[type];
        if(!arr) {
            listeners[type] = [listener]
        }else {
            arr.push(listener)
        }
        return listener
    };
    p.on = function(type, listener, scope, once, data, useCapture) {
        if(listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent
        }
        scope = scope || this;
        return this.addEventListener(type, function(evt) {
            listener.call(scope, evt, data);
            once && evt.remove()
        }, useCapture)
    };
    p.removeEventListener = function(type, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if(!listeners) {
            return
        }
        var arr = listeners[type];
        if(!arr) {
            return
        }
        for(var i = 0, l = arr.length;i < l;i++) {
            if(arr[i] == listener) {
                if(l == 1) {
                    delete listeners[type]
                }else {
                    arr.splice(i, 1)
                }
                break
            }
        }
    };
    p.off = p.removeEventListener;
    p.removeAllEventListeners = function(type) {
        if(!type) {
            this._listeners = this._captureListeners = null
        }else {
            if(this._listeners) {
                delete this._listeners[type]
            }
            if(this._captureListeners) {
                delete this._captureListeners[type]
            }
        }
    };
    p.dispatchEvent = function(eventObj, target) {
        if(typeof eventObj == "string") {
            var listeners = this._listeners;
            if(!listeners || !listeners[eventObj]) {
                return false
            }
            eventObj = new createjs.Event(eventObj)
        }
        eventObj.target = target || this;
        if(!eventObj.bubbles || !this.parent) {
            this._dispatchEvent(eventObj, 2)
        }else {
            var top = this, list = [top];
            while(top.parent) {
                list.push(top = top.parent)
            }
            var i, l = list.length;
            for(i = l - 1;i >= 0 && !eventObj.propagationStopped;i--) {
                list[i]._dispatchEvent(eventObj, 1 + (i == 0))
            }
            for(i = 1;i < l && !eventObj.propagationStopped;i++) {
                list[i]._dispatchEvent(eventObj, 3)
            }
        }
        return eventObj.defaultPrevented
    };
    p.hasEventListener = function(type) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return!!(listeners && listeners[type] || captureListeners && captureListeners[type])
    };
    p.toString = function() {
        return"[EventDispatcher]"
    };
    p._dispatchEvent = function(eventObj, eventPhase) {
        var l, listeners = eventPhase == 1 ? this._captureListeners : this._listeners;
        if(eventObj && listeners) {
            var arr = listeners[eventObj.type];
            if(!arr || !(l = arr.length)) {
                return
            }
            eventObj.currentTarget = this;
            eventObj.eventPhase = eventPhase;
            eventObj.removed = false;
            arr = arr.slice();
            for(var i = 0;i < l && !eventObj.immediatePropagationStopped;i++) {
                var o = arr[i];
                if(o.handleEvent) {
                    o.handleEvent(eventObj)
                }else {
                    o(eventObj)
                }
                if(eventObj.removed) {
                    this.off(eventObj.type, o, eventPhase == 1);
                    eventObj.removed = false
                }
            }
        }
    };
    createjs.EventDispatcher = EventDispatcher
})();
this.createjs = this.createjs || {};
(function() {
    createjs.indexOf = function(array, searchElement) {
        for(var i = 0, l = array.length;i < l;i++) {
            if(searchElement === array[i]) {
                return i
            }
        }
        return-1
    }
})();
this.createjs = this.createjs || {};
(function() {
    createjs.proxy = function(method, scope) {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function() {
            return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs))
        }
    }
})();
this.createjs = this.createjs || {};
(function() {
    var s = createjs.PreloadJS = createjs.PreloadJS || {};
    s.version = "NEXT";
    s.buildDate = "Fri, 30 Aug 2013 06:49:55 GMT"
})();
this.createjs = this.createjs || {};
(function() {
    var AbstractLoader = function() {
        this.init()
    };
    AbstractLoader.prototype = {};
    var p = AbstractLoader.prototype;
    var s = AbstractLoader;
    s.FILE_PATTERN = /^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/;
    p.loaded = false;
    p.canceled = false;
    p.progress = 0;
    p._item = null;
    p._basePath = null;
    p.addEventListener = null;
    p.removeEventListener = null;
    p.removeAllEventListeners = null;
    p.dispatchEvent = null;
    p.hasEventListener = null;
    p._listeners = null;
    createjs.EventDispatcher.initialize(p);
    p.getItem = function() {
        return this._item
    };
    p.init = function() {
    };
    p.load = function() {
    };
    p.close = function() {
    };
    p._sendLoadStart = function() {
        if(this._isCanceled()) {
            return
        }
        this.dispatchEvent("loadstart")
    };
    p._sendProgress = function(value) {
        if(this._isCanceled()) {
            return
        }
        var event = null;
        if(typeof value == "number") {
            this.progress = value;
            event = new createjs.Event("progress");
            event.loaded = this.progress;
            event.total = 1
        }else {
            event = value;
            this.progress = value.loaded / value.total;
            if(isNaN(this.progress) || this.progress == Infinity) {
                this.progress = 0
            }
        }
        event.progress = this.progress;
        this.hasEventListener("progress") && this.dispatchEvent(event)
    };
    p._sendComplete = function() {
        if(this._isCanceled()) {
            return
        }
        this.dispatchEvent("complete")
    };
    p._sendError = function(event) {
        if(this._isCanceled() || !this.hasEventListener("error")) {
            return
        }
        if(event == null) {
            event = new createjs.Event("error")
        }
        this.dispatchEvent(event)
    };
    p._isCanceled = function() {
        if(window.createjs == null || this.canceled) {
            return true
        }
        return false
    };
    p._parseURI = function(path) {
        if(!path) {
            return null
        }
        return path.match(s.FILE_PATTERN)
    };
    p._formatQueryString = function(data, query) {
        if(data == null) {
            throw new Error("You must specify data.");
        }
        var params = [];
        for(var n in data) {
            params.push(n + "=" + escape(data[n]))
        }
        if(query) {
            params = params.concat(query)
        }
        return params.join("&")
    };
    p.buildPath = function(src, _basePath, data) {
        if(_basePath != null) {
            var match = this._parseURI(src);
            if(match == null || match[1] == null || match[1] == "") {
                src = _basePath + src
            }
        }
        if(data == null) {
            return src
        }
        var query = [];
        var idx = createjs.indexOf(src, "?");
        if(idx != -1) {
            var q = src.slice(idx + 1);
            query = query.concat(q.split("&"))
        }
        if(idx != -1) {
            return src.slice(0, idx) + "?" + this._formatQueryString(data, query)
        }else {
            return src + "?" + this._formatQueryString(data, query)
        }
    };
    p.toString = function() {
        return"[PreloadJS AbstractLoader]"
    };
    createjs.AbstractLoader = AbstractLoader
})();
this.createjs = this.createjs || {};
(function() {
    var LoadQueue = function(useXHR, basePath) {
        this.init(useXHR, basePath)
    };
    var p = LoadQueue.prototype = new createjs.AbstractLoader;
    var s = LoadQueue;
    s.LOAD_TIMEOUT = 8E3;
    s.BINARY = "binary";
    s.CSS = "css";
    s.IMAGE = "image";
    s.JAVASCRIPT = "javascript";
    s.JSON = "json";
    s.JSONP = "jsonp";
    s.SOUND = "sound";
    s.SVG = "svg";
    s.TEXT = "text";
    s.XML = "xml";
    s.POST = "POST";
    s.GET = "GET";
    p.useXHR = true;
    p.stopOnError = false;
    p.maintainScriptOrder = true;
    p.next = null;
    p._typeCallbacks = null;
    p._extensionCallbacks = null;
    p._loadStartWasDispatched = false;
    p._maxConnections = 1;
    p._currentlyLoadingScript = null;
    p._currentLoads = null;
    p._loadQueue = null;
    p._loadQueueBackup = null;
    p._loadItemsById = null;
    p._loadItemsBySrc = null;
    p._loadedResults = null;
    p._loadedRawResults = null;
    p._numItems = 0;
    p._numItemsLoaded = 0;
    p._scriptOrder = null;
    p._loadedScripts = null;
    p.init = function(useXHR, basePath) {
        this._numItems = this._numItemsLoaded = 0;
        this._paused = false;
        this._loadStartWasDispatched = false;
        this._currentLoads = [];
        this._loadQueue = [];
        this._loadQueueBackup = [];
        this._scriptOrder = [];
        this._loadedScripts = [];
        this._loadItemsById = {};
        this._loadItemsBySrc = {};
        this._loadedResults = {};
        this._loadedRawResults = {};
        this._typeCallbacks = {};
        this._extensionCallbacks = {};
        this._basePath = basePath;
        this.setUseXHR(useXHR)
    };
    p.setUseXHR = function(value) {
        this.useXHR = value != false && window.XMLHttpRequest != null;
        return this.useXHR
    };
    p.removeAll = function() {
        this.remove()
    };
    p.remove = function(idsOrUrls) {
        var args = null;
        if(idsOrUrls && !(idsOrUrls instanceof Array)) {
            args = [idsOrUrls]
        }else {
            if(idsOrUrls) {
                args = idsOrUrls
            }else {
                if(arguments.length > 0) {
                    return
                }
            }
        }
        var itemsWereRemoved = false;
        if(!args) {
            this.close();
            for(var n in this._loadItemsById) {
                this._disposeItem(this._loadItemsById[n])
            }
            this.init(this.useXHR)
        }else {
            while(args.length) {
                var item = args.pop();
                var r = this.getResult(item);
                for(i = this._loadQueue.length - 1;i >= 0;i--) {
                    loadItem = this._loadQueue[i].getItem();
                    if(loadItem.id == item || loadItem.src == item) {
                        this._loadQueue.splice(i, 1)[0].cancel();
                        break
                    }
                }
                for(i = this._loadQueueBackup.length - 1;i >= 0;i--) {
                    loadItem = this._loadQueueBackup[i].getItem();
                    if(loadItem.id == item || loadItem.src == item) {
                        this._loadQueueBackup.splice(i, 1)[0].cancel();
                        break
                    }
                }
                if(r) {
                    delete this._loadItemsById[r.id];
                    delete this._loadItemsBySrc[r.src];
                    this._disposeItem(r)
                }else {
                    for(var i = this._currentLoads.length - 1;i >= 0;i--) {
                        var loadItem = this._currentLoads[i].getItem();
                        if(loadItem.id == item || loadItem.src == item) {
                            this._currentLoads.splice(i, 1)[0].cancel();
                            itemsWereRemoved = true;
                            break
                        }
                    }
                }
            }
            if(itemsWereRemoved) {
                this._loadNext()
            }
        }
    };
    p.reset = function() {
        this.close();
        for(var n in this._loadItemsById) {
            this._disposeItem(this._loadItemsById[n])
        }
        var a = [];
        for(i = 0, l = this._loadQueueBackup.length;i < l;i++) {
            a.push(this._loadQueueBackup[i].getItem())
        }
        this.loadManifest(a, false)
    };
    s.isBinary = function(type) {
        switch(type) {
            case createjs.LoadQueue.IMAGE:
                ;
            case createjs.LoadQueue.BINARY:
                return true;
            default:
                return false
        }
    };
    p.installPlugin = function(plugin) {
        if(plugin == null || plugin.getPreloadHandlers == null) {
            return
        }
        var map = plugin.getPreloadHandlers();
        if(map.types != null) {
            for(var i = 0, l = map.types.length;i < l;i++) {
                this._typeCallbacks[map.types[i]] = map.callback
            }
        }
        if(map.extensions != null) {
            for(i = 0, l = map.extensions.length;i < l;i++) {
                this._extensionCallbacks[map.extensions[i]] = map.callback
            }
        }
    };
    p.setMaxConnections = function(value) {
        this._maxConnections = value;
        if(!this._paused && this._loadQueue.length > 0) {
            this._loadNext()
        }
    };
    p.loadFile = function(file, loadNow, basePath) {
        if(file == null) {
            var event = new createjs.Event("error");
            event.text = "PRELOAD_NO_FILE";
            this._sendError(event);
            return
        }
        this._addItem(file, basePath);
        if(loadNow !== false) {
            this.setPaused(false)
        }else {
            this.setPaused(true)
        }
    };
    p.loadManifest = function(manifest, loadNow, basePath) {
        var data = null;
        if(manifest instanceof Array) {
            if(manifest.length == 0) {
                var event = new createjs.Event("error");
                event.text = "PRELOAD_MANIFEST_EMPTY";
                this._sendError(event);
                return
            }
            data = manifest
        }else {
            if(manifest == null) {
                var event = new createjs.Event("error");
                event.text = "PRELOAD_MANIFEST_NULL";
                this._sendError(event);
                return
            }
            data = [manifest]
        }
        for(var i = 0, l = data.length;i < l;i++) {
            this._addItem(data[i], basePath)
        }
        if(loadNow !== false) {
            this.setPaused(false)
        }else {
            this.setPaused(true)
        }
    };
    p.load = function() {
        this.setPaused(false)
    };
    p.getItem = function(value) {
        return this._loadItemsById[value] || this._loadItemsBySrc[value]
    };
    p.getResult = function(value, rawResult) {
        var item = this._loadItemsById[value] || this._loadItemsBySrc[value];
        if(item == null) {
            return null
        }
        var id = item.id;
        if(rawResult && this._loadedRawResults[id]) {
            return this._loadedRawResults[id]
        }
        return this._loadedResults[id]
    };
    p.setPaused = function(value) {
        this._paused = value;
        if(!this._paused) {
            this._loadNext()
        }
    };
    p.close = function() {
        while(this._currentLoads.length) {
            this._currentLoads.pop().cancel()
        }
        this._scriptOrder.length = 0;
        this._loadedScripts.length = 0;
        this.loadStartWasDispatched = false
    };
    p._addItem = function(value, basePath) {
        var item = this._createLoadItem(value);
        if(item == null) {
            return
        }
        var loader = this._createLoader(item, basePath);
        if(loader != null) {
            this._loadQueue.push(loader);
            this._loadQueueBackup.push(loader);
            this._numItems++;
            this._updateProgress();
            if(this.maintainScriptOrder && item.type == createjs.LoadQueue.JAVASCRIPT && loader instanceof createjs.XHRLoader) {
                this._scriptOrder.push(item);
                this._loadedScripts.push(null)
            }
        }
    };
    p._createLoadItem = function(value) {
        var item = null;
        switch(typeof value) {
            case "string":
                item = {src:value};
                break;
            case "object":
                if(window.HTMLAudioElement && value instanceof HTMLAudioElement) {
                    item = {tag:value, src:item.tag.src, type:createjs.LoadQueue.SOUND}
                }else {
                    item = value
                }
                break;
            default:
                return null
        }
        var match = this._parseURI(item.src);
        if(match != null) {
            item.ext = match[5]
        }
        if(item.type == null) {
            item.type = this._getTypeByExtension(item.ext)
        }
        if(item.type == createjs.LoadQueue.JSON && item.callback != null) {
            item.type = createjs.LoadQueue.JSONP
        }
        if(item.type == createjs.LoadQueue.JSONP && item.callback == null) {
            throw new Error("callback is required for loading JSONP requests.");
        }
        if(item.tag == null) {
            item.tag = this._createTag(item.type)
        }
        if(item.id == null || item.id == "") {
            item.id = item.src
        }
        var customHandler = this._typeCallbacks[item.type] || this._extensionCallbacks[item.ext];
        if(customHandler) {
            var result = customHandler(item.src, item.type, item.id, item.data);
            if(result === false) {
                return null
            }else {
                if(result === true) {
                }else {
                    if(result.src != null) {
                        item.src = result.src
                    }
                    if(result.id != null) {
                        item.id = result.id
                    }
                    if(result.tag != null && result.tag.load instanceof Function) {
                        item.tag = result.tag
                    }
                    if(result.completeHandler != null) {
                        item.completeHandler = result.completeHandler
                    }
                }
            }
            if(result.type) {
                item.type = result.type
            }
            match = this._parseURI(item.src);
            if(match != null && match[5] != null) {
                item.ext = match[5].toLowerCase()
            }
        }
        this._loadItemsById[item.id] = item;
        this._loadItemsBySrc[item.src] = item;
        return item
    };
    p._createLoader = function(item, basePath) {
        var useXHR = this.useXHR;
        switch(item.type) {
            case createjs.LoadQueue.JSON:
                ;
            case createjs.LoadQueue.XML:
                ;
            case createjs.LoadQueue.TEXT:
                useXHR = true;
                break;
            case createjs.LoadQueue.SOUND:
                ;
            case createjs.LoadQueue.JSONP:
                useXHR = false;
                break;
            case null:
                return null
        }
        if(basePath == null) {
            basePath = this._basePath
        }
        if(useXHR) {
            return new createjs.XHRLoader(item, basePath)
        }else {
            return new createjs.TagLoader(item, basePath)
        }
    };
    p._loadNext = function() {
        if(this._paused) {
            return
        }
        if(!this._loadStartWasDispatched) {
            this._sendLoadStart();
            this._loadStartWasDispatched = true
        }
        if(this._numItems == this._numItemsLoaded) {
            this.loaded = true;
            this._sendComplete();
            if(this.next && this.next.load) {
                this.next.load()
            }
        }else {
            this.loaded = false
        }
        for(var i = 0;i < this._loadQueue.length;i++) {
            if(this._currentLoads.length >= this._maxConnections) {
                break
            }
            var loader = this._loadQueue[i];
            if(this.maintainScriptOrder && loader instanceof createjs.TagLoader && loader.getItem().type == createjs.LoadQueue.JAVASCRIPT) {
                if(this._currentlyLoadingScript) {
                    continue
                }
                this._currentlyLoadingScript = true
            }
            this._loadQueue.splice(i, 1);
            i--;
            this._loadItem(loader)
        }
    };
    p._loadItem = function(loader) {
        loader.addEventListener("progress", createjs.proxy(this._handleProgress, this));
        loader.addEventListener("complete", createjs.proxy(this._handleFileComplete, this));
        loader.addEventListener("error", createjs.proxy(this._handleFileError, this));
        this._currentLoads.push(loader);
        this._sendFileStart(loader.getItem());
        loader.load()
    };
    p._handleFileError = function(event) {
        var loader = event.target;
        this._numItemsLoaded++;
        this._updateProgress();
        var event = new createjs.Event("error");
        event.text = "FILE_LOAD_ERROR";
        event.item = loader.getItem();
        this._sendError(event);
        if(!this.stopOnError) {
            this._removeLoadItem(loader);
            this._loadNext()
        }
    };
    p._handleFileComplete = function(event) {
        var loader = event.target;
        var item = loader.getItem();
        this._loadedResults[item.id] = loader.getResult();
        if(loader instanceof createjs.XHRLoader) {
            this._loadedRawResults[item.id] = loader.getResult(true)
        }
        this._removeLoadItem(loader);
        if(this.maintainScriptOrder && item.type == createjs.LoadQueue.JAVASCRIPT) {
            if(loader instanceof createjs.TagLoader) {
                this._currentlyLoadingScript = false
            }else {
                this._loadedScripts[createjs.indexOf(this._scriptOrder, item)] = item;
                this._checkScriptLoadOrder(loader);
                return
            }
        }
        this._processFinishedLoad(item, loader)
    };
    p._processFinishedLoad = function(item, loader) {
        this._numItemsLoaded++;
        this._updateProgress();
        this._sendFileComplete(item, loader);
        this._loadNext()
    };
    p._checkScriptLoadOrder = function() {
        var l = this._loadedScripts.length;
        for(var i = 0;i < l;i++) {
            var item = this._loadedScripts[i];
            if(item === null) {
                break
            }
            if(item === true) {
                continue
            }
            this._processFinishedLoad(item);
            this._loadedScripts[i] = true;
            i--;
            l--
        }
    };
    p._removeLoadItem = function(loader) {
        var l = this._currentLoads.length;
        for(var i = 0;i < l;i++) {
            if(this._currentLoads[i] == loader) {
                this._currentLoads.splice(i, 1);
                break
            }
        }
    };
    p._handleProgress = function(event) {
        var loader = event.target;
        this._sendFileProgress(loader.getItem(), loader.progress);
        this._updateProgress()
    };
    p._updateProgress = function() {
        var loaded = this._numItemsLoaded / this._numItems;
        var remaining = this._numItems - this._numItemsLoaded;
        if(remaining > 0) {
            var chunk = 0;
            for(var i = 0, l = this._currentLoads.length;i < l;i++) {
                chunk += this._currentLoads[i].progress
            }
            loaded += chunk / remaining * (remaining / this._numItems)
        }
        this._sendProgress(loaded)
    };
    p._disposeItem = function(item) {
        delete this._loadedResults[item.id];
        delete this._loadedRawResults[item.id];
        delete this._loadItemsById[item.id];
        delete this._loadItemsBySrc[item.src]
    };
    p._createTag = function(type) {
        var tag = null;
        switch(type) {
            case createjs.LoadQueue.IMAGE:
                return document.createElement("img");
            case createjs.LoadQueue.SOUND:
                tag = document.createElement("audio");
                tag.autoplay = false;
                return tag;
            case createjs.LoadQueue.JSONP:
                ;
            case createjs.LoadQueue.JAVASCRIPT:
                tag = document.createElement("script");
                tag.type = "text/javascript";
                return tag;
            case createjs.LoadQueue.CSS:
                if(this.useXHR) {
                    tag = document.createElement("style")
                }else {
                    tag = document.createElement("link")
                }
                tag.rel = "stylesheet";
                tag.type = "text/css";
                return tag;
            case createjs.LoadQueue.SVG:
                if(this.useXHR) {
                    tag = document.createElement("svg")
                }else {
                    tag = document.createElement("object");
                    tag.type = "image/svg+xml"
                }
                return tag
        }
        return null
    };
    p._getTypeByExtension = function(extension) {
        if(extension == null) {
            return createjs.LoadQueue.TEXT
        }
        switch(extension.toLowerCase()) {
            case "jpeg":
                ;
            case "jpg":
                ;
            case "gif":
                ;
            case "png":
                ;
            case "webp":
                ;
            case "bmp":
                return createjs.LoadQueue.IMAGE;
            case "ogg":
                ;
            case "mp3":
                ;
            case "wav":
                return createjs.LoadQueue.SOUND;
            case "json":
                return createjs.LoadQueue.JSON;
            case "xml":
                return createjs.LoadQueue.XML;
            case "css":
                return createjs.LoadQueue.CSS;
            case "js":
                return createjs.LoadQueue.JAVASCRIPT;
            case "svg":
                return createjs.LoadQueue.SVG;
            default:
                return createjs.LoadQueue.TEXT
        }
    };
    p._sendFileProgress = function(item, progress) {
        if(this._isCanceled()) {
            this._cleanUp();
            return
        }
        if(!this.hasEventListener("fileprogress")) {
            return
        }
        var event = new createjs.Event("fileprogress");
        event.progress = progress;
        event.loaded = progress;
        event.total = 1;
        event.item = item;
        this.dispatchEvent(event)
    };
    p._sendFileComplete = function(item, loader) {
        if(this._isCanceled()) {
            return
        }
        var event = new createjs.Event("fileload");
        event.loader = loader;
        event.item = item;
        event.result = this._loadedResults[item.id];
        event.rawResult = this._loadedRawResults[item.id];
        if(item.completeHandler) {
            item.completeHandler(event)
        }
        this.hasEventListener("fileload") && this.dispatchEvent(event)
    };
    p._sendFileStart = function(item) {
        var event = new createjs.Event("filestart");
        event.item = item;
        this.hasEventListener("filestart") && this.dispatchEvent(event)
    };
    p.toString = function() {
        return"[PreloadJS LoadQueue]"
    };
    createjs.LoadQueue = LoadQueue;
    var BrowserDetect = function() {
    };
    BrowserDetect.init = function() {
        var agent = navigator.userAgent;
        BrowserDetect.isFirefox = createjs.indexOf(agent, "Firefox") > -1;
        BrowserDetect.isOpera = window.opera != null;
        BrowserDetect.isChrome = createjs.indexOf(agent, "Chrome") > -1;
        BrowserDetect.isIOS = createjs.indexOf(agent, "iPod") > -1 || createjs.indexOf(agent, "iPhone") > -1 || createjs.indexOf(agent, "iPad") > -1
    };
    BrowserDetect.init();
    createjs.LoadQueue.BrowserDetect = BrowserDetect
})();
this.createjs = this.createjs || {};
(function() {
    var TagLoader = function(item, basePath) {
        this.init(item, basePath)
    };
    var p = TagLoader.prototype = new createjs.AbstractLoader;
    p._loadTimeout = null;
    p._tagCompleteProxy = null;
    p._isAudio = false;
    p._tag = null;
    p._jsonResult = null;
    p.init = function(item, basePath) {
        this._item = item;
        this._basePath = basePath;
        this._tag = item.tag;
        this._isAudio = window.HTMLAudioElement && item.tag instanceof HTMLAudioElement;
        this._tagCompleteProxy = createjs.proxy(this._handleLoad, this)
    };
    p.getResult = function() {
        if(this._item.type == createjs.LoadQueue.JSONP) {
            return this._jsonResult
        }else {
            return this._tag
        }
    };
    p.cancel = function() {
        this.canceled = true;
        this._clean();
        var item = this.getItem()
    };
    p.load = function() {
        var item = this._item;
        var tag = this._tag;
        clearTimeout(this._loadTimeout);
        this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), createjs.LoadQueue.LOAD_TIMEOUT);
        if(this._isAudio) {
            tag.src = null;
            tag.preload = "auto"
        }
        tag.onerror = createjs.proxy(this._handleError, this);
        if(this._isAudio) {
            tag.onstalled = createjs.proxy(this._handleStalled, this);
            tag.addEventListener("canplaythrough", this._tagCompleteProxy, false)
        }else {
            tag.onload = createjs.proxy(this._handleLoad, this);
            tag.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this)
        }
        var src = this.buildPath(item.src, this._basePath, item.values);
        switch(item.type) {
            case createjs.LoadQueue.CSS:
                tag.href = src;
                break;
            case createjs.LoadQueue.SVG:
                tag.data = src;
                break;
            default:
                tag.src = src
        }
        if(item.type == createjs.LoadQueue.JSONP) {
            if(item.callback == null) {
                throw new Error("callback is required for loading JSONP requests.");
            }
            if(window[item.callback] != null) {
                throw new Error('JSONP callback "' + item.callback + '" already exists on window. You need to specify a different callback. Or re-name the current one.');
            }
            window[item.callback] = createjs.proxy(this._handleJSONPLoad, this)
        }
        if(item.type == createjs.LoadQueue.SVG || item.type == createjs.LoadQueue.JSONP || item.type == createjs.LoadQueue.JSON || item.type == createjs.LoadQueue.JAVASCRIPT || item.type == createjs.LoadQueue.CSS) {
            this._startTagVisibility = tag.style.visibility;
            tag.style.visibility = "hidden";
            (document.body || document.getElementsByTagName("body")[0]).appendChild(tag)
        }
        if(tag.load != null) {
            tag.load()
        }
    };
    p._handleJSONPLoad = function(data) {
        this._jsonResult = data
    };
    p._handleTimeout = function() {
        this._clean();
        var event = new createjs.Event("error");
        event.text = "PRELOAD_TIMEOUT";
        this._sendError(event)
    };
    p._handleStalled = function() {
    };
    p._handleError = function(event) {
        this._clean();
        var newEvent = new createjs.Event("error");
        this._sendError(newEvent)
    };
    p._handleReadyStateChange = function() {
        clearTimeout(this._loadTimeout);
        var tag = this.getItem().tag;
        if(tag.readyState == "loaded" || tag.readyState == "complete") {
            this._handleLoad()
        }
    };
    p._handleLoad = function(event) {
        if(this._isCanceled()) {
            return
        }
        var item = this.getItem();
        var tag = item.tag;
        if(this.loaded || this.isAudio && tag.readyState !== 4) {
            return
        }
        this.loaded = true;
        switch(item.type) {
            case createjs.LoadQueue.SVG:
                ;
            case createjs.LoadQueue.JSONP:
                tag.style.visibility = this._startTagVisibility;
                (document.body || document.getElementsByTagName("body")[0]).removeChild(tag);
                break;
            default:
        }
        this._clean();
        this._sendComplete()
    };
    p._clean = function() {
        clearTimeout(this._loadTimeout);
        var tag = this.getItem().tag;
        tag.onload = null;
        tag.removeEventListener && tag.removeEventListener("canplaythrough", this._tagCompleteProxy, false);
        tag.onstalled = null;
        tag.onprogress = null;
        tag.onerror = null;
        if(tag.parentNode) {
            tag.parentNode.removeChild(tag)
        }
        var item = this.getItem();
        if(item.type == createjs.LoadQueue.JSONP) {
            window[item.callback] = null
        }
    };
    p.toString = function() {
        return"[PreloadJS TagLoader]"
    };
    createjs.TagLoader = TagLoader
})();
this.createjs = this.createjs || {};
(function() {
    var XHRLoader = function(item, basePath) {
        this.init(item, basePath)
    };
    var p = XHRLoader.prototype = new createjs.AbstractLoader;
    p._request = null;
    p._loadTimeout = null;
    p._xhrLevel = 1;
    p._response = null;
    p._rawResponse = null;
    p.init = function(item, basePath) {
        this._item = item;
        this._basePath = basePath;
        if(!this._createXHR(item)) {
        }
    };
    p.getResult = function(rawResult) {
        if(rawResult && this._rawResponse) {
            return this._rawResponse
        }
        return this._response
    };
    p.cancel = function() {
        this.canceled = true;
        this._clean();
        this._request.abort()
    };
    p.load = function() {
        if(this._request == null) {
            this._handleError();
            return
        }
        this._request.onloadstart = createjs.proxy(this._handleLoadStart, this);
        this._request.onprogress = createjs.proxy(this._handleProgress, this);
        this._request.onabort = createjs.proxy(this._handleAbort, this);
        this._request.onerror = createjs.proxy(this._handleError, this);
        this._request.ontimeout = createjs.proxy(this._handleTimeout, this);
        if(this._xhrLevel == 1) {
            this._loadTimeout = setTimeout(createjs.proxy(this._handleTimeout, this), createjs.LoadQueue.LOAD_TIMEOUT)
        }
        this._request.onload = createjs.proxy(this._handleLoad, this);
        this._request.onreadystatechange = createjs.proxy(this._handleReadyStateChange, this);
        try {
            if(!this._item.values || this._item.method == createjs.LoadQueue.GET) {
                this._request.send()
            }else {
                if(this._item.method == createjs.LoadQueue.POST) {
                    this._request.send(this._formatQueryString(this._item.values))
                }
            }
        }catch(error) {
            var event = new createjs.Event("error");
            event.error = error;
            this._sendError(event)
        }
    };
    p.getAllResponseHeaders = function() {
        if(this._request.getAllResponseHeaders instanceof Function) {
            return this._request.getAllResponseHeaders()
        }else {
            return null
        }
    };
    p.getResponseHeader = function(header) {
        if(this._request.getResponseHeader instanceof Function) {
            return this._request.getResponseHeader(header)
        }else {
            return null
        }
    };
    p._handleProgress = function(event) {
        if(!event || event.loaded > 0 && event.total == 0) {
            return
        }
        var newEvent = new createjs.Event("progress");
        newEvent.loaded = event.loaded;
        newEvent.total = event.total;
        this._sendProgress(newEvent)
    };
    p._handleLoadStart = function(event) {
        clearTimeout(this._loadTimeout);
        this._sendLoadStart()
    };
    p._handleAbort = function(event) {
        this._clean();
        var event = new createjs.Event("error");
        event.text = "XHR_ABORTED";
        this._sendError(event)
    };
    p._handleError = function(event) {
        this._clean();
        var newEvent = new createjs.Event("error");
        this._sendError(newEvent)
    };
    p._handleReadyStateChange = function(event) {
        if(this._request.readyState == 4) {
            this._handleLoad()
        }
    };
    p._handleLoad = function(event) {
        if(this.loaded) {
            return
        }
        this.loaded = true;
        if(!this._checkError()) {
            this._handleError();
            return
        }
        this._response = this._getResponse();
        this._clean();
        var isComplete = this._generateTag();
        if(isComplete) {
            this._sendComplete()
        }
    };
    p._handleTimeout = function(event) {
        this._clean();
        var newEvent = new createjs.Event("error");
        newEvent.text = "PRELOAD_TIMEOUT";
        this._sendError(event)
    };
    p._checkError = function() {
        var status = parseInt(this._request.status);
        switch(status) {
            case 404:
                return false;
            break;
            case 0:
                return true
            break;
        }
        return true
    };
    p._getResponse = function() {
        if(this._response != null) {
            return this._response
        }
        if(this._request.response != null) {
            return this._request.response
        }
        try {
            if(this._request.responseText != null) {
                return this._request.responseText
            }
        }catch(e) {
        }
        try {
            if(this._request.responseXML != null) {
                return this._request.responseXML
            }
        }catch(e) {
        }
        return null
    };
    p._createXHR = function(item) {
        var target = document.createElement("a");
        target.href = this.buildPath(item.src, this._basePath);
        var host = document.createElement("a");
        host.href = location.href;
        var crossdomain = target.hostname != "" && (target.port != host.port || target.protocol != host.protocol || target.hostname != host.hostname);
        var req = null;
        if(crossdomain && window.XDomainRequest) {
            req = new XDomainRequest
        }else {
            if(window.XMLHttpRequest) {
                req = new XMLHttpRequest
            }else {
                try {
                    req = new ActiveXObject("Msxml2.XMLHTTP.6.0")
                }catch(e) {
                    try {
                        req = new ActiveXObject("Msxml2.XMLHTTP.3.0")
                    }catch(e) {
                        try {
                            req = new ActiveXObject("Msxml2.XMLHTTP")
                        }catch(e) {
                            return false
                        }
                    }
                }
            }
        }
        if(item.type == createjs.LoadQueue.TEXT && req.overrideMimeType) {
            req.overrideMimeType("text/plain; charset=x-user-defined")
        }
        this._xhrLevel = typeof req.responseType === "string" ? 2 : 1;
        var src = null;
        if(item.method == createjs.LoadQueue.GET) {
            src = this.buildPath(item.src, this._basePath, item.values)
        }else {
            src = this.buildPath(item.src, this._basePath)
        }
        req.open(item.method || createjs.LoadQueue.GET, src, true);
        if(crossdomain && req instanceof XMLHttpRequest && this._xhrLevel == 1) {
            req.setRequestHeader("Origin", location.origin)
        }
        if(item.values && item.method == createjs.LoadQueue.POST) {
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }
        if(createjs.LoadQueue.isBinary(item.type)) {
            req.responseType = "arraybuffer"
        }
        this._request = req;
        return true
    };
    p._clean = function() {
        clearTimeout(this._loadTimeout);
        var req = this._request;
        req.onloadstart = null;
        req.onprogress = null;
        req.onabort = null;
        req.onerror = null;
        req.onload = null;
        req.ontimeout = null;
        req.onloadend = null;
        req.onreadystatechange = null
    };
    p._generateTag = function() {
        var type = this._item.type;
        var tag = this._item.tag;
        switch(type) {
            case createjs.LoadQueue.IMAGE:
                tag.onload = createjs.proxy(this._handleTagReady, this);
                tag.src = this.buildPath(this._item.src, this._basePath, this._item.values);
                this._rawResponse = this._response;
                this._response = tag;
                return false;
            case createjs.LoadQueue.JAVASCRIPT:
                tag = document.createElement("script");
                tag.text = this._response;
                this._rawResponse = this._response;
                this._response = tag;
                return true;
            case createjs.LoadQueue.CSS:
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(tag);
                if(tag.styleSheet) {
                    tag.styleSheet.cssText = this._response
                }else {
                    var textNode = document.createTextNode(this._response);
                    tag.appendChild(textNode)
                }
                this._rawResponse = this._response;
                this._response = tag;
                return true;
            case createjs.LoadQueue.XML:
                var xml = this._parseXML(this._response, "text/xml");
                this._response = xml;
                return true;
            case createjs.LoadQueue.SVG:
                var xml = this._parseXML(this._response, "image/svg+xml");
                this._rawResponse = this._response;
                if(xml.documentElement != null) {
                    tag.appendChild(xml.documentElement);
                    this._response = tag
                }else {
                    this._response = xml
                }
                return true;
            case createjs.LoadQueue.JSON:
                var json = {};
                try {
                    json = JSON.parse(this._response)
                }catch(error) {
                    json = error
                }
                this._rawResponse = this._response;
                this._response = json;
                return true
        }
        return true
    };
    p._parseXML = function(text, type) {
        var xml = null;
        if(window.DOMParser) {
            var parser = new DOMParser;
            xml = parser.parseFromString(text, type)
        }else {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(text)
        }
        return xml
    };
    p._handleTagReady = function() {
        this._sendComplete()
    };
    p.toString = function() {
        return"[PreloadJS XHRLoader]"
    };
    createjs.XHRLoader = XHRLoader
})();
if(typeof JSON !== "object") {
    JSON = {}
}
(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if(typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\u0008":"\\b", "\t":"\\t", "\n":"\\n", "\u000c":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if(value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if(typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch(typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
                ;
            case "null":
                return String(value);
            case "object":
                if(!value) {
                    return"null"
                }
                gap += indent;
                partial = [];
                if(Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for(i = 0;i < length;i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if(rep && typeof rep === "object") {
                    length = rep.length;
                    for(i = 0;i < length;i += 1) {
                        if(typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }else {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if(typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if(typeof space === "number") {
                for(i = 0;i < space;i += 1) {
                    indent += " "
                }
            }else {
                if(typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if(replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }
            return str("", {"":value})
        }
    }
    if(typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if(value && typeof value === "object") {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if(v !== undefined) {
                                value[k] = v
                            }else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if(cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"":j}, "") : j
            }
            throw new SyntaxError("JSON.parse");
        }
    }
})();

