var fs = require("fs");

var version = "v0.2-alpha";
var output = "libs";
var beautifyName = "wozllajs-dev-" + version;
var minName = "wozllajs-min-" + version;
var withCreatejsName = "wozllajs-full-dev-" + version + ".js";

var libs = [
    'libs/easeljs-0.6.1.min.js',
    'libs/preloadjs-NEXT.js',
    'libs/tweenjs-0.4.1.min.js'
];

var files = [
    'src/wozllajs/wozllajs.js',
    'src/wozllajs/core/Array2D.js',
    'src/wozllajs/core/EventDispatcher.js',
    'src/wozllajs/core/Time.js',
    'src/wozllajs/core/Touch.js',
    'src/wozllajs/core/TouchEvent.js',
    'src/wozllajs/core/EventAdmin.js',
    'src/wozllajs/core/Engine.js',
    'src/wozllajs/core/ResourceManager.js',
    'src/wozllajs/core/LayerManager.js',
    'src/wozllajs/core/GameObject.js',
    'src/wozllajs/core/Stage.js',
    'src/wozllajs/core/Transform.js',
    'src/wozllajs/core/Component.js',
    'src/wozllajs/core/Renderer.js',
    'src/wozllajs/core/Collider.js',
    'src/wozllajs/core/Behaviour.js',
    'src/wozllajs/renderer/ImageRenderer.js',
    'src/wozllajs/renderer/TextureRenderer.js',
    'src/wozllajs/renderer/AnimationSheetRenderer.js',
    'src/wozllajs/util/StageBuilder.js'
];


var fullList = libs.concat(files);
var fullPath = output + "/" + withCreatejsName;
console.log(fullPath);
if(fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
}
fs.openSync(fullPath, 'a');

for(var i= 0,len=fullList.length; i<len; i++) {
    fs.appendFileSync(fullPath, fs.readFileSync(fullList[i]));
    fs.appendFileSync(fullPath, ';\n\n');
}