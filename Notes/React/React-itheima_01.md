
[toc]


# 学习来自于黑马`React`课程
## 1`React`概述：

### 1.1 `React`是什么？
- <font color="red">`React`</font>是一个而用于<font color="red">构建用户界面</font>的<font color="red"> JavaScript 库</font>
- 用户界面： HTML页面（前端）
- `React` 主要用来写HTML 页面，或<font color="red">构建 web 应用</font>
- 如果从 `MVC` 的角度来看， `React` 仅仅是视图层（ `V` ），也就是只负责视图的渲染，而并非提供了完整的 `M` 和 `C` 的功能
- `React` 起源于 `FaceBook` 的内部项目，后又用来架设 `Instagram` 的网站，并与2013年5月开源

### 1.2 `React`的特点？
- 声明式
    你只需要描述 `UI` （`HTML`）看起来是什么样，就跟写 `HTML` 一样

    ```js
    const jsx = <div className="app">
                    <h1> Hello React!  动态变化数据： { count }</h1>
                </div>
    ```

- 基于组件
    - 组件时 `React` <font color="red">最重要</font>的内容
    - 组件表示页面重点额部分内容
    
- 学习一次，随处使用
    - 使用 `React` 可以开发 `web` 应用
    - 使用 `React` 可以开发移动端原生应用（`raect-native`）
    - 使用 `React` 可以开发 `VR` （虚拟现实）应用（`raect 360`）

## 2 `React` 的基本使用

### 2.1 `React` 的安装
- 安装命令： `npm i react react-dom`
    - `react` 包是核心，提供创建元素，组件等功能
    -  `react-dom` 包提供 `DOM` 相关功能

### 2.2 `React` 的使用

- 1、引入 `react` 和 `react-dom` 两个 `js` 文件
    注意引入顺序
```html
<script src="./node_modules/react/umd/react.development.js"></script>
<script src="./node_modules/react-dom/umd/react-dom.development.js"></script>
```

- 2、创建 `React` 元素

- 3、渲染 `React` 元素到页面中

```html
<div id="root"></div>
<script>
    /* React.createElement() 创建 `React` 元素 */
    /* 参数1：元素名称 */
    /* 参数2：元素属性 */
    /* 参数3：元素的子节点 */
    const title = React.createElement('h1',null,"Hello React!")

    /*渲染 `React` 元素到页面中  */
    /* ReactDOM.render  参数1： 要渲染的 React 元素 */
    /* ReactDOM.render 参数2： 挂载点（元素要渲染的地方） */
    ReactDOM.render(title, document.getElementById('root') )

</script>
```
### 2.3 方法说明
- `React.createElement()` 的说明  （知道）
```js
    /* React.createElement 创建 `React` 元素 */
    /* 参数 1 ：要创建的 React 元素名称 */
    /* 参数 2 ：该 React 元素的属性 */
    /* 参数 3 及其以后的参数：该 React 元素的子节点 */
    /* 如果子节点还有子节点  还是使用  去嵌套 */
    const el = React.createElement('h1',null,"Hello React!")
```
- `ReactDOM.render()` 说明
```js
/*渲染 `React` 元素到页面中：  */
/* ReactDOM.render  参数1： 要渲染的 React 元素 */
/* ReactDOM.render  参数2： 挂载点 DOM对象（用于指定渲染到页面的位置） */
ReactDOM.render(el, document.getElementById('root') )
```


## 3 `React` 脚手架的使用

### 3.1 `React` 脚手架的意义

- 脚手架是开发 现代 `web` 应用的必备
- 充分利用 `webpack` 、`Babel`、 `ESLint`等工具辅助项目开发
- 零配置，无需手动配置繁琐的工具即可使用
- 关注业务，而不是工具配置。

### 3.2 使用 `React` 脚手架初始化项目
- 1、初始化项目，命令： `npx create-react-app my-app`
- 2、启动项目，在项目根目录执行命令： `npm start`或者 `yarn start`

### 3.3 说明
#### `npx` 命令介绍
- `npx` v 5.2.0 引入的一条命令
- 目的： 提升包提供的命令行工具的使用体验
- 原来：先安装脚手架包，再使用这个包中提供的命令
- 现在：<font color="red">无需安装脚手架包</font>，就可以直接使用这个包提供的命令

