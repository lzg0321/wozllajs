require.config({
    baseUrl: './',
    paths: {
        'all': './../libs/wozllajs-v2'
    }
});

require([
    'all'
//    '../source/all'
], function(W) {
    console.log(W);
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