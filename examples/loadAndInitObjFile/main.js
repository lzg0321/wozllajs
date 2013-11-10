
require.config({
    baseUrl: './',
    urlArgs: "t=" + Date.now(),
    paths: {
                'wozllajs': '../../libs/wozllajs-v2',
        'wozllajs_components': '../../libs/wozllajs-v2-components'
//        'wozllajs': './../../source/wozllajs',
//        'wozllajs_components': './../../source/wozllajs_components'
    },
    shim: {
        'wozllajs_components': {
            deps: ['wozllajs']
        }
    },
});

require([
    'wozllajs',
    'wozllajs_components',
    './map/AModule'
], function() {
    var W = wozllajs;
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
