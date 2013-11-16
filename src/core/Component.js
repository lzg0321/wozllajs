define(function(require) {

    var loader = require('../assets/loader');
    var uniqueKey = require('../utils/uniqueKey');

    function Component() {
        this.UID = uniqueKey();
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

    p.getResource = function(id) {
        return loader.get(id);
    };

    p.loadResource = function(params, base) {
        return loader.load(params, base);
    };

    p.unloadResource = function(ids) {
        if(typeof ids === 'string') {
            ids = [ids];
        }
        var i, len;
        for(i=0,len=ids.length; i<len; i++) {
            loader.remove(ids[i]);
        }
    };

    p.isInstanceof = function(type) {
        return this instanceof type;
    };

    return Component;

});