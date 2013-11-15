define([
    './../var',
    './../globals',
    './../math/Rectangle',
    './../math/Matrix2D',
    './../promise',
    './AbstractGameObject',
    './Component',
    './Behaviour',
    './Animation',
    './Renderer',
    './Layout',
    './HitDelegate',
    './Mask',
    './Query',
    './events/GameObjectEvent'
], function(W, G, Rectangle, Matrix2D, Promise, AbstractGameObject, Component, Behaviour, Animation,
            Renderer, Layout, HitDelegate, Mask, Query, GameObjectEvent) {

    var testHitCanvas = W.createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext('2d');
    var helpRect = new Rectangle();
    var helpMatrix = new Matrix2D();

    var UnityGameObject = function(param) {
        AbstractGameObject.apply(this, arguments);
        this._active = true;
        this._visible = true;
        this._width = 0;
        this._height = 0;
        this._interactive = false;
        this._initialized = false;
        this._components = [];
        this._delayRemoves = [];
    };

    var p = W.inherits(UnityGameObject, AbstractGameObject);

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

    p.isInteractive = function() {
        return this._children.length > 0 || this._interactive;
    };

    p.setInteractive = function(interactive) {
        this._interactive = interactive;
    };

    p.getWidth = function() {
        return this._width;
    };

    p.setWidth = function(w) {
        this._width = w;
    };

    p.getHeight = function() {
        return this._height;
    };

    p.setHeight = function(h) {
        this._height = h;
    };

    p.getGlobalBounds = function(resultRect, print) {
        if(!resultRect) {
            resultRect = new Rectangle();
        }
        var t = this.transform;
        var concatenatedMatrix = this.transform.getConcatenatedMatrix(helpMatrix);
        var localA = t.localToGlobal(0, 0, concatenatedMatrix);
        var localB = t.localToGlobal(this._width, 0, concatenatedMatrix);
        var localC = t.localToGlobal(0, this._height, concatenatedMatrix);
        var localD = t.localToGlobal(this._width, this._height, concatenatedMatrix);
        print && console.log(localA, localB, localC, localD);
        resultRect.x = Math.min(localA.x, localB.x, localC.x, localD.x);
        resultRect.y = Math.min(localA.y, localB.y, localC.y, localD.y);
        resultRect.width = Math.max(localA.x, localB.x, localC.x, localD.x) - resultRect.x;
        resultRect.height = Math.max(localA.y, localB.y, localC.y, localD.y) - resultRect.y;
        return resultRect;
    };

    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };

    p.getComponent = function(type) {
        var i, len, comp;
        var components = this._components;
        var alias;
        if(typeof type === 'string') {
            alias = type;
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.alias === alias) {
                    return comp;
                }
            }
        }
        else {
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.isInstanceof(type)) {
                    return comp;
                }
            }
        }
        return null;
    };

    p.getComponents = function(type) {
        var i, len, comp, alias;
        var components = this._components;
        var found = [];
        if(typeof type === 'string') {
            alias = type;
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.alias === alias) {
                    found.push(comp);
                }
            }
        } else {
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.isInstanceof(type)) {
                    found.push(comp);
                }
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

    p.query = function(expression) {
        return Query(expression, this);
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
        this.layout();
        this._doDelayRemove();
        this._initialized = true;
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.INIT,
            bubbles : true
        }));
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

    p.layout = function() {
        var layout = this.getComponent(Layout);
        var children = this._children;
        var i, len, child;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.layout();
        }
        layout && layout.doLayout();
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
        var mask;
        if(!this._initialized || !this._active || !this._visible) return;
        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);
        context.restore();
        this._doDelayRemove();
    };

    p.testHit = function(x, y) {
        var hit = false, hitDelegate;
        if(!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if(hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        }
        else {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            this._draw(testHitContext, this.getStage().getVisibleRect());
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };

    p.getTopObjectUnderPoint = function(x, y, useInteractive) {
        var i, child, obj, localPoint;
        var children = this._children;
        if(useInteractive && !this.isInteractive()) {
            return null;
        }
        if(children.length > 0) {
            for(i=children.length-1; i>=0 ; i--) {
                child = children[i];
                obj = child.getTopObjectUnderPoint(x, y, useInteractive);
                if(obj) {
                    return obj;
                }
            }
        } else {
            localPoint = this.transform.globalToLocal(x, y);
            if(this.testHit(localPoint.x, localPoint.y)) {
                return this;
            }
        }
        return null;
    };

    p.animate = function(name, callback) {
        var animations = this.getComponents(Animation);
        var i, len, ani;
        for(i=0,len=animations.length; i<len; i++) {
            ani = animations[i];
            if(ani.name === name) {
                ani.play(callback);
                break;
            }
        }
    };

    p.playEffect = function(effects) {

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
        var i, len, child, gBounds, mask;
        var children = this._children;
        if(children.length <= 0) {
            gBounds = this.getGlobalBounds(helpRect);
            if(gBounds.intersects(visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height)) {
                mask = this.getComponent(Mask);
                mask && mask.clip(context);
                this.sendMessage(G.METHOD_DRAW, arguments, Renderer);
            }
        } else {
            mask = this.getComponent(Mask);
            mask && mask.clip(context);
            for(i=0,len=children.length; i<len; i++) {
                child = children[i];
                child.draw(context, visibleRect);
            }
        }
    };

    return UnityGameObject;
});