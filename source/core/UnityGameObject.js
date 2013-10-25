define([
    './../var',
    './../globals',
    './AbstractGameObject',
    './Component',
    './Behaviour',
    './Renderer',
    './HitDelegate',
    './events/GameObjectEvent'
], function(W, G, AbstractGameObject, Component, Behaviour, Renderer, HitDelegate, GameObjectEvent) {

    var testHitCanvas = W.createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext('2d');

    var UnityGameObject = function(param) {
        AbstractGameObject.apply(this, arguments);
        this._active = true;
        this._visible = true;
        this._initialized = false;
        this._components = [];
        this._delayRemoves = [];
    };

    var p = UnityGameObject.prototype;

    p.isActive = function(upWards) {
        if(upWards === false) {
            return this._active;
        }
        var active = true;
        var o = this;
        while(o) {
            active = active && o._active;
            if(!active) {
                return false;
            }
            o = o._parent;
        }
        return active;
    };

    p.setActive = function(active) {
        this._active = active;
    };

    p.isVisible = function(upWards) {
        if(upWards === false) {
            return this._visible;
        }
        var visible = true;
        var o = this;
        while(o) {
            visible = visible && o._visible;
            if(!visible) {
                return false;
            }
            o = o._parent;
        }
        return visible;
    };

    p.setVisible = function(visible) {
        this._visible = visible;
    };

    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };

    p.getComponent = function(type) {
        var i, len, comp;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp.isInstanceof(type)) {
                return comp;
            }
        }
        return null;
    };

    p.getComponents = function(type) {
        var i, len, comp;
        var components = this._components;
        var found = [];
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp.isInstanceof(type)) {
                found.push(comp);
            }
        }
        return found;
    };

    p.removeComponent = function(component) {
        var i, len, comp;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp === component) {
                components.splice(i, 1);
                comp.setGameObject(null);
                break;
            }
        }
    };

    p.delayRemoveComponent = function(component) {
        this._delayRemoves.push(component);
    };

    p.delayRemoveObject = function(gameObject) {
        this._delayRemoves.push(gameObject);
    };

    p.delayRemove = function() {
        this._parent.delayRemoveObject(this);
    };

    p.sendMessage = function(methodName, args, type) {
        var i, len, comp, method;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(!type || (type && comp.isInstanceof(type))) {
                method = comp[methodName];
                method && method.apply(comp, args);
            }
        }
    };

    p.broadcastMessage = function(methodName, args) {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.broadcastMessage(methodName, args);
        }
        this.sendMessage(methodName, args);
    };

    p.init = function() {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_INIT_COMPONENT);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.init();
        }
        this._doDelayRemove();
        this._initialized = true;
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.INIT,
            bubbles : true
        }))
    };

    p.destroy = function() {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.destroy();
        }
        this._doDelayRemove();
        this.sendMessage(G.METHOD_DESTROY_COMPONENT);
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.DESTROY,
            bubbles : true
        }))
    };

    p.update = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.update();
        }
        this.sendMessage(G.METHOD_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.lateUpdate = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.lateUpdate();
        }
        this.sendMessage(G.METHOD_LATE_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.draw = function(context, visibleRect) {
        if(!this._initialized || !this._active || !this._visible) return;
        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);
        context.restore();
        this._doDelayRemove();
    };

    p.testHit = function(x, y, onlyRenderSelf) {
        var hit = false, hitDelegate, renderer;
        if(!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if(hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        }
        else if(this._cacheCanvas && this._cached) {
            hit = this._cacheContext.getImageData(-this._cacheOffsetX+x, -this._cacheOffsetY+y, 1, 1).data[3] > 1;
        }
        else {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            if(onlyRenderSelf) {
                renderer = this.getComponent(Renderer);
                if(!renderer) {
                    hit = false;
                } else {
                    renderer.draw(testHitContext, this.getStage().getVisibleRect());
                }
            } else {
                this._draw(testHitContext, this.getStage().getVisibleRect());
            }
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };

    p.getTopObjectUnderPoint = function(x, y) {
        var i, child, obj, localPoint;
        for(i=this._children.length-1; i>=0 ; i--) {
            child = this._children[i];
            obj = child.getTopObjectUnderPoint(x, y);
            if(obj) {
                return obj;
            }
        }
        localPoint = this.transform.globalToLocal(x, y);
        if(this.testHit(localPoint.x, localPoint.y, true)) {
            return this;
        }
        return null;
    };

    p._doDelayRemove = function() {
        var i, len, target;
        if(this._delayRemoves.length > 0) {
            for(i=0,len=this._delayRemoves.length; i<len; i++) {
                target = this._delayRemoves[i];
                if(target instanceof AbstractGameObject) {
                    this.removeObject(target);
                }
                else if(target instanceof Component) {
                    this.removeComponent(target);
                }
            }
            this._delayRemoves.length = 0;
        }
    };

    p._draw = function(context, visibleRect) {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_DRAW, arguments, Renderer);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.draw(context, visibleRect);
        }
    };

    W.extend(UnityGameObject, AbstractGameObject);

    return UnityGameObject;
});