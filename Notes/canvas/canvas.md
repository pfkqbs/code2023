[toc]

## 什么是 `Canvas` ?
`Canvas` 中文名叫 “画布”，是 `HTML5` 新增的一个标签。
`Canvas` 允许开发者通过 `JS` 在这个标签上绘制各种图案。
`Canvas` 拥有多种绘制路径、矩形、圆形、字符以及图片的方法。
`Canvas` 在某些情况下可以 “代替” 图片。
`Canvas` 可用于动画、游戏、数据可视化、图片编辑器、实时视频处理等领域。

- **`Canvas` 和 `SVG` 的区别**

|  `Canvas`	     |   `SVG`     |
| :-------   | :-------- |
|  用 `JS` 动态生成元素（一个 `HTML` 元素）	 |  用 `XML` 描述元素（类似 `HTML` 元素那样，可用多个元素来描述一个图形）     |
|  位图（受屏幕分辨率影响）	         |  矢量图（不受屏幕分辨率影响）     |
|  不支持事件	                   |        支持事件          |                   
|  数据发生变化需要重绘	            |   不需要重绘      |

```html
<!-- 1  创建canvas 元素 -->
<canvas width="500" height="400" id="mycanvas">
        当前的浏览器版本不支持，请升级浏览器
</canvas>
<script>

// 2  获取 canvas 对象
const cnv = document.getElementById("c");

// 3 获取 canvas 上下文环境对象
const cxt = cnv.getContext('2d');

// 4绘制直线：坐标（20,100）至（200,100）的直线
cxt.moveTo(20,100);//起点坐标（x，y）

cxt.lineTo(200,100);//终点坐标（x，y）
cxt.stroke();//将起点和终点链接
</script>
```
|  方法	     |  Canvas上下文环境对象的方法   |
| :-------   | :-------- |
|  绘制直线	       |  `cxt.moveTo(20,100);``cxt.lineTo(200,100);``cxt.stroke();`    |
|  修改直线的宽度	       |  `cxt.lineWidth  = 20`    |
|  修改直线的颜色	       |  `cxt.strokeStyle = '#00FF00'`    |
|  修改直线两端样式	       |  `cxt.lineCap = 'round'` `// 默认: butt; 圆形: round; 方形: square`   |
|  绘制矩形        |  `cxt.strokeRect(50, 50, 200, 100)`    |
|  绘制圆弧        |  `cxt.arc(200, 200, 100, 0, 2 * Math.PI, false);`    |                   
|  擦除画布        |  `cxt.clearRect(0, 0, 600, 600);`    |
