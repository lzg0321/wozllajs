/**
 * Base component for GameObject
 */
WozllaJS.define('Component', function($) {

    function Component() {}

    Component.prototype = {

        /**
         * Identified this Component's type
         *
         * @public
         */
        type : null,

        /**
         * this method will called by GameObject when GameObject creating this Component
         *
         * @param gameObject
         * @private
         */
        bindGameObject : function(gameObject) {
            this.gameObject = gameObject;
        },

        onPreInit : function() {

        },

        onInit : function() {

        },

        onDestroy : function() {

        }
    };

    return Component;

});