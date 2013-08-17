/**
 * 主循环引擎
 */
Class.module('wozllajs.Engine', function() {

    var EVENT_TYPE = 'Engine';
    var engineEventDispatcher = wozllajs.util.EventDispatcher();
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
        }
    }

});