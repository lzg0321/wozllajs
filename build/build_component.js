({
    baseUrl: "./../source",
    paths: {
        wozllajs : 'empty:'
    },
    name: "wozllajs_components",
    optimize: 'none',
    out: "./../libs/wozllajs-v2-components.js",
    onBuildWrite : function(moduleName, path, contents) {
        if(moduleName === 'wozllajs_components') {
            contents = contents.replace(/component\//g, 'wozllajs/component/');
        } else {
            contents = contents.replace("define('" + moduleName, "define('wozllajs/" + moduleName);
        }
        return contents;
    }
})