define(function(require) {

    var Objects = require('../utils/Objects');
    var UnityGameObject = require('./UnityGameObject');
    var Filter = require('./Filter');
    var createCanvas = require('../utils/createCanvas');

    var CachableGameObject = function(param) {
        UnityGameObject.apply(this, arguments);

        this._cacheCanvas = null;
        this._cacheContext = null;
        this._cached = false;
        this._cacheOffsetX = 0;
        this._cacheOffsetY = 0;
    };

    var p = Objects.inherits(CachableGameObject, UnityGameObject);

    p.cache = function(x, y, width, height) {
        if(this._cacheCanvas) {
            this.uncache();
        }
        this._cacheOffsetX = x;
        this._cacheOffsetY = y;
        this._cacheCanvas = createCanvas(width, height);
        this._cacheContext = this._cacheCanvas.getContext('2d');
        this._cached = false;
    };

    p.updateCache = function(offsetX, offsetY) {
        this._cached = false;
        this._cacheOffsetX = offsetX || this._cacheOffsetX;
        this._cacheOffsetY = offsetY || this._cacheOffsetY;
    };

    p.translateCache = function(deltaX, deltaY) {
        this._cached = false;
        this._cacheOffsetX += deltaX;
        this._cacheOffsetY += deltaY;
    };

    p.uncache = function() {
        if(this._cacheCanvas) {
            this._cacheContext.dispose && this._cacheContext.dispose();
            this._cacheCanvas.dispose && this._cacheCanvas.dispose();
            this._cacheCanvas = null;
        }
        this._cached = false;
    };

    p._draw = function(context, visibleRect) {
        if(this._cacheCanvas) {
            if(!this._cached) {
                this._drawCache();
                this._cached = true;
            }
            context.drawImage(this._cacheCanvas, 0, 0);
        } else {
            UnityGameObject.prototype._draw.apply(this, arguments);
        }
    };

    p._drawCache = function(context, visibleRect) {
        var cacheContext = this._cacheContext;
        cacheContext.clearRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
        cacheContext = this._cacheContext;
        cacheContext.translate(-this._cacheOffsetX, -this._cacheOffsetY);
        UnityGameObject.prototype._draw.apply(this, [cacheContext, visibleRect]);
        cacheContext.translate(this._cacheOffsetX, this._cacheOffsetY);
        this._applyFilters(cacheContext, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
    };

    p._applyFilters = function(cacheContext, x, y, width, height) {
        var id, filter;
        var filters = this.getComponents(Filter);
        for(id in filters) {
            cacheContext.save();
            filter = filters[id];
            filter.applyFilter(cacheContext, x, y, width, height);
            cacheContext.restore();
        }
    };

    return CachableGameObject;
});