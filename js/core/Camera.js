
WozllaJS.define('Camera', function($) {

    function Camera(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.transform = new $.Transform();
    }

    Camera.prototype = {

        applyTransform : function() {
            this.transform.applyToContext(this.context);
        }

    };


    return Camera;

});