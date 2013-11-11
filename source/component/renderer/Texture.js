define([
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/assets/Texture',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query',
    './../annotation/$Property'
], function(W, Renderer, TextureAsset, $Resource, $Component, $Query, $Property) {

    $Component({ id: 'renderer.Texture', constructor: Texture });
    function Texture() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Texture, Renderer);

    p.alias = 'c-texture';

    $Property({ property: 'texture', type: 'texture' });
    $Resource({ property: 'texture' });
    p.texture = undefined;

    $Property({
        property: 'frame',
        type: 'texture_frame',
        config: {
            sourceProperty: 'texture'
        }
    });
    p.frame = undefined;

    p.draw = function(context, visibleRect) {
        this.texture && this.texture.drawFrame(context, this.frame);
    };

    p.applyProperties = function(properties) {
        var texture = properties.texture;
        if(texture instanceof TextureAsset) {
            this.texture = texture;
        }
        this.frame = properties.frame;
    };

    return Texture;

});