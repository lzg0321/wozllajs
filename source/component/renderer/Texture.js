define([
    './../../var',
    './../../core/Renderer',
    './../../build/annotation/$Resource',
    './../../build/annotation/$Component',
    './../../build/annotation/$Query'
], function(W, Renderer, $Resource, $Component, $Query) {

    $Component({ id: 'renderer.Texture', constructor: Texture });
    function Texture() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Texture, Renderer);

    p.alias = 'c-texture';

    $Resource({ property: 'texture' });
    p.texture = undefined;

    p.frame = undefined;

    p.draw = function(context, visibleRect) {
        this.texture.drawFrame(context, this.frame);
    };

    return Texture;

});