#### 补充说明
- 推荐使用 `npx create-react-app my-app`
- `npm init create-app my-app`
- `yarn create-app my-app`

#### `yarn` 
- `yarn` 是 `Facebook` 发布的包管理工具，可以看做是 `npm` 的替代品，功能与 `npm` 相同
- `yarn` 具有快速可靠和安全的特点
- 初始化新项目： `yarn init`
- 安装包：`yarn add 包名称`
- 安装项目依赖项： `yarn`
- 其他命令：请参考：yarn文档

### 3.4 在脚手架中使用 `React`
- 1、导入 `react` 和 `react-dom` 两个包
```js
import React from 'react'
import ReactDOM from 'react-dom'
```
- 2、调用 `React.createElement()` 方法创建 `react` 元素
- 3、调用 `ReactDOM.render()` 方法 渲染 `react` 元素到页面中

## 4 `JSX`

###  4.1 `JSX`的基本使用

#### 4.1.1 `createElement()` 的问题

- 繁琐 不简洁
- 不直观，无法一眼看出所描述的结构。
- 不优雅，用户体验不爽。

```html
<div className="shopping-list">
    <h1>Shopping List</h1>
    <ul>
        <li> Instagram </li>
        <li> whatsApp </li>
    </ul>
</div>
```

#### `JSX` 简介

- `JSX` 是 `JavaScript XML` 的简写，表示 `JavaScript` 代码中写 `XML` （`HTML`） 格式的代码

- **优势**：声明式语法更加直观。与HTML结果相同，降低了学习成本，提升了开发效率

- <font color="red">`JSX` 是 `React` 的核心内容</font>

#### `JSX` 的基本使用
- 使用 `JSX` 语法创建 `react` 元素
```js
//使用 JSX 语法，创建 react 元素：
cosnt title = <h1> Hello JSX!</h1>
```
- 使用 `ReactDOM.render()` 方法渲染 `react` 元素到页面中

```js
//渲染创建好的 react 元素：
ReactDOM.render( title, document.getElementById('root'))
```

#### 为什么脚手架中可以使用 `JSX` 语法？

- `JSX` 不是标准的 `ECMAScript` 语法，它是 `ECMAScript` 的语法扩展

- 需要使用 `babel` 编译处理后，才能在浏览器环境中使用

- `create-react-app` 脚手架中已经默认有该配置，无需手动配置。

- 编译 `JSX` 语法的包是 `@babel/preset-react`

### 注意点

- `React` 元素的属性使用驼峰命名法

- 特殊属性名：`class` --> `className`、`for`-->`htmlFor`、`tabindex`--> `tabIndex`

- 没有子节点的 `react` 元素可以使用 `/>` 结束

- 推荐：使用<font color="red">小括号包裹 `JSX`</font> ，从而避免 `JS` 中的自动分好陷阱
```js
const title = (<h1 className="title"> Hello JSX!</h1>)
```

###  4.2 `JSX`中 使用 `JavaScript` 表达式

#### 嵌入表达式
- 数据存储在 `JS` 中
- 语法：<font color="red">{ `JavaScript` 表达式 }</font>
- 注意：语法中是<font color="red">单大括号</font>，不是双大括号；
```js
const name = 'jack'
const dv = (
    <div> 你好，我叫 {name} </div>
)
```

####  注意点

- <font color="red">单大括号</font>中可以使用任意的 `JavaScript` 表达式

- `JSX` 自身也是 `JS` 表达式

- 注意： `JS` 重点额对象是一个例外，一般只会出现在 `style` 属性中

- 注意： <font color="red">不能在 `{}` 中出现语句</font>（比如：if/for 等等）

###  4.3 `JSX`的 条件渲染
- **场景**：`loading`效果
- **条件渲染**： 根据条件渲染特定的 `JSX` 结构
- 可以使用 <font color="red">`iF/else`</font> 或 <font color="red">三元运算符</font> 或 <font color="red">逻辑运算符</font> 来实现

