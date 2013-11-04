define([
    './component/renderer/Image',
    './component/renderer/Texture',
    './component/renderer/Ninepatch'
], function(Image, Texture, Ninepatch) {

    return {
        renderer : {
            Image : Image,
            Texture : Texture,
            Ninepatch : Ninepatch
        }
    }
});