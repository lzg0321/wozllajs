this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	var Component = function(params) {
		this.initialize(params);
	};

	Component.RENDERER = 'renderer';
	Component.COLLIDER = 'collider';
    Component.LAYOUT = 'layout';
    Component.HIT_TEST = 'hitTest';
	Component.BEHAVIOUR = 'behaviour';

    Component.decorate = function(name, proto, superName, superConstructor) {
        superConstructor = superConstructor || Component;
        function DecorateComponent(params) {
            this.initialize(params);
        }
        var p = DecorateComponent.prototype = Object.create(superConstructor.prototype);
        for(var k in proto) {
            if(p[k] && (typeof proto[k] === 'function')) {
                p[superName + "_" + k] = p[k];
            }
            p[k] = proto[k];
        }
        return DecorateComponent;
    };

	Component.prototype = {

        UID : null,

	    id : null,

	    alias : null,

	    type : null,

        silent : false,

	    gameObject : null,

	    initialize : function(params) {
	    	this.checkParams(params);
	    	for(var p in params) {
	    		if(this[p] !== undefined) {
	    			this[p] = params[p];
	    		}
	    	}
            this.UID = wozllajs.UniqueKeyGen ++;
	    },

	    checkParams : function(params) {},

	    initComponent : function() {},

	    destroyComponent : function() {},

	    setGameObject : function(gameObject) {
	    	this.gameObject = gameObject;
	    },

	    getResourceById : function(id) {
	        return wozllajs.ResourceManager.getResource(id);
	    },

        on : function(type, listener, scope) {
            this.gameObject.on(type, listener, scope || this);
        },

        off : function(type, listener, scope) {
            this.gameObject.off(type, listener, scope || this);
        },

        notify : function(type, params) {
            this.gameObject.notify(type, params);
        },

	    _collectResources : function(collection) {}
	};

	wozllajs.Component = Component;


})();