```js
const isLoading = true
const loadData = ()=>{
    if(isLoading) {
        return ( <div> 数据加载中，请稍后...</diV> )
    }
    return (<div> 数据加载完成，此处显式加载后的数据</diV>)
}
const dv = (
    <div>
        { loadData() }
    </div>
)
```
```js
const isLoading = true
const loadData = ()=>{
    return isLoading ? ( <div> 数据加载中，请稍后...</diV> ) : (<div> 数据加载完成，此处显式加载后的数据</diV>)

}
const dv = (
    <div>
        { loadData() }
    </div>
)
```
```js
const isLoading = true
/* isLoading 为TRUE 则显示  数据加载中，请稍后... */
const loadData = ()=>{
    return isLoading && ( <div> 数据加载中，请稍后...</diV> )

}
const dv = (
    <div>
        { loadData() }
    </div>
)
```
###  4.4 `JSX`的 列表渲染
- 如果要渲染一组数据，应该使用数组的 <font color="red">map() </font>方法
- **注意**：渲染列表时应该添加 `key` 属性， <font color="red">`key` 属性的值要保证唯一</font>
- **原则**： `map()` 遍历谁，就给谁添加 `key` 属性
- **注意**： 尽量避免使用索引号作为 `key`
```js
const songs = [
    {id:1,name:"黄种人"}，
    {id:2,name:"中国人"}，
    {id:3,name:"我的中国心"}，
]
const list = (
    <ul>
        {songs.map(item => (<li key={item.id}> {item.name} </li>) )}
    </ul>
)
```
###  4.5 `JSX`的 样式处理
- 行内样式--`style`(耦合太紧密，不推荐)
```html
<h1 style={{color:'red',background:'skyblue'}}>
    JSX 的样式处理
</h1>
```
- 类名--`className`（推荐）

```js
//先引入 css 文件

const list = (
    <h1 className="title">
        JSX 的样式处理
    </h1>
)
```
##  5 `React` 组件基础

### 5.1 `React` 组件介绍
- 组件时 `React` 的一等公民，使用 `React` 就是在用组件
- 组件表示页面中的部分功能
- 组合多个组件实现完整的页面功能
- 特点： 可复用、独立、可组合
### 5.2 `React` 组件的两种创建方式
#### 5.2.1 使用 函数 创建组件
- **函数组件**：使用 `js` 的函数（或箭头函数） 创建的组件
- **约定1**：函数名称必须以<font color="red">大写字母开头</font>，`React` 据此区分组件和普通的 `React` 元素
- **约定2**：函数组件<font color="red">必须由返回值</font>，表示该组件的结构
- 如果返回值为 `null` ,表示不渲染任何内容
```js
function Hello(){
    return (
        <div> 这是我的第一个函数组件！</div>
    )
}

```
#### 5.2.2 渲染函数组件： 
- 渲染函数组件:<font color="red">用函数名作为组件标签名</font>
- 组件标签可以是单标签也可以是双标签
```js
//创建组件
function Hello(){
    return (
        <div> 这是我的第一个函数组件！</div>
    )
}

//渲染组件
ReactDOM.render(<Hello />,document.getElementById('root'))
```
###### 函数也可以是箭头函数

```js
//创建组件
const Hello = () => (<div> 这是我的第一个函数组件！</div>)

//渲染组件
ReactDOM.render(<Hello />,document.getElementById('root'))
```

#### 5.2.3 使用 类 创建组件

- **类组件**： 使用 `ES6` 的 `class` 创建的组件

- **约定**：类名称也必须是<font color="red">大写字母开头</font>

- **约定**：类组件应该继承 <font color="red">`React.Component`</font> 父类，从而可以使用父类中提供的方法和属性

- **约定**：类名称必须提供 <font color="red">`render()`</font> 方法

- **约定**：`render()` 方法<font color="red">必须由返回值</font>，表示该组件的结构

```js
class Hello extends React.Component {
    render(){
        return <div>Class Component!</div>
    }
}
ReactDOM.render(<Hello />,document.getElementById('root'))
```
#### 5.2.4 抽离为独立 `js` 文件

- 思考：项目中的组件多了之后，该如何组织这些组件呢？
    - 选择一： 将所有的组件放在同一个 `js` 文件中
    - 选择二： 将每个组件放在单独的 `js` 文件中

- 组件作为一个独立的个体，一般都会是<font color="red">放到一个单独的 js 文件中</font>

