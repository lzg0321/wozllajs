define([
    './../var',
    './Component'
], function(W, Component) {

    function Mask() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Mask, Component);

    p.clip = function(context) {
        throw new Error('abstract method');
    };

    return Mask;

});