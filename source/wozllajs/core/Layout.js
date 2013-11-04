define([
    './../var',
    './Component'
], function(W, Component) {

    function Layout() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Layout, Component);

    p.doLayout = function(x, y) {};

    return Layout;

});