- 1、创建 `Hello.js `
- 2、在 `Hello.js` 中导入 `React`
- 3、创建组件（ 函数 或 类）
- 4、在  `Hello.js` 中导出该组件
- 5、在  `index.js` 中导入 `Hello` 组件
- 6、渲染组件

```js
//Hello.js
import React from 'react'
class Hello extends React.Component{
    render(){
        return (<div>Hello Class Component!</div>)
    }
}
//导出Hello 组件
export default Hello
```

```js
//index.js
import Hello from './Hello'

//渲染导入的 Hello 组件
ReactDOM.render(<Hello />,document.getElementById('root'))
```
### 5.4 `React` 事件处理
#### 5.4.1 事件绑定
- `react` 事件绑定语法 与 `DOM` 事件语法相似
- 语法：<font color="red"> on+事件名称={事件处理程序}</font>，比如：`onClick={ ()=>{ } }`
- 语法：<font color="red">`React` 事件采用驼峰命名法</font>，比如：`onMounseEnter`、`onFocus`
- 在函数组件中绑定事件,函数组件中没有 `this`
```js
class App extends React.Component{
    //事件处理程序
    handleClick (){
        console.log( "单击事件触发了！")
    }
    //渲染页面
    render(){
        return (
        <button onClick={this.handleClick}>点击</button>
        )
    }
}
```
```js
function App(){
    //事件处理程序
    function handleClick(){
        console.log( "单击事件触发了！！")
    }
    //渲染页面
    return (
        <button onClick={this.handleClick}>点击</button>
    )
}

```
#### 5.4.2 事件对象
- 可以通过 <font color="red">事件处理程序的参数</font> 获取到事件对象
- `React` 中的事件对象叫做： <font color="skyblue">合成事件</font>（对象）
- 合成事件： 兼容所有浏览器，无需担心跨浏览器兼容性问题

```js
class App extends React.Component{
    //事件处理程序
    handleClick (e){
        e.preventDefault ()
        console.log( "单击事件触发了！")
    }
    //渲染页面
    render(){
        return (
        <a onClick={this.handleClick}>点我，不会跳转页面</a>
        )
    }
}

```
### 5.5 有状态组件和无状态组件
- 函数组件又叫做 <font color="red">无状态组件</font>， 类组件又叫做 <font color="red">有状态组件</font>
- 状态 （state） 即<font color="red">数据</font>
- 函数组件没有自己的状态，<font color="red">只负责数据展示</font>（静）
- 类组件有自己的状态，<font color="red">负责更新UI</font>，让页面“动”起来

> 比如计数器案例中，单击按钮让数值加 1。 0 和 1 就是不同时刻的状态，而由 0 变为 1 就表示状态发生了变化。状态变化后，`UI` 也要相应的更新。`React` 中想要实现该功能，就要使用有状态组件来完成。

### 5.6 组件中的 `state` 和 `setState()`
#### 5.6.1 `state` 的基本使用
- 状态（`state`） 即数据，是组件内部的<font color="red">私有</font>数据，只能在组件内部使用
- <font color="red">`state` 的值是对象</font>，表示一个组件中可以有多个数据
- **获取状态**：<font color="red"> this.state</font>
```js
class Hello extends React.Component{
    
    constructor(){
        super()
        //初始化state
        this.state = {
            count:0
        }
    }
    //渲染页面
    render(){
        return (
        <div>有状态组件</div>
        )
    }
}
```
简化写法（推荐使用）：
```js
class Hello extends React.Component{

    //初始化state
    state = {
        count:0
    }

    //渲染页面
    render(){
        return (
        <div>有状态组件  计数器：{this.state.count}</div>
        )
    }
}
```
#### 5.6.2 `setState() `修改状态

