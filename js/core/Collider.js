/**
 * Base class for all Collider Component
 */
WozllaJS.define('Collider', function($) {

    function Collider() {
        $.Component.call(this);
    }

    Collider.prototype = $.extend($.Component, {

        /**
         * Identified this Component's type
         *
         * @public
         */
        type : 'Collider',

        /**
         * if true, it means this Collider will compare others Collider by method collide
         */
        dynamic : null,


        /**
         * @abstract
         * @return true/false
         */
        collide : function(anotherCollider) {}
    });

    return Collider;

});