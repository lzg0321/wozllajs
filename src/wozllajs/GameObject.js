Class.define('wozlla.GameObject', {

    extend : 'wozlla.AbstractGameObject',

    updates : [],
    lateUpdates : [],
    draws : [],

    addComponent : function(component) {
        this.callParent(arguments);
        if(component.update) {
            this.updates.push(component);
        }
        if(component.lateUpdates) {
            this.lateUpdates.push(component);
        }
        if(component.draw) {
            this.draws.push(component);
        }
    },

    removeComponent : function(component) {
        if(this.callParent(arguments) !== -1) {
            if(component.update) {
                this.updates.remove(component);
            }
            if(component.lateUpdates) {
                this.lateUpdates.remove(component);
            }
            if(component.draw) {
                this.draws.remove(component);
            }
        }
    },

    init : function() {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components.init();
        }
    },

    destroy : function() {
        var i, len;
        for(i=0, len=this._components.length; i<len; i++) {
            this._components.destroy();
        }
    },

    update : function(camera) {
        var objects = this._objects;
        var components = this.updates,
            i, len;
        var obj;

        for(i=0, len=components.length; i<len; i++) {
            components[i].update(camera);
        }
        for(i=0, len=objects.length; i<len; i++) {
            obj = objects[i];
            if(obj.active) {
                obj.lateUpdate(camera);
            }
        }

    },

    lateUpdate : function(camera) {
        var objects = this._objects;
        var components = this.lateUpdates,
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
        var components = this.draws,
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
    }

});