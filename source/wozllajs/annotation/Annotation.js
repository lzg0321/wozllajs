define([
    './../var',
    './../util/Tuple',
    './AnnotationRegistry'
], function(W, Tuple, AnnotationRegistry) {

    var currentAnnotation;

    function $Annotation(name, config, definition, $NamedAnnotation) {
        var prop, propValue, defineType;
        for(prop in config) {
            if(!definition[prop]) {
                throw new Error('Undefined property "' + prop + '" in ' + name);
            }
            propValue = config[prop];
            defineType = definition[prop].type;
            if(!propValue) {
                propValue = definition[prop].defaults;
            }
            else if(((typeof defineType) === 'string')) {
                if(((typeof propValue) !== defineType)) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
            }
            else if(propValue instanceof Object) {
                if(!(propValue instanceof definition[prop].type)) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
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
        var i, len;
        var theModule = module;
        var arr = [];
        while(theModule) {
            arr.unshift(theModule);
            theModule = W.getSuperConstructor(theModule);
        }
        var annotation = new Annotation();
        var mAnnotation;
        for(i=0,len=arr.length; i<len; i++) {
            mAnnotation = AnnotationRegistry.get(arr[i]);
            if(mAnnotation) {
                mAnnotation.forEach(function(type, $annos) {
                    var i, len;
                    type = window[type];
                    for(i=0,len=$annos.length; i<len; i++) {
                        annotation.addAnnotation(type, $annos[i]);
                    }
                });
            }
        }
        return annotation;
    };

    Annotation.define = function(name, definition) {
        var $NamedAnnotation = function(config) {
            if(typeof config !== 'object') {
                config = { value : config };
            }
            return new $Annotation(name, config, definition, $NamedAnnotation);
        };

        $NamedAnnotation.forModule = function(module) {
            return Annotation.forModule(module).getAnnotations($NamedAnnotation);
        };
        $NamedAnnotation.isPresent = function(module) {
            return Annotation.forModule(module).isAnnotationPresent($NamedAnnotation);
        };
        $NamedAnnotation.all = function() {
            return AnnotationRegistry.getAll($NamedAnnotation);
        };
        $NamedAnnotation._annotation_name = name;
        // export for global
        return $NamedAnnotation;
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

    p.forEach = function(callback) {
        var data = this._$annotationTuple.data;
        for(var type in data) {
            callback(type, data[type]);
        }
    };

    return Annotation;

});