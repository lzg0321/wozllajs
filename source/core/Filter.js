define([
    './../var',
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