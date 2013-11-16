define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Behaviour() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Behaviour, Component);

    p.update = function() {};
    p.lateUpdate = function() {};

    return Behaviour;

});