- 状态是可变的
- **语法**： <font color="red">this.setState({要修改的数据})</font>
- **注意**： <font color="red">不要直接修改state 中的值，这是错误的！</font>
- **`setState()`的作用**： 1、<font color="red">修改state</font>,2、 <font color="red">更新UI</font>
- **思想**： <font color="red">数据驱动视图</font>
```js
class App extends React.Component{

    //初始化state
    state = {
        count:0，
        text:'aaa'
    }
    //渲染页面
    render(){
        return (
        <div>
            <div>有状态组件  计数器：{this.state.count}</div>
            <button onClick={()=>{

                this.setState({
                    count:this.state.count +1
                })

                }}> 点击 + 1 </button>
        </div>
        )
    }
}
```
#### 5.6.3 从 `JSX` 中抽离事件处理程序
- `JSX` 中掺杂过多 `JS` 逻辑代码，会显得非常混乱
- **推荐**： <font color="red">将逻辑抽离到单独的方法中</font>，保证 `JSX` 结构清晰
- **报错**: <font color="red">TypeError:Cannot read property 'setState' of undefineds</font>
- **原因**：事件处理程序中 `this` 的值为 `undefined`
- **希望**： `this` 指向组件实例（ `render` 方法中的 `this` 即为组件实例）
```js
class App extends React.Component{

    //初始化state
    state = {
        count:0，
        text:'aaa'
    }

    //事件处理程序--事件处理程序中 `this` 的值为 `undefined`
    onIncrement(){
        this.setState({
            count:this.state.count +1
        })
    }
    //渲染页面
    render(){
        return (
        <div>
            <div>有状态组件  计数器：{this.state.count}</div>
            <button onClick={this.onIncrement()}> 点击 + 1 </button>
        </div>
        )
    }
}
```
### 5.7 事件绑定 `this` 指向

#### 5.7.1 箭头函数
- 利用箭头函数自身不绑定 `this` 的特点
- `render()` 方法中的 `this` 为组件实例，可以获取到 `setState()`

```js
class App extends React.Component{

    //初始化state
    state = {
        count:0，
        text:'aaa'
    }

    //事件处理程序
    onIncrement(){
        this.setState({
            count:this.state.count +1
        })
    }
    //渲染页面
    render(){
        return (
        <div>
            <div>有状态组件  计数器：{this.state.count}</div>
            <button onClick={() => this.onIncrement() }> 点击 + 1 </button>
        </div>
        )
    }
}
```

#### 5.7.2 `Function.prototype.bind()`
- 利用 `ES5` 中的 `bind` 方法，将事件处理程序中的 `this` 与组件实例绑定到一起
```js
class App extends React.Component{


    constructor(){
        super()
        
        //初始化state
        state = {
            count:0，
            text:'aaa'
        }

        //利用 `ES5` 中的 `bind` 方法，将事件处理程序中的 `this` 与组件实例绑定到一起
        this.onIncrement = this.onIncrement.bind(this)  
    }

    //事件处理程序
    onIncrement(){
        this.setState({
            count:this.state.count +1
        })
    }

    //渲染页面
    render(){
        return (
        <div>
            <div>有状态组件  计数器：{this.state.count}</div>
            <button onClick={ this.onIncrement }> 点击 + 1 </button>
        </div>
        )
    }
}
```

#### 5.7.3 `class` 的实例方法(推荐使用此方法)
- 利用箭头函数形式的 `class` 实例方法
- 注意： 该语法是实验性语法，但是，由于 `babel` 的存在可以直接使用
```js
class App extends React.Component{
   
    //初始化state
    state = {
        count:0，
        text:'aaa'
    }


    //事件处理程序
    onIncrement = () => {   //利用箭头函数形式的 `class` 实例方法
        this.setState({
            count:this.state.count +1
        })
    }

    //渲染页面
    render(){
        return (
        <div>
            <div>有状态组件  计数器：{this.state.count}</div>
            <button onClick={ this.onIncrement }> 点击 + 1 </button>
        </div>
        )
    }
}
```

