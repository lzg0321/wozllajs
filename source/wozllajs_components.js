define([
    'wozllajs',
    './component/annotation/$Property',
    './component/renderer/Image',
    './component/renderer/Ninepatch',
    './component/renderer/Texture',
    './component/renderer/FrameAnimation'
], function(wozllajs, $Property, Image, Ninepatch, Texture, FrameAnimation) {

    wozllajs.annotation.$Property = $Property;
    wozllajs.renderer = wozllajs.renderer || {};
    wozllajs.renderer.Image = Image;
    wozllajs.renderer.Ninepatch = Ninepatch;
    wozllajs.renderer.Texture = Texture;
    wozllajs.renderer.FrameAnimation = FrameAnimation;

    return wozllajs;

});