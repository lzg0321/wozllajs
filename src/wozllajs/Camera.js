/**
 *
 * 这个类代表一个{wozlla.Display}的可视位置, 继承自{wozlla.GameObject}
 * 不同的是Camera的x, y信息表示的是相反的，比如x=10,y=10代码display的可视位置
 * 是-10,-10, 即当前Camera所属的{wozlla.Display}的场景中所有{wozlla.GameObject}
 * 的位置都被右下移动了10px。
 *
 * @class wozlla.Camera
 */

wozllajs.define('wozlla.Camera', {
    /**
     * @extend wozlla.GameObject
     */
    extend : 'wozlla.GameObject',

    /**
     *
     * @field display {wozlla.Display} 该camera所属的{wozlla.Display}
     */
    display : null,

    /**
     * 该camera所属的{wozlla.Display}的context2d
     */
    context : null,

    /**
     * @field width {int} 该camera所属的{wozlla.Display}的可见区域的宽度
     * @field height {int} 该camera所属的{wozlla.Display}的可见区域的高度
     */
    width : 0,
    height : 0,

    initialize : function() {
        this.callParent(arguments);
        this.width = this.display.canvas.width;
        this.height = this.display.canvas.height;
    },

    /**
     * 移动(x, y)，与moveTo区别在于move的参考坐标的camera本身
     * @param x {int}
     * @param y {int}
     */
    move : function(x, y) {
        this.x -= x;
        this.y -= y;
    },

    /**
     * 移动到点(x, y)，与move区别在于moveTo的参考坐标是{wozlla.Display}初始可见区域的位置
     * @param x {int}
     * @param y {int}
     */
    moveTo : function(x, y) {
        this.x = -x;
        this.y = -y;
    }
});