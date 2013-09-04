wozllajs.defineComponent('renderer.TextureButton', function() {

    var TextureButton = function(params) {
        this.initialize(params);
    };

    var p = TextureButton.prototype = Object.create(wozllajs.renderer.JSONTextureRenderer.prototype);

    p.id = 'renderer.TextureButton';

    p.normalIndex = null;

    p.pressIndex = null;

    p.handler = null;

    p.JSONTextureRenderer_initComponent = p.initComponent;

    p.initComponent = function() {
        var _this = this;
        this.JSONTextureRenderer_initComponent();
        this.on('touchstart', function(e) {
            console.log('touchstart');
        });
        this.on('touchend', function(e) {
            console.log('touchend');
        });
        this.on('click', function(e) {
            console.log('click');
        });
    };

    return TextureButton;

});