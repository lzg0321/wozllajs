define([
    './../var',
    './LoadQueue'
], function(W, LoadQueue) {

    var AsyncImage = function(imageId) {
        this.imageId = imageId;
    };

    var p = AsyncImage.prototype;

    p.draw = function(context) {
        // TODO optimize performance for slice and unshift
        var args = W.slice(arguments, 1);
        var image = LoadQueue.get(this.imageId);
        if(image) {
            args.unshift(image);
            context.drawImage.apply(context, args);
        }
    };

    p.dispose = function() {
        var image = LoadQueue.get(this.imageId);
        if(image) {
            LoadQueue.remove(this.imageId);
            // for Ludei
            image.dispose && image.dispose();
        }
    };

    p.reload = function() {

    };

    return AsyncImage;
});