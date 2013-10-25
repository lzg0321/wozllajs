require.config({
    baseUrl: './',
    urlArgs: "t=" + Date.now(),
    paths: {
//        'wozllajs': './../libs/wozllajs-v2'
    }
});

require([
    './../source/wozllajs',
], function(W) {
    var context = document.getElementById('canvas').getContext('2d');
    W.config({
        canvas : document.getElementById('canvas'),
        width : 960,
        height : 640,
        autoClear : true
    });

    W.onStageInit(function(stage) {
        stage.autoClear = false;
        W.LoadQueue.load('ShuiPaoPao.tt').then(function(result) {
            var texture = result['ShuiPaoPao.tt'];
            texture.drawFrame(context, 'attack/attack0001.png');
        });
    });

});