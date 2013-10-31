define([
    './../../var',
    './../../core/Renderer',
    './../../build/annotation/$Resource',
    './../../build/annotation/$Component'
], function(W, Renderer, $Resource, $Component) {

    $Component({ id: 'renderer.Image', constructor: Image });
    function Image() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Image, Renderer);

    $Resource({ property: 'src' });
    p.src = undefined;

    p.draw = function(context, visibleRect) {

    };

    return Image;

});