Class.define('wozlla.Display', {

    statics : {
        Displays : {},
        get : function(id) {
            return this.Displays[id];
        }
    },

    canvas : null,
    id : null,
    width : 0,
    height : 0,
    zIndex : 0,

    initialize : function(params) {
        this.callParent(arguments);
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'display_' + this.id;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.zIndex = this.zIndex;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    createCamera : function() {
        return Class.create('wozlla.Camera', {
            context : this.canvas.getContext('2d')
        });
    },

    dispose : function() {
        this._disposeCanvas();
        delete this.Displays[this.id];
    },

    _disposeCanvas : function() {
        // ludei's cocoonjs provide a method named 'dispose' to GC immediately.
        this.canvas.dispose && this.canvas.dispose();
    }

});