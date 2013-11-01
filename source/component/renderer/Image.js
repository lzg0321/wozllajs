define([
    './../../var',
    './../../core/Renderer',
    './../../build/annotation/$Resource',
    './../../build/annotation/$Component',
    './../../build/annotation/$Query'
], function(W, Renderer, $Resource, $Component, $Query) {

    $Component({ id: 'renderer.Image', constructor: Image });
    function Image() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Image, Renderer);

    p.alias = 'x-image';

    $Resource({ property: 'image' });
    p.image = undefined;

    $Query({ property: 'obj' });
    p.obj = undefined;

    p.draw = function(context, visibleRect) {
        this.image.draw(context, 0, 0);
    };

    return Image;

});