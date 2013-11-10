define([
    './../promise',
    './../core/Component',
    './../preload/LoadQueue',
    './buildObject',
    './traverseObject',
    './annotation/$Resource',
    './annotation/$Query'
], function(Promise, Component, LoadQueue, buildObject, traverseObject, $Resource, $Query) {

   return function(result) {
       var p = new Promise();
       var obj, resources = [], resourceInjectComponentMap = {};
       obj = buildObject(result);
       var start = Date.now();
       traverseObject(obj, function(o) {
           var i, len, j, len2, comp, components, $querys, $query, expr, item, id, property,
               $resource, $resources;
           components = o.getComponents(Component);
           for(i=0,len=components.length; i<len; i++) {
               comp = components[i];
               $querys = $Query.forModule(comp.constructor);
               for(j=0,len2=$querys.length; j<len2; j++) {
                   $query = $querys[j];
                   property = $query.property;
                   if(comp.properties.hasOwnProperty(property)) {
                       expr = comp.properties[property];
                       if(!(comp.properties[property] = o.query(expr))) {
                           throw new Error('Cant found by expression ' + expr);
                       }
                   } else {
                       throw new Error('Cant found property "' + $query.property + '" in component alias=' + comp.alias);
                   }
               }
               $resources = $Resource.forModule(comp.constructor);
               for(j=0,len2=$resources.length; j<len2; j++) {
                   $resource = $resources[j];
                   if(comp.properties.hasOwnProperty($resource.property)) {
                       item = comp.properties[$resource.property];
                       resources.push(item);
                       id = item.id || item.src || item;
                       resourceInjectComponentMap[id] = resourceInjectComponentMap[id] || [];
                       resourceInjectComponentMap[id].push({
                           property : $resource.property,
                           component : comp
                       });
                   }
               }
           }
       });
       LoadQueue.load(resources).then(function(result) {
           var id, i, len, comps, c, r;
           for(id in result) {
               r = result[id];
               comps = resourceInjectComponentMap[id];
               if(comps) {
                   for(i=0,len=comps.length; i<len; i++) {
                       c = comps[i];
                       c.component.properties[c.property] = r;
                   }
                   delete resourceInjectComponentMap[id];
               } else {
                   console.log('[Warn] maybe some error here');
               }
           }
           for(id in resourceInjectComponentMap) {
               console.log('[Warn] Unable to inject property "' + resourceInjectComponentMap[id].property +
                   '" in component alias=' + resourceInjectComponentMap[id].component.alias);

           }
           console.log('annotation inject cost ' + (Date.now()-start) + 'ms');
           obj.init();
           p.done(obj);
       });
       return p;
   }

});