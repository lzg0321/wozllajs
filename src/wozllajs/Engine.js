/**
 * a module for game main loop management
 */
wozllajs.module('wozlla.Engine', function() {

    var EVENT_TYPE = 'Engine';
    var engineEventDispatcher = wozlla.util.EventDispatcher();
    var running = true;

    function frame() {
        if(!running) return;
        engineEventDispatcher.fireEvent(EVENT_TYPE);
        requestAnimationFrame(frame, 1000/100);
    }

    return {

        addListener : function(listener) {
            engineEventDispatcher.addEventListener(EVENT_TYPE, listener);
        },
        removeListener : function(listener) {
            engineEventDispatcher.removeEventListener(EVENT_TYPE, listener);
        },
        start : function() {
            running = true;
            requestAnimationFrame(frame, 1000/100);
        },
        stop : function() {
            running = false;
        },

        runStep : function() {
            engineEventDispatcher.fireEvent(EVENT_TYPE);
        }
    }

});