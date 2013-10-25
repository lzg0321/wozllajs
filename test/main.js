//require.config({
//    baseUrl: './',
//    paths: {
//        'wozllajs': './../libs/wozllajs-v2'
//    }
//});



require([
    './../source/wozllajs',
], function(W) {
    W.config({
        canvas : document.getElementById('canvas'),
        width : 960,
        height : 640,
        autoClear : true
    });

    W.onStageInit(function(stage) {
        console.log(stage);
    });

});