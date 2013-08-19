/**
 * 场景对象，简单地继承GameObject
 * @class {wozlla.Scene}
 */
wozllajs.define('wozlla.Scene', {

    extend : 'wozlla.GameObject',

    /**
     * 一个标识，标识这个对象是一个场景
     */
    isScene : true,

    /**
     * 背景颜色，用于Display循环中填充背景
     */
    backgroundColor : null,

    initialize : function() {
        this.callParent(arguments);
        if(!this.id) {
            // 默认给个id
            this.id = 'Scene_' + Date.now() + Math.random();
        }
    }

});