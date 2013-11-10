define([
    'wozllajs',
    './component/annotation/$Property',
    './component/renderer/Image',
    './component/renderer/Ninepatch',
    './component/renderer/Texture'
], function(wozllajs, $Property, Image, Ninepatch, Texture) {

    wozllajs.annotation.$Property = $Property;
    wozllajs.renderer = wozllajs.renderer || {};
    wozllajs.renderer.Image = Image;
    wozllajs.renderer.Ninepatch = Ninepatch;
    wozllajs.renderer.Texture = Texture;

    return wozllajs;

});