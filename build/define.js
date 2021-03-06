(function() {
	var defined = {};
	var definedListeners = window.definedListeners = {};

	var normalize = function(base, dept) {
		var bases = base.split('/');
		var depts = dept.split('/');
		var first = depts[0];
		if(first !== '.' && first !== '..') {
			bases.length = 0;
		} else {
			bases.pop();
		}
		for(var i=0; i<depts.length; i++) {
			dept = depts[i];
			if(dept === '.' || dept === bases[bases.length-1]) {
				continue;
			}
			if(dept === '..') {
				bases.pop();
			} else {
				bases.push(dept);
			}
		}
		return bases.join('/');
	};

	var createLocalRequire = function(base) {
		return function(path) {
			var fPath = normalize(base, path);
			var module = defined[fPath];
			if(!module) {
				throw new Error("Can't require module by '" + path + "' from '" + base + "', please check the module is loaded.");
			}
			return module;
		}
	};
	var addEventListener = function(type, listener) {
		definedListeners[type] = definedListeners[type] || [];
		definedListeners[type].push(listener);
	};
	var removeEventListener = function(type, listener) {
		var i, len;
		var listeners = definedListeners[type];
		if(listeners) {
			for(i=0,len=listeners.length; i<len; i++) {
				if(listeners[i] === listener) {
					listeners.splice(i, 1);
					break;
				}
			}
		}
	};
	var fireEvent = function(type) {
		var i, len;
		var listeners = definedListeners[type];
		if(listeners && listeners.length) {
			listeners = [].concat(listeners);
			for(i=0,len=listeners.length; i<len; i++) {
				listeners[i](type);
			}
		}
	};

	window.define = window.define || function(id, depts, factory) {
		var i, len, deptsLen=depts.length;
		var require = createLocalRequire(id);
		var module = {
			deptMap: {},
			exports : {}
		};
		var doDefine = function() {
			var exports = factory(require, module.exports, module);
			defined[id] = exports || module.exports;
			fireEvent(id);
		};
		if(depts.length === 0) {
			doDefine();
		} else {
			for(i=0,len=depts.length; i<len; i++) {
				(function(dept, module) {
					function check() {
						deptsLen--;
						if(deptsLen === 0) {
							doDefine();
						}
					}
					if(defined[dept]) {
						check();
						return;
					}
					function onDeptDefined() {
						removeEventListener(dept, onDeptDefined);
						check();
					}
					addEventListener(dept, onDeptDefined);
				})(normalize(id, depts[i]), module);
			}
		}
	};
})();
