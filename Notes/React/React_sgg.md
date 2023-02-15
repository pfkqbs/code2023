[toc]

# `React`全家桶(技术栈)

尚硅谷前端研究院  [新版本 `React` 16.8  2021版]

## 第1章：`React`入门 

### 1.1.`React`简介

- 官网
    - 1.英文官网: https://reactjs.org/
    - 2.中文官网: https://react.docschina.org/

- 介绍描述

    - 1.用于动态构建用户界面的 `JavaScript` 库(只关注于视图)  
        - 1、发送请求获取数据，
        - 2、处理数据（过滤，整理格式等 
        - 3、<font color="red">操作`DOM`呈现页面</font> `React` 只负责这部分 )
        - 4、<font color="red">核心：`React` 是一个将数据渲染为 `HTML` 视图的开源 `JavaScript` 库</font>

    - 2.由 `Facebook` 开源

- 为什么学`React`,原生 `JS` 的痛点?
    - 原生 `JS` 操作`DOM`繁琐，效率低（`DOM-API` 操作 `UI`）
    - 使用 `JS` 直接操作`DOM`，浏览器会进行大量的重绘重排。
    - 原生 `JS` 没有组件化编码方案，代码复用率低。

- 为什么学`React`,`React` 的特点？
    - 1.采用 __声明式编码__ __组件化模式__，提高开发效率及组件复用率
    - 3.在`React Native` 中可以使用 `React` 语法进行 移动端开发 
    - 4.使用 __虚拟`DOM`__ +优秀的 __`Diffing`算法__，尽量减少与真实`DOM` 的交互

- __`React` 高效的原因__
    - 1.使用虚拟(`virtual`)`DOM`, 不总是直接操作页面真实`DOM`。
    - 2.`DOM Diffing`算法, 最小化页面重绘。

- 学习 `React` 之前你要掌握的`js`基础知识
    - 判断 `this` 的指向
    - `class`（类）
    - `ES6` 语法规范
    - `npm` 包管理器
    - 原型机原型链
    - 数组常用方法
    - 模块化

### 1.2.`React`的基本使用

#### 1.2.1.效果 `Hello React`！

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Hello React</title>
	</head>
	<body>
		<!-- 注意一!!--必须有容器div -->
		<div id="test">
			
		</div>
		<!-- `React`核心库。（ 注意二!!--核心库先于下面两个引入 ） -->
		<script src="./react_js/react.development.js" type="text/javascript" charset="utf-8"></script>

        <!-- 提供操作`DOM`的`react`扩展库 -->
		<script src="./react_js/react-dom.development.js" type="text/javascript" charset="utf-8"></script>

        <!-- 解析`JSX`语法代码转为`JS`代码的库。( Script 标签必须 type=“text/babel”) -->
		<script src="./react_js/babel.min.js" type="text/javascript" charset="utf-8"></script>
		
		<script type="text/babel">/*  注意三!!--这里必须是 babel  */
			// 创建虚拟Dom
			const vDom = <h1>Hello React!</h1>  /*   注意四!!--此处一定不要写引号 因为不是字符串 */
			
			//渲染虚拟Dom
			ReactDOM.render(vDom,document.getElementById('test'))
			
		</script>
	</body>
</html>

```

#### 1.2.2.相关`js`库

- <font color="red">`react.js`</font>：`React`核心库。（ **核心库先于下面两个引入** ）
- <font color="red">`react-dom.js`</font>：提供操作`DOM`的`react`扩展库。
- <font color="red">`babel.min.js`</font>：解析`JSX`语法代码转为`JS`代码的库。(`Script`标签必须`type=“text/babel”`)

#### 1.2.3.创建虚拟`DOM`的两种方式

- 1.纯`JS`方式(一般不用):  

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>使用js创建虚拟DOM的两种方式</title>
</head>
<body>
    <!-- 必须有容器div -->
    <div id="test">
        
    </div>
    
    <script src="./react_js/react.development.js" type="text/javascript" charset="utf-8"></script>
    <script src="./react_js/react-dom.development.js" type="text/javascript" charset="utf-8"></script>

    
    <script type="text/javascript">
        // js创建虚拟Dom
        const vDom = React.createElement('h1',{id:"title"},"Hello React")
        
        // 如果h1标签嵌套其他标签 必须使用React.createElement()去实现
        
        //渲染虚拟Dom
        ReactDOM.render(vDom,document.getElementById('test'))
        
    </script>
</body>
</html>

```
- 2.`JSX `方式

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>使用  jsx  创建 虚拟 DOM 的两种方式</title>
</head>
<body>
<!-- 必须有容器div -->
<div id="test">
    