### 5.8 表单处理
#### 5.8.1  受控组件
- `HTML` 中的表单元素是可输入的，也就是有自己的可变状态
- 而，`React` 中可变状态通常保存在 `state` 中，并且只能通过 `setState()` 方法来修改
- `React` 将 `state` 与表单元素值 `value` 绑定到一起，<font color="red">由 `state` 的值来控制表单元素的值</font>
- 受控组件： 其值收到 `React` 控制的表单元素
```js
<input type="text" value={this.state.text}
```
#### 5.8.2 步骤：
- 1、在 `state` 中添加一个状态，作为表单的 `value` 的值（ 控制表单元素值的  来源 ）
- 2、给表单元素绑定 `change` 事件，将表单元素的值 设置为 `state` 的值（ 控制表单元素值的 变化 ）
```js
class App extends React.Component{
   
    //初始化state
    state = {
        txt:'aaa'
    }

    //事件处理程序
    handleChange = e =>{
        this.setState({
            txt:e.target.value
        })
    }

    //渲染页面
    render(){
        return (
        <div>
            <input type="text" value={this.state.txt} onChange={this.handleChange}/>
        </div>
        )
    }
}
```
#### 5.8.3 示例
- 文本框、富文本框、下拉框 操作 `value` 的值
- 复选框: 操作 `checked` 的值
```js
class App extends React.Component{
   
    //初始化state
    state = {
        txt:'aaa',
        content:'',
        city:'',
        isChecked:false
    }

    //事件处理程序
    handleChange = e =>{
        this.setState({
            txt:e.target.value
        })
    }
    handleContent = e =>{
        this.setState({
            content:e.target.value
        })
    }
    handleCity = e =>{
        this.setState({
            city:e.target.value
        })
    }
    handleChecked = e =>{
        this.setState({
            isChecked:e.target.checked
        })
    }

    //渲染页面
    render(){
        return (
        <div>
            {/* 文本框 */}
            <input type="text" value={this.state.txt} onChange={this.handleChange}/>

            {/* 富文本框 */}
            <textarea value={this.state.content} onChange={this.handleContent}></textarea>

            {/* 下拉框 */}
            <select value={this.state.city} onChange={this.handleCity}>
                <option value="sh">上海</option>
                <option value="bj">北京</option>
                <option value="gz">广州</option>
            </select>

            {/* 复选框 */}
            <input type="checkbox" checked={this.state.isChecked} onChange={this.handleChecked}/>
        </div>
        )
    }
}
```
#### 5.8.4 多个表单元素优化：
- 问题：每个表单元素都有一个单独的事件处理程序处理太繁琐
- 优化： 使用一个事件处理程序同时处理多个表单元素
- 优化步骤：
    - 给表单元素添加 `name` 属性，名称与 `state` 相同
    - 根据表单元素类型获取对应值
    - 在 `change` 事件处理程序中通过 [name] 来修改对应的 `state`
```js
<input 
    type="text"
    name="txt"
    value={this.state.txt}
    onChange={this.handleForm}   
    />
```
```js
//根据表单元素类型取值
const value = target.type === 'checkbox' ? target.checked : target.value

//根据name 设置对应的 state
this.setState({
    [name]:value
})
```
```js
class App extends React.Component{
   
    //初始化state
    state = {
        txt:'aaa',
        content:'',
        city:'',
        isChecked:false
    }

    //事件处理程序
    handleForm = e =>{

        //获取当前DoM 对象
        const target = e.target

        //根据表单元素类型取值
        const value = target.type === 'checkbox' ? target.checked : target.value

        //获取name
        const name = target.name

        this.setState({
            [name]:value
        })
    }
 

    //渲染页面
    render(){
        return (
        <div>
            {/* 文本框 */}
            <input 
                type="text"
                name="txt" 
                value={this.state.txt} 
                onChange={this.handleForm}/>

            {/* 富文本框 */}
            <textarea 
                value={this.state.content} 
                name="content"
                onChange={this.handleForm}>
            </textarea>

            {/* 下拉框 */}
            <select 
                name="city"
                value={this.state.city} 
                onChange={this.handleForm}>
                <option value="sh">上海</option>
                <option value="bj">北京</option>
                <option value="gz">广州</option>
            </select>

            {/* 复选框 */}
            <input 
                type="checkbox"
                name="isChecked" 
                checked={this.state.isChecked} 
                onChange={this.handleForm}/>
        </div>
        )
    }
}
```

