/**
 * this singleton controls main loop of game.
 *
 *
 *
 */
WozllaJS.define('Engine', function($) {

    var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(frameCall, intervalTime) {
                setTimeout(frameCall, intervalTime);
            };

    var displayCanvas;
    var running = true;
    var loopListeners = [];

    return {

        init : function(width, height, canvas) {
            displayCanvas = canvas;
            canvas.width = width;
            canvas.height = height;

            loopListeners = [];
            $.Time.reset();
            this.addMainLoopListener(function() {
                $.Time.update();
            });
        },

        addMainLoopListener : function(listener) {
            loopListeners.push(listener);
        },

        removeMainLoopListener : function(listener) {

        },

        startMainLoop : function() {
            running = true;

            function frame() {
                if(!running) return;

                var i, len =loopListeners.length;
                for(i=0; i<len; i++) {
                    loopListeners[i]();
                }

                requestAnimationFrame(frame, 1000/100);

            }

            requestAnimationFrame(frame, 1000/100);
        },

        stopMainLoop : function() {
            running = false;
        },

        getDisplayCanvas : function() {
            return displayCanvas;
        }

    }

});