define(function (require, exports, module) {

    /**
     * @class wozllajs.events.Event
	 * 	Event类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * @constructor
     * @param {Object} params
     * @param {String} params.type 指定事件类型
     * @param {Boolean} [params.bubbles=false] 指定事件是否冒泡
     */

    var Event = function(params) {

        /**
         * 事件类型
         * @type {String}
		 * @readonly
         */
        this.type = params.type;

        /**
         * 事件目标
         * @type {EventTarget}
		 * @readonly
         */
        this.target = null;

        /**
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。
         * @type {EventTarget}
		 * @readonly
         */
        this.currentTarget = null;

        /**
         * 事件流中的当前阶段。
         * @type {int}
		 * @readonly
         */
        this.eventPhase = null;

        /**
         * 表示事件是否为冒泡事件。
         * @type {Boolean}
		 * @readonly
         */
        this.bubbles = params.bubbles;

        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
        this._defaultPrevented = false;
        this._listenerRemoved = false;
    };

    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;

    var p = Event.prototype;

	p.isPropagationStopped = function() {
		return this._propagationStoped;
	};

    /**
     * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
     */
    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };

    /**
     * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
     */
    p.stopPropagation = function() {
        this._propagationStoped = true;
    };

    /**
     * 如果可以取消事件的默认行为，则取消该行为。
     */
    p.preventDefault = function() {
        this._defaultPrevented = true;
    };

    /**
     * 移除当前正在处理事件的侦听器。
     */
    p.removeListener = function() {
        this._listenerRemoved = true;
    };

    module.exports = Event;

});