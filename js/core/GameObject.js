/**
 * Base class for all scenes.
 * A GameObject consists many Component
 */
WozllaJS.define('GameObject', function($) {

    function GameObject() {
        this._componentTable = {};
        this.components = {
            render : [],
            update : [],
            lateUpdate : [],
            collide : []
        };
    }

    GameObject.prototype = {


        /**
         * An unique key for this GameObject
         *
         * @readonly
         * @public
         */
        id : null,

        /**
         * The tags of this GameObject, only change it's properties
         *
         * @public
         */
        tags : null,

        /**
         *  @readonly
         *  @public
         */
        active : null,

        /**
         * The camera bind to this GameObject
         */
        camera : null,

        /**
         * An group of array contains all Component objects, using to iterator quickly Component objects
         *
         * @readonly
         * @public
         */
        components : null,

        /**
         * An table contains all Component objects, using to search Component by Component namespace.
         *
         * @readonly
         * @private
         */
        _componentTable : null,

        addComponent : function(namespace) {
            var factory = $.namespace(namespace);
            var componentInstance = new factory();
            componentInstance.bindGameObject(this);
            this._componentTable[namespace] = this._componentTable[namespace] || [];
            this._componentTable[namespace].push(componentInstance);

            for(var funcName in this.components) {
                if(componentInstance[funcName]) {
                    this.components[funcName].push(componentInstance);
                }
            }
        },

        getComponent : function(namespace) {
            if(!this._componentTable[namespace]) {
                return null;
            }
            return this._componentTable[namespace][0];
        },

        getComponents : function(namespace) {
            if(!this._componentTable[namespace]) {
                return null;
            }
            return this._componentTable[namespace];
        },

        preInit : function() {

        },

        init : function() {

        },

        destroy : function() {

        },

        setActive : function(active) {
            this.active = active;
        }
    };

    return GameObject;

});