define([
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/assets/Texture',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query',
    './../annotation/$Property'
], function(W, Renderer, Texture, $Resource, $Component, $Query, $Property) {

    $Component({ id: 'renderer.Ninepatch', constructor: Ninepatch });
    function Ninepatch() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Ninepatch, Renderer);

    p.alias = 'c-9patch';

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

    $Property({ property: 'grid', type: 'position' });
    p.grid = undefined;

    $Property({ property: 'size', type: 'size' });
    p.size = undefined;

    p.applyProperties = function(properties) {
        var texture = properties.texture;
        if(texture instanceof Texture) {
            this.texture = texture;
        }
        this.frame = properties.frame;
    };

    p.draw = function(context, visibleRect) {
        this.texture && this.texture.drawAs9Grid(context, this.frame, this.grid, this.size.width, this.size.height);
    };

    return Ninepatch;

});