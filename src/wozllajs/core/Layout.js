this.wozllajs = this.wozllajs || {};

(function() {
    "use strict";

    function Layout(params) {
        this.initialize(params);
    }

    var p = Layout.prototype = Object.create(wozllajs.Component.prototype);

    p.type = wozllajs.Component.LAYOUT;

    p.initComponent = function() {
        this.doLayout();
    };

    p.doLayout = function() {};

    wozllajs.Layout = Layout;

})();