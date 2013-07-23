/**
 * Base class for all Renderer Component
 */
WozllaJS.define('Renderer', function($) {

    function Renderer() {
        $.Component.call(this);
    }

    Renderer.prototype = $.extend($.Component, {

        /**
         * Identified this Component's type
         *
         * @public
         */
        type : 'Renderer',

        /**
         * @abstract
         * @param context canvas context
         */
        render : function(context) {}
    });

    return Renderer;

});