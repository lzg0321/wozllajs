this.wozllajs = this.wozllajs || {};

(function() {

    function ChangeEvent() {
        wozllajs.Event.apply(this, ['change', true, true]);
    }

    var p = ChangeEvent.prototype = Object.create(wozllajs.Event.prototype);

    wozllajs.ChangeEvent = ChangeEvent;

})();