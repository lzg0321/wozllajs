this.wozllajs = this.wozllajs || {};



(function() {

    var toString = Object.prototype.toString;

    var componentMap = {};

    wozllajs.isTouchSupport = 'ontouchstart' in window;

    wozllajs.proxy = function (method, scope) {
        var aArgs = Array.prototype.slice.call(arguments, 2);
        return function () {
            return method.apply(scope, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };

    wozllajs.isArray = function(testObj) {
        return wozllajs.is(testObj, 'Array');
    };

    wozllajs.is = function(testObj, type) {
        return toString.call(testObj).toLowerCase() === type.toLowerCase();
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

    wozllajs.printComponent = function() {
        console.log('ComponentMap: ', componentMap);
    };

    wozllajs.createComponent = function(namespace, params) {
        var cmpConstructor = componentMap[namespace];
        if(!cmpConstructor) {
            throw new Error("Can't find Component '" + namespace + "'");
        }
        return new cmpConstructor(params);
    };

    wozllajs.defineComponent = function(namespace, maker) {
        var NSList = namespace.split(".");
        var step = wozllajs;
        var k = null;
        var cmpConstructor;
        var cmpProto;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if(step[k]) {
                    console.log('The namespace "' + namespace + '" has been regsitered, override it.');
                }
                cmpConstructor = step[k] = maker();
                cmpProto = cmpConstructor.prototype;
                componentMap[namespace] = cmpConstructor;
                componentMap[cmpProto.alias] = cmpConstructor;
            }
        }
    };
    
})();