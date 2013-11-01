require.config({
    baseUrl: './',
    urlArgs: "t=" + Date.now()
});

require([
    '../../source/wozllajs'
], function(W) {
    var context = document.getElementById('canvas').getContext('2d');
    W.config({
        canvas : document.getElementById('canvas'),
        width : 960,
        height : 640,
        autoClear : true
    });

    W.onStageInit(function(stage) {
        W.loadAndInitObjFile('obj.o').then(function(obj) {
            console.log(stage);
            stage.addObject(obj);
        });
    });

});