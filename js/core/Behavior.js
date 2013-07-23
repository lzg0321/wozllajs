/**
 * Base class for all Behavior Component
 */
WozllaJS.define('Behavior', function($) {

    function Behavior() {
        $.Component.call(this);
    }

    Behavior.prototype = $.extend($.Component, {

        /**
         * Identified this Component's type
         *
         * @public
         */
        type : 'Behavior',


        /**
         * @abstract
         */
        update : function() {},

        /**
         * @abstract
         */
        // lateUpdate : function() {},

        /**
         * @Unsupported
         */
        fixedUpdate : function() {}
    });

    return Behavior;

});