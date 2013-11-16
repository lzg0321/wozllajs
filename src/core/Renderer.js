define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Renderer() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Renderer, Component);

    p.draw = function(context, visibleRect) {};

    return Renderer;

});