</div>
    
<script src="./react_js/react.development.js" type="text/javascript" charset="utf-8"></script>
<script src="./react_js/react-dom.development.js" type="text/javascript" charset="utf-8"></script>
<script src="./react_js/babel.min.js" type="text/javascript" charset="utf-8"></script>
    
<script type="text/babel">/*  这里必须是babel  */
    // 创建虚拟Dom
    const vDom = (
    <h1 id="title">
        <span>Hello React!</span>
    </h1>
    )  /*   此处一定不要写引号 因为不是字符串 */
    
    //渲染虚拟Dom
    ReactDOM.render(vDom,document.getElementById('test'))
    
</script>
</body>
</html>

```

#### 1.2.4.虚拟`DOM`与真实`DOM`

- 1.`React`提供了一些`API`来创建一种 “特别” 的一般`js`对象
    - `const VDOM = React.createElement('xx',{id:'xx'},'xx')`
    - 上面创建的就是一个简单的虚拟`DOM`对象

- 2.虚拟`DOM`对象最终都会被`React`转换为真实的`DOM`

- 3.我们编码时基本只需要操作`react`的虚拟`DOM`相关数据, `react`会转换为真实`DOM`变化而更新界。
(`debugger`  鼠标放在`TDOM`上，可看到真实`DOM`上有很多属性，而虚拟`DOM`上属性很少。)

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>虚拟DOM与真实DOM</title>
	</head>
	<body>
		<!-- 必须有容器div -->
		<div id="test">
			
		</div>
		<div id="demo">
			
		</div>
		
		<script src="./react_js/react.development.js" type="text/javascript" charset="utf-8"></script>
		<script src="./react_js/react-dom.development.js" type="text/javascript" charset="utf-8"></script>
		<script src="./react_js/babel.min.js" type="text/javascript" charset="utf-8"></script>
		
		<script type="text/babel">/*  这里必须是babel  */

			// 创建虚拟Dom
			const vDom = (
			<h1 id="title">
				<span>Hello React!</span>
			</h1>
			)  /*   此处一定不要写引号 因为不是字符串 */
			
			//渲染虚拟Dom
			ReactDOM.render(vDom,document.getElementById('test'))
			
			const  TDOM = document.getElementById('demo')
			console.log('虚拟DOM',vDom)
			console.log('真实',TDOM)
			debugger;
			console.log('类型',typeof vDom)
			console.log('vDOM',vDom instanceof Object)
			
			/* 关于虚拟DOM:
			虚拟DOM其实就是Object类型的对象（一般对象）
			虚拟DOM比较轻，真实DOM比较重，因为虚拟DOM是react内部使用，无需真实DOM那么多属性。
			虚拟DOM最终会被React 转化为真实DOM
			*/
			
		</script>
	</body>
</html>

```

### 1.3.`React JSX`

#### 1.3.1.效果


#### 1.3.2.`JSX`

- 1.**全称**:  `JavaScript XML`

- 2.**`react`定义的一种类似于`XML`的`JS`扩展语法**: `JS` + `XML`本质是`React.createElement(component, props, ...children)`方法的语法糖

