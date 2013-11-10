define([
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/preload/AsyncImage',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query',
    './../annotation/$Property',
], function(W, Renderer, AsyncImage, $Resource, $Component, $Query, $Property) {

    $Component({ id: 'renderer.Image', constructor: Image });
    function Image() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Image, Renderer);

    p.alias = 'c-image';

    $Property({ property: 'image', type: 'image'});
    $Resource({ property: 'image' });
    p.image = undefined;

    p.applyProperties = function(properties) {
        var image = properties.image;
        if(image instanceof AsyncImage) {
            this.image = image;
        }
    };

    p.draw = function(context, visibleRect) {
        this.image && this.image.draw(context, 0, 0);
    };

    return Image;

});