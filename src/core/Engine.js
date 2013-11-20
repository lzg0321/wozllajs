define(function(require) {

    var Tuple = require('../utils/Tuple');
    var Time = require('./Time');
    var Stage = require('./Stage');

    var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(frameCall, intervalTime) {
                setTimeout(frameCall, intervalTime);
            };

    var ENGINE_EVENT_TYPE = 'Engine';
    var engineEventListeners = new Tuple();
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
        fireEngineEvent();
        // is it good?
        Stage.root && Stage.root.tick();
        requestAnimationFrame(frame, frameTime);
    }

    function fireEngineEvent() {
        var i, len, listener, ret;
        var listeners = engineEventListeners.get(ENGINE_EVENT_TYPE);
        if(!listeners || listeners.length === 0) {
            return;
        }
        listeners = [].concat(listeners);
        for(i=0, len=listeners.length; i<len; i++) {
            listener = listeners[i];
            listener.apply(listener, arguments);
        }
    }

    return {

        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener : function(listener) {
            engineEventListeners.push(ENGINE_EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener : function(listener) {
            engineEventListeners.remove(ENGINE_EVENT_TYPE, listener);
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
            fireEngineEvent();
        }
    }

});