Class.define('wozlla.Display', {

    statics : {
        S_displays : {},
        get : function(id) {
            return this.S_displays[id];
        }
    },

    canvas : null,
    id : null,
    width : 0,
    height : 0,
    zIndex : 0,
    camera : null,

    scene : null,

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
            if(scene) {

                scene.update(camera);
                scene.lateUpdate(camera);

                context.save();
                camera.updateContext(context);
                if(scene.backgroundColor) {
                    var fillStyle = context.fillStyle;
                    context.fillStyle = this.backgroundColor;
                    context.fillRect(0, 0, camera.width, camera.height);
                    context.fillStyle = fillStyle;
                }
                else {
                    context.clearRect(0, 0, camera.width, camera.height);
                }
                scene.draw(context, camera);
                context.restore();

            }
        };

        wozllajs.getEngine().addListener(this._loop);
    },

    dispose : function() {
        this._disposeCanvas();
        delete this.S_displays[this.id];
        wozllajs.getEngine().removeListener(this._loop);
    },

    setScene : function(scene) {
        this.scene = scene;
    },

    _disposeCanvas : function() {
        // ludei's cocoonjs provide a method named 'dispose' to GC immediately.
        this.canvas.dispose && this.canvas.dispose();
    }

});