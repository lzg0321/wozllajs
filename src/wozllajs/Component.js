/**
 * 该类是所有GameObject的组件的基类, 定义组件例子:
 *  <code>
 *  // define an animation component
    wozllajs.defineComponent('x.Animation', {
        alias : 'xAnimation',
        extend : 'wozlla.Component',
        update : function() {
            var obj = this.gameObject;
            obj.x += 1;
            obj.y += 1;
            obj.rotation += 1;
            if(obj.x > 960) {
                obj.x = 0;
            }
            if(obj.y > 640) {
                obj.y = 0;
            }
        }
    });
 *  </code>
 *
 * @class wozlla.Component
 */
wozllajs.define('wozlla.Component', {

    statics : {
        NATURE_RENDER : 1,
        NATURE_LAYOUT : 2,
        NATURE_BEHAVIOR : 3,
        NATURE_OTHER : 4
    },

    /**
     * @field id {string} 组件的id
     */
    id : null,

    /**
     * 所属GameObject
     */
    gameObject : null,

    /**
     * 一个数据指该组件具备如何的特性, 这个变量是冗余设计的，子类实现时尽量标识
     */
    natures : null,

    /**
     * 该组件被加入某个GameObject时调用
     * @function
     * @public
     * @param gameObject 所加入的GameObject的实例
     */
    setGameObject : function(gameObject) {
        this.gameObject = gameObject;
    },

    /**
     * 该方法会在GameObject.init时被调用
     * @function
     * @public
     */
    init : function() {},
    /**
     * 该方法会在GameObject.destroy时被调用
     * @function
     * @public
     */
    destroy : function() {},

    /**
     * 获取某个已经加载的资源
     * @param id 资源id
     * @return {*}
     */
    getResourceById : function(id) {
        return wozlla.ResourceManager.getResource(id);
    },

    /**
     * 这个方法会在 GameObject.loadResources 时调用。
     * 该方法子类重写后, 把该组件所用的资源路径push到res数组中，
     * 当GameObject.loadResources调用时会加载所push的资源，
     * for example, 子类实现代码如下
     *  <code>
     * _getResources : function(res) {
     *      res.push('some_pic.png');
     * },
     * init : function() {
     *      var image = this.getResourceById('some_pic.png'); // return an instance of Image
     * }
     * </code>
     *
     * @protected
     * @param res {Array} the resources container
     */
    _getResources : function(res) {}

    /**
     * 该方法在{wozlla.Dipsplay}执行的每一帧会被调用, 该方法用于计算
     * for example, 子类实现代码如下
     *  <code>
     * update : function(camera) {
     *     if(camera.x > 100) {
     *         this.gameObject.visible = false;
     *     }
     * }
     * </code>
     * @abstract
     * @param camera {wozlla.Camera} 当前{wozlla.Dipsplay}的camera实例
     */
    // update : function(camera) {},

    /**
     * 该方法在{wozlla.Dipsplay}执行的每一帧会被调用, 该方法用于计算, 与update
     * 不同的是lateUpdate总会在update之后被调用, 所以通常会有很多方便之处，如果
     * 用来做跟随Camera
     * for example, 子类实现代码如下
     *  <code>
     * lateUpdate : function(camera) {
     *      // 让当前组件所属的gameObject跟随屏幕
     *     this.gameObject.x = -camera.x;
     *     this.gameObject.y = -camera.y;
     * }
     * </code>
     * @abstract
     * @param camera {wozlla.Camera} 当前{wozlla.Dipsplay}的camera实例
     */
    // lateUpdate : function(camera) {},

    /**
     * 该方法在{wozlla.Dipsplay}执行的每一帧会被调用, 该方法用于实现绘制功能
     * 实现的例子可以看看 {wozlla.component.renderer.ImageRenderer}
     * @abstract
     */
    // draw : function(context, cameraRect) {},


});