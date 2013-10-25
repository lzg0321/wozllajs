define([
    './var',
    './annotation/Annotation',
    './annotation/AnnotationRegistry'
], function(W, Annotation, AnnotationRegistry) {

    // must export first
    W.Annotation = Annotation;
    W.AnnotationRegistry = AnnotationRegistry;

    return {
        Annotation : Annotation,
        AnnotationRegistry : AnnotationRegistry
    };
});