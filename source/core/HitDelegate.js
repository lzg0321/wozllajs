define([
    './../wozllajs',
    './Component'
], function(W, Component) {

    function HitDelegate() {
        Component.apply(this, arguments);
    }

    var p = HitDelegate.prototype;

    p.testHit = function(x, y) {};

    W.extend(HitDelegate, Component);

    return HitDelegate;

});