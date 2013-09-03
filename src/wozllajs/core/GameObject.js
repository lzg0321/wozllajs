this.wozllajs = this.wozllajs || {};

(function() {

	"use strict";

    var testHitCanvas = document.createElement('canvas');
    var testHitContext = testHitCanvas.getContext('2d');
    testHitCanvas.width = 1;
    testHitCanvas.height = 1;

	var GameObject = function(id) {
		this.initialize(id);
	};

	GameObject.prototype = {

		id : null,

		transform : null,

		_renderer : null,

		_collider : null,

		_behaviours : null,

		_parent : null,

		_componentInited : false,

		_active : true,

		_visible : true,

        _layer : null,

        _mouseEnable : true,

        _hitTestDelegate : null,

		_children : null,

		_childrenMap : null,

		_resources : null,

		initialize : function(id) {
			this.id = id;
			this.transform = new wozllajs.Transform();
			this._behaviours = {};
			this._children = [];
			this._childrenMap = {};
			this._resources = [];
		},

		getParent : function() {
			return this._parent;
		},

        getStage : function() {
            var o = this;
            while(o && !o.isStage) {
                o = o._parent;
            }
            return o;
        },

		getObjectById : function(id) {
        	return this._childrenMap[id];
    	},

	    addObject : function(obj) {
	        this._childrenMap[obj.id] = obj;
	        this._children.push(obj);
	        obj._parent = this;
	    },

	    removeObject : function(idOrObj) {
	        var children = this._children;
	        var obj = typeof idOrObj === 'string' ? this._childrenMap[idOrObj] : idOrObj;
	        var idx = wozllajs.arrayRemove(obj, children);
	        if(idx !== -1) {
	            delete this._childrenMap[obj.id];
	        }
	        return idx;
	    },

	    remove : function() {
	        this._parent.removeObject(this);
	        this._parent = null;
	    },

	    findObjectById : function(id) {
	    	var i, len, children;
	        var obj = this.getObjectById(id);
	        if(!obj) {
	            children = this._children;
	            for(i=0,len=children.length; i<len; i++) {
	                obj = children[i].findObjectById(id);
	                if(obj) break;
	            }
	        }
	        return obj;
	    },

        findObjectByPath : function(path) {
            var i, len;
            var paths = path.split('.');
            var obj = this.findObjectById(paths[0]);
            if(obj) {
                for(i=1, len=paths.length; i<len; i++) {
                    obj = obj.getObjectById(paths[i]);
                    if(!obj) return null;
                }
            }
            return obj;
        },

	    isActive : function() {
	    	return this._active;
	    },

	    setActive : function(active) {
	        this._active = !!active;
	    },

	    isVisible : function() {
	    	return this._visible;
	    },

	    setVisible : function(visible) {
	        this._visible = !!visible;
	    },

        getLayer : function(fromParent) {
            if(!fromParent) {
                return this._layer;
            }
            var o = this;
            while(o && !o._layer) {
                o = o._parent;
            }
            return o && o._layer;
        },

        setLayer : function(layer) {
            this._layer = layer;
        },

        isMouseEnable : function() {
            return this._mouseEnable;
        },

        setMouseEnable : function(enable) {
            this._mouseEnable = enable;
        },

        testHit : function(x, y) {
            var hit = false;
            if(this._hitTestDelegate) {
                hit = this._hitTestDelegate.testHit(x, y);
            } else {
                testHitContext.setTransform(1, 0, 0, 1, -x, -y);
                this.draw(testHitContext, this.getStage().getVisibleRect());
                hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
                testHitContext.setTransform(1, 0, 0, 1, 0, 0);
                testHitContext.clearRect(0, 0, 2, 2);
            }
            return hit;
        },

	    loadResources : function(params) {
			this._collectResources(this._resources);
	        wozllajs.ResourceManager.load({
	            items : this._resources,
	            onProgress : params.onProgress,
	            onComplete : params.onComplete
	        });
		},

		releaseResources : function(whiteList) {
	        var i, len, resource;
			var res = this._resources;
	        for(i=0, len=res.length; i<len; i++) {
	            resource = res[i];
	            if(wozllajs.is(resource, 'Image')) {
	                if(whiteList && wozllajs.indexOf(resource.src, whiteList) === -1) {
	                    wozllajs.ResourceManager.disposeImage(resource);
	                }
	            }
	        }
		},

	    init : function() {
	    	var i, len;
			var behaviourId, behaviour;
			var children = this._children;

	    	this._renderer && this._renderer.initComponent();
	    	this._collider && this._collider.initComponent();
	    	for(behaviourId in this._behaviours) {
	    		behaviour = this._behaviours[behaviourId];
	    		behaviour && behaviour.initComponent();
	    	}

	    	for(i=0,len=children.length; i<len; i++) {
	    		children[i].init();
	    	}
            if(this._layer) {
                wozllajs.LayerManager.appendTo(this._layer, this);
            }
	    	this._componentInited = true;
		},

		destroy : function() {
			var i, len;
			var behaviourId, behaviour;
			var children = this._children;

			for(behaviourId in this._behaviours) {
	    		behaviour = this._behaviours[behaviourId];
	    		behaviour && behaviour.destroyComponent();
	    	}
	    	this._collider && this._collider.destroyComponent();
	    	this._renderer && this._renderer.destroyComponent();

	    	for(i=0,len=children.length; i<len; i++) {
	    		children[i].destroy();
	    	}
            wozllajs.LayerManager.removeFrom(this._layer, this);
		},

		update : function() {
			var i, len;
			var behaviourId, behaviour;
			var children = this._children;

			if(!this._componentInited || !this._active) {
				return;
			}

			for(behaviourId in this._behaviours) {
	    		behaviour = this._behaviours[behaviourId];
	    		behaviour && behaviour.update && behaviour.update();
	    	}
	    	this._renderer && this._renderer.update && this._renderer.update();
	    	for(i=0,len=children.length; i<len; i++) {
	    		children[i].update();
	    	}
		},

		lateUpdate : function() {
			var i, len;
			var behaviourId, behaviour;
			var children = this._children;

			if(!this._componentInited || !this._active) {
				return;
			}

			for(behaviourId in this._behaviours) {
	    		behaviour = this._behaviours[behaviourId];
	    		behaviour && behaviour.lateUpdate && behaviour.lateUpdate();
	    	}
	    	this._renderer && this._renderer.lateUpdate && this._renderer.lateUpdate();
	    	for(i=0,len=children.length; i<len; i++) {
	    		children[i].lateUpdate();
	    	}
		},

		draw : function(context, visibleRect) {
			if(!this._componentInited || !this._active || !this._visible) {
				return;
			}

			context.save();
        	this.transform.updateContext(context);
			this._draw(context, visibleRect);

			context.restore();
		},

		setRenderer : function(renderer) {
			this._renderer = renderer;
			renderer.setGameObject(this);
		},

		getRenderer : function() {
			return this._renderer;
		},

		setCollider : function(collider) {
			this._collider = collider;
		},

		getCollider : function() {
			return this._collider;
		},

        setHitTestDelegate : function(delegate) {
            this._hitTestDelegate = delegate;
        },

        getHitTestDelegate : function() {
            return this._hitTestDelegate;
        },

		addBehaviour : function(behaviour) {
			this._behaviours[behaviour.id] = behaviour;
			behaviour.setGameObject(this);
		},

		removeBehaviour : function(behaviour) {
            if(typeof behaviour === 'string') {
                behaviour = this.getBehaviour(behaviour);
                if(!behaviour) {
                    return;
                }
            }
			delete this._behaviours[behaviour.id];
			behaviour.setGameObject(null);
		},

		getBehaviour : function(id) {
			return this._behaviours[id];
		},

        on : function(type, listener) {
            wozllajs.EventAdmin.on(type, this, listener);
        },

        off : function(type, listener) {
            wozllajs.EventAdmin.off(type, this, listener);
        },

        notify : function(type, params) {
            wozllajs.EventAdmin.notify(type, params);
        },

		_draw : function(context, visibleRect) {
			var i, len;
			var children = this._children;
			this._renderer && this._renderer.draw(context, visibleRect);
			for(i=0,len=children.length; i<len; i++) {
	    		children[i].draw(context, visibleRect);
	    	}
		},

		_collectResources : function(collection) {
			var behaviourId, behaviour;
            var i, len;
            var children = this._children;
			for(behaviourId in this._behaviours) {
	    		behaviour = this._behaviours[behaviourId];
	    		behaviour && behaviour._collectResources(collection);
	    	}
	    	this._renderer && this._renderer._collectResources(collection);
            for(i=0,len=children.length; i<len; i++) {
                children[i]._collectResources(collection);
            }
		}

	};

	wozllajs.GameObject = GameObject;

})();