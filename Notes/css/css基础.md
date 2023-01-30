CSS基础知识







# CSS基础知识



## 01、CSS 简介 

CSS 指层叠样式表 (Cascading Style Sheets)，对HTML网页内容进行统一外观样式设计和管理，给网页进行各种装饰，让她变得美观，是HTML的化妆师。（Cascading ：/kæsˈkeɪdɪŋ/（水）倾泻；连续传递；串联。cascade 的现在分词）

主要优点：

- 美化页面：提供丰富的外观设计能力，大量的样式属性。

- 可复用：可以统一管理HTML页面的样式，可复用。

- CSS3可以实现网页样式、内容分离，并对网页元素实现像素级的样式管理。

### 1.1、知识框架 



### 1.2、CSS 是怎么工作的？ 

下面的步骤是浏览加载网页的简化版本，而且不同的浏览器在处理文件的时候会有不同的方式，但是下面的步骤基本都会出现。

 **加载**HTML文件  ===》**解析**HTML文件  ===》 **创建**DOM Tree  ===》**加载**  资源（CSS）  ===》**显示**基于渲染树布局

​                                                                   ===》 **加载**  资源（CSS）（还有图片、视频等资源） ===》**解析CSS**

​                                       

应用于DOM节点>渲染树解析出各种选择器规则

当浏览器遇到无法解析的 CSS 代码会发生什么？——什么也不会干，继续解析下一个CSS样式。

## 02、CSS基础知识 

###  2.1、基础语法 

CSS样式由选择器名 花括号{n个申明(属性:值);}组成。

![image.png]()



●选择器就是用来选择要改变样式的HTML元素。

●属性与值用半角冒号:分开，半角分号;结尾，分割多组键值。一般建议一行一个键值对。

●如果属性值有多个词组，需加上引号保护起来。

●不合法、错误的申明会被忽略（跳过），CSS总是怎么宽容！

🔸代码风格：

●小写：一般都采用小写，字母开头，字母、数字、下划线组成。

●短线分割：当选择器里是类名时，且类名由多个单词组成，则各个单词之间下划线_、或中划线-分割。多用中短线：background-image

●当使用并集选择器时，各个元素竖着写。

🔸注释：/*注释，可换行*/

📢注意空格：一定注意关键字（and、or）、符号（括号()，加+、减-）之间的空格，不然有些时候会有些莫名其妙的问题。其中加+、减-会首先当做正负数符号

 2.2、CSS 的简写属性 

简写属性就是将同一主题的属性的定义集中在一起，空格分割，如background、font、border、margin、padding。

●覆盖：没有指定的值会被设置为它的初始值。这就意味着，⚠️它将会覆盖之前设置的值。

●顺序：简写属性的值本身没有顺序要求，但值类型一样时，就需要注意对应简写属性的规则了。

 2.3、CSS的使用 

|                   | 描述                                                         | 示例                                         |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 🔸行内样式         | 在元素的style属性上写css样式。 ⚠️缺点：代码耦合度高，样式不复用，不利于维护，尽量不用。 | <p style="color: blue;">p文字</p>            |
| 🔸内部（内嵌）样式 | 在样式<style>标签中定义css样式，只在当前页面内有效。 ⚠️缺点：多个页面之间无法复用。 | <style> p{color: blue;} </style>             |
| 🔸外部样式（推荐） | 单独css文件定义样式，html的head中<link>引入，所有引入了该css文件的页面都会生效，便于复用和统一管理。 | <link rel="stylesheet" href="css文件路径" /> |

❓<link>和@import的区别？都可以用来加载外部css资源文件，不同点：

|            | <link>                                  | @import()                              |
| ---------- | --------------------------------------- | -------------------------------------- |
| 资源类型   | link支持更多外部资源加载，包括css、图标 | @import是CSS语法，只支持导入css        |
| 哪里使用？ | HTML页面中                              | css文件、<style>标签里，必须是第一句   |
| 加载优先级 | 与HTML页面一同加载                      | 要等网页加载完成后才进行加载           |
| 兼容性问题 | 良好                                    | @import是CSS2.1版本的，不兼容 ie5 以下 |
| 扩展性     | <link>支持javascript去控制其属性        | @import不支持JS操作，支持媒体查询      |

 2.4、层叠、优先级和继承 

🔶层叠：

一个元素可应用多个样式选择器，当多条样式规则应用到同一个元素时，存在样式冲突，就出现了层叠，那到底该用谁的呢？

