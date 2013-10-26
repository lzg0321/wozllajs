define([
    './../var',
    './Component'
], function(W, Component) {

    function Behaviour() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = W.inherits(Behaviour, Component);

    p.update = function() {};
    p.lateUpdate = function() {};

    return Behaviour;

});