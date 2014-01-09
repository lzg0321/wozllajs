define(function(require) {

    var Objects = require('../utils/Objects');
    var Rectangle = require('../math/Rectangle');
    var Matrix2D = require('../math/Matrix2D');
    var Promise = require('../utils/Promise');
    var AbstractGameObject = require('./AbstractGameObject');
    var Component = require('./Component');
    var Behaviour = require('./Behaviour');
    var Animation = require('./Animation');
    var Renderer = require('./Renderer');
    var Layout = require('./Layout');
    var HitDelegate = require('./HitDelegate');
    var Mask = require('./Mask');
    var GameObjectEvent = require('./events/GameObjectEvent');
    var createCanvas = require('../utils/createCanvas');

    var testHitCanvas = createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext('2d');
    var helpRect = new Rectangle();
    var helpMatrix = new Matrix2D();

	/**
	 * 该类将所有Component的功能组合进来，实现组件式的游戏对象
	 * @class wozllajs.core.UnityGameObject
	 * @extends wozllajs.core.AbstractGameObject
	 * @constructor
	 * @param param
	 * @param param.name
	 */
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
		this.customData = {};
    };

    var p = Objects.inherits(UnityGameObject, AbstractGameObject);

	/**
	 * 判断该object是否是激活的
	 * @param upWards 是否向上根据tree中的parent, ancients去判断
	 * @returns {Boolean}
	 */
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

	/**
	 * set active
	 * @param active
	 */
    p.setActive = function(active) {
        this._active = active;
    };

	/**
	 * 判断该object是否可见
	 * @param upWards 是否向上根据tree中的parent, ancients去判断
	 * @returns {Boolean}
	 */
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

	/**
	 * set visible
	 * @param visible
	 */
    p.setVisible = function(visible) {
        this._visible = visible;
    };

	/**
	 * 判断该object是否可交互, 当有children时忽略_interactive属性默认为可交互，这是通常用在test hit上.
	 * @returns {boolean}
	 */
    p.isInteractive = function() {
        return this._children.length > 0 || this._interactive;
    };

	/**
	 * set interactive
	 * @param interactive
	 */
    p.setInteractive = function(interactive) {
        this._interactive = interactive;
    };

	/**
	 * get width
	 * @returns {int}
	 */
    p.getWidth = function() {
        return this._width;
    };

	/**
	 * set width
	 * @param w
	 */
    p.setWidth = function(w) {
        this._width = w;
    };

	/**
	 * get height of this object
	 * @returns {*}
	 */
    p.getHeight = function() {
        return this._height;
    };

	/**
	 * set height
	 * @param h
	 */
    p.setHeight = function(h) {
        this._height = h;
    };

	/**
	 * 获取这个对象的绝对bound，用于绘制的时候判断是否在屏幕中
	 * @param {wozllajs.math.Rectangle} resultRect 如果传了这个参数，结果将返回这个rectangle
	 * @param print for debugging
	 * @returns {wozllajs.math.Rectangle}
	 */
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

	p.query = function(selector) {
		var splits = selector.split(':');
		var result = this.getObjectByName(splits[0]);
		if(splits[1]) {
			result = result.getComponent(splits[1]);
		}
		return result;
	};

	/**
	 * add a component
	 * @param component
	 */
    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };

	/**
	 * get component by it's constructor or alias
	 * @param type
	 * @returns {wozllajs.core.Component}
	 */
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

	/**
	 * get all components by it's constructor or alias
	 * @param type
	 * @returns {Array}
	 */
    p.getComponents = function(type) {
        var i, len, comp, alias;
        var components = this._components;
        var found = [];
        if(typeof type === 'string') {
            alias = type.toLowerCase();
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.alias.toLowerCase() === alias) {
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

	/**
	 * remove component
	 * @param component
	 */
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

	p.removeAllComponents = function() {
		this._components.length = 0;
	};

	/**
	 * 在下一阶段移除 component
	 * @param component
	 */
    p.delayRemoveComponent = function(component) {
        this._delayRemoves.push(component);
    };

	/**
	 * 在下一阶段移除 game object
	 * @param gameObject
	 */
    p.delayRemoveObject = function(gameObject) {
        this._delayRemoves.push(gameObject);
    };

	/**
	 * 在下一阶段 remove me from parent
	 */
    p.delayRemove = function() {
        this._parent.delayRemoveObject(this);
    };

	/**
	 * 调用所有component的指定方法，并传递参数
	 * @param methodName
	 * @param args
	 * @param type
	 */
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

	/**
	 * 调用所有component指定方法并传递参数，包括该object的children
	 * @param methodName
	 * @param args
	 */
    p.broadcastMessage = function(methodName, args) {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.broadcastMessage(methodName, args);
        }
        this.sendMessage(methodName, args);
    };

	/**
	 * 初始化该对象
	 */
    p.init = function() {
        var i, len, child;
        var children = this._children;
        this.sendMessage('initComponent');
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

	/**
	 * 销毁该对象
	 */
    p.destroy = function() {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.destroy();
        }
        this._doDelayRemove();
        this.sendMessage('destroyComponent');
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.DESTROY,
            bubbles : true
        }));
		this.removeAllListeners();
    };

	/**
	 * layout
	 */
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
        this.sendMessage('update', null, Behaviour);
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
        this.sendMessage('lateUpdate', null, Behaviour);
        this._doDelayRemove();
    };

    p.draw = function(context, visibleRect) {
        var mask, optimized;
		if(!this._initialized || !this._active || !this._visible) return;
        //context.save();
		//mask = this.getComponent(Mask);
		//optimized = !mask;
        this.transform.updateContext(context, optimized);
        this._draw(context, visibleRect);
        this.transform.reupdateContext(context, optimized);
        /// /context.restore();
        this._doDelayRemove();
    };

    p.testHit = function(x, y, onlyUseHitDelegate) {
        var hit = false, hitDelegate;
        if(!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if(hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        }
        else if(!onlyUseHitDelegate) {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            this._draw(testHitContext, this.getStage().getVisibleRect());
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };

    p.getTopObjectUnderPoint = function(x, y, useInteractive) {
        var i, child, obj, localPoint, onlyUseHitDelegate;
        var children = this._children;
        if(useInteractive && !this.isInteractive()) {
            return null;
        }
        if(children.length > 0) {
			onlyUseHitDelegate = true;
            for(i=children.length-1; i>=0 ; i--) {
                child = children[i];
                obj = child.getTopObjectUnderPoint(x, y, useInteractive);
                if(obj) {
                    return obj;
                }
            }
        }
		if(this._interactive) {
			localPoint = this.transform.globalToLocal(x, y);
			if(this.testHit(localPoint.x, localPoint.y, onlyUseHitDelegate)) {
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
            //gBounds = this.getGlobalBounds(helpRect);
            //if(gBounds.intersects(visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height)) {
				mask = this.getComponent(Mask);
				mask && mask.clip(context);
                this.sendMessage('draw', arguments, Renderer);
            //}
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