●同级别（同选择器）的样式规则：后面的样式规则会覆盖前面的，或者也可以理解谁离元素最近就用谁，和选择器顺序无关，如<p class="d1 d2">中d1、d2的顺序无关。

●谁大就用谁：其他情况就是用优先级权重来计算，谁的优先级更高（值更大）就用谁！

🔶优先级：

选择器优先级：样式的目标越具体优先级越高：行内样式优先级（1000 ）> id（100）> class（10）>标签（1）>通用（0）。括号内是权重值，用来决策优先级。

!important：一个特殊的 CSS语法，恐怖如斯10000优先级， 可以用来覆盖所有上面所有优先级和层叠，使用小心（尽量不用）！

🔶继承：

继承也需要在上下文中去理解 —— 一些设置在父元素上的 css 属性是可以被子元素继承的。如一些布局类的（高宽、边距、边框）是默认不继承的，可以显示设置继承。一些文本类的（字体、文本样式、字体颜色）大多支持隐式继承（默认从父元素继承）。

CSS提供了五个特殊的通用属性值用来显示控制继承，每个 css 属性都可使用这些值。

| 属性         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| inherit      | 继承父类属性（/ɪnˈherɪt/），就是 "开启继承"，使子元素属性和父元素相同 |
| initial      | 恢复初始值（ /ɪˈnɪʃl/最初的），设置属性值和浏览器默认样式相同，如果浏览器默认样式中未设置且该属性是自然继承的，那么会设置为 inherit 。 |
| unset        | 自然值，将属性重置为自然值，也就是如果属性是自然继承那么就是 inherit，否则和 initial 一样 |
| revert       | 恢复，将应用于选定元素的属性值重置为浏览器的默认样式，而不是应用于该属性的默认值。在许多情况下，此值的作用类似于 unset。 |
| revert-layer | 重置上一层，将应用于选定元素的属性值重置为在上一个层叠层中建立的值。 |

 2.5、@规则 

@符号开头的特殊语法规则。

| @规则                                                        | 描述                                                         | 示例/备注                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [@charset](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@charset) | 定义样式表的字符集，必须是样式表中的第一个元素               | @charset "UTF-8";不支持HTML中使用                            |
| [@import](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@import) | 引入一个外部样式表，必须先于所有其他类型的规则，@charset 除外。支持媒体查询。 | @import url("fineprint.css") @import url list-of-media-queries; |
| [@namespace](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@namespace) | 用来定义使用在 CSS 样式表中的 XML 命名空间的 @规则           |                                                              |
| [@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media) | 定义媒介查询规则，用于响应式样式设计                         | @media screen and (min-width: 900px){}                       |
| [@page](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page) | @page 规则用于在打印文档时修改某些 CSS 属性                  |                                                              |
| [@supports](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@supports) IE🚫 | 特性查询，判断当前浏览器环境是否支持某些特性，js中可通过 CSSSupportsRule 来访问 @supports | 支持not、and、or嵌套多个表达式                               |
| [@font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face) | 定义下载的外部的网络字体                                     | @font-face {font-family:"fname";src: url()}                  |
| [@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes) | CSS 动画的关键帧                                             |                                                              |

 03、值与单位 

 3.1、尺寸单位（长度/大小） 

🔸绝对长度：

●cm：厘米

●px：像素

🔸相对长度：

●em，相对于父元素字体或自身字体的大小（倍数）。

●rem，相对于根元素<html>字体大小（倍数）。如果用em、rem作为单位，建议根元素设置10px，便于计算。

●vh/vw：视窗（浏览器可视窗口）高度、宽度的1%，可以把一些东西做得随浏览器的视口改变大小。

🔸百分比：相对于其他值（大多是父元素）的比例。

●字体大小设置百分比，就是相当于父元素字体大小的比例。

●宽度百分比，父元素宽度比例。

 3.2、min/max-width尺寸边界 

设置元素高宽的边界。

| 属性                                                         | 描述                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| [min-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-height) | 设置元素的最小高度，默认auto，当大于height会覆盖height的值 |
| [max-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max-height) | 设置元素的最大高度，当小于height会覆盖height的值           |
| [min-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-width) | 设置最小宽度，默认auto，如果大于width会覆盖width的值       |
| [max-width](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max-width) | 设置最大宽度值，如果小于width会覆盖width的值               |

对于替换元素（图像和视频），他们有自己的大小，这会影响布局，可以通过设置max-width:100%来控制其大小范围。虽然设置width: 100%;也可以控制大小，但会拉伸图片。

 3.3、color颜色值 

