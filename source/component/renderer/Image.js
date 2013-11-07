define([
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query'
], function(W, Renderer, $Resource, $Component, $Query) {

    $Component({ id: 'renderer.Image', constructor: Image });
    function Image() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Image, Renderer);

    p.alias = 'c-image';

    $Resource({ property: 'image' });
    p.image = undefined;

    p.draw = function(context, visibleRect) {
        this.image.draw(context, 0, 0);
    };

    return Image;

});