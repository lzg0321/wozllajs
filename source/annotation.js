define([
    './annotation/Annotation',
    './annotation/AnnotationRegistry',
    './annotation/$Inject'
], function(Annotation, AnnotationRegistry) {

    return {
        Annotation : Annotation,
        AnnotationRegistry : AnnotationRegistry
    }
});