- 3.**作用**: 用来简化创建虚拟`DOM`
    - 1)**写法**：`const vDom = <h1>Hello React!</h1>`
    - 2)**注意1**：它不是字符串, 也不是`HTML`/`XML`标签
    - 3)**注意2**：它最终产生的就是一个`JS`对象             `Script`标签必须`type=“text/babel”`

- 4.标签名任意: `HTML`标签或其它标签

- 5.标签属性任意: `HTML`标签属性或其它

- 6.基本语法规则
    - 1)遇到 `<`开头的代码, 以标签的语法解析: `html`同名标签转换为`html`同名元素, 其它标签需要特别解析
    - 2)遇到以 `{ `开头的代码，以`JS`语法解析: 标签中的`js`表达式必须用`{ }`包含
    - 3)样式类名指定不要使用`class`，而是`className`；内联样式的话，使用`style={{marginLfet:’10px’}}`,`key`小驼峰
    - 4)只能有一个根标签
    - 5)标签必须闭合
    - 6)**标签首字母**：
      - 如果首字母为小写，则将该标签转为`html`同名标签，如果`html`无该同名元素，则报错。
      - 如果首字母大写，`React`就去渲染对应的组件，
      - 如果组件没有定义，则报错。
```HTML
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>JSX语法</title>
		<style type="text/css">
			.title{
				background: #035D68;
			}
		</style>
	</head>
	<body>
<!-- 必须有容器div -->
<div id="test">
    
</div>

<script src="./react_js/react.development.js" type="text/javascript" charset="utf-8"></script>
<script src="./react_js/react-dom.development.js" type="text/javascript" charset="utf-8"></script>
<script src="./react_js/babel.min.js" type="text/javascript" charset="utf-8"></script>

<script type="text/babel">/*  这里必须是babel  */

const myId = "h1TiTle"
const myData = "Hello World!"

// 使用JSX 创建虚拟Dom
const vDom = (
<h1 id={myId.toLowerCase()} className='title'>
    <span style={{fontSize:"14px",color:'#fff'}}>Hello React!----{myData}</span>
    <input />
</h1>
) 

//渲染虚拟Dom到页面
ReactDOM.render(vDom,document.getElementById('test'))
			
// jsx语法规则：
    // 1、定义虚拟DOM时，不要写引号
    // 2、标签中使用js表达式要用{}去解析
    // 3、样式类名指定不要用class，而是用className
    // 4、内联样式，要用style={{key:value}}的形式去写，最外面的{}表示里面为js表达式，里面的{}表示是一个对象
    // 5、不能有多个根标签
    // 6、标签必须闭合
    // 7、标签首字母小写->小写标签jsx就会转为d对应的html同名标签，没有对应的html标签则报错，
    // 8、标签首字母大写->首字母大写的标签jsx就会转为组件名,组件没定义，则报错
		</script>
	</body>
</html>

```

- 7.`babel.js`的作用
    - 1)浏览器不能直接解析`JSX`代码, 需要`babel`转译为纯`JS`的代码才能运行
    - 2)只要用了`JSX`，都要加上`type="text/babel"`, 声明需要`babel`来处理

#### 1.3.3.渲染虚拟`DOM`(元素)

虚拟`Dom`本质是`Objec`t类型的对象（一般对象），虚拟`Dom`比较“轻”，真实`Dom`比较 “重”，因为虚拟`Dom`是`React`内部在用，无需真实`Dom`上那么多的属性，虚拟`Dom`最终会被`React`转化为真实`Dom`，展示到页面上

- 1.语法:  `ReactDOM.render(virtualDOM, containerDOM)`
- 2.作用: 将虚拟`DOM`元素渲染到页面中的真实容器`DOM`中显示
- 3.参数说明
    - 1)参数一: 纯`js`或`jsx`创建的虚拟`dom`对象
    - 2)参数二: 用来包含虚拟`DOM`元素的真实`dom`元素对象(一般是一个`div`)
`React.createElement(‘标签名’，‘标签属性’，标签内容)`

#### 1.3.4.`JSX`练习

需求: 动态展示如下列表

