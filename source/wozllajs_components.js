define('wozllajs/component', [
    'wozllajs',
    './component/renderer/Image',
    './component/renderer/Ninepatch',
    './component/renderer/Texture'
], function(wozllajs, Image, Ninepatch, Texture) {

    wozllajs.renderer = wozllajs.renderer || {};
    wozllajs.renderer.Image = Image;
    wozllajs.renderer.Ninepatch = Ninepatch;
    wozllajs.renderer.Texture = Texture;

    return wozllajs;

});