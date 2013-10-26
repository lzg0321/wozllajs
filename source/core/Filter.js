define([
    './../var',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = W.inherits(Renderer, Component);

    p.applyFilter = function(cacheContext, x, y, width, height) {};

    return Renderer;

});