补充回顾： 什么是表达式？什么是`js`语句？区别是什么？

表达式： 会产生一个值，可以放在任何一个需要值的地方：

下面都是表达式：
- 1、`a`
- 2、`a+b`
- 3、`demo(1)`
- 4、`arr.map()`
- 5、`function test(){}`

`js`语句：
下面都是语句（代码）：
- 1、`if(){}}`
- 2、`for(){}`
- 3、`switch(){case:xxx}`

### 1.4.模块与组件、模块化与组件化的理解

#### 1.4.1.模块(`js`模块)

- 1.**理解**：向外提供特定功能的`js`程序, 一般就是一个`js`文件

- 2.**为什么要拆成模块**：随着业务逻辑增加，代码越来越多且复杂。

- 3.**作用**：复用`js`, 简化`js`的编写, 提高`js`运行效率

#### 1.4.2.组件

- 1.**理解**：用来实现局部功能效果的代码和资源的集合(`html`/`css`/`js`/`image`等等)

- 2.**为什么要用组件**： 一个界面的功能更复杂

- 3.**作用**：复用编码, 简化项目编码, 提高运行效率

#### 1.4.3.模块化

当应用的`js`都以模块来编写的, 这个应用就是一个模块化的应用

#### 1.4.4.组件化

当应用是以多组件的方式实现, 这个应用就是一个组件化的应用


## 第2章：`React`面向组件编程

### 2.1. 基本理解和使用

#### 2.1.1. 使用`React`开发者工具调试

#### 2.1.2. 函数式组件 和 类式组件

- 函数式组件：

```js
//1--创建函数式组件，必须有返回值

function Demo(){
    return <h2>我是函数式组件！使用与简单组件的定义！</h2>
}

//2--渲染组件到页面
ReactDOM.render(<Demo />,document.getElementById('test'))

//定义的函数 Demo，调用了吗？ React帮你调用了
//es6 babel编译后，开启严格模式后，函数里this为undefined
        

// 渲染时函数组件名 名写成标签的形式,<Demo />并且闭合
// <Demo /> 首字母必须大写,

// 执行了React.render(<>)之后，发生了什么？
// 在React解析组件标签，找到了组件
// 发现组件是使用函数定义的，随后调用了函数
```

类式组件：

```js
//1--创建类式组件
class MyComponent extends React.Component{
    
    render(){  //render 必须写，必须由返回值
        return (
            <h2>我是类式组件！适用于复杂组件</h2>
            )
    }
}

//2--渲染组件到页面
ReactDOM.render(<MyComponent />,document.getElementById('test'))

// 执行了React.render(<>)之后，发生了什么？

//1-- 在React解析  组件标签 ，找到了组件MyComponent

//2-- 发现组件是使用类定义的，随后 new 出了该类的实例，并通过该实例调用到原型上的 render 方法

//3-- 将 rander 返回的虚拟 Dom 转为真实 DOM，随后呈现在页面中。
```

#### 2.1.3. 注意

- 1.组件名 __必须首字母大写__
- 2.虚拟`DOM`元素 __只能有一个根元素__
- 3.虚拟`DOM`元素 __必须有结束标签__

#### 2.1.4. 渲染类组件标签的基本流程

- 1.`React`内部会创建组件实例对象

- 2.调用`render()`得到虚拟`DOM`, 并解析为真实`DOM`

- 3.插入到指定的页面元素内部

### 2.2. 组件三大核心属性1: `state`

#### 2.2.1. 效果

需求: 定义一个展示天气信息的组件

1.默认展示天气炎热 或 凉爽

2.点击文字切换天气

```js
//创建类式组件(有状态的组件就叫复杂组件) 借助构造器初始化状态，读取state 
class Weather extends React.Component {
    constructor(props) {
    super(props)
    // 初始化状态
    this.state = {isHot: false,}
    }
    render() {
        // 读取状态
    const { isHot } = this.state  //解构
    return (
        <div>
        <div>
            <h1>{ isHot ? "天气炎热" : "不热" }</h1>
        </div>
        </div>
    )
    }
}
        
//渲染组件到页面
ReactDOM.render(<Weather />,document.getElementById('test'))
```
#### 2.2.2. 理解

