define([
    './../var'
], function(W) {

    function Component() {
        this.UID = W.uniqueKey();
        this.gameObject = null;
    }

    var p = Component.prototype;

    p.alias = undefined;

    p.properties = {}; // for build

    p.setGameObject = function(gameObject) {
        this.gameObject = gameObject;
    };

    p.initComponent = function() {
        this.applyProperties(this.properties);
    };

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

    p.applyProperties = function(properties) {
        for(var p in properties) {
            this[p] = properties[p];
        }
    };

    p.isInstanceof = function(type) {
        return this instanceof type;
    };

    return Component;

});