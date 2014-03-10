define(function(require) {

	/*
		SpriteContainer: 1
		Sprite: 2
		BitmapText: 3
		DOMElement: 4
	 */

	var idMap = {};

	var Objects = require('../utils/Objects');
	var CachableGameObject = require('./CachableGameObject');
	var GameObjectEvent = require('./events/GameObjectEvent');

	var GLGameObject = function() {
		var me = this;
		CachableGameObject.apply(this, arguments);
		if(this.id) {
			idMap[this.id] = this;
			this.addEventListener(GameObjectEvent.DESTROY, function(e) {
				if(e.target !== me) return;
				e.removeListener();
				delete idMap[me.id];
			});
		}
	};

	GLGameObject.idMap = idMap;

	var p = Objects.inherits(GLGameObject, CachableGameObject);

	p.isRenderable = function() {
		return !(!this._initialized || !this._active || !this._visible);
	};

	p.draw = function(webGLContext, webGLStage, parentMartrix) {
		var mask, optimized;
		if(!this._initialized || !this._active || !this._visible) return;
		this._draw(webGLContext, webGLStage, parentMartrix);
		/// /context.restore();
		this._doDelayRemove();
	};

	p._draw = function(webGLContext, webGLStage, parentMartrix) {
		var i, len, child, gBounds, mask;
		var children = this._children;
		if(children.length <= 0) {
			// TODO clip
			//mask = this.getComponent(Mask);
//			mask && mask.clip(context);
			this.sendMessage('draw', arguments, Renderer);
			//}
		} else {
			// TODO clip
//			mask = this.getComponent(Mask);
//			mask && mask.clip(context);
			for(i=0,len=children.length; i<len; i++) {
				child = children[i];
				child.draw(webGLContext, webGLStage, parentMartrix);
			}
		}
	};

	GLGameObject.getById = function(id) {
		return idMap[id];
	};

	return GLGameObject;
});