1.`state`是组件对象最重要的属性, 值是对象(可以包含多个`key-value`的组合)

2.组件被称为"状态机", 通过更新组件的`state`来更新对应的页面显示(重新渲染组件)

#### 2.2.3. 强烈注意

- 1.组件中`render`方法中的`this`为组件实例对象

- 2.组件自定义的方法中`this`为`undefined`，如何解决？

    - a)强制绑定`this`: 通过函数对象的`bind()`
    - b)箭头函数

- 3.状态数据，不能直接修改或更新，使用`setState`

### 2.3. 组件三大核心属性2: `props`

#### 2.3.1. 效果

需求: 自定义用来显示一个人员信息的组件
1.姓名必须指定，且为字符串类型；
2.性别为字符串类型，如果性别没有指定，默认为男
3.年龄为字符串类型，且为数字类型，默认值为18

#### 2.3.2. 理解

1.每个组件对象都会有`props`(`properties`的简写)属性
2.组件标签的所有属性都保存在`props`中

#### 2.3.3. 作用

1.通过标签属性从组件外向组件内传递变化的数据
2.注意: 组件内部不要修改`props`数据

#### 2.3.4. 编码操作

1.内部读取某个属性值

2.对`props`中的属性值进行类型限制和必要性限制
第一种方式（`React v15.5` 开始已弃用）：
第二种方式（新）：使用`prop-types`库进限制（需要引入`prop-types`库）

3.扩展属性: 将对象的所有属性通过props传递

4.默认属性值：

5.组件类的构造函数

### 2.4. 组件三大核心属性3: `refs`与事件处理
#### 2.4.1. 效果

需求: 自定义组件, 功能说明如下:

1. 点击按钮, 提示第一个输入框中的值
2. 当第2个输入框失去焦点时, 提示这个输入框中的值
效果如下：

#### 2.4.2. 理解

组件内的标签可以定义`ref`属性来标识自己

#### 2.4.3. 编码

1.字符串形式的`ref`

2.回调形式的`ref`

3.`createRef`创建`ref`容器·

#### 2.4.4. 事件处理

1.通过`onXxx`属性指定事件处理函数(注意大小写)
1)`React`使用的是自定义(合成)事件, 而不是使用的原生`DOM`事件
2)`React`中的事件是通过事件委托方式处理的(委托给组件最外层的元素)
2.通过`event.target`得到发生事件的`DOM`元素对象

### 2.5. 收集表单数据
#### 2.5.1. 效果

需求: 定义一个包含表单的组件
输入用户名密码后, 点击登录提示输入信息

#### 2.5.2. 理解

包含表单的组件分类
1.受控组件
2.非受控组件

### 2.6. 组件的生命周期
#### 2.6.1. 效果

需求:定义组件实现以下功能：

1. 让指定的文本做显示 / 隐藏的渐变动画
2. 从完全可见，到彻底消失，耗时2S
3. 点击“不活了”按钮从界面中卸载组件

#### 2.6.2. 理解

1.组件从创建到死亡它会经历一些特定的阶段。
2.`React`组件中包含一系列勾子函数(生命周期回调函数), 会在特定的时刻调用。
3.我们在定义组件时，会在特定的生命周期回调函数中，做特定的工作。

#### 2.6.3. 生命周期流程图(旧)

生命周期的三个阶段（旧）
- 1. 初始化阶段: 由`ReactDOM.render()`触发---初次渲染
    - 1.`constructor()`
    - 2.`componentWillMount()`
    - 3.`render()`
    - 4.`componentDidMount()`
- 2. 更新阶段: 由组件内部`this.setSate()`或父组件重新`render`触发
    - 1.`shouldComponentUpdate()`
    - 2.`componentWillUpdate()`
    - 3.`render()`
    - 4.`componentDidUpdate()`
