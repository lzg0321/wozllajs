define([
    './../var',
    './Component'
], function(W, Component) {

    function HitDelegate() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(HitDelegate, Component);

    p.testHit = function(x, y) {};

    return HitDelegate;

});