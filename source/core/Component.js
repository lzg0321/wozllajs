define([
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