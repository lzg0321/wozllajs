/**
 * 该类代表一个显示设备，即一个Display对应一个canvas, 该canvas会被添加到
 * {wozlla.Engine}的rootElement中。
 * Display包含一个camera用于定义自身所处的位置变化，包含一个{wozlla.Scene}
 * 对象表示需要显示的对象和组件。
 * 当用到多个Display时使用zIndex去区分Display所处的层的深度。
 *
 */
wozllajs.define('wozlla.Display', {

    statics : {
        /**
         * 存储所有创建的Display
         */
        S_displays : {},
        /**
         * 根据id获取所对应有Display
         * @param id
         * @return {wozlla.Display}
         */
        get : function(id) {
            return this.S_displays[id];
        }
    },

    /**
     * @field {CanvasElement}
     */
    canvas : null,
    /**
     * unique key for this Display
     */
    id : null,

    /**
     * the size of this Display
     */
    width : 0,
    height : 0,

    /**
     * the z of this Display
     */
    zIndex : 0,

    /**
     * 定义该Display的显示区域的信息
     * @field {wozlla.Camera}
     */
    camera : null,

    /**
     * 当前运行中的{wozlla.Scene}
     */
    scene : null,

    /**
     * 指定当前运行的fps
     */
    fps : null,

    _loop : null,

    initialize : function(params) {
        var _this = this;
        this.callParent(arguments);
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'wozlla_Display_' + this.id;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.zIndex = this.zIndex;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.camera = Class.create('wozlla.Camera', {
            display : this,
            context : this.canvas.getContext('2d')
        });

        this._loop = function() {
            var camera = _this.camera;
            var scene = _this.scene;
            var context = camera.context;
            if(scene && scene.inited && scene.active) {

                scene.update(camera);
                scene.lateUpdate(camera);

                context.save();
                if(scene.backgroundColor) {
                    var fillStyle = context.fillStyle;
                    context.fillStyle = this.backgroundColor;
                    context.fillRect(0, 0, camera.width, camera.height);
                    context.fillStyle = fillStyle;
                }
                else {
                    context.clearRect(0, 0, camera.width, camera.height);
                }
                camera.updateContext(context);
                scene.draw(context, camera);
                context.restore();

            }
        };

        wozllajs.getEngine().addListener(this._loop);
    },

    /**
     * 卸载和释放当前Display资源
     */
    dispose : function() {
        this._disposeCanvas();
        delete this.S_displays[this.id];
        wozllajs.getEngine().removeListener(this._loop);
    },

    /**
     * 设置当前Display运行的{wozlla.Scene}
     * @param scene
     */
    setScene : function(scene) {
        this.scene = scene;
    },

    _disposeCanvas : function() {
        // ludei's cocoonjs provide a method named 'dispose' to GC immediately.
        this.canvas.dispose && this.canvas.dispose();
    }

});