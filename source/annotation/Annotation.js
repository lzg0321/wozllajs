define([
    './../var',
    './../util/Tuple',
    './AnnotationRegistry'
], function(W, Tuple, AnnotationRegistry) {

    var currentAnnotation;

    function $Annotation(name, config, definition, $NamedAnnotation) {
        var prop, propValue;
        for(prop in config) {
            if(!definition[prop]) {
                throw new Error('Undefined property "' + prop + '" in ' + name);
            }
            propValue = config[prop];
            if(!propValue) {
                propValue = definition[prop].defaults;
            }
            else if(propValue instanceof Object) {
                if(!(propValue instanceof definition[prop].type)) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
            }
            else if((typeof propValue) !== definition[prop].type) {
                throw new Error('Type mismatch on property "' + prop + '" of ' + name);
            }
            this[prop] = propValue;
        }
        currentAnnotation.addAnnotation($NamedAnnotation, this);
    }

    var Annotation = function(param) {
        this._$annotationTuple = new Tuple();
        this._empty = true;
        currentAnnotation = this;
    };

    Annotation.forModule = function(module) {
        return AnnotationRegistry.get(module);
    };

    Annotation.define = function(name, definition) {

        var $NamedAnnotation = function(config) {
            new $Annotation(name, config, definition, $NamedAnnotation);
        };

        $NamedAnnotation.forModule = function(module) {
            return Annotation.forModule(module).getAnnotations($NamedAnnotation);
        };
        $NamedAnnotation.isPresent = function(module) {
            return Annotation.forModule(module).isAnnotationPresent($NamedAnnotation);
        };
        $NamedAnnotation._annotation_name = name;
        // export for global
        return window ? window[name] = $NamedAnnotation : $NamedAnnotation;
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