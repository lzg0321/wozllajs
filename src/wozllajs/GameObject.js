/**
 * 继承自{wozlla.AbstractGameObject}, 为GameObject添加游戏运行中
 * 所需功能。
 *
 * update, lateUpdate, draw 这三个方法在{wozlla.Display}上会每帧
 * 被调用，前两者通常用于组件更新数据，而draw用于显示内容
 *
 * @class {wozlla.GameObject}
 */
wozllajs.define('wozlla.GameObject', {

    extend : 'wozlla.AbstractGameObject',

    /**
     * 是否已经执行完init方法, 外部不应改变此变量，要激活或者显示对象请
     * 使用setActive, setVisible
     */
    inited : false,

    /**
     * 是否激活此GameObject，true表示update, lateUpdate，draw会被调用, false则反之
     */
    active : true,

    /**
     * 是否显示此GameObject, true表示draw会被调用, false则反之，此变量不影响update的调用
     */
    visible : true,

    _updates : null,
    _lateUpdates : null,
    _draws : null,

    _resources : null;

    initialize : function() {
        this.callParent(arguments);
        this._updates = [];
        this._lateUpdates = [];
        this._draws = [];
        this._resources = [];
    },

    /**
     * 设置当前GameObject的active
     * @param active {boolean}
     */
    setActive : function(active) {
        this.active = active;
    },

    /**
     * 设置当前GameObject的visible
     * @param visible {boolean}
     */
    setVisible : function(visible) {
        this.visible = visible;
    },

    /**
     * 将组件添加到当前GameObject中，同时根据component所实现的方法分别加到不同的功能的数组中
     * @param component
     */
    addComponent : function(component) {
        this.callParent(arguments);
        if(component.update) {
            this._updates.push(component);
        }
        if(component._lateUpdates) {
            this._lateUpdates.push(component);
        }
        if(component.draw) {
            this._draws.push(component);
        }
    },

    /**
     * 将组件从当前GameObject中移除，同时根据component所实现的方法从不同的功能的数组中移除
     * @param component
     */
    removeComponent : function(component) {
        if(this.callParent(arguments) !== -1) {
            if(component.update) {
                this._updates.remove(component);
            }
            if(component._lateUpdates) {
                this._lateUpdates.remove(component);
            }
            if(component.draw) {
                this._draws.remove(component);
            }
        }
    },

    /**
     * 这个方法结合_getResources使用，这个方法会收集该GameObject以及它所有的子孙的资源，
     * 并使用{wozlla.ResourceManager}去加载。
     * @param params
     */
    loadResources : function(params) {
        var res = [];
        this._getResources(this._resources);
        wozlla.ResourceManager.load({
            items : res,
            onProgress : params.onProgress,
            onComplete : params.onComplete
        });
    },

    /**
     *  释放该GameObject下的资源
     *  @param whiteList 不释放的列表
     */
    releaseResources : function(whiteList) {
        var res = this._resources;
        var resource;
        for(var i=0, len=res.length; i<len; i++) {
            resource = res[i];
            if(wozllajs.is(resource, 'Image')) {
                if(whiteList && whiteList.indexOf(resource.src) === -1) {
                    wozllajs.ResourceManager.disposeImage(resource);
                }
            }
        }
    },

    /**
     * 初始化当前GameObject
     */
    init : function() {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components[i].init();
        }
        for(i=0, len=this._objects.length; i<len; i++) {
            this._objects[i].init();
        }
        this.inited = true;
    },

    /**
     * 销毁当前GameObject
     */
    destroy : function() {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components[i].destroy();
        }
    },

    update : function(camera) {
        var objects = this._objects;
        var components = this._updates,
            i, len;
        var obj;
        for(i=0, len=components.length; i<len; i++) {
            components[i].update(camera);
        }
        for(i=0, len=objects.length; i<len; i++) {
            obj = objects[i];
            if(obj.inited && obj.active) {
                obj.update(camera);
            }
        }

    },

    lateUpdate : function(camera) {
        var objects = this._objects;
        var components = this._lateUpdates,
            i, len;
        var obj;

        for(i=0, len=components.length; i<len; i++) {
            components[i].lateUpdate(camera);
        }
        for(i=0, len=objects.length; i<len; i++) {
            obj = objects[i];
            if(obj.inited && obj.active) {
                obj.lateUpdate(camera);
            }
        }
    },

    draw : function(context, cameraRect) {
        var objects = this._objects;
        var components = this._draws,
            i, len = components.length;
        var obj;

        context.save();
        this.updateContext(context);
        for(i=0; i<len; i++) {
            components[i].draw(context, cameraRect);
        }
        for(i=0, len=objects.length; i<len; i++) {
            obj = objects[i];
            if(obj.inited && obj.active && obj.visible) {
                obj.draw(context, cameraRect);
            }
        }
        context.restore();
    },

    _getResources : function(res) {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components[i]._getResources(res);
        }
        for(i=0, len=this._objects.length; i<len; i++) {
            this._objects[i]._getResources(res);
        }
    }

});