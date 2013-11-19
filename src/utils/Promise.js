define(function(require, exports, module) {

    var Arrays = require('./Arrays');

    var Promise = function() {
        this._thenQueue = [];
        this._errorQueue = [];
    };

    Promise.wait = function(promises) {
        var i, len;
        var p = new Promise();
        var doneNum = 0;
        var result = [];
        if(arguments.length === 1) {
            if(!Arrays.is(promises)) {
                promises = [promises];
            }
        } else {
            promises = Arrays.slice(arguments);
        }
        for(i=0,len=promises.length; i<len; i++) {
            (function(idx, promiseLen) {
                promises[idx].then(function(r) {
                    doneNum ++;
                    r = arguments.length > 1 ? Arrays.slice(arguments) : r;
                    result[idx] = r;
                    if(doneNum === promiseLen) {
                        p.done.apply(p, result);
                    }
                    return r;
                }).catchError(function(e) {
					p.sendError(e);
				});
            })(i, len);
        }
        return p;
    };

    Promise.run = function(func) {
        var p;
        try {
            p = func(function() {
                var args = arguments;
                setTimeout(function(){
                    p.done.apply(p, args);
                }, 1);
            }, function(e) {
                p.sendError(e);
            });
            if(!p || !(p instanceof Promise)) {
                p = new Promise();
            }
        } catch(e) {
            if(!p || !(p instanceof Promise)) {
                p = new Promise();
            }
            setTimeout(function() {
				p.sendError(e);
			}, 1);
        }
        return p;
    };

    var p = Promise.prototype;

    p.then = function(callback, context) {
        this._thenQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.catchError = function(callback, context) {
        this._errorQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.done = function() {
        var me = this;
        var args = arguments;
        setTimeout(function() {
            me._nextThen.apply(me, args);
        }, 1);
        return this;
    };

    p.sendError = function(error) {
        var me = this;
        setTimeout(function() {
            me._nextError(error);
        }, 1);
        return this;
    };

    p._nextThen = function() {
        var then = this._thenQueue.shift();
        if(then) {
            var args = then.callback.apply(then.context || this, arguments);
            args = Arrays.isArray(args) ? args : [args];
            this._nextThen.apply(this, args);
        }
    };

    p._nextError = function() {
        var error = this._errorQueue.shift();
        if(error) {
            var args = error.callback.apply(error.context || this, arguments);
            args = Arrays.isArray(args) ? args : [args];
            this._nextError.apply(this, args);
        }
    };

    module.exports = Promise;

});