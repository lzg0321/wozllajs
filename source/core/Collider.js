define([
    './../var',
    './Component'
], function(W, Component) {

    function Collider() {
        Component.apply(this, arguments);
    }

    var p = Collider.prototype;

    W.extend(Collider, Component);

    return Collider;

});