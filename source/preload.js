define([
    './var',
    './preload/AsyncImage',
    './preload/Loader',
    './preload/ImageLoader',
    './preload/LoadQueue',
    './preload/JSONLoader',
    './preload/StringLoader'
], function(W, AsyncImage, Loader, ImageLoader, LoadQueue, JSONLoader, StringLoader) {

    return {
        AsyncImage : AsyncImage,
        Loader : Loader,
        ImageLoader : ImageLoader,
        LoadQueue : LoadQueue,
        JSONLoader : JSONLoader,
        StringLoader : StringLoader
    };
});