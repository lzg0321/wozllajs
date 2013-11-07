
define('wozllajs/component/renderer/Image',[
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
define('wozllajs/component/renderer/Ninepatch',[
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query'
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
define('wozllajs/component/renderer/Texture',[
    'wozllajs',
    'wozllajs/core/Renderer',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query'
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
define('wozllajs_components',[
    'wozllajs',
    './wozllajs/component/renderer/Image',
    './wozllajs/component/renderer/Ninepatch',
    './wozllajs/component/renderer/Texture'
], function(wozllajs, Image, Ninepatch, Texture) {

    wozllajs.renderer = wozllajs.renderer || {};
    wozllajs.renderer.Image = Image;
    wozllajs.renderer.Ninepatch = Ninepatch;
    wozllajs.renderer.Texture = Texture;

    return wozllajs;

});