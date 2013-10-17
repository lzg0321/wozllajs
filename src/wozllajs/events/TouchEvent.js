this.wozllajs = this.wozllajs || {};

(function() {

    function TouchEvent(type) {
        wozllajs.Event.apply(this, [type, true, true]);
    }

    var p = TouchEvent.prototype = Object.create(wozllajs.Event.prototype);

    p.x = null;
    p.y = null;

    p.screenX = null;
    p.screenY = null;

    p.globalX = null;
    p.globalY = null;

    wozllajs.MouseEvent = TouchEvent;

})();