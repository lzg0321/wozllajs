
define('var/isArray',[],function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        return toString.call(testObj) === '[object Array]';
    };

});
define('var/isImage',[],function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        var str = toString.call(testObj);
        return str === '[object Image]' || str === '[object HTMLImageElement]';
    };

});
define('var/extend',[],function() {

    return function(theClass, superClass) {
        var funcName,
            theClassProto = theClass.prototype,
            newClassProto = Object.create(superClass.prototype);
        for(funcName in theClassProto) {
            if(theClassProto.hasOwnProperty(funcName)) {
                newClassProto[funcName] = theClassProto[funcName];
            }
        }
        theClass.prototype = newClassProto;
    };

});
define('var/uniqueKey',[],function() {

    var uniqueKeyIncrementor = 1;

    return function() {
        return uniqueKeyIncrementor++;
    };
});
define('var/slice',[],function() {

    return function(argsObj) {
        var ags = Array.prototype.slice.apply(arguments, [1]);
        return Array.prototype.slice.apply(argsObj, ags);
    };

});
define('var/createCanvas',[],function() {

    return function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

});
define('var/support',[],function() {

    return {
        touch : 'ontouchstart' in window
    }
});
define('globals',[],function() {

    return {
        METHOD_UPDATE : 'update',
        METHOD_LATE_UPDATE : 'lateUpdate',
        METHOD_DRAW : 'draw',
        METHOD_INIT_COMPONENT : 'initComponent',
        METHOD_DESTROY_COMPONENT : 'destroyComponent'
    }
});
define('wozllajs',[
    './var/isArray',
    './var/isImage',
    './var/extend',
    './var/uniqueKey',
    './var/slice',
    './var/createCanvas',
    './var/support',
    './globals'
], function(isArray, isImage,  extend, uniqueKey, slice, createCanvas, support, globals) {

    var wozllajs = {
        isArray : isArray,
        isImage : isImage,
        extend : extend,
        uniqueKey : uniqueKey,
        slice : slice,
        createCanvas : createCanvas,
        support : support
    };

    for(var i in globals) {
        wozllajs[i] = globals[i];
    }

    return window.wozllajs = wozllajs;
});

