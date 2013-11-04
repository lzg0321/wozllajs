define([
    './../../var',
    './.././Renderer',
    './../../build/annotation/$Resource',
    './.././annotation/$Component',
    './.././annotation/$Query'
], function(W, Renderer, $Resource, $Component, $Query) {

    $Component({ id: 'renderer.Ninepatch', constructor: Ninepatch });
    function Ninepatch() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(Ninepatch, Renderer);

    p.alias = 'c-9patch';

    $Resource({ property: 'texture' });
    p.texture = undefined;

    p.frame = undefined;

    p.grid = undefined;

    p.size = undefined;

    p.draw = function(context, visibleRect) {
        this.texture.drawAs9Grid(context, this.frame, this.grid, this.size.width, this.size.height);
    };

    return Ninepatch;

});