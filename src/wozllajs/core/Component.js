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

	    _collectResources : function(collection) {}
	};

	wozllajs.Component = Component;


})();