define('promise',[
    './wozllajs'
], function(W){

    var Promise = function() {
        this._thenQueue = [];
        this._errorQueue = [];
    };

    Promise.wait = function(promises) {
        var i, len;
        var p = new Promise();
        var doneNum = 0;
        var result = [];
        if(arguments.length === 1) {
            if(!W.isArray(promises)) {
                promises = [promises];
            }
        } else {
            promises = W.slice(arguments);
        }
        for(i=0,len=promises.length; i<len; i++) {
            (function(idx, promiseLen) {
                promises[idx].then(function(r) {
                    doneNum ++;
                    r = arguments.length > 1 ? W.slice(arguments) : r;
                    result[idx] = r;
                    if(doneNum === promiseLen) {
                        p.done.apply(p, result);
                    }
                    return r;
                });
            })(i, len);
        }
        return p;
    };

    var p = Promise.prototype;

    p.then = function(callback, context) {
        this._thenQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.catchError = function(callback, context) {
        this._errorQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.done = function() {
        this._nextThen.apply(this, arguments);
        return this;
    };

    p.sendError = function(error) {
        this._nextError(error);
        return this;
    };

    p._nextThen = function() {
        var then = this._thenQueue.shift();
        if(then) {
            var args = then.callback.apply(then.context || this, arguments);
            args = W.isArray(args) ? args : [args];
            this._nextThen.apply(this, args);
        }
    };

    p._nextError = function() {
        var error = this._errorQueue.shift();
        if(error) {
            var args = error.callback.apply(error.context || this, arguments);
            args = W.isArray(args) ? args : [args];
            this._nextError.apply(this, args);
        }
    };

    return Promise;

});
define('util/Tuple',[],function() {

    var Tuple = function() {
        this.data = {};
    };

    Tuple.prototype = {
        push : function(key, val) {
            this.data[key] = this.data[key] || [];
            this.data[key].push(val);
        },
        get : function(key) {
            if(key === undefined) {
                return this.data;
            }
            return this.data[key] || [];
        },
        sort : function(key, sorter) {
            this.data[key].sort(sorter);
            return this;
        },
        remove : function(key, val) {
            var idx, i, len;
            var array = this.data[key];
            if(!array) {
                return false;
            }
            for(i=0,len=array.length; i<len; i++) {
                if(array[i] === val) {
                    idx = i;
                    break;
                }
            }
            if(idx !== undefined) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        clear : function(key) {
            if(key) {
                this.data[key] = undefined;
            } else {
                this.data = {};
            }
        }
    };

    return Tuple;

});
define('annotation/AnnotationRegistry',[
    './../var/uniqueKey'
], function(uniqueKey) {

    var registry = {};

    function createId() {
        return '__module_annotation_' + uniqueKey()
    }

    function getModuleKey() {
        return '__module_annotation_key';
    }

    return {
        get : function(module) {
            return registry[module[getModuleKey()]];
        },
        register : function(module, annotation) {
            var id = createId();
            registry[id] = annotation;
            module[getModuleKey()] = id;
        },
        unregister : function(module) {
            delete registry[module[getModuleKey()]];
        }
    }

});
define('annotation/Annotation',[
    './../wozllajs',
    './../util/Tuple',
    './AnnotationRegistry'
], function(W, Tuple, AnnotationRegistry) {

    var currentAnnotation;

    var Annotation = function(param) {
        this._$annotationTuple = new Tuple();
        this._empty = true;
        currentAnnotation = this;
    };

    Annotation.get = function(module) {
        return AnnotationRegistry.get(module);
    };

    Annotation.define = function(name, definition) {
        function $Annotation(config) {
            var def = $Annotation.definition;
            var prop, propValue;
            for(prop in config) {
                if(!def[prop]) {
                    throw new Error('Undefined property "' + prop + '" in ' + name);
                }
                propValue = config[prop];
                if(!propValue) {
                    propValue = def[prop].defaults;
                }
                else if(propValue instanceof Object) {
                    if(!(propValue instanceof def[prop].type)) {
                        throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                    }
                }
                else if((typeof propValue) !== def[prop].type) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
                this[prop] = propValue;
            }
            currentAnnotation.addAnnotation($Annotation, this);
        }
        $Annotation._annotation_name = name;
        $Annotation.definition = definition;
        W.annotation = W.annotation || {};
        W.annotation[name] = function(config) { new $Annotation(config); };
        return W.annotation[name];
    };

    var p = Annotation.prototype;

    p.isEmpty = function() {
        return this._empty;
    };

    p.isAnnotationPresent = function(type) {
        return this._$annotationTuple.get(type._annotation_name).length > 0;
    };

    p.getAnnotation = function(type) {

        return this._$annotationTuple.get(type._annotation_name)[0];
    };

    p.getAnnotations = function(type) {
        return this._$annotationTuple.get(type._annotation_name);
    };

    p.addAnnotation = function(type, $annotation) {
        this._$annotationTuple.push(type._annotation_name, $annotation);
        this._empty = false;
    };

    return Annotation;

});
define('annotation',[
    './wozllajs',
    './annotation/Annotation',
    './annotation/AnnotationRegistry'
], function(W, Annotation, AnnotationRegistry) {

    // must export first
    W.Annotation = Annotation;
    W.AnnotationRegistry = AnnotationRegistry;

    return {
        Annotation : Annotation,
        AnnotationRegistry : AnnotationRegistry
    };
});
define('ajax/param',[],function() {

    return {
        toString : function(query) {
            if(!query) {
                return '';
            }
            var i, str = '';
            for(i in query) {
                str += '&' + i + '=' + query[i];
            }
            if(str) {
                str = str.substr(1);
            }
            return str;
        },
        toQuery : function(str) {
            // TODO
        }
    }
});
define('ajax/xhr',[],function() {
    return function() {
        return new XMLHttpRequest();
    }
});
define('ajax/get',[
    './param'
], function(param) {

    return function(xhr, url, data, contentType, dataType, async) {
        url += '?' + param.toString(data);
        xhr.open('GET', url, async);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send();
    }
});
define('ajax/post',[],function() {

    return function() {
        // TODO
    }
});
define('ajax/transport',[
    './../promise',
    './xhr',
    './get',
    './post'
], function(Promise, createXHR, GET, POST) {

    return function(settings) {
        var p = new Promise();

        var xhr, now = Date.now();
        var url = settings.url,
            method = settings.method || 'GET',
            data = settings.data,
            dataType = settings.dataType || 'text',
            contentType = settings.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
            async = settings.async;

        var mimeType = 'text/plain';
        var responseField = 'responseText';
        var parseResponse = function(text) {
            return text;
        };

        switch (dataType.toLowerCase()) {
            case 'json' :
                mimeType = 'application/json';
                parseResponse = JSON.parse;
                break;
            case 'script' :
            case 'js' :
                mimeType = 'text/javascript';
                break;
            case 'xml' :
                mimeType = 'text/xml';
                responseField = 'responseXML';
                break;
        }

        async = async === false ? async : true;
        if(data) {
            if(!data.t) {
                data.t = now;
            } else {
                data._ = now;
            }
        }

        xhr = createXHR();
        xhr.overrideMimeType(mimeType);

        try {
            switch(method.toUpperCase()) {
                case 'GET' : GET(xhr, url, data, contentType, dataType, async); break;
                case 'POST' : POST(xhr, url, data, contentType, dataType, async); break;
                default : p.sendError(new Error('Unknow request method: ' + method)); break;
            }
        } catch(e) {
            p.sendError(e);
        }

        xhr.onreadystatechange = function() {
            var status, response;
            if(xhr.readyState === 4) {
                try {
                    response = parseResponse(xhr[responseField]);
                } catch(e) {
                    p.sendError(e);
                    return;
                }
                p.done(response, xhr);
            }
        };

        return p;
    };

});
define('ajax',[
    './promise',
    './ajax/param',
    './ajax/xhr',
    './ajax/transport',
    './ajax/get',
    './ajax/post'
], function(Promise, param, createXHR, ajaxTransport,GET, POST) {

    return {
        ajax : ajaxTransport,
        get : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data
            });
        },
        getJSON : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data,
                dataType : 'json'
            });
        },
        post : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'POST',
                data : data
            });
        }
    };

});
define('events/Event',[
    './../wozllajs'
], function(W) {

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

    return Event;

});




