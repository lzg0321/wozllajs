define(function (require, exports, module) {

	var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;

	exports.trim = function(str) {
		return str.replace(trimRegex, '');
	};

	exports.endWith = function(test, suffix) {
		if(!exports.is(test)) {
			return false;
		}
		return test.lastIndexOf(suffix) === test.length - suffix.length;
	};

	exports.startWith = function(test, prefix) {
		if(!exports.is(test)) {
			return false;
		}
		return test.indexOf(prefix) === 0;
	};

	exports.is = function(test) {
		return typeof test === 'string';
	};

});