define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Filter() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Filter, Component);

    p.applyFilter = function(cacheContext, x, y, width, height) {};

    return Filter;

});