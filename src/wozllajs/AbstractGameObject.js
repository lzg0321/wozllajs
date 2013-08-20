/**
 * 抽象的GameObject,定义GameObject的数据结构
 * GameObject定义了一个树状的数据结构，每一个节点都
 * 是一个GameObject的实例。
 * GameObject包含了一组component用于定义自己的行为和表现.
 *
 * AbstractGameObject定义结构，获取和查找外于该树的其它GameObject.
 * 以及获取当前GameObject的组件{wozlla.Component}子类实例
 *
 * @class {wozlla.AbstractGameObject}
 */
wozllajs.define('wozlla.AbstractGameObject', {

    /**
     * mixin Transform module, 使该对象具备Transform的属性和方法
     */
    include : ['wozlla.Transform'],

    /**
     * unique key to identified this game object
     */
    id : null,

    /**
     * transform of this GameObject, curentlly is GameObject itself.
     */
    transform : null,

    /**
     * parent GameObject
     */
    parent : null,

    /**
     * children GameObject
     * 对于2d游戏，这个变量里的所有GameObject的排列顺序决定了他们层的深度
     * 排在前面的则越靠近背景，排在后面的越靠近用户的眼睛
     * @field {Array}
     */
    _objects : null,

    /**
     * children GameObject store in this map, for quickly searching by id
     */
    _objectMap : null,

    /**
     *  all components in this array
     *  @field {Array}
     */
    _components : null,

    /**
     * all components store in this map, for quickly searching by id
     */
    _componentMap : null,

    initialize : function() {
        this.callParent(arguments);
        this.transform = this;
        this._objects = [];
        this._objectMap = {};
        this._components = [];
        this._componentMap = {};
    },

    /**
     * add a GameObject as child of this GameObject
     * @param obj
     */
    addObject : function(obj) {
        this._objectMap[obj.id] = obj;
        this._objects.push(obj);
        obj.parent = this;
    },

    /**
     * remove a GameObject from children of this GameObject
     * @param idOrObj
     * @return {int} a index of removed GameObject at '_objects'
     */
    removeObject : function(idOrObj) {
        var objects = this._objects;
        var obj = typeof idOrObj === 'string' ? this._objectMap[idOrObj] : idOrObj;
        var idx = this._objects.remove(obj);
        if(idx !== -1) {
            objects.splice(idx, 1);
            delete this._objectMap[obj.id];
        }
        return idx;
    },

    /**
     * remove this GameObject from it's parent.
     */
    remove : function() {
        this.parent.removeObject(this);
        this.parent = null;
    },

    /**
     * get a GameObject from next level children by id
     * @param id
     * @return {*}
     */
    getObjectById : function(id) {
        return this._objectMap[id];
    },

    /**
     * find a GameObject from all it's children by id
     * @param id
     * @return {*}
     */
    findObjectById : function(id) {
        var obj = this.getObjectById(id);
        if(!obj) {
            var objects = this._objects;
            var i, len;

            for(i=0,len=objects.length; i<len; i++) {
                obj = objects[i].findObjectById(id);
                if(obj) break;
            }
        }
        return obj;
    },

    /**
     * find a GameObject from it's children by path
     * for example:
     *
     * // it's true
     * obj.findObjectByPath('a.b.c') === obj.findObjectById('a').getObjectById('b').getObjectById('c')
     *
     * @param path
     * @return {*}
     */
    findObjectByPath : function(path) {
        var paths = path.split('.');
        var pathRootObj = this.findObjectById(paths.shift());
        if(!pathRootObj) {
            return null;
        }
        var target = pathRootObj;
        while(paths.length > 0 && target) {
            target = target.getObjectById(paths.shift())
        }
        return target;
    },

    /**
     * add a component to this GameObject
     * @param component
     */
    addComponent : function(component) {
        var _this = this;
        this._components.push(component);
        this._componentMap[component.id] = component;
        component.setGameObject(this);
    },

    /**
     * remove a component from this GameObject
     * @param component
     * @return {*}
     */
    removeComponent : function(component) {
        var i, len, idx;
        component.destroy && component.destroy();
        idx = this._components.remove(component);
        if(idx !== -1) {
            delete this._componentMap[component.id];
            component.setGameObject(null);
        }
        return idx;
    },

    /**
     * get a component from this GameObject by id
     * @param id
     * @return {*}
     */
    getComponent : function(id) {
        return this._componentMap[id];
    }

});