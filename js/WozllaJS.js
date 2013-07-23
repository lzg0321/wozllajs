
var WozllaJS = new function() {

    this.define = function(namespace, maker) {
        var NSList = namespace.split(".");
        var step = this;
        var k = null;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if (step[k] === undefined) {
                    step[k] = maker(this);
                }
            }
        }
        return false;
    };

    this.namespace = function(ns) {
        var NSList = ns.split(".");
        var step = this;
        var k = null;
        while (k = NSList.shift()) {
            if (step[k] === undefined) {
                console.log("[Warn] can't found namespace '" + ns + "'");
                return null;
            }
            step = step[k];
        }
        return step;
    };

    this.extend = function(superClass, proto) {
        var obj = Object.create(superClass.prototype);
        if (proto) {
            for (var funcName in proto) {
                obj[funcName] = proto[funcName];
            }
        }
        return obj;
    };

    return this;

};

if(window && !window.W) {
    window.W = WozllaJS;
}