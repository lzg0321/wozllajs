define([
    './../var',
    './CachableGameObject'
], function(W, CachableGameObject) {

    var visibleRect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    var Stage = function(param) {
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
        this.width = param.width;
        this.height = param.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext('2d');
    };

    Stage.root = null;

    var p = Stage.prototype;

    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };

    p.draw = function() {
        this.autoClear && this.stageContext.clearRect(0, 0, this.width, this.height);
        CachableGameObject.prototype.draw.apply(this, [this.stageContext, this.getVisibleRect()]);
    };

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this.width = width;
        this.height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this.width;
        visibleRect.height = this.height;
        return visibleRect;
    };

    W.extend(Stage, CachableGameObject);

    return Stage;

});