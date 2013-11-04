define([
    './var',
    './../wozllajs/preload/AsyncImage',
    './../wozllajs/preload/Loader',
    './../wozllajs/preload/ImageLoader',
    './../wozllajs/preload/LoadQueue',
    './../wozllajs/preload/JSONLoader',
    './../wozllajs/preload/StringLoader'
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