#### 5.8.5 非受控组件 （`DOM`方式）
- 说明： 借助 `ref` ,使用原生 `DOM` 方式来获取表单元素值
- `ref` 的作用： 获取 `DOM` 或组件
- 使用步骤：
    - 1、调用 <font color="red">`React.createRef()`</font> 方法创建一个 `ref` 对象
    ```js
    constructor(){
        super()
        this.txtRef = React.createRef()
    }
    ```
    - 2将创建好的 `ref` 对象添加到文本框中
    ```html
    <input type="text" ref={ this.txtRef } />
    ```
    - 3、通过 `ref` 对象获取到文本框的值
    ```js
    console.log( this.txtRef.current.value)
    ```

    ```js
    class App extends React.Component{
        constructor(){
            super()

            //创建 ref
            this.txtRef = React.createRef()
        }
      
        //初始化state
        state = {
            txt:'aaa',
            content:'',
            city:'',
            isChecked:false
        }

        //事件处理程序
        getTxt = e =>{

            // 通过 `ref` 对象获取到文本框的值
            console.log( this.txtRef.current.value)

            //获取当前DoM 对象
            const target = e.target

            //根据表单元素类型取值
            const value = target.type === 'checkbox' ? target.checked : target.value

            //获取name
            const name = target.name

            this.setState({
                [name]:value
            })
        }
    
        //渲染页面
        render(){
            return (
            <div>
                {/* 文本框 */}
                <input 
                    type="text"
                    name="txt" 
                    ref={this.txtRef}
                    value={this.state.txt} 
                    onChange={this.handleForm}/>               
                <button onClick={this.getTxt}>点击获取文本框的值</button>
            </div>
            )
        }
    }
    ```

### 5.9 需求分析：
- 渲染评论列表（列表渲染）
    - 在 `state` 中初始化评论列表数据
    - 使用数组的 `map` 方法遍历 `state` 中的列表数据
    - 给每个被遍历的 `li` 元素添加 `key` 属性

- 没有评论数据是渲染暂无评论内容（条件渲染）
    - 判断列表数的长度是否为 0
    - 如果为 0 ，则渲染暂无评论

- 获取评论信息，包括评论人和评论内容（受控组件）
    - 使用受控组件方式处理表单元素
- 发表评论，更新评论列表（`setState()` ）
    - 给按钮绑定单击事件
    - 在事件处理程序中，通过 `state` 获取评论信息
    - 将评论信息添加到 `state` 中，并调用 `setState()` 方法更新 `state`
    - 边界情况： 清空文本框
    - 边界情况： 非空判断
```js
import React from 'react'
import ReactDOM from 'react-dom'

/* 
  22评论列表案例（5-发表评论-2边界情况）
*/

import './index.css'

class App extends React.Component {
  // 初始化状态
  state = {
    comments: [
      { id: 1, name: 'jack', content: '沙发！！！' },
      { id: 2, name: 'rose', content: '板凳~' },
      { id: 3, name: 'tom', content: '楼主好人' }
    ],

    // 评论人
    userName: '',
    // 评论内容：
    userContent: ''
  }

  // 渲染评论列表：
  renderList() {
    const { comments } = this.state

    if (comments.length === 0) {
      return <div className="no-comment">暂无评论，快去评论吧~</div>
    }

    return (
      <ul>
        {comments.map(item => (
          <li key={item.id}>
            <h3>评论人：{item.name}</h3>
            <p>评论内容：{item.content}</p>
          </li>
        ))}
      </ul>
    )
  }

  // 处理表单元素值
  handleForm = e => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  // 发表评论：
  addComment = () => {
    const { comments, userName, userContent } = this.state

    // 非空校验
    if (userName.trim() === '' || userContent.trim() === '') {
      alert('请输入评论人和评论内容')
      return
    }

    // 将评论信息添加到state中
    const newComments = [
      {
        id: Math.random(),
        name: userName,
        content: userContent
      },
      ...comments
    ]

    // 文本框的值如何清空？ 要清空文本框只需要将其对应的state清空即可
    this.setState({
      comments: newComments,
      userName: '',
      userContent: ''
    })
  }

  render() {
    const { userName, userContent } = this.state

    return (
      <div className="app">
        <div>
          <input
            className="user"
            type="text"
            placeholder="请输入评论人"
            value={userName}
            name="userName"
            onChange={this.handleForm}
          />
          <br />
          <textarea
            className="content"
            cols="30"
            rows="10"
            placeholder="请输入评论内容"
            value={userContent}
            name="userContent"
            onChange={this.handleForm}
          />
          <br />
          <button onClick={this.addComment}>发表评论</button>
        </div>

        {/* 通过条件渲染决定渲染什么内容： */}
        {this.renderList()}
      </div>
    )
  }
}

// 渲染组件
ReactDOM.render(<App />, document.getElementById('root'))

```