- 3. 卸载组件: 由`ReactDOM.unmountComponentAtNode()`触发
    - 1.`componentWillUnmount()`

#### 2.6.4. 生命周期流程图(新)

生命周期的三个阶段（新）

- 1. 初始化阶段: 由ReactDOM.render()触发---初次渲染

    - 1.constructor()
    - 2.getDerivedStateFromProps
    - 3.render()
    - 4.componentDidMount() 

- 2. 更新阶段: 由组件内部this.setSate()或父组件重新render触发

    - 1.getDerivedStateFromProps
    - 2.shouldComponentUpdate()
    - 3.render()
    - 4.getSnapshotBeforeUpdate
    - 5.componentDidUpdate()
- 3. 卸载组件: 由ReactDOM.unmountComponentAtNode()触发
    - 1.componentWillUnmount()

#### 2.6.5. 重要的勾子

- 1.`render`：初始化渲染或更新渲染调用
- 2.`componentDidMount`：开启监听, 发送`ajax`请求
- 3.`componentWillUnmount`：做一些收尾工作, 如: 清理定时器

#### 2.6.6. 即将废弃的勾子

- 1.`componentWillMount`
- 2.`componentWillReceiveProps`
- 3.`componentWillUpdate`

现在使用会出现警告，下一个大版本需要加上UNSAFE_前缀才能使用，以后可能会被彻底废弃，不建议使用。

### 2.7. 虚拟D`OM`与`DOM Diffing`算法
#### 2.7.1. 效果
需求：验证虚拟`DOM Diffing`算法的存在

2.7.2. 基本原理图

## 第3章：`React`应用(基于`React`脚手架)
### 3.1. 使用`create-react-app`创建`react`应用
3.1.1. react脚手架
1.xxx脚手架: 用来帮助程序员快速创建一个基于xxx库的模板项目
1.包含了所有需要的配置（语法检查、jsx编译、devServer…）
2.下载好了所有相关的依赖
3.可以直接运行一个简单效果
2.react提供了一个用于创建react项目的脚手架库: create-react-app
3.项目的整体技术架构为:  react + webpack + es6 + eslint
4.使用脚手架开发的项目的特点: 模块化, 组件化, 工程化
3.1.2. 创建项目并启动
第一步，全局安装：npm i -g create-react-app
第二步，切换到想创项目的目录，使用命令：create-react-app hello-react
第三步，进入项目文件夹：cd hello-react
第四步，启动项目：npm start
3.1.3. react脚手架项目结构
public ---- 静态资源文件夹
favicon.icon ------ 网站页签图标
index.html -------- 主页面
logo192.png ------- logo图
logo512.png ------- logo图
manifest.json ----- 应用加壳的配置文件
robots.txt -------- 爬虫协议文件
src ---- 源码文件夹
App.css -------- App组件的样式
App.js --------- App组件
App.test.js ---- 用于给App做测试
index.css ------ 样式
index.js ------- 入口文件
logo.svg ------- logo图
reportWebVitals.js
--- 页面性能分析文件(需要web-vitals库的支持)
setupTests.js
---- 组件单元测试的文件(需要jest-dom库的支持)
3.1.4. 功能界面的组件化编码流程（通用）

1. 拆分组件: 拆分界面,抽取组件
2. 实现静态组件: 使用组件实现静态页面效果
3. 实现动态组件
3.1 动态显示初始化数据
3.1.1 数据类型
3.1.2 数据名称
3.1.2 保存在哪个组件?
3.2 交互(从绑定事件监听开始)
3.2. 组件的组合使用-TodoList
功能: 组件化实现此功能
4. 显示所有todo列表
5. 输入文本, 点击按钮显示到列表的首位, 并清除输入的文本

