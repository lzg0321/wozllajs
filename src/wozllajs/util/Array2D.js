/**
 * 一个二堆数组数据结构, 结构如下:
 * {
 *     "key1" : [],
 *     "key2" : [],
 *     "key3" : [],
 *     ...
 * }
 */

wozllajs.module('wozlla.util.Array2D', function() {

    var data = {};

    return {
        /**
         * 将val加到一个以key为键的数组中，如果没以key为键的数则创建一个空数组
         * @param key
         * @param val
         */
        push : function(key, val) {
            data[key] = data[key] || [];
            data[key].push(val);
        },
        get : function(key) {
            if(key === undefined) {
                return data;
            }
            return data[key];
        },
        sort : function(key, sorter) {
            data[key].sort(sorter);
            return this;
        },
        remove : function(key, val) {
            var idx, i, len;
            var array = data[key];
            if(!array) {
                return false;
            }
            for(i=0,len=array.length; i<len; i++) {
                if(array[i] === val) {
                    idx = i;
                    break;
                }
            }
            if(idx !== undefined) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        clear : function(key) {
            if(key) {
                data[key] = undefined;
            } else {
                data = {};
            }
        }
    }
});