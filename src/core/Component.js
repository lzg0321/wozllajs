define(function(require) {

    var loader = require('../assets/loader');
    var uniqueKey = require('../utils/uniqueKey');

	var registry = {};

    function Component(properties) {
        this.UID = uniqueKey();
        this.gameObject = null;
		this.properties = properties || {};
    }

	Component.getConstructor = function(idOrAlias) {
		var ctor = registry[idOrAlias];
		if(!ctor) {
			console.log('[Warn] Unknow component "' + idOrAlias + '"');
		}
		return ctor;
	};

	Component.getRegistry = function() {
		return registry;
	};

	Component.unregisterAll = function() {
		registry = {};
	};

	Component.register = function(compCtor) {
		var id = compCtor.prototype.id;
		var alias = compCtor.prototype.alias;
		if(!id || !alias) {
			throw new Error('component must define id and alias.');
		}
		if(registry[id]) {
			throw new Error('component id "' + id + '" has been registered.');
		}
		if(registry[alias]) {
			throw new Error('component alias "' + alias + '" has been registered.');
		}
		registry[id] = compCtor;
		registry[alias] = compCtor;
	};

    var p = Component.prototype;

	p.id = undefined;

    p.alias = undefined;

    p.setGameObject = function(gameObject) {
        this.gameObject = gameObject;
    };

	p.applyProperties = function() {
		for(var i in this.properties) {
			if(this[i] === undefined || this[i] === null) {
				this[i] = this.properties[i];
			}
		}
	};

    p.initComponent = function() {};

    p.destroyComponent = function() {};

    p.on = function(type, listener) {
        this.gameObject.addEventListener.apply(this.gameObject, arguments);
    };

    p.off = function(type, listener) {
        this.gameObject.removeEventListener.apply(this.gameObject, arguments);
    };

    p.dispatchEvent = function(event) {
        this.gameObject.dispatchEvent(event);
    };

    p.getResource = function(id) {
        return loader.get(id);
    };

    p.loadResource = function(params, base) {
        return loader.load(params, base);
    };

    p.unloadResource = function(ids) {
        if(typeof ids === 'string') {
            ids = [ids];
        }
        var i, len;
        for(i=0,len=ids.length; i<len; i++) {
            loader.remove(ids[i]);
        }
    };

    p.isInstanceof = function(type) {
        return this instanceof type;
    };

    return Component;

});