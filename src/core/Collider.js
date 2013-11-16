define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Collider() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Collider, Component);

    return Collider;

});