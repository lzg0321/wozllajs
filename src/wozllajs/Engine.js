/**
 * 该类封装了requestAnimationFrame去控制游戏的主循环
 *
 * @module {wozlla.Engine}
 */
wozllajs.module('wozlla.Engine', function() {

    var EVENT_TYPE = 'Engine';
    var engineEventDispatcher = wozlla.util.EventDispatcher();
    var running = true;

    /**
     * 主循环中一帧
     */
    function frame() {
        if(!running) return;
        engineEventDispatcher.fireEvent(EVENT_TYPE);
        requestAnimationFrame(frame, 1000/100);
    }

    return {

        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener : function(listener) {
            engineEventDispatcher.addEventListener(EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener : function(listener) {
            engineEventDispatcher.removeEventListener(EVENT_TYPE, listener);
        },

        /**
         * 开始主循环或重新开始主循环
         */
        start : function() {
            running = true;
            requestAnimationFrame(frame, 1000/100);
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
            engineEventDispatcher.fireEvent(EVENT_TYPE);
        }
    }

});