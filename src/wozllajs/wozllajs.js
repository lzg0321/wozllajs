this.wozllajs = this.wozllajs || {};



(function() {

    var toString = Object.prototype.toString;

    var componentMap = {};

    wozllajs.UniqueKeyGen = 0;

    wozllajs.debug = false;

    wozllajs.isTouchSupport = 'ontouchstart' in window;

    wozllajs.proxy = function (method, scope) {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function () {
            return method.apply(scope || method, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };

    wozllajs.isArray = function(testObj) {
        return wozllajs.is(testObj, 'Array');
    };

    wozllajs.is = function(testObj, type) {
        return toString.call(testObj).toLowerCase() === '[object ' + type.toLowerCase() + ']';
    };

    wozllajs.indexOf = function(obj, arr) {
        var i, len;
        for(i=0, len=arr.length; i<len; i++) {
            if(arr[i] === obj) {
                return i;
            }
        }
        return -1;
    };

    wozllajs.arrayRemove = function(obj, arr) {
        var idx = wozllajs.indexOf(obj, arr);
        if(idx !== -1) {
            arr.splice(idx, 1);
        }
        return idx;
    };

    wozllajs.createCanvas = function(width, height) {
        var c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        return c;
    };

    wozllajs.namespace = function(ns, root) {
        var NSList = ns.split(".");
        var step = root || wozllajs;
        var k = null;
        while (k = NSList.shift()) {
            if (step[k] === undefined) {
                if(wozllajs.debug) {
                    console.log("[Warn] can't found namespace '" + ns + "'");
                }
                return null;
            }
            step = step[k];
        }
        return step;
    };

    wozllajs.printComponent = function() {
        console.log('ComponentMap: ', componentMap);
    };

    wozllajs.createComponent = function(namespace, params) {
        var cmpConstructor = componentMap[namespace];
        if(!cmpConstructor) {
            console.log("Can't find Component '" + namespace + "'");
            return null;
        }
        return new cmpConstructor(params);
    };

    wozllajs.defineComponent = function(namespace, maker) {
        var NSList = namespace.split(".");
        var step = wozllajs;
        var k = null;
        var superConstructor;
        var cmpConstructor;
        var cmpProto;
        var extend;
        var baseCmp;
        var superName;
        var name = namespace.indexOf('.') !== -1 ? namespace.substr(namespace.lastIndexOf('.')+1) : namespace;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if(step[k]) {
                    //console.log('The namespace "' + namespace + '" has been regsitered, override it.');
                }
                if(typeof maker === 'function') {
                    cmpConstructor = maker();
                } else if(typeof maker === 'object') {
                    baseCmp = {
                        'Renderer' : wozllajs.Renderer,
                        'Collider' : wozllajs.Collider,
                        'Layout'   : wozllajs.Layout,
                        'Behaviour' : wozllajs.Behaviour,
                        'HitTestDelegate' : wozllajs.HitTestDelegate
                    };
                    extend = maker.extend;
                    delete maker.extend;
                    superName = extend.indexOf('.') !== -1 ? extend.substr(extend.lastIndexOf('.')+1) : extend;
                    superConstructor = baseCmp[extend] || componentMap[extend];
                    cmpConstructor = wozllajs.Component.decorate(name, maker, superName, superConstructor);
                }
                if(cmpConstructor) {
                    cmpProto = cmpConstructor.prototype;
                    cmpProto.id = namespace;
                    componentMap[namespace] = cmpConstructor;
                    componentMap[cmpProto.alias] = cmpConstructor;
                    step[k] = cmpConstructor;
                } else {
                    throw new Error('Error in defineComponent: ' + namespace);
                }
            }
        }
    };
    
})();