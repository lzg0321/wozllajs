define([
    './annotation/Annotation',
    './annotation/AnnotationRegistry'
], function(Annotation, AnnotationRegistry) {

    define.factoryProxy = function(callback, args, exports) {
        var annotation = new Annotation();
        exports = callback.apply(exports, args);
        if(!annotation.isEmpty()) {
            AnnotationRegistry.register(exports, annotation);
        }
        return exports;
    };

});