RGB颜色是基于R（red）、G（green）、B（blue）三个颜色通道组合而成，每个颜色通道值0到255，16进制就是00到FF。

| 颜色值                        | 描述                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| 颜色关键词：red               | 预定义的颜色值，如red、green、blue、transparent （透明色），[完整列表](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords#list_of_all_color_keywords) |
| 16进制值RGB：#FF12AA          | #开头，6位16进制数值                                         |
| 16进制RGBA：#FF12AAFF         | #开头，8位16进制数值，多了透明度A（alpha 通道）              |
| RGB函数：rgb(2, 121, 139)     | rgb三个值作为参数（10进制，0-255）                           |
| 函数RGBA：rgba(2,121,139,0.3) | rgba4个值作为参数，最后一个参数透明度值是0到1的小数。        |
| 透明度属性：opacity           | 0到1的小数，在元素上设置对整个盒子生效                       |
| currentColor                  | css3关键字，当前元素的（或其最近父元素）继承的color值        |

 3.4、渐变色gradient 

渐变色gradient（/ˈɡreɪdiənt/ ）是一种特别的image数据类型，用于background-image、border-image的值，实现多种渐变颜色。可以设置多组值，逗号隔开，层叠渲染都会生效。

 🔸线性渐变linear-gradient() 

沿线性方向的颜色渐变：

[linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient) ( 方向/角度 , 颜色 位置% , 颜色 位置% , ... )

●方向/角度（angle），目的是确定线性渐变的方向，有两种设置方式：

○角度（angle，顺时针），沿指针方向渐变，单位deg（degree）。

○方向，关键字to+ 一个或多个位置（top、bottom、right、left），to right /*从左到右*/

●颜色值：颜色值color。

●插值位置：可以是%比例，和长度（px），基于方向的渐变插值位置。

![image.png]()



 🔸径向渐变radial-gradient() 

从中心往四周辐射扩散的颜色渐变，（radial /ˈreɪdiəl/辐射、径向）。

[radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/radial-gradient) (形状 | size  at 圆心位置 , 颜色 位置% , 颜色 位置% , ... )

●shape：径向渐变的图形形状，ellipse (默认)、circle （圆）

●at position：设置圆心位置（x、y坐标），可用x、坐标值，或方位两种方式：

○坐标定位（像素、百分比）：at 0 50%，at 10px 30px

○方位定位（top、bottom、right、left、center）：at left top

●size：渐变结束形状的大小，枚举值：closest-side、closest-corner、farthest-side、farthest-corner

![image.png]()



 🔸圆锥渐变conic-gradient() 

沿着圆的时钟方向进行旋转渐变（conic /ˈkɒnɪk/锥形）

[conic-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/conic-gradient) (开始角度/圆心位置 , 颜色 位置%|角度deg , 颜色 位置%|角度deg , ... )

●from angele：锥形渐变的开始角度，from 0deg

●at position：设置圆心位置（x、y坐标），可用x、坐标值，或方位两种方式：

○坐标定位（像素、百分比）：at 0 50%，at 10px 30px

○方位定位（top、bottom、right、left、center）：at left top

![image.png]()



» 锥形渐变实现的进度图效果：

![image.png]()



 🔸重复渐变repeating 

重复渐变就是执行多次渐变，以铺满整个区域，上面三种渐变都支持重复渐变模式。

repeating-上面的三种渐变

![image.png]()



 3.5、计算函数calc()函数 

[calc](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

 （计算表达式） 可动态的计算出一个数值，

IE9

。



●可用于长度、角度、时间、百分比、数字的计算。

●支持+加法、-减法、*乘法、/除法。注意运算符前后须有空格，否则可能会无法识别为一个有效的表达式，因为+-可能会被认为是正负数。

 3.6、CSS变量var(--) 

带有前缀

\--

的属性名，比如

--example--name

，表示的是带有值的自定义属性(

IE🚫

)，通过 

var()

函数在作用域范围内复用的。



●变量的作用域：取决于其申明的选择器。

 04、盒子模型 

 4.1、万物皆盒子 

在CSS眼中，万物皆盒子，每一个元素都是一个盒子，盒子有边框border，有内边距padding，有外边距margin，以及盒子内的内容区域content。HTML中的元素就是各种层叠的盒子，CSS的布局也是基于这些盒子。

![image.png]()



●∎content：盒子里的内容，这个区域也称为“content-box”。

●∎padding：盒子内边距，盒子内容到边框border的间距（上右下左，顺时针方向）。

●∎border：盒子边框，边框线包括多个样式属性：线粗细、线样式、颜色、圆角等。border包含的区域称为“border-box”。

●∎margin：盒子外边距，盒子和其他元素的间距（上右下左）。

| 属性            | 描述                                   | 值                                           |
| --------------- | -------------------------------------- | -------------------------------------------- |
| ∎border         | 边框样式（上右下左），可简写           | border:5px solid red;                        |
| border-width    | 设置四个边框的宽度                     | border-width: 5px 10px 1px medium            |
| border-style    | 设置 4 个边框线的样式                  | dotted点、 solid线、 double双线、 dashed虚线 |
| border-color    | 设置四条边框的颜色                     | border-color:red green blue pink;            |
| border-radius   | 设置四个 border-*-radius 圆角属性      | border-radius:15px 0;                        |
| border-collapse | 表格的边框的合并设置                   | collapse /kəˈlæps/                           |
| ∎padding        | 设置所有（上右下左）内边距属性         | 数值/百分比%：padding:10px 5px;              |
| ∎margin         | 设置所有（上右下左）外边距属性，可负数 | 数值/百分比%：margin:10px 5px 15px 20px;     |

border、padding、margin都有四个边（上右下左，顺时针方向：top、right、bottom、left），可以一起设置，也可以分别设置。在浏览器的调试模式下可以看到任何元素的盒子模型结构：

![image.png]()



⁉️注意：margin 不计入实际大小 —— 当然，它会影响盒子在页面所占空间，但是影响的是盒子外部空间。盒子的范围到边框border为止 —— 不会延伸到 margin。
⁉️外边距折叠 ：两个外边距上下相邻的元素，他们的外边距将合并为一个外边距（重叠在一起），即最大的那个外边距的大小，而不是二者的外边距之和。当然不是绝对的，参考[外边距重叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)。

![image.png]()



用边框画三角形：四个边框可以分别设置样式，设置其他三个变为透明色，就可以画出一个三角形了。

![image.png]()



基于块级元素、内联元素的区别，盒子也分为两种：块级盒子 (block box) 和 内联盒子 (inline box)。

🔶块级盒子 (block box)：应用完整的盒子模型

●自动换行，宽度默认和父容器一样宽

●width、height有效，内边距、外边距、边框会将盒子周围的元素“推开”。

🔶内联盒子 (inline box)：部分盒子模型有效

●盒子不换行，width、height无效，基于元素内容自动适应。

●垂直方向的内边距、外边距、边框有效，但不会把其他inline盒子推开。

●水平方向的内边距、外边距、边框有效，会把其他inline盒子推开。

 4.2、box-sizing盒模型 

盒子模型 [box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing) 有两种模式：标准盒模型、代替（IE）盒模型，通过属性box-sizing设置（IE8支持，之前IE都只有代替盒模型）。

| box-sizing  | 描述                                                         | 备注           |
| ----------- | ------------------------------------------------------------ | -------------- |
| content-box | 标准盒子模型（默认值）： 元素width、height仅限Content内容，padding 和 border往外扩张。如果给元素设置 width 、height，实际设置的是 content box。  整个盒子的宽高需再加上padding 和 border，是不是很反人类？是就对了！ 切换标准盒模型：box-sizing: content-box | ![image.png]() |
| border-box  | 替代（IE）盒模型 元素width、height包含Content、padding、border，padding 和 border都向内挤压。 切换代替盒模型：box-sizing: border-box 有时候为了更精确的控制布局，会强制使用IE盒模型并初始内外边距为0： box-sizing: border-box; margin: 0px; padding: 0px; | ![image.png]() |

 4.3、min/max-content内容尺寸 

下面的

*-content

（

IE🚫

）“值”用来设置元素的宽度、高度，是基于盒子的内容来动态设置盒子尺寸。



| 尺寸值      | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| min-content | 最小内容尺寸，基于盒子内容content最小的尺寸                  |
| max-content | 最大内容尺寸，基于盒子内容content最大的尺寸                  |
| fit-content | 适应内容尺寸（/fɪt/适应，合适），会根据视口的大小自适应min-content、max-content |

![image.png]()



©️版权申明：版权所有@安木夕，本文内容仅供学习，欢迎指正、交流，转载请注明出处！[原文编辑地址-语雀](https://www.yuque.com/kanding/ktech/gmfugr)



4 人点赞

- ![lixin133](./CSS基础知识_files/original)
- ![曾平勇](./CSS基础知识_files/0)
- ![Po](./CSS基础知识_files/image(1).png)
- ![安木夕](./CSS基础知识_files/image(2).png)

4



[安木夕](https://www.yuque.com/kanding)

2022-11-18 23:24

257

0

IP 属地四川

举报

分享到：

划词评论（0）



![乔先生](./CSS基础知识_files/original)

正文





Ctrl + ⇧ + 7有序列表



回复



![语雀](./CSS基础知识_files/original(1))



[关于语雀](https://www.yuque.com/help/about)[使用帮助](https://www.yuque.com/help)[数据安全](https://www.yuque.com/about/security)[服务协议](https://www.yuque.com/terms)[English](https://www.yuque.com/kanding/ktech/gmfugr?language=en-us)

[安木夕](https://www.yuque.com/kanding)



技术人生



搜索Ctrl + J

首页

目录





▍🛠️工具&资源

[🖱️低代码/BI组件资源](https://www.yuque.com/kanding/ktech/ud9rvonrzy8fkh5o)

[📊可视化图表Chart资源](https://www.yuque.com/kanding/ktech/beegictacg4649fc)

[🔯前端开源组件/框架资源](https://www.yuque.com/kanding/ktech/guqo1c9og6ezadgp)

[📖ProGit-Git教程](https://www.yuque.com/kanding/ktech/ng8w19)

[🔠程序员常用英语单词](https://www.yuque.com/kanding/ktech/xg7gi7)

[🔣正则表达式速查](https://www.yuque.com/kanding/ktech/rfyis6)

[无标题文档](https://www.yuque.com/kanding/ktech/bkfxq7giiv08opq9)

[*remark](https://www.yuque.com/kanding/ktech/lfad6m)



▍🌐前端WEB技术(50+)

[前端技术学习路线-导图🖼️](https://www.yuque.com/kanding/ktech/bx9x0d)

[前端技术学习路线资料](https://www.yuque.com/kanding/ktech/wgyqrh)



▍📁HTML教程(3)

**大纲**





[01、CSS 简介](https://www.yuque.com/kanding/ktech/gmfugr#RFuVE)

[1.1、知识框架](https://www.yuque.com/kanding/ktech/gmfugr#wM6e0)

[1.2、CSS 是怎么工作的？](https://www.yuque.com/kanding/ktech/gmfugr#dC8Sl)

[02、CSS基础知识](https://www.yuque.com/kanding/ktech/gmfugr#ElN06)

[2.1、基础语法](https://www.yuque.com/kanding/ktech/gmfugr#vtjYu)

[2.2、CSS 的简写属性](https://www.yuque.com/kanding/ktech/gmfugr#XAOSt)

[2.3、CSS的使用](https://www.yuque.com/kanding/ktech/gmfugr#w7Y0D)

[2.4、层叠、优先级和继承](https://www.yuque.com/kanding/ktech/gmfugr#NV4H7)

[2.5、@规则](https://www.yuque.com/kanding/ktech/gmfugr#aDcaa)

[03、值与单位](https://www.yuque.com/kanding/ktech/gmfugr#HAnpO)

[3.1、尺寸单位（长度/大小）](https://www.yuque.com/kanding/ktech/gmfugr#WdQHv)

[3.2、min/max-width尺寸边界](https://www.yuque.com/kanding/ktech/gmfugr#mrKj4)

[3.3、color颜色值](https://www.yuque.com/kanding/ktech/gmfugr#beLNx)

[3.4、渐变色gradient](https://www.yuque.com/kanding/ktech/gmfugr#wGeCp)

[🔸线性渐变linear-gradient()](https://www.yuque.com/kanding/ktech/gmfugr#cX2SG)

[🔸径向渐变radial-gradient()](https://www.yuque.com/kanding/ktech/gmfugr#qLJhl)

[🔸圆锥渐变conic-gradient()](https://www.yuque.com/kanding/ktech/gmfugr#K8eKO)

[🔸重复渐变repeating](https://www.yuque.com/kanding/ktech/gmfugr#JrGJZ)

[3.5、计算函数calc()函数](https://www.yuque.com/kanding/ktech/gmfugr#ca3NO)

[3.6、CSS变量var(--)](https://www.yuque.com/kanding/ktech/gmfugr#cE97x)

[04、盒子模型](https://www.yuque.com/kanding/ktech/gmfugr#aae3U)

[4.1、万物皆盒子](https://www.yuque.com/kanding/ktech/gmfugr#kXwHg)

[4.2、box-sizing盒模型](https://www.yuque.com/kanding/ktech/gmfugr#EuTFm)

[4.3、min/max-content内容尺寸](https://www.yuque.com/kanding/ktech/gmfugr#Ox1QV)

Adblocker