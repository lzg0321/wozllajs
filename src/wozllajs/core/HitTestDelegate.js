this.wozllajs = this.wozllajs || {};

(function() {

    "use strict";

    function HitTestDelegate(params) {
        this.initialize(params);
    }

    var p = HitTestDelegate.prototype = Object.create(wozllajs.Component.prototype);

    p.type = wozllajs.Component.HIT_TEST;

    p.testHit = function(x, y) {
        return false;
    };

    p.draw = function(context) {
    };

    wozllajs.HitTestDelegate = HitTestDelegate;

})();