define('events/EventTarget',[
    './Event'
], function(Event) {

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
        'touchstart' : 'onTouchStart',
        'touchmove' : 'onTouchMove',
        'touchend' : 'onTouchEnd',
        'click' : 'onClick'
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
        if (arr) { this.removeEventListener(eventType, listener, useCapture); }
        arr = listeners[eventType];
        if (!arr) {
            listeners[eventType] = [listener];
        }
        else {
            arr.push(listener);
        }
        return listener;
    };

    p.removeEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        var arr = listeners[eventType];
        if (!arr) { return; }
        for (var i=0,l=arr.length; i<l; i++) {
            if (arr[i] == listener) {
                if (l==1) {
                    delete(listeners[eventType]);
                }
                else { arr.splice(i,1); }
                break;
            }
        }
    };

    p.hasEventListener = function(eventType) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[eventType]) || (captureListeners && captureListeners[eventType]));
    };

    p.dispatchEvent = function(event) {
        var i, len, list, object, defaultAction;
        event.target = this;
        if(false === event.bubbles) {
            event.eventPhase = Event.TARGET_PHASE;
            if(!this._dispatchEvent(event)) {
                defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            return;
        }

        list = this._getAncients();
        event.eventPhase = Event.CAPTURING_PHASE;
        for(i=list.length-1; i>=0 ; i--) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
                return;
            }
        }
        event.eventPhase = Event.TARGET_PHASE;
        if(!this._dispatchEvent(event)) {
            defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
            defaultAction && defaultAction(event);
        }
        if(event._propagationStoped) {
            return;
        }
        event.eventPhase = Event.BUBBLING_PHASE;
        for(i=0,len=list.length; i<len; i++) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
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
        var i, len, arr, listeners, handler;
        event.currentTarget = this;
        event._listenerRemoved = false;
        listeners = event.eventPhase === Event.CAPTURING_PHASE ? this._captureListeners : this._listeners;
        if(listeners) {
            arr = listeners[event.type];
            if(!arr || arr.length === 0) return event._defaultPrevented;
            arr = arr.slice();
            for(i=0,len=arr.length; i<len; i++) {
                event._listenerRemoved = false;
                handler = arr[i];
                handler(event);
                if(event._listenerRemoved) {
                    this.removeEventListener(event.type, handler, event.eventPhase === Event.CAPTURING_PHASE);
                }
                if(event._immediatePropagationStoped) {
                    break;
                }
            }
        }
        return event._defaultPrevented;
    };

    return EventTarget;
});



