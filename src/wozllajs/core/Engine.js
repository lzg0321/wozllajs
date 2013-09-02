this.wozllajs = this.wozllajs || {};

this.wozllajs.Engine = (function() {

	var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(frameCall, intervalTime) {
            setTimeout(frameCall, intervalTime);
        };


    var Time = wozllajs.Time;
    var EVENT_TYPE = 'Engine';
    var engineEventDispatcher = new wozllajs.EventDispatcher();
    var running = true;
    var frameTime;

    /**
     * 主循环中一帧
     */
    function frame() {
        if(!running) {
            Time.reset();
            return;
        }
        Time.update();
        engineEventDispatcher.fireEvent(EVENT_TYPE);
        requestAnimationFrame(frame, frameTime);
    }

    return {

        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener : function(listener) {
            // special for Stage
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(stage.__engineTick) {
                    return;
                }
                stage.__engineTick = function() {
                    stage.update();
                    stage.lateUpdate();
                    stage.draw();
                };
                listener = stage.__engineTick;
            }
            engineEventDispatcher.addEventListener(EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener : function(listener) {
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(!stage.__engineTick) {
                    return;
                }
                listener = stage.__engineTick;
                stage.__engineTick = null;
            }
            engineEventDispatcher.removeEventListener(EVENT_TYPE, listener);
        },

        /**
         * 开始主循环或重新开始主循环
         */
        start : function(newFrameTime) {
            frameTime = newFrameTime || 10;
            running = true;
            requestAnimationFrame(frame, frameTime);
        },

        /**
         * 停止主循环
         */
        stop : function() {
            running = false;
        },

        /**
         * 运行一步
         */
        runStep : function() {
            Time.update();
            Time.delta = frameTime;
            engineEventDispatcher.fireEvent(EVENT_TYPE);
        }
    }

})();