W.define('ImageRenderer', function($) {

    function ImageRenderer() {
        $.Renderer.call(this);


    }

    ImageRenderer.prototype = $.extend($.Renderer, {

        imageSrc : null,

        getResources : function() {

        },

        render : function(context) {
            context.draw(this.image, 0, 0);
        }
    });

    return ImageRenderer;
});