define('events',[
    './wozllajs',
    './events/Event',
    './events/EventTarget'
], function(W, Event, EventTarget) {

    return {
        Event : Event,
        EventTarget : EventTarget
    };
});
define('preload/Loader',[
    './../wozllajs'
], function(W) {

    var Loader = function(item) {
        this._item = item;
    };

    var p = Loader.prototype;

    p.load = function() {};

    return Loader;
});
define('preload/ImageLoader',[
    'require',
    './../wozllajs',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var ImageLoader = function() {
        Loader.apply(this, arguments);
    };

    ImageLoader.loadSrc = function(src) {
        var p = new Promise();
        var image = new Image();
        image.src = src;
        image.onload = function() {
            p.done(image);
        };
        image.onerror = function() {
            p.sendError(new Error('Fail to load image, ' + src));
        };
        return p;
    };

    var p = ImageLoader.prototype;

    p.load = function() {
        return ImageLoader.loadSrc(this._item['src']);
    };

    W.extend(ImageLoader, Loader);

    return ImageLoader;
});
define('preload/StringLoader',[
    'require',
    './../wozllajs',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var StringLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = StringLoader.prototype;

    p.load = function() {
        return W.get(this._item['src']);
    };

    W.extend(StringLoader, Loader);

    return StringLoader;
});
define('preload/JSONLoader',[
    'require',
    './../wozllajs',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var JSONLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = JSONLoader.prototype;

    p.load = function() {
        return W.getJSON(this._item['src']);
    };

    W.extend(JSONLoader, Loader);

    return JSONLoader;
});
define('preload/LoadQueue',[
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
define('preload/AsyncImage',[
    './../wozllajs',
    './LoadQueue'
], function(W, LoadQueue) {

    var AsyncImage = function(imageId) {
        this.imageId = imageId;
    };

    var p = AsyncImage.prototype;

    p.draw = function(context) {
        // TODO optimize performance for slice and unshift
        var args = W.slice(arguments, 1);
        var image = LoadQueue.get(this.imageId);
        if(image) {
            args.unshift(image);
            context.drawImage.apply(context, args);
        }
    };

    p.dispose = function() {
        var image = LoadQueue.get(this.imageId);
        if(image) {
            LoadQueue.remove(this.imageId);
            // for Ludei
            image.dispose && image.dispose();
        }
    };

    p.reload = function() {

    };

    return AsyncImage;
});
define('preload',[
    './wozllajs',
    './preload/AsyncImage',
    './preload/Loader',
    './preload/ImageLoader',
    './preload/LoadQueue'
], function(W, AsyncImage, Loader, ImageLoader, LoadQueue) {

    return {
        AsyncImage : AsyncImage,
        Loader : Loader,
        ImageLoader : ImageLoader,
        LoadQueue : LoadQueue
    };
});
define('core/Time',[],function() {
    return {

        delta : 0,

        now : 0,

        update : function() {
            var now = Date.now();
            if(this.now) {
                this.delta = now - this.now;
            }
            this.now = now;
        },

        reset : function() {
            this.delta = 0;
            this.now = 0;
        }
    };
});
define('core/time',[],function() {
    return {

        delta : 0,

        now : 0,

        update : function() {
            var now = Date.now();
            if(this.now) {
                this.delta = now - this.now;
            }
            this.now = now;
        },

        reset : function() {
            this.delta = 0;
            this.now = 0;
        }
    };
});
/**
 * Copy from createjs
 * @see createjs.com
 */

define('math/Matrix2D',[],function() {

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
    Matrix2D.identity = null; // set at bottom of class definition.

    /**
     * Multiplier for converting degrees to radians. Used internally by Matrix2D.
     * @property DEG_TO_RAD
     * @static
     * @final
     * @type Number
     * @readonly
     **/
    Matrix2D.DEG_TO_RAD = Math.PI/180;


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
    p.shadow  = null;

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
        this.a = (a == null) ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d == null) ? 1 : d;
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
            this.a  = a1*a+this.b*c;
            this.b  = a1*b+this.b*d;
            this.c  = c1*a+this.d*c;
            this.d  = c1*b+this.d*d;
        }
        this.tx = tx1*a+this.ty*c+tx;
        this.ty = tx1*b+this.ty*d+ty;
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

        this.a  = a*a1+b*c1;
        this.b  = a*b1+b*d1;
        this.c  = c*a1+d*c1;
        this.d  = c*b1+d*d1;
        this.tx = tx*a1+ty*c1+this.tx;
        this.ty = tx*b1+ty*d1+this.ty;
        return this;
    };

    /**
     * Prepends the specified matrix with this matrix.
     * @method prependMatrix
     * @param {Matrix2D} matrix
     **/
    p.prependMatrix = function(matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
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
        this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
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
        if (rotation%360) {
            var r = rotation*Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX; this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
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
        if (rotation%360) {
            var r = rotation*Matrix2D.DEG_TO_RAD;
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
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
        } else {
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX*this.a+regY*this.c;
            this.ty -= regX*this.b+regY*this.d;
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

        this.a = a1*cos-this.b*sin;
        this.b = a1*sin+this.b*cos;
        this.c = c1*cos-this.d*sin;
        this.d = c1*sin+this.d*cos;
        this.tx = tx1*cos-this.ty*sin;
        this.ty = tx1*sin+this.ty*cos;
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
        skewX = skewX*Matrix2D.DEG_TO_RAD;
        skewY = skewY*Matrix2D.DEG_TO_RAD;
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
        var n = a1*d1-b1*c1;

        this.a = d1/n;
        this.b = -b1/n;
        this.c = -c1/n;
        this.d = a1/n;
        this.tx = (c1*this.ty-d1*tx1)/n;
        this.ty = -(a1*this.ty-b1*tx1)/n;
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
        pt = pt||{};
        pt.x = x*this.a+y*this.c+this.tx;
        pt.y = x*this.b+y*this.d+this.ty;
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
        if (target == null) { target = {}; }
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);

        if (skewX == skewY) {
            target.rotation = skewY/Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += (target.rotation <= 0) ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX/Matrix2D.DEG_TO_RAD;
            target.skewY = skewY/Matrix2D.DEG_TO_RAD;
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
        this.initialize(a,b,c,d,tx,ty);
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
        return (new Matrix2D()).copy(this);
    };

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function() {
        return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
    };

    // this has to be populated after the class is defined:
    Matrix2D.identity = new Matrix2D();

    return Matrix2D;

});
define('core/Transform',[
    './../math/Matrix2D'
], function(Matrix2D) {

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
        getRoot : function() {
            var o = this.gameObject;
            while(o && o._parent) {
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
        localToGlobal : function(x, y) {
            var mtx = this.getConcatenatedMatrix();
            if (mtx == null) { return null; }
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        /**
         * 与localToGlobal相反
         * @param x
         * @param y
         * @return {*}
         */
        globalToLocal : function(x, y) {
            var mtx = this.getConcatenatedMatrix();
            if (mtx == null) { return null; }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        /**
         * 获取一个Matrix2D, 及联了所有它的parentTransform的属性, 通常很方便的用于转换坐标点
         * @return {createjs.Matrix2D}
         */
        getConcatenatedMatrix : function() {
            var o = this;
            matrix.identity();
            while (o != null) {
                matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                    .prependProperties(o.alpha);
                o = o.parent;
            }
            return matrix;
        },

        /**
         * 获取当前Transform转换的Matrix2D
         * @return {Matrix2D}
         */
        getMatrix : function() {
            var o = this;
            return matrix.identity()
                .appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                .appendProperties(o.alpha);
        },

        /**
         * 将当前的Transform应用到canvas的context上
         * @param context CanvasContextRenderer2d
         */
        updateContext : function(context) {
            var mtx, o=this;
            mtx = matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            context.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            context.globalAlpha *= o.alpha;
        },

        applyTransform : function(transform) {
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
define('annotation/$Inject',[
    './../wozllajs',
    './Annotation',
    './../core/AbstractGameObject'
], function(W, Annotation, AbstractGameObject) {

    return Annotation.define('$Inject', {
        type : {
            type : Object,
            defaults : null
        },
        value : {
            type : 'string',
            defaults : null
        }
    });

});
define('core/AbstractGameObject',[
    'require',
    'module',
    './../wozllajs',
    './../events/EventTarget',
    './Transform',
    './../annotation/$Inject'
], function(require, module, W, EventTarget, Transform, $Inject) {

    $Inject({
        type : Object,
        value : 'Login'
    });

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

        this.id = params.id;
        this.UID = W.uniqueKey();
        this.transform = new Transform({ gameObject: this });
        this._parent = null;
        this._children = [];
        this._childrenMap = {};
    };

    var p = AbstractGameObject.prototype;

    p.setId = function(id) {
        if(this._parent) {
            delete this._parent._childrenMap[this.id];
            this._parent._childrenMap[id] = this;
        }
        this.id = id;
    };

    p.getParent = function() {
        return this._parent;
    };

    p.getPath = function(seperator) {
        var o = this;
        var path = [];
        while(o) {
            path.unshift(o.id);
            o = o._parent;
        }
        return path.join(seperator || '.');
    };

    p.getStage = function() {
        return require('./Stage').root;
    };

    p.getChildren = function() {
        return this._children.slice();
    };

    p.sortChildren = function(func) {
        this._children.sort(func);
    };

    p.getObjectById = function(id) {
        return this._childrenMap[id];
    };

    p.addObject = function(obj) {
        this._childrenMap[obj.id] = obj;
        this._children.push(obj);
        obj._parent = this;
    };

    p.insertObject = function(obj, index) {
        this._childrenMap[obj.id] = obj;
        this._children.splice(index, 0, obj);
        obj._parent = this;
    };

    p.insertBefore = function(obj, objOrId) {
        var i, len, child;
        var index = 0;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index);
    };

    p.insertAfter = function(obj, objOrId) {
        var i, len, child;
        var index = this._children.length;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index+1);
    };

    p.removeObject = function(idOrObj) {
        var children = this._children;
        var obj = typeof idOrObj === 'string' ? this._childrenMap[idOrObj] : idOrObj;
        var idx = -1;
        var i, len;
        for(i=0,len=children.length; i<len; i++) {
            if(obj === children[i]) {
                idx = i;
                children.splice(idx, 1);
                break;
            }
        }
        if(idx !== -1) {
            delete this._childrenMap[obj.id];
            obj._parent = null;
            obj.transform.parent = null;
        }
        return idx;
    };

    p.remove = function(params) {
        this._parent && this._parent.removeObject(this);
        this._parent = null;
    };

    p.removeAll = function(params) {
        this._children = [];
        this._childrenMap = {};
    };

    p.findObjectById = function(id) {
        var i, len, children;
        var obj = this.getObjectById(id);
        if(!obj) {
            children = this._children;
            for(i=0,len=children.length; i<len; i++) {
                obj = children[i].findObjectById(id);
                if(obj) break;
            }
        }
        return obj;
    };

    p.findObjectByPath = function(path) {
        var i, len;
        var paths = path.split('.');
        var obj = this.findObjectById(paths[0]);
        if(obj) {
            for(i=1, len=paths.length; i<len; i++) {
                obj = obj.getObjectById(paths[i]);
                if(!obj) return null;
            }
        }
        return obj;
    };


    W.extend(AbstractGameObject, EventTarget);

    return AbstractGameObject;

});
define('core/Component',[
    './../wozllajs'
], function(W) {

    function Component() {
        this.UID = W.uniqueKey();
        this.gameObject = null;
    }

    var p = Component.prototype;

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

    p.isInstanceof = function(type) {
        return this instanceof type;
    };

    return Component;

});
define('core/Behaviour',[
    './../wozllajs',
    './Component'
], function(W, Component) {

    function Behaviour() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = Behaviour.prototype;

    p.update = function() {};
    p.lateUpdate = function() {};

    W.extend(Behaviour, Component);

    return Behaviour;

});
define('core/Renderer',[
    './../wozllajs',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
    }

    var p = Renderer.prototype;

    p.draw = function(context, visibleRect) {};

    W.extend(Renderer, Component);

    return Renderer;

});
define('core/HitDelegate',[
    './../wozllajs',
    './Component'
], function(W, Component) {

    function HitDelegate() {
        Component.apply(this, arguments);
    }

    var p = HitDelegate.prototype;

    p.testHit = function(x, y) {};

    W.extend(HitDelegate, Component);

    return HitDelegate;

});
define('core/events/GameObjectEvent',[
    './../../wozllajs',
    './../../events/Event'
], function(W, Event) {

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';

    W.extend(GameObjectEvent, Event);

    return GameObjectEvent;

});
define('core/UnityGameObject',[
    './../wozllajs',
    './../globals',
    './AbstractGameObject',
    './Component',
    './Behaviour',
    './Renderer',
    './HitDelegate',
    './events/GameObjectEvent'
], function(W, G, AbstractGameObject, Component, Behaviour, Renderer, HitDelegate, GameObjectEvent) {

    var testHitCanvas = W.createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext('2d');

    var UnityGameObject = function(param) {
        AbstractGameObject.apply(this, arguments);
        this._active = true;
        this._visible = true;
        this._initialized = false;
        this._components = [];
        this._delayRemoves = [];
    };

    var p = UnityGameObject.prototype;

    p.isActive = function(upWards) {
        if(upWards === false) {
            return this._active;
        }
        var active = true;
        var o = this;
        while(o) {
            active = active && o._active;
            if(!active) {
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
        if(upWards === false) {
            return this._visible;
        }
        var visible = true;
        var o = this;
        while(o) {
            visible = visible && o._visible;
            if(!visible) {
                return false;
            }
            o = o._parent;
        }
        return visible;
    };

    p.setVisible = function(visible) {
        this._visible = visible;
    };

    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };

    p.getComponent = function(type) {
        var i, len, comp;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp.isInstanceof(type)) {
                return comp;
            }
        }
        return null;
    };

    p.getComponents = function(type) {
        var i, len, comp;
        var components = this._components;
        var found = [];
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp.isInstanceof(type)) {
                found.push(comp);
            }
        }
        return found;
    };

    p.removeComponent = function(component) {
        var i, len, comp;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp === component) {
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
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(!type || (type && comp.isInstanceof(type))) {
                method = comp[methodName];
                method && method.apply(comp, args);
            }
        }
    };

    p.broadcastMessage = function(methodName, args) {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.broadcastMessage(methodName, args);
        }
        this.sendMessage(methodName, args);
    };

    p.init = function() {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_INIT_COMPONENT);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.init();
        }
        this._doDelayRemove();
        this._initialized = true;
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.INIT
        }))
    };

    p.destroy = function() {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.destroy();
        }
        this._doDelayRemove();
        this.sendMessage(G.METHOD_DESTROY_COMPONENT);
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.DESTROY
        }))
    };

    p.update = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.update();
        }
        this.sendMessage(G.METHOD_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.lateUpdate = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.lateUpdate();
        }
        this.sendMessage(G.METHOD_LATE_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.draw = function(context, visibleRect) {
        if(!this._initialized || !this._active || !this._visible) return;
        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);
        context.restore();
        this._doDelayRemove();
    };

    p.testHit = function(x, y, onlyRenderSelf) {
        var hit = false, hitDelegate, renderer;
        if(!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if(hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        }
        else if(this._cacheCanvas && this._cached) {
            hit = this._cacheContext.getImageData(-this._cacheOffsetX+x, -this._cacheOffsetY+y, 1, 1).data[3] > 1;
        }
        else {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            if(onlyRenderSelf) {
                renderer = this.getComponent(Renderer);
                if(!renderer) {
                    hit = false;
                } else {
                    renderer.draw(testHitContext, this.getStage().getVisibleRect());
                }
            } else {
                this._draw(testHitContext, this.getStage().getVisibleRect());
            }
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };

    p.getTopObjectUnderPoint = function(x, y) {
        var i, child, obj, localPoint;
        for(i=this._children.length-1; i>=0 ; i--) {
            child = this._children[i];
            obj = child.getTopObjectUnderPoint(x, y);
            if(obj) {
                return obj;
            }
        }
        localPoint = this.transform.globalToLocal(x, y);
        if(this.testHit(localPoint.x, localPoint.y, true)) {
            return this;
        }
        return null;
    };

    p._doDelayRemove = function() {
        var i, len, target;
        if(this._delayRemoves.length > 0) {
            for(i=0,len=this._delayRemoves.length; i<len; i++) {
                target = this._delayRemoves[i];
                if(target instanceof AbstractGameObject) {
                    this.removeObject(target);
                }
                else if(target instanceof Component) {
                    this.removeComponent(target);
                }
            }
            this._delayRemoves.length = 0;
        }
    };

    p._draw = function(context, visibleRect) {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_DRAW, arguments, Renderer);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.draw(context, visibleRect);
        }
    };

    W.extend(UnityGameObject, AbstractGameObject);

    return UnityGameObject;
});
define('core/Filter',[
    './../wozllajs',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = Renderer.prototype;

    p.applyFilter = function(cacheContext, x, y, width, height) {};

    W.extend(Renderer, Component);

    return Renderer;

});
define('core/CachableGameObject',[
    'module',
    './../wozllajs',
    './../globals',
    './UnityGameObject',
    './Filter',
], function(module, W, G, UnityGameObject, Filter) {

    var CachableGameObject = function(param) {
        UnityGameObject.apply(this, arguments);

        this._cacheCanvas = null;
        this._cacheContext = null;
        this._cached = false;
        this._cacheOffsetX = 0;
        this._cacheOffsetY = 0;
    };

    var p = CachableGameObject.prototype;

    p.cache = function(x, y, width, height) {
        if(this._cacheCanvas) {
            this.uncache();
        }
        this._cacheOffsetX = x;
        this._cacheOffsetY = y;
        this._cacheCanvas = W.createCanvas(width, height);
        this._cacheContext = this._cacheCanvas.getContext('2d');
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
        if(this._cacheCanvas) {
            this._cacheContext.dispose && this._cacheContext.dispose();
            this._cacheCanvas.dispose && this._cacheCanvas.dispose();
            this._cacheCanvas = null;
        }
        this._cached = false;
    };

    p._draw = function(context, visibleRect) {
        if(this._cacheCanvas) {
            if(!this._cached) {
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
        this._draw(cacheContext, visibleRect);
        cacheContext.translate(this._cacheOffsetX, this._cacheOffsetY);
        this._applyFilters(cacheContext, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
    };

    p._applyFilters = function(cacheContext, x, y, width, height) {
        var id, filter;
        var filters = this.getComponents(Filter);
        for(id in filters) {
            cacheContext.save();
            filter = filters[id];
            filter.applyFilter(cacheContext, x, y, width, height);
            cacheContext.restore();
        }
    };


    W.extend(CachableGameObject, UnityGameObject);

    return CachableGameObject;
});
define('core/Stage',[
    './../wozllajs',
    './CachableGameObject'
], function(W, CachableGameObject) {

    var visibleRect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    var Stage = function(param) {
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
        this.width = param.width;
        this.height = param.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext('2d');
    };

    Stage.root = null;

    var p = Stage.prototype;

    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };

    p.draw = function() {
        this.autoClear && this.stageContext.clearRect(0, 0, this.width, this.height);
        CachableGameObject.prototype.draw.apply(this, [this.stageContext, this.getVisibleRect()]);
    };

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this.width = width;
        this.height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this.width;
        visibleRect.height = this.height;
        return visibleRect;
    };

    W.extend(Stage, CachableGameObject);

    return Stage;

});
define('core/Engine',[
    './time',
    './../util/Tuple',
    './Stage'
], function(Time, Tuple, Stage) {

    var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(frameCall, intervalTime) {
                setTimeout(frameCall, intervalTime);
            };

    var ENGINE_EVENT_TYPE = 'Engine';
    var engineEventListeners = new Tuple();
    var running = true;
    var frameTime;

    /**
     * 主循环中一帧
     */
    function frame() {
        if(!running) {
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
        if(!listeners || listeners.length === 0) {
            return;
        }
        listeners = [].concat(listeners);
        for(i=0, len=listeners.length; i<len; i++) {
            listener = listeners[i];
            listener.apply(listener, arguments);
        }
    }

    return {

        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener : function(listener) {
            // special for Stage
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(stage.__engineTick) {
                    return;
                }
                stage.__engineTick = function() {
                    stage.update();
                    stage.lateUpdate();
                    stage.draw();
                };
                listener = stage.__engineTick;
            }
            engineEventListeners.push(ENGINE_EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener : function(listener) {
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(!stage.__engineTick) {
                    return;
                }
                listener = stage.__engineTick;
                stage.__engineTick = null;
            }
            engineEventListeners.remove(ENGINE_EVENT_TYPE, listener);
        },

        /**
         * 开始主循环或重新开始主循环
         */
        start : function(newFrameTime) {
            frameTime = newFrameTime || 10;
            running = true;
            requestAnimationFrame(frame, frameTime);
        },

        /**
         * 停止主循环
         */
        stop : function() {
            running = false;
        },

        /**
         * 运行一步
         */
        runStep : function() {
            Time.update();
            Time.delta = frameTime;
            fireEngineEvent();
        }
    }

});
define('core/Collider',[
    './../wozllajs',
    './Component'
], function(W, Component) {

    function Collider() {
        Component.apply(this, arguments);
    }

    var p = Collider.prototype;

    W.extend(Collider, Component);

    return Collider;

});
define('core/events/TouchEvent',[
    './../../wozllajs',
    './../../events/Event'
], function(W, Event) {

    var TouchEvent = function(param) {
        Event.apply(this, arguments);
        this.x = param.x;
        this.y = param.y;
    };

    TouchEvent.TOUCH_START = 'touchstart';
    TouchEvent.TOUCH_END = 'touchend';
    TouchEvent.TOUCH_MOVE = 'touchmove';
    TouchEvent.CLICK = 'click';

    W.extend(TouchEvent, Event);

    return TouchEvent;

});
define('core/Touch',[
    './../var/support',
    './events/TouchEvent'
], function(support, TouchEvent) {

    var stage;
    var enabled = true;

    var touchstartTarget;
    var touchendTarget;

    function getCanvasOffset() {
        var obj = stage.stageCanvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        return offset;
    }

    function onEvent(e) {
        if(!enabled) return;
        var target, touchEvent, canvasOffset, x, y, t;
        var type = e.type;
        canvasOffset = getCanvasOffset();
        // mouse event
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        // touch event
        else if(e.changedTouches) {
            t = e.changedTouches[0];
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }

        target = stage.getTopObjectUnderPoint(x, y);

        if(type === 'mousedown') {
            type = TouchEvent.TOUCH_START;
            touchstartTarget = target;
        }
        else if(type === 'mouseup') {
            type = TouchEvent.TOUCH_END;
            touchendTarget = target;
        }
        else if(type === 'mousemove') {
            type = TouchEvent.TOUCH_MOVE;
        }
        touchEvent = new TouchEvent({
            type : type,
            x : x,
            y : y
        });

        target && target.dispatchEvent(touchEvent);

        if(type === TouchEvent.TOUCH_END) {
            if(touchendTarget && touchstartTarget === touchendTarget) {
                touchstartTarget = null;
                touchendTarget = null;
                touchendTarget.dispatchEvent(new TouchEvent({
                    type : TouchEvent.CLICK,
                    x : x,
                    y : y
                }));
            }
        }
    }


    return {
        init : function(theStage) {
            stage = theStage;
            if(support.touch) {
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
                    if(down) {
                        onEvent(e);
                    }
                }, false);
            }
        },
        enable : function() {
            enabled = true;
        },
        disable : function() {
            enabled = false;
        }
    }
});
define('core',[
    './wozllajs',
    './core/Time',
    './core/Engine',
    './core/AbstractGameObject',
    './core/UnityGameObject',
    './core/CachableGameObject',
    './core/Transform',
    './core/Component',
    './core/Behaviour',
    './core/Collider',
    './core/Filter',
    './core/HitDelegate',
    './core/Renderer',
    './core/Stage',
    './core/Touch',
    './core/events/GameObjectEvent',
    './core/events/TouchEvent'
], function(W, Time, Engine, AbstractGameObject, UnityGameObject, CachableGameObject, Transform, Component,
    Behaviour, Collider, Filter, HitDelegate, Renderer, Stage, Touch, GameObjectEvent, TouchEvent) {

    var config;

    W.config = function(configuration) {
        config = configuration;
    };

    W.onStageInit = function(callback) {
        var stage = new Stage({
            id : 'wozllajs_Stage',
            canvas : config.canvas,
            width : config.width,
            height : config.height,
            autoClear : config.autoClear
        });
        config.canvas.width = config.width;
        config.canvas.height = config.height;
        Touch.init(stage);
        stage.init();
        stage.addEventListener(GameObjectEvent.INIT, function(e) {
            e.removeListener();
            setTimeout(function() {
                callback && callback(stage);
            }, 1);
        });
        Stage.root = stage;
        Engine.start();
    };

    return {
        Time : Time,
        Engine : Engine,
        AbstractGameObject : AbstractGameObject,
        UnityGameObject : UnityGameObject,
        CachableGameObject : CachableGameObject,
        GameObject : CachableGameObject,
        Transform : Transform,
        Component : Component,
        Behaviour : Behaviour,
        Filter : Filter,
        HitDelegate : HitDelegate,
        Renderer : Renderer,
        Stage : Stage,
        Touch : Touch,

        events : {
            TouchEvent : TouchEvent,
            GameObjectEvent : GameObjectEvent
        }
    };
});
define.factoryProxy = function(callback, args, exports) {
    if(window.wozllajs && window.wozllajs.Annotation) {
        var annotation = new wozllajs.Annotation();
        exports = callback.apply(exports, args);
        if(!annotation.isEmpty()) {
            wozllajs.AnnotationRegistry.register(exports, annotation);
        }
        return exports;
    }
    return callback.apply(exports, args);
};

define('all',[
    './wozllajs',
    './promise',
    './annotation',
    './ajax',
    './events',
    './preload',
    './core'
], function(wozllajs, Promise) {

    wozllajs.Promise = Promise;

    // export modules
    var modules = wozllajs.slice(arguments, 2);
    var i, len, m, p;
    for(i=0,len=modules.length; i<len; i++) {
        m = modules[i];
        if(typeof m === 'function') {
            continue;
        }
        for(p in m) {
            wozllajs[p] = m[p];
        }
    }


    return window.wozllajs = wozllajs;
});