define([
    './var',
    './preload/AsyncImage',
    './preload/Loader',
    './preload/ImageLoader',
    './preload/LoadQueue'
], function(W, AsyncImage, Loader, ImageLoader, LoadQueue) {

    return {
        AsyncImage : AsyncImage,
        Loader : Loader,
        ImageLoader : ImageLoader,
        LoadQueue : LoadQueue
    };
});