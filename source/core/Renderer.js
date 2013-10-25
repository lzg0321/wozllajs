define([
    './../wozllajs',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
    }

    var p = Renderer.prototype;

    p.draw = function(context, visibleRect) {};

    W.extend(Renderer, Component);

    return Renderer;

});