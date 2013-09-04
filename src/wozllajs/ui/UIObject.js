this.wozllajs = this.wozllajs || {};

(function() {
    "use strict";

    /**
     * dirtyable object
     */

    var UIObject = function(id) {
        this.initialize(id);
    };

    var p = UIObject.prototype = Object.create(wozllajs.GameObject.prototype);

    p.isUIObject = true;

    p.dirty = true;

    p.update = function() {
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
    };

    p.lateUpdate = function() {
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
    };

    p.dirtyUpdate = function() {

    };

    p.draw = function(context, visibleRect) {
        if(!this._componentInited || !this._active || !this._visible || !this.dirty) {
            return;
        }

        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);

        context.restore();
    };

    wozllajs.UIObject = UIObject;

})();