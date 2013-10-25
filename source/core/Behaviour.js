define([
    './../var',
    './Component'
], function(W, Component) {

    function Behaviour() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = Behaviour.prototype;

    p.update = function() {};
    p.lateUpdate = function() {};

    W.extend(Behaviour, Component);

    return Behaviour;

});