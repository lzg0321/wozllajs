define([
    './../var',
    './../util/Tuple',
    './AnnotationRegistry'
], function(W, Tuple, AnnotationRegistry) {

    var currentAnnotation;

    var Annotation = function(param) {
        this._$annotationTuple = new Tuple();
        this._empty = true;
        currentAnnotation = this;
    };

    Annotation.get = function(module) {
        return AnnotationRegistry.get(module);
    };

    Annotation.define = function(name, definition) {
        function $Annotation(config) {
            var def = $Annotation.definition;
            var prop, propValue;
            for(prop in config) {
                if(!def[prop]) {
                    throw new Error('Undefined property "' + prop + '" in ' + name);
                }
                propValue = config[prop];
                if(!propValue) {
                    propValue = def[prop].defaults;
                }
                else if(propValue instanceof Object) {
                    if(!(propValue instanceof def[prop].type)) {
                        throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                    }
                }
                else if((typeof propValue) !== def[prop].type) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
                this[prop] = propValue;
            }
            currentAnnotation.addAnnotation($Annotation, this);
        }
        $Annotation._annotation_name = name;
        $Annotation.definition = definition;
        W.annotation = W.annotation || {};
        W.annotation[name] = function(config) { new $Annotation(config); };
        return W.annotation[name];
    };

    var p = Annotation.prototype;

    p.isEmpty = function() {
        return this._empty;
    };

    p.isAnnotationPresent = function(type) {
        return this._$annotationTuple.get(type._annotation_name).length > 0;
    };

    p.getAnnotation = function(type) {

        return this._$annotationTuple.get(type._annotation_name)[0];
    };

    p.getAnnotations = function(type) {
        return this._$annotationTuple.get(type._annotation_name);
    };

    p.addAnnotation = function(type, $annotation) {
        this._$annotationTuple.push(type._annotation_name, $annotation);
        this._empty = false;
    };

    return Annotation;

});