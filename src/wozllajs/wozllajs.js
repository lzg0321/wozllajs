this.wozllajs = this.wozllajs || {};

(function() {

    // Array
    if(!Array.prototype.remove) {
        Array.prototype.remove = function(obj) {
            var idx = this.indexOf(obj);
            if(idx !== -1) {
                this.splice(idx, 1);
            }
        };
    }

    if(!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj) {
            var i, len;
            for(i=0, len=this.length; i<len; i++) {
                if(this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }

})();

(function() {

    var toString = Object.prototype.toString;

    var componentMap = {}; 

    wozllajs.isArray = function(testObj) {
        return wozllajs.is(testObj, 'Array');
    };

    wozllajs.is = function(testObj, type) {
        return toString.call(testObj).toLowerCase() === type.toLowerCase();
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