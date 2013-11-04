define([
    './../var',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Renderer, Component);

    p.draw = function(context, visibleRect) {};

    return Renderer;

});