define([
    './var'
], function(W){

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
            if(!W.isArray(promises)) {
                promises = [promises];
            }
        } else {
            promises = W.slice(arguments);
        }
        for(i=0,len=promises.length; i<len; i++) {
            (function(idx, promiseLen) {
                promises[idx].then(function(r) {
                    doneNum ++;
                    r = arguments.length > 1 ? W.slice(arguments) : r;
                    result[idx] = r;
                    if(doneNum === promiseLen) {
                        p.done.apply(p, result);
                    }
                    return r;
                });
            })(i, len);
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
        setTimeout(function() {
            me._nextThen.apply(this, arguments);
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
            args = W.isArray(args) ? args : [args];
            this._nextThen.apply(this, args);
        }
    };

    p._nextError = function() {
        var error = this._errorQueue.shift();
        if(error) {
            var args = error.callback.apply(error.context || this, arguments);
            args = W.isArray(args) ? args : [args];
            this._nextError.apply(this, args);
        }
    };

    return Promise;

});