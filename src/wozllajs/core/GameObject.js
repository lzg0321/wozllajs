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

        UID : null,

		id : null,

        isGameObject : true,

		transform : null,

		_renderer : null,

		_collider : null,

        _layout : null,

		_behaviours : null,

        _aliasMap : null,

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

        _cacheCanvas : null,

        _cacheContext : null,

        _cached : false,

        _cacheOffsetX : 0,

        _cacheOffsetY : 0,

		initialize : function(id) {
            this.UID = wozllajs.UniqueKeyGen ++;
			this.id = id;
			this.transform = new wozllajs.Transform();
			this._behaviours = {};
            this._aliasMap = {};
			this._children = [];
			this._childrenMap = {};
			this._resources = [];
		},

		getParent : function() {
			return this._parent;
		},

        getPath : function(seperator) {
            var o = this;
            var path = [];
            var deep = 0;
            while(o) {
                path.unshift(o.id);
                o = o._parent;
            }
            return path.join(seperator || '.');
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
            obj.transform.parent = this.transform;
	    },

	    removeObject : function(idOrObj) {
	        var children = this._children;
	        var obj = typeof idOrObj === 'string' ? this._childrenMap[idOrObj] : idOrObj;
	        var idx = wozllajs.arrayRemove(obj, children);
	        if(idx !== -1) {
	            delete this._childrenMap[obj.id];
                obj._parent = null;
                obj.transform.parent = null;
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

        getChildren : function() {
            return this._children;
        },

        sortChildren : function(func) {
            this._children.sort(func);
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

        getEventLayer : function() {
            var layer;
            var layerZ;
            var layers;
            var i, len;
            var o = this;
            var getLayerZ = wozllajs.LayerManager.getLayerZ;
            while(o) {
                if(o._layer) {
                    layers = o._layer.split(',');
                    for(i=0,len=layers.length; i<len; i++) {
                        layer = layers[i];
                        layerZ = getLayerZ(layer);
                        if(parseInt(layerZ) === layerZ) {
                            return layer;
                        }
                    }
                }
                o = o._parent;
            }
            return -9999999;
        },

        setLayer : function(layer) {
            this._layer = layer;
        },

        isInLayer : function(layer) {
            return this._layer && this._layer.indexOf(layer) !== -1;
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
            }
            else if(this._cacheCanvas && this._cached) {
                hit = this._cacheContext.getImageData(-this._cacheOffsetX+x, -this._cacheOffsetY+y, 1, 1).data[3] > 1;
            }
            else {
                testHitContext.setTransform(1, 0, 0, 1, -x, -y);
                this._draw(testHitContext, this.getStage().getVisibleRect());
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
            this.uncache();
		},

	    init : function() {
	    	var i, len, layers;
			var behaviourId, behaviour;
			var children = this._children;
            this._layout && this._layout.initComponent();
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
                layers = this._layer.split(',');
                for(i=0,len=layers.length; i<len; i++) {
                    if(layers[i]) {
                        wozllajs.LayerManager.appendTo(layers[i], this);
                    }
                }
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
            this._layout && this._layout.destroyComponent();
	    	for(i=0,len=children.length; i<len; i++) {
	    		children[i].destroy();
	    	}
            wozllajs.LayerManager.removeFrom(this._layer, this);
		},

        layout : function() {
            var i, len;
            var children = this._children;
            this._layout && this._layout.doLayout();
            for(i=0,len=children.length; i<len; i++) {
                children[i].layout();
            }
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
            var cacheContext;
			if(!this._componentInited || !this._active || !this._visible) {
				return;
			}

			context.save();
        	this.transform.updateContext(context);
            if(this._cacheCanvas) {
                if(!this._cached) {
                    cacheContext = this._cacheContext;
                    cacheContext.translate(-this._cacheOffsetX, -this._cacheOffsetY);
                    this._draw(cacheContext, visibleRect);
                    cacheContext.translate(this._cacheOffsetX, this._cacheOffsetY);
                    this._cached = true;
                }
                context.drawImage(this._cacheCanvas, this._cacheOffsetX, this._cacheOffsetY);
            } else {
			    this._draw(context, visibleRect);
            }

			context.restore();
		},

        cache : function(x, y, width, height) {
            if(this._cacheCanvas) {
                this.uncache();
            }
            this._cacheOffsetX = x;
            this._cacheOffsetY = y;
            this._cacheCanvas = wozllajs.createCanvas(width, height);
            this._cacheContext = this._cacheCanvas.getContext('2d');
            this._cached = false;
        },

        uncache : function() {
            if(this._cacheCanvas) {
                this._cacheCanvas.dispose && this._cacheCanvas.dispose();
                this._cacheCanvas = null;
            }
            this._cached = false;
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
            this._collider.setGameObject(this);
		},

		getCollider : function() {
			return this._collider;
		},

        setLayout : function(layout) {
            this._layout = layout;
            this._layout.setGameObject(this);
        },

        getLayout : function() {
            return this._layout;
        },

        setHitTestDelegate : function(delegate) {
            this._hitTestDelegate = delegate;
            this._hitTestDelegate.setGameObject(this);
        },

        getHitTestDelegate : function() {
            return this._hitTestDelegate;
        },

		addBehaviour : function(behaviour) {
			this._behaviours[behaviour.id] = behaviour;
            this._aliasMap[behaviour.alias] = behaviour;
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
            delete this._aliasMap[behaviour.alias]
			behaviour.setGameObject(null);
		},

		getBehaviour : function(id) {
			return this._behaviours[id] || this._aliasMap[id];
		},

        on : function(type, listener, scope) {
            var proxy = listener[this._getSimpleProxyKey(scope, type)] = wozllajs.proxy(listener, scope);
            wozllajs.EventAdmin.on(type, this, proxy, scope);
        },

        once : function(type, listener, scope) {
            var proxy = listener[this._getSimpleProxyKey(scope, type)] = wozllajs.proxy(listener, scope);
            wozllajs.EventAdmin.once(type, this, proxy, scope);
        },

        off : function(type, listener, scope) {
            wozllajs.EventAdmin.off(type, this, listener[this._getSimpleProxyKey(scope, type)]);
        },

        notify : function(type, params) {
            wozllajs.EventAdmin.notify(type, params);
        },

        _getSimpleProxyKey : function(scope, type) {
            return '_sp_' + scope.UID + '.' + type;
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