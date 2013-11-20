define(function(require) {

    var Objects = require('../utils/Objects');
    var Component = require('./Component');

    function Layout() {
        Component.apply(this, arguments);
    }

    var p = Objects.inherits(Layout, Component);

    p.doLayout = function() {};

    return Layout;

});