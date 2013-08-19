wozllajs.define('wozlla.GameObject', {

    extend : 'wozlla.AbstractGameObject',

    _updates : null,
    _lateUpdates : null,
    _draws : null,

    initialize : function() {
        this.callParent(arguments);
        this._updates = [];
        this._lateUpdates = [];
        this._draws = [];
    },

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

    loadResources : function(params) {
        var res = [];
        this._getResources(res);
        wozlla.ResourceManager.load({
            items : res,
            onProgress : params.onProgress,
            onComplete : params.onComplete
        });
    },

    init : function() {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components[i].init();
        }
        for(i=0, len=this._objects.length; i<len; i++) {
            this._objects[i].init();
        }
    },

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
            if(obj.active) {
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
            if(obj.active) {
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
            if(obj.active && obj.visible) {
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