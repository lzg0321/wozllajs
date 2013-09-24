this.wozllajs = this.wozllajs || {};

(function() {
    "use strict";

    function Filter(params) {
        this.initialize(params);
    }

    var p = Filter.prototype = Object.create(wozllajs.Component.prototype);

    p.type = wozllajs.Component.FILTER;

    p.applyFilter = function(context, x, y, width, height) {};

    wozllajs.Filter = Filter;

})();