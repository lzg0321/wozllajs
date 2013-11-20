define(function(require) {

    var Objects = require('../utils/Objects');
    var Time = require('./Time');
    var Behaviour = require('./Behaviour');

    function Animation() {
        Behaviour.apply(this, arguments);
        this.name = null;
        this.enabled = false;
        this.callbacks = [];
    }

    var p = Objects.inherits(Animation, Behaviour);

    p.update = function() {
        this.enabled && this.tick(Time.delta);
    };

    p.play = function(callback) {
        this.enabled = true;
        this.callbacks.push(callback);
    };

    p.stop = function() {
        this.enabled = false;
    };

    p.tick = function(delta) {
        throw new Error('abstract method');
    };

    p.done = function() {
        var cbs = this.callbacks;
        for(var i= 0,len=cbs.length; i<len; i++) {
            cbs[i]();
        }
    };

    return Animation;

});