define([
    './../var',
    './../math/Rectangle',
    './CachableGameObject'
], function(W, Rectangle, CachableGameObject) {

    var visibleRect = new Rectangle();

    var Stage = function(param) {
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
        this._width = param.width;
        this._height = param.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext('2d');
    };

    Stage.root = null;

    var p = W.inherits(Stage, CachableGameObject);

    p.isStage = false;

    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };

    p.draw = function() {
        this.autoClear && this.stageContext.clearRect(0, 0, this._width, this._height);
        CachableGameObject.prototype.draw.apply(this, [this.stageContext, this.getVisibleRect()]);
    };

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this._width = width;
        this._height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this._width;
        visibleRect.height = this._height;
        return visibleRect;
    };

    return Stage;

});