### 第4章：React ajax
4.1. 理解
4.1.1. 前置说明
1.React本身只关注于界面, 并不包含发送ajax请求的代码
2.前端应用需要通过ajax请求与后台进行交互(json数据)
3.react应用中需要集成第三方ajax库(或自己封装)
4.1.2. 常用的ajax请求库
1.jQuery: 比较重, 如果需要另外引入不建议使用
2.axios: 轻量级, 建议使用
1)封装XmlHttpRequest对象的ajax
2) promise风格
3)可以用在浏览器端和node服务器端
4.2. axios
4.2.1. 文档
https://github.com/axios/axios
4.2.2. 相关API
1)GET请求
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

2)POST请求
axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
})
.then(function (response) {
console.log(response);
})
.catch(function (error) {
console.log(error);
});
4.3. 案例—github用户搜索
4.3.1. 效果

请求地址: https://api.github.com/search/users?q=xxxxxx
4.4. 消息订阅-发布机制
1.工具库: PubSubJS
2.下载: npm install pubsub-js --save
3.使用:
1)import PubSub from 'pubsub-js' //引入
2)PubSub.subscribe('delete', function(data){ }); //订阅
3)PubSub.publish('delete', data) //发布消息
4.5. 扩展：Fetch
4.5.1. 文档
1.https://github.github.io/fetch/
2.https://segmentfault.com/a/1190000003810652
4.5.2. 特点
1.fetch: 原生函数，不再使用XmlHttpRequest对象提交ajax请求
2.老版本浏览器可能不支持
4.5.3. 相关API
1)GET请求
fetch(url).then(function(response) {
    return response.json()
  }).then(function(data) {
    console.log(data)
  }).catch(function(e) {
    console.log(e)
  });

2)POST请求
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  }).then(function(data) {
    console.log(data)
  }).catch(function(e) {
    console.log(e)
  })

### 第5章：React路由
5.1. 相关理解
5.1.1. SPA的理解
1.单页Web应用（single page web application，SPA）。
2.整个应用只有一个完整的页面。
3.点击页面中的链接不会刷新页面，只会做页面的局部更新。
4.数据都需要通过ajax请求获取, 并在前端异步展现。
5.1.2. 路由的理解
1.什么是路由?
1.一个路由就是一个映射关系(key:value)
2.key为路径, value可能是function或component
2.路由分类
1.后端路由：
1)理解： value是function, 用来处理客户端提交的请求。
2)注册路由： router.get(path, function(req, res))
3)工作过程：当node接收到一个请求时, 根据请求路径找到匹配的路由, 调用路由中的函数来处理请求, 返回响应数据
2.前端路由：
1)浏览器端路由，value是component，用于展示页面内容。
2)注册路由: 
3)工作过程：当浏览器的path变为/test时, 当前路由组件就会变为Test组件
5.1.3. react-router-dom的理解
1.react的一个插件库。
2.专门用来实现一个SPA应用。
3.基于react的项目基本都会用到此库。
5.2. react-router-dom相关API
5.2.1. 内置组件
1.
2.
3.
4.
5.
6.
7.
5.2.2. 其它
1.history对象
2.match对象
3.withRouter函数
5.3. 基本路由使用
5.3.1. 效果

5.3.2. 准备
1.下载react-router-dom: npm install --save react-router-dom
2.引入bootstrap.css: 
5.4. 嵌套路由使用
效果

5.5. 向路由组件传递参数数据
效果

5.6. 多种路由跳转方式
效果

### 第6章：React UI组件库

6.1.流行的开源React UI组件库
6.1.1. material-ui(国外)
1.官网: http://www.material-ui.com/#/
2.github: https://github.com/callemall/material-ui
6.1.2. ant-design(国内蚂蚁金服)
1.官网: https://ant.design/index-cn
2.Github: https://github.com/ant-design/ant-design/

