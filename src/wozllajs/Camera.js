wozllajs.define('wozlla.Camera', {

    extend : 'wozlla.GameObject',

    display : null,

    context : null,

    width : 0,
    height : 0,

    initialize : function() {
        this.callParent(arguments);
        this.width = this.display.canvas.width;
        this.height = this.display.canvas.height;
    }

});