define([
    './../var',
    './Component'
], function(W, Component) {

    function Collider() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Collider, Component);

    return Collider;

});