### 第7章：redux
7.1. redux理解
7.1.1. 学习文档
1.英文文档: https://redux.js.org/
2.中文文档: http://www.redux.org.cn/
3.Github: https://github.com/reactjs/redux
7.1.2. redux是什么
1.redux是一个专门用于做状态管理的JS库(不是react插件库)。
2.它可以用在react, angular, vue等项目中, 但基本与react配合使用。
3.作用: 集中式管理react应用中多个组件共享的状态。
7.1.3. 什么情况下需要使用redux
1.某个组件的状态，需要让其他组件可以随时拿到（共享）。
2.一个组件需要改变另一个组件的状态（通信）。
3.总体原则：能不用就不用, 如果不用比较吃力才考虑使用。
7.1.4. redux工作流程

7.2. redux的三个核心概念
7.2.1. action
1.动作的对象
2.包含2个属性
type：标识属性, 值为字符串, 唯一, 必要属性
data：数据属性, 值类型任意, 可选属性
3.例子：{ type: 'ADD_STUDENT',data:{name: 'tom',age:18} }
7.2.2. reducer
1.用于初始化状态、加工状态。
2.加工时，根据旧的state和action， 产生新的state的纯函数。
7.2.3. store
1.将state、action、reducer联系在一起的对象
2.如何得到此对象?
1)import {createStore} from 'redux'
2)import reducer from './reducers'
3)const store = createStore(reducer)
3.此对象的功能?
1)getState(): 得到state
2)dispatch(action): 分发action, 触发reducer调用, 产生新的state
3)subscribe(listener): 注册监听, 当产生了新的state时, 自动调用
7.3. redux的核心API
7.3.1. createstore()
作用：创建包含指定reducer的store对象
7.3.2. store对象
1.作用: redux库最核心的管理对象
2.它内部维护着:
1)state
2)reducer
3.核心方法:
1)getState()
2)dispatch(action)
3)subscribe(listener)
4.具体编码:
1)store.getState()
2)store.dispatch({type:'INCREMENT', number})
3)store.subscribe(render)
7.3.3. applyMiddleware()
作用：应用上基于redux的中间件(插件库)
7.3.4. combineReducers()
作用：合并多个reducer函数
7.4. 使用redux编写应用
效果

7.5. redux异步编程
7.5.1理解：
1.redux默认是不能进行异步处理的,
2.某些时候应用中需要在redux中执行异步任务(ajax, 定时器)
7.5.2. 使用异步中间件
npm install --save redux-thunk
7.6. react-redux
7.6.1. 理解
1.一个react插件库
2.专门用来简化react应用中使用redux
7.6.2. react-Redux将所有组件分成两大类
1.UI组件
1)只负责 UI 的呈现，不带有任何业务逻辑
2)通过props接收数据(一般数据和函数)
3)不使用任何 Redux 的 API
4)一般保存在components文件夹下
2.容器组件
1)负责管理数据和业务逻辑，不负责UI的呈现
2)使用 Redux 的 API
3)一般保存在containers文件夹下
7.6.3. 相关API
1.Provider：让所有组件都可以得到state数据

2.connect：用于包装 UI 组件生成容器组件

3.mapStateToprops：将外部的数据（即state对象）转换为UI组件的标签属性

4.mapDispatchToProps：将分发action的函数转换为UI组件的标签属性
7.7. 使用上redux调试工具
7.7.1. 安装chrome浏览器插件

7.7.2. 下载工具依赖包
npm install --save-dev redux-devtools-extension

7.8. 纯函数和高阶函数
7.8.1. 纯函数
1.一类特别的函数: 只要是同样的输入(实参)，必定得到同样的输出(返回)
2.必须遵守以下一些约束  
1)不得改写参数数据
2)不会产生任何副作用，例如网络请求，输入和输出设备
3)不能调用Date.now()或者Math.random()等不纯的方法  
3.redux的reducer函数必须是一个纯函数
7.8.2. 高阶函数
1.理解: 一类特别的函数
1)情况1: 参数是函数
2)情况2: 返回是函数
2.常见的高阶函数:
1)定时器设置函数
2)数组的forEach()/map()/filter()/reduce()/find()/bind()
3)promise
4)react-redux中的connect函数
3.作用: 能实现更加动态, 更加可扩展的功能