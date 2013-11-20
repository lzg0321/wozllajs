define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Mask() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Mask, Component);

    p.clip = function(context) {
        throw new Error('abstract method');
    };

    return Mask;

});