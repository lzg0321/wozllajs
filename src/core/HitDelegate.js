define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function HitDelegate() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(HitDelegate, Component);

    p.testHit = function(x, y) {};

    return HitDelegate;

});