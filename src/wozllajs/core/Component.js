this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	var Component = function(params) {
		this.initialize(params);
	};

	Component.RENDERER = 'renderer';
	Component.COLLIDER = 'collider';
	Component.BEHAVIOUR = 'behaviour';

	Component.prototype = {

	    id : null,

	    alias : null,

	    type : null,

	    gameObject : null,

	    initialize : function(params) {
	    	this.checkParams(params);
	    	for(var p in params) {
	    		if(this[p] !== undefined) {
	    			this[p] = params[p];
	    		}
	    	}
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

        on : function(type, listener) {
            this.gameObject.on(type, listener);
        },

        off : function(type, listener) {
            this.gameObject.off(type, listener);
        },

        notify : function(type, params) {
            this.gameObject.notify(type, params);
        },

	    _collectResources : function(collection) {}
	};

	wozllajs.Component = Component;


})();