this.wozllajs = this.wozllajs || {};

(function() {

    function Event(type, bubbles, cancelable) {
        this.type = type;
        this.bubbles = bubbles || false;
        this.cancelable = cancelable || false;

        this.currentTarget = null;
        this.target = null;
        this.eventPhase = Event.CAPTURING_PHASE;

        this._stopImmediatePropagation = false;
        this._stopPropagation = false;
        this._removeListener = false;
    }

    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;

    Event.prototype = {
        stopImmediatePropagation : function() {
            this.__stopPropagation = true;
            this._stopImmediatePropagation = true;
        },
        stopPropagation : function() {
            this._stopPropagation = true;
        },
        removeListener : function() {
            this._removeListener = true;
        }
    };

    wozllajs.Event = Event;

})();