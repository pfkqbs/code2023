[toc]

## 6 `React` 组件进阶：

### 6.1 组件通讯介绍

- <font color="red">组件</font> 是独立且封闭的单元，默认情况下，只能使用组件自己的数据。在组件化过程中，我们将一个完整的功能拆分成多个组件，以更好的完成整个应用的功能。而在这个过程中，多个组件之间不可避免的要共享某些数据。为了实现这些功能，就需要打破组件的独立封闭性，让其与外界沟通。这个过程就是 <font color="red">组件通讯</font>。

### 6.2 组件的 `props`
- 组件时封闭的，要接收外部数据应该通过 `props` 来实现
- **`props` 的作用**： <font color="red">接收传递给组件的数据</font>
- **传递数据**: <font color="red">给组件标签添加属性</font>
- **接收数据**： 函数组件通过 <font color="red">参数 `props`</font> 接收数据，类组件通过 <font color="red">`this.props`</font> 接收数据
- **特点**：
    
    - 可以给组件传递**任意类型**的数据
    - <font color="red">`props`</font> 是 <font color="red">只读</font> 的对象，只能读取属性的值，无法修改对象
    - **注意**：使用类组件时，如果写了构造函数，<font color="red">应该将 `props` 传递给`super()`</font>  ,否则，无法在构造函数中获取到`props`
    ```js
    class Hello extends React.Component{
        constructor(props){
            //推荐将props 传递给父类构造函数
            super(props)
            console.log( this.props )
        }
        render(){
            console.log('render', this.props )
            return ( <div>接收到的数据： {this.props.age}</div>)
        }
    }
    ```


- 函数组件代码：
```js
<Hello 
    name="jack" 
    age={19} 
    colors={["red","green","blue"] }
    fn={() =>console.log('这是一个函数')} 
    tag={<p>这是一个p标签</p>}/>

function Hello (props){
    console.log(props)
    return (
        <div>接收到的数据： {props.name}</div>
        <div>接收到的数据： {props.tag}</div>
        <div>接收到的数据： {props.fn()}</div>
    )
}
```
- 类式组件代码：
```js
class Hello extends React.Component {
    render (){
        console.log(this.props)
        return (
            <div>接收到的数据： {this.props.age}</div>
        )
    }
}
<Hello name="jack" age={19} />
```

### 6.3 组件通讯的三种方式

#### 6.3.1 组件之间的通讯分为3种：

- 1、父组件 --> 子组件
- 2、子组件 --> 父组件
- 3、兄弟组件

#### 6.3.2 父组件传递数据给子组件

- 1、父组件提供传递的 `state` 数据
- 2、给子组件标签添加属性，值为 `state` 中的数据
- 3、子组件中通过 `props` 接收父组件中传递的数据
```js
/* 父组件 */
class Parent extends React.Component {
    state = {lastName:"老王"}
    render(){
        return(
            <div>
                传递数据给子组件：<Child name={this.state.lastName } />
            </div>
        )
    }
}
```
```js
//子组件
function Child(props){
    return (
        <div>
            子组件接收到数据：{props.name}
        </div>
    )
}
```
```js
/* 父组件 */
class Parent extends React.Component {
    state = {lastName:"老王"}
    render(){
        return(
            <div>
                传递数据给子组件：<Child name={this.state.lastName } />
            </div>
        )
    }
}
//子组件
function Child(props){
    return (
        <div>
            子组件接收到数据：{props.name}
        </div>
    )
}
ReactDOM.render(<Parent />,document.getElementById('root'))
```

#### 6.3.3 子组件传递数据给父组件
- 思路：利用后调函数，父组件提供回调，子组件调用，将要传递的数据作为回调函数的参数
    - 1、父组件提供一个回调函数（用于接收数据）
    - 2、将该函数作为属性的值，传递给子组件
    - 3、子组件通过 `props` 调用回调函数
    - 4、将子组件的数据作为参数传递给回调函数
    - **注意**：回调函数中 `this` 指向问题
    ```js
    import React from 'react'
    import ReactDOM from 'react-dom'

    /* 
    父组件传递数据给子组件
    */

    import './index.css'

    //父组件
    class Parent extends React.Component{
    state = {
        parentMsg:'parentMsg'
    }

    //1  父组件提供一个回调函数（用于接收数据）
    getChildMsg = (msg) =>{
        console.log("接收带子组件的数据",msg)

        this.setState({
            parentMsg:'11'
        })
    }
    render (){
        return (
            <div>
                父组件： { this.state.parentMsg }
                {/* 2  将该函数作为属性的值，传递给子组件  */}
                子组件：<Child getMsg={this.getChildMsg} />
            </div>
        )
    }
    }

    class Child extends React.Component{

    state = {childMsg:"React"}

    handleClick = () => {

        //- 3、子组件通过 `props` 调用回调函数
        //- 4、将子组件的数据作为参数传递给回调函数  
        this.props.getMsg( this.state.childMsg )
    }
    render (){
        return (
            <div>
                <button onClick={this.handleClick}> 点我，给父组件传递数据 </button>
            </div>
        )
    }
    }
    ReactDOM.render(<Parent />,document.getElementById('root'))
    ```
#### 6.3.4 兄弟组件
- 将**共享状态**提升到最近的公共父组件中，由**公共父组件** 管理这个状态
- **思想**： **状态提升**
- 公共父组件职责：
    - 1、提供共享状态 
    - 2、提供操作共享状态的方法
- 要通讯的子组件只需通过 **`props`** 接收状态或操作状态的方法
```js
class Counter extends React.Component {
    //提供共享状态
    state = {
        count:0
    }
    //提供修改数据的方法
    onIncrement = () =>{
        this.setState({
            count:this.state.count +1
        })
    }
    render(){
        return (
            <div>
                <Child1 count={this.state.count}/>
                <Child2 onIncrement={this.onIncrement}/>
            </div>
        )
    }
}
const Child1 = props =>{
    return <h1>计数器：{props.count}</h1>
}
const Child2 = props =>{
    return <button onClick={()=>props.onIncrement()}>点击 +1 </button>
}
ReactDOM.render(<Counter />,document.getElementById('root'))
```

### 6.4 `Context`
- 如果两个组件时远方亲戚（比如，嵌套组件） 可以使用 `Context` 实现组件通讯
- `Context` 提供了两个组件： `Provider` ， `Consumer`
- `Provider` 组件： 用来 提供 数据
- `Consumer` 组件： 用来 消费 数据

> - <App />
>    - <Node />
>        - <SubNode />
>            - <Child />

- 思考： `App` 组件要船体数据给 `Child` 组件，该如何处理？
    - 处理方式：使用 `props` 一层一层组件往下传递（繁琐）
    - <font color="red">作用：跨组件传递数据</font>（比如： 主题、语言等）
        
        - 使用步骤：
            - 1、调用 `React.createContext()` 创建 `Provider` (提供数据) 和 `Consumer` (消费数据) 两个组件
            ```const { Provider，Consumer } = React.createContext()```
            - 2、使用 `Provider` 组件作为父节点
            ```js
            <Provider>
                <div className="App">
                    <Child1 />
                </div>
            </Provider>
            ```
            - 3、设置 `value` 属性，表示要传递的数据
            ```< Provider value="pink"/>```
            - 4、调用 `Consumer` 组件接收数据
            ```js
            <Consumer>
                { data => <span>data 参数表示接收到的数据 -- {data}</span>}
            </Consumer>
    ```
        
            ```js
            // 1--调用 `React.createContext()` 创建 `Provider` (提供数据) 和 `Consumer` (消费数据) 两个组件
    const { Provider,Consumer } = React.createContext()
        
            class App extends React.Component {
                render(){
                    return (
                        /*   2--使用 `Provider` 组件作为父节点 */
                        /*   3--设置 `value` 属性，表示要传递的数据 */
                        <Provider value="pink">
                            <div className="App">
                                <Node />
                            </div>
                        </Provider>
                    )
                }
            }
            const Node = props =>{
                return (
                    <div className="node">
                        <SubNode />
                    </div>
                )
            }
            const SubNode = props =>{
                return (
                    <div className="subnode">
                        <Child />
                    </div>
                )
            }
            const Child = props =>{
                return (
                    <div class="child">
                        /* 4--调用 `Consumer` 组件接收数据 */
                         <Consumer>
                         { data => <span>data 参数表示接收到的数据 -- {data}</span>}
                         </Consumer>
                    </div>
                )
            }
            ReactDOM.render(<App />,document.getElementById('root'))
            ```

### 6.5 `props` 深入
#### 6.5.1 `children` 属性
- `children` 属性： 表示组件标签的子节点。当组件标签有子节点时，`props` 就会有该属性
- `children` 属性与普通的 `props` 一样，值可以是任意值 （文本、`React` 元素、组件、甚至是函数）
```js
function Hello(props){
    return (
        <div>
            组件的子节点： { props.children }
        </div>
    )
}
<Hello>我是子节点</Hello>
```
看代码演示： `children` 为文本节点
```js
import React from 'react'
import ReactDOM from 'react-dom'
const App = props =>{
    console.log( props )
    return (
        <div>
            <h1>组件标签的子节点：</h1>

            {/* 获取子节点 */}
            {props.children}
        </div>
    )
}
ReactDOM.render(<App>我是子节点</App>,document.getElementById('root'))
```
看代码演示： `children` 也可以为`React` 元素、组件、甚至是函数
```js
import React from 'react'
import ReactDOM from 'react-dom'
const Test = () => <button>我是button 组件</button>
const App = props =>{
    console.log( props )
    // props.children()
    return (
        <div>
            <h1>组件标签的子节点：</h1>

            {/* 获取子节点 */}
            {props.children}
        </div>
    )
}
ReactDOM.render(<App>
    {/* <p>我是子节点，p标签</p> */}
    <Test />
</App>,document.getElementById('root'))
```

#### 6.5.2 `props` 校验
- 对于组件来说， `props` 是外来的，无法保证组件使用者传入什么格式的数据
- `props` 校验：允许在创建组件的时候，就指定 `props` 的类型、格式等
- 作用： 捕获使用组件的时候 因为 `props` 导致的错误，给出明确的错误提示，增加组件的健壮性
- **使用步骤**：
    
    - 1、安装包 `props-types` (`yarn add prop-types`或者 `npm i prop-types` )
    - 2、导入 `props-types`包
    - 3、使用 `App.propTypes ={}` 来给组件的 `props` 添加校验规则
    - 4、校验规则通过 `PropTypes` 对象来指定
    ```js
    import PropTypes from 'prop-types'
    function App(props){
        return (
            <h1>Hi,{props.colors}</h1>
        )
    }
    App.propTypes = {
        //约定 colors 属性为 array 类型
        //如果类型不对，则报出明确错误，便于分析错误原因
        colors:PropTypes.array
    }
    ```
```js
App.propTypes = {
    colors:PropTypes.array
}
```
```js
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'/* 导入 `props-types`包 */

const App = props => {
    const arr = props.colors
    const lis = arr.map((item,index) =><li key={index}>{item} </li>)
    return (
        <ul>
            {lis}
        </ul>
    )


}
{/* 使用 `App.propTypes ={}` 来给组件的 `props` 添加校验规则 */}
App.propTypes = {
    //约定 colors 属性为 array 类型
    //如果类型不对，则报出明确错误，便于分析错误原因
    colors:PropTypes.array
}

{/* ReactDOM.render(<App colors={19} />,document.getElementById('root')) */}
ReactDOM.render(<App colors={["red","blue"]} />,document.getElementById('root'))
```

#### 6.5.3 约束规则
- **常见类型**： `array` 、`bool` 、`func` 、 `number` 、 `object` 、 `string`
- **`React` 元素类型**： `element`
- **必填项**： `isRequired`
- **特定结构的对象**： `shape({})`
- **查看所有的约束规则**： https://reactjs.org/docs/typechecking-with-proptypes.html
```js
//常见类型：
optionalFunc:PropTypes.func,
//必填项：
requiredFunc:PropTypes.func.isRequired
//特定结构的对象：
optionalObjectWithShape:PropTypes.shap({
    color:PropTypes.string,
    fontSize:PropTypes.number
})
```
```js
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'/* 导入 `props-types`包 */

const App = props => {
    return (
        <div>
           <h1>props:</h1> 
        </div>
    )


}

App.propTypes = {
    //约定 colors 属性为 array 类型
    //如果类型不对，则报出明确错误，便于分析错误原因
    a:PropTypes.number,
    fn:PropTypes.func.idRequired,
    tag:PropTypes.element,
    filter:PropTypes.shape({
        area:PropTypes.string,
        price:PropTypes.number,
    }),
}

ReactDOM.render(<App fn={()=>{}}/>,document.getElementById('root'))
```
#### 6.5.4 `props` 的默认值
- 场景： 分页组件 -> 每页显式条数
- 作用： 给 `props` 设置默认值，在未传入 `props` 时生效
```js
import React from 'react'
import ReactDOM from 'react-dom'

const App = props => {
    console.log( props)
    return (
        <div>
           <h1>此处显式props 的默认值:{props.pageSize}</h1> 
        </div>
    )


}
//添加 props 默认值
App.defaultProps = {
    pageSize:10
}

ReactDOM.render(<App />,document.getElementById('root'))
```
### 6.6 组件的生命周期

#### 生命周期概述

- **意义**：组件的生命周期有助于理解组件的运行方式，完成更复杂的组件功能，分析组件错误原因等
- **组件的生命周期**：组件从被创建到挂载到页面中运行，再到组件不再使用时卸载的过程
- 生命周期的每个阶段总是伴随着一些方法调用，这些方法就是生命周期函数的**钩子函数**
- 钩子函数的作用：为开发人员在不同阶段操作组件提供了时机
- **只有 类组件 才有生命周期**

#### 生命周期的三个阶段
- 生命周期的三个阶段： 创建时、更新时、卸载时
    - 每个阶段的执行时机
    - 每个阶段钩子函数的执行顺序
    - 每个钩子函数的作用

- 创建时（挂载阶段）
    - 执行时机：组件创建时（页面加载时）
    - 执行顺序：`constructor()` --> `render()` --> `componentDidMount()`

    | 钩子函数 | 触发时机 | 作用 |
    | :----: | :---- | :---- |
    | `constructor` | 创建组件时，最先执行 | 1、初始化 `state`  <br/>2、为事件处理程序绑定 `this` |
    | `render` | 每次渲染都会触发 | 渲染 `UI` <br/>(注意：不能调用 `setState()`) |
    | `componentDidmount` | 组件挂载（完成`DOM`渲染）后 | 1、发送网络请求、<br/>2、`DOM` 操作 |

```js
import React from 'react'
import ReactDOM from 'react-dom'

/* 组件生命周期-- 创建阶段 */

class App extends React.Component {
    constructor(props) {
        super(props)

        //初始化state
        this.state = {
            count:0
        }
        console.warn( '生命周期钩子函数：constructor ')

        const title = document.getElementById('title')
        console.log( 'constructor--title ',title)
    }

    componentDidMount(){
        const title = document.getElementById('title')
        console.log( 'componentDidmount--title ',title)
        console.warn( '生命周期钩子函数：componentDidmount ')
    }

    render(){
        // 错误演示  不要再render 中调用 setState()
        // this.setState({
        //     count:1
        // })
        console.warn( '生命周期钩子函数：render ')
        const title = document.getElementById('title')
        console.log( 'render--title ',title)

        return (
            <div>
               <h1 id="title">统计豆豆被打的次数：</h1> 
               <button id="btn">打豆豆</button> 
            </div>
        )
    }
}

ReactDOM.render(<App />,document.getElementById('root'))
```
- 更新时（更新阶段）
    - **执行时机**：
        - 1、`setState()`
        - 2、`forceUpdate()`
        - 3、组件接收新的 `props`
    - **说明**： 以上三者任意一种变化，组件就会重新渲染
    - 执行顺序：`render()`  -->   `componentDidUpdate()`

    | 钩子函数 | 触发时机 | 作用 |
    | :----: | :---- | :---- |
    | `render` | 每次渲染都会触发 | 渲染 `UI` (与挂载阶段 是同一个 `render` ) |
    | `componentDidUpdate` | 组件更新（完成`DOM`渲染）后 | 1、发送网络请求、<br/>2、`DOM` 操作 <br/>（注意：如果要`setState()`必须放在一个 if 条件中） |

```js
import React from 'react'
import ReactDOM from 'react-dom'

/* 组件生命周期 -- 更新阶段*/

class App extends React.Component {
    constructor(props) {
        super(props)

        //初始化state
        this.state = {
            count: 0
        }

    }
    //打豆豆
    handleClick = () => {
        this.setState({
            count:this.state.count + 1
        })

        //演示强制更新
        // this.forceUpdate()
    }
    // console.log( props)
    render() {
        console.log('生命周期钩子函数-render ')
        return (
            <div>
                <Counter count={this.state.count} />
                <button onClick={this.handleClick}>打豆豆</button>
            </div>
        )
    }
}

class Counter extends React.Component {
    componentDidUpdate(prevProps){
        console.log('Counter 组件 生命周期钩子函数-componentDidUpdate ')

        //注意：如果要`setState()`必须放在一个 if 条件中）
        //因为： 如果直接调用 setState()  更新状态， 也会调至递归更新
        // this.setState({})

        // 正确做法
        //做法：比较更新前后的 props 是否相同，来决定是否重新渲染组件
        console.log('上一次props:',prevProps,"当前的props:",this.props)
        if(prevProps.count !== this.props.count ){
            this.setState({})

            // 发送ajax请求
        }


        const title = document.getElementById('title')
        console.log( title.innerHTML )
    }
    render() {
        console.log('Counter 组件 生命周期钩子函数-render ')
        return <h1 id="title">统计豆豆被打的次数：{this.props.count}</h1>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
- 卸载时（卸载阶段）
    - **执行时机**：组件从页面中消失

    | 钩子函数 | 触发时机 | 作用 |
    | :----: | :---- | :---- |
    | `componentWillUnmount` | 组件卸载（从页面中消失） | 执行清理工作（比如清理定时器等） |
```js
import React from 'react'
import ReactDOM from 'react-dom'

/* 组件生命周期 -- 卸载阶段*/

class App extends React.Component {
    constructor(props) {
        super(props)

        //初始化state
        this.state = {
            count: 0
        }

    }
    //打豆豆
    handleClick = () => {
        this.setState({
            count:this.state.count + 1
        })
    }

    // console.log( props)
    render() {
        return (
            <div>
                {this.state.count >3 ? <h1>豆豆被打死了</h1>:(<Counter count={this.state.count} />)}
                
                <button onClick={this.handleClick}>打豆豆</button>
            </div>
        )
    }
}

class Counter extends React.Component {
    render() {
        return <h1 id="title">统计豆豆被打的次数：{this.props.count}</h1>
    }
    componentDidMount(){

       //开启定时器
       this.timerId = setInterval( ()=>{
        console.log('定时器正在执行！')
       },500) 
       
    }
    componentWillUnmount(){
        console.log('componentWillUnmount钩子函数触发了')

        //清理定时器
        clearInterval(this.timerId)
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
- 不常用钩子函数介绍
    - 新版完整生命周期钩子函数（知道）

### 6.7 `render-props` 和高阶组件

#### 6.7.1`React` 组件复用概述

- **思考**：如果两个组件中的部分功能相似或相同，该如何处理？
- **处理方式**： <font color="red">复用</font>相似的功能（ 联想函数封装 ）
- **复用什么**？
    - `state`
    - 操作 `state` 的方法（组件状态逻辑）
- **两种方式**：
    - <font color="red">**`render props`模式**</font>
    - <font color="red">**高阶组件（`HOC`）**</font>
- **注意**：这两种方式 不是新的 `API` ,而是利用 `React` 自身特点的编码技巧，演化而成的固定模式（固定写法）

#### 6.7.2 `render props`模式
- 思路分析
    - 思路：将要复用的 `state` 和操作 `state` 的方法封装到一个组件中
    - 问题1：如何才能拿到该组件中复用的 `state` ?  
    - 在使用组件时，添加一个值为<font color="red">函数的 `props`</font> ,通过函数<font color="red">参数</font> 来获取（ 需要组件内部实现 ）
        `<Mouse render={(mouse) => {}}/>`
    - 问题2：如何渲染任意的`UI`?
    - 使用该函数的返回值作为要渲染的 `UI` 内容( 需要组件内部实现 )
    ```js
    <Mouse render={(mouse) => (
        <p>鼠标当前位置 {mouse.x}，{mouse.y}</p>
    )}/>
    ```
- **使用步骤**：
    - 1、创建 `Mouse` 组件，在组件中提供复用的 <font color="red">状态逻辑</font> 代码（1、状态 2、操作状态的方法）
    - 2、将要 <font color="red">复用的状态</font> 作为 `props.render(state)` 方法的参数，暴露到组件外部。
    - 3、使用 `props.render()` 的返回值 作为要渲染的内容
- 演示 `Mouse` 组件的复用
    - `Mouse` 组件负责： 封装复用的状态逻辑代码（）
    - 状态：鼠标坐标（x,y）
    - 操作状态的方法：鼠标移动事件
    - 传入的 `render props` 负责:使用复用的状态来渲染 `UI` 结构
```js
class Mouse extends React.Component {
    //...
    render(){
        return this.props.render(this.state)
    }
}
<mouse render={ (mouse) => <p>鼠标当前位置{mouse.x}--{mouse.y}</p>} />
```
```js
import React from 'react'
import ReactDOM from 'react-dom'
import img from './cat.jpg'

/* render props  模式*/

class App extends React.Component {
 
    render() {
        return (
            <div>
                <h1>render props 模式</h1>
                <Mouse 
                    render={(mouse)=>{
                    return (
                        <p>
                            鼠标的位置：{mouse.x}--{mouse.y}
                        </p>
                    )                  
                }}/>
                {/* 猫捉老鼠 */}
                <Mouse 
                    render={(mouse)=>{
                    return (
                        <img 
                        src={img} 
                        alt="cat" 
                        style={{
                            position:'absolute',
                            top:mouse.y - 50,
                            left:mouse.x - 70,
                            width:'140px',
                            height:'100px'
                        }}/>
                    )                  
                }}/>
            </div>
        )
    }
}

class Mouse extends React.Component {
    // 鼠标位置
    state = {
        x:0,
        y:0,
    }
    // 鼠标移动事件的事件处理程序
    handleMouseMove = e =>{
        this.setState({
            x:e.clientX,
            y:e.clientY
        })
    }
    // 监听鼠标移动事件
    componentDidMount(){
        window.addEventListener('mousemove',this.handleMouseMove)
    }
    render() {
        return this.props.render(this.state)
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
- `children` 代替 `render` 属性

    - **注意**：并不是该模式叫 `render props` 就必须使用名为 `render` 的 `prop` ,实际上可以使用任意名称的 `prop`

    - 把 `prop` 是一个函数并且告诉组件要渲染什么内容的技术叫做：`render props` 模式

    - 推荐： 使用 `children` 代替 `render` 属性

核心代码：
```js
<Mouse>
 { ({x,y}) => <p>鼠标的位置是{x}，{y}</p>}
</Mouse>

//组件内部
this.props.children(this.state)
```
完整代码：
```js
import React from 'react'
import ReactDOM from 'react-dom'
import img from './cat.jpg'

/* render props  模式*/

class App extends React.Component {
 
    render() {
        return (
            <div>
                <h1>render props 模式</h1>
                {/* render 模式 */}

               {/*  <Mouse 
                    render={(mouse)=>{
                    return (
                        <p>
                            鼠标的位置：{mouse.x}--{mouse.y}
                        </p>
                    )                  
                }}/> */}

                {/* children  模式  */}

                <Mouse>
                { mouse => (
                    <p>
                        鼠标的位置：{mouse.x}--{mouse.y}
                    </p>
                ) }
                </Mouse>
                {/* 猫捉老鼠 */}
                <Mouse>
                    {mouse =>(
                        <img 
                        src={img} 
                        alt="cat" 
                        style={{
                            position:'absolute',
                            top:mouse.y - 50,
                            left:mouse.x - 70,
                            width:'140px',
                            height:'100px'
                        }}/>
                    )}
                    </Mouse>                  
            </div>
        )
    }
}

class Mouse extends React.Component {
    // 鼠标位置
    state = {
        x:0,
        y:0,
    }
    // 鼠标移动事件的事件处理程序
    handleMouseMove = e =>{
        this.setState({
            x:e.clientX,
            y:e.clientY
        })
    }
    // 监听鼠标移动事件
    componentDidMount(){
        window.addEventListener('mousemove',this.handleMouseMove)
    }
    render() {
        /* return this.props.render(this.state) */
         return this.props.children(this.state) 

    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
- **代码优化**
    - 1、**推荐： 给 `render props` 模式添加 `props` 校验**
        - 核心代码：
        ```js
        Mouse.propTypes = {
            children:PropTypes.func.isRequired
        }
        ```
    - 2、**应该在组件卸载时解除 `mousemove` 事件绑定**
        - 核心代码：
        ```js
        componentWillUnmount(){
            window.removeEventListener('mousemove',this.handleMouseMove)
        }
        ```

####  6.7.3 高阶组件
##### 概述
- 目的：实现状态逻辑复用
- 采用 包装 （装饰） 模式，比如说：手机壳
- 手机： 获取保护功能
- 手机壳：提供保护功能
- 高阶组件就相当于手机壳，通过包装组件，增强组件功能
#####  思路分析
- 高阶组件（`HOC`:`Hight-Order Component`）是一个函数，接收要包装的组件，返回增强后的组件
    核心代码`const EnhancedComponent = withHOC( WrappedComponent )`
- 高阶组件内部 创建一个类组件，在这个类组件中提供复用的状态逻辑代码，通过 `prop` 将复用的状态传递给被包装组件 `WrappedComponent`
    核心代码：
    ```js
    //高阶组件内部创建的类组件：
    class Mouse extends React.Component {
        render (){
            return <WrappedComponent {...this.state} />
        }
    }
    ```
##### 使用步骤：
- 1、创建一个函数，名称为以 **with 开头**
- 2、指定函数参数，参数应该以大写字母开头（作为要渲染的组件）
- 3、在函数内部创建一个类组件，**提供复用的状态逻辑代码**，并返回
核心代码：
```js
function withMouse (WrappedComponent){
    class Mouse extends React.Component {
        return Mouse
    }
}
```
- 4、在该组件中，渲染参数组件，同时将状态通过 `prop` 传递给参数组件
核心代码：
```js
//Mouse 组件的render 方法中
return <WrappedComponent {...this.state} />
```
- 5、调用该高阶组件，传入增强的组件，通过返回值拿到增强后的组件，并将其渲染到页面中
```js
//创建组件
const WrappedComponent = withMouse(Position)

//渲染组件
<MousePosition />
```
完整代码：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import img from './cat.jpg'
/* 高阶组件*/

// 创建高阶组件
function withMouse(WrappedComponent){
    
    //该组件提供复用的状态逻辑
    class Mouse extends React.Component {
        //鼠标状态
        state= {
            x:0,
            y:0
        }
        handleMouseMove = e => {
            this.setState({
                x:e.clientX,
                y:e.clientY
            })
        }
        // 控制鼠标状态的逻辑
        componentDidMount(){
            window.addEventListener('mousemove',this.handleMouseMove)
        }
        // 
        componentWillUnmount(){
            window.removeEventListener('mousemove',this.handleMouseMove)
        }
        render(){
            return <WrappedComponent {...this.state}></WrappedComponent>
        }
    }

    return Mouse
}

// 用来测试高阶组件
const Position = props => (
    <p>
        鼠标当前的位置：(x:{props.x},y:{props.y})
    </p>
)

//猫捉老鼠的组件
const Cat = props =>(
    <img 
        src={img} 
        alt="cat" 
        style={{
            position:'absolute',
            top:props.y - 50,
            left:props.x - 70,
            width:'140px',
            height:'100px'
        }}/>
)

// 获取增强后的组件：
const MousePosition = withMouse(Position)

//调用高阶组件来增强猫捉老鼠的组件
const MouseCat = withMouse(Cat)

class App extends React.Component {

    render() {
        return (
            <div>
            <h1>高阶组件</h1>
            {/* 渲染增强后的组件 */}
            <MousePosition />
            <MouseCat />
            </div>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('root'))
```
#####  设置`displayName`
- 使用高阶组件存在的问题：得到的两个组件名称相同（查看 `React` 开发者工具）
- 原因： 默认情况下， `React` 使用组件名称 作为 `displayName`
- 解决方式：为高阶组件 设置 `displayName` 便于调试时区分不同的组件
- `displayName` 的作用：用于设置调试信息（`React Developer Tools` 信息）
- 设置方式：
```js
Mouse.displayName = `WithMouse${getDisplayName(WrappedComponent)}`

function getDisplayName(WrappedComponent){
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
```
        
完整代码：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import img from './cat.jpg'
/* 高阶组件*/

// 创建高阶组件
function withMouse(WrappedComponent){
    
    //该组件提供复用的状态逻辑
    class Mouse extends React.Component {
        //鼠标状态
        state= {
            x:0,
            y:0
        }
        handleMouseMove = e => {
            this.setState({
                x:e.clientX,
                y:e.clientY
            })
        }
        // 控制鼠标状态的逻辑
        componentDidMount(){
            window.addEventListener('mousemove',this.handleMouseMove)
        }
        // 
        componentWillUnmount(){
            window.removeEventListener('mousemove',this.handleMouseMove)
        }
        render(){
            return <WrappedComponent {...this.state}></WrappedComponent>
        }
    }

    //设置 displayName
    Mouse.displayName = `WithMouse${getDisplayName(WrappedComponent)}`

    return Mouse
}

//设置 displayName
function getDisplayName(WrappedComponent){
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
// 用来测试高阶组件
const Position = props => {
    console.log('Position',props)
    return(
        <p>
        鼠标当前的位置：(x:{props.x},y:{props.y})
        </p>
    )
}

//猫捉老鼠的组件
const Cat = props =>(
    <img 
        src={img} 
        alt="cat" 
        style={{
            position:'absolute',
            top:props.y - 50,
            left:props.x - 70,
            width:'140px',
            height:'100px'
        }}/>
)

// 获取增强后的组件：
const MousePosition = withMouse(Position)

//调用高阶组件来增强猫捉老鼠的组件
const MouseCat = withMouse(Cat)

class App extends React.Component {

    render() {
        return (
            <div>
            <h1>高阶组件</h1>
            {/* 渲染增强后的组件 */}
            <MousePosition a="1"/>
            <MouseCat />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
```
##### 传递 `props` 
- 问题： `props` 丢失
- 原因：高阶组件没有往下传递`props`
- 解决方式：渲染 `WrappedComponent` 时，将 `state` 和 `this.props` 一起传递给组件
- 传递方式： `<WrappedComponent {...this.state} {...this.props}/>`

### 6.8 `React` 组件进阶总结
- 组件通讯是构建 `React` 应用必不可少的一环
- `props` 的灵活性让组件更加强大
- 状态提升是 `React` 组件的常用模式
- 组件生命周期有助于理解组件的运行过程
- 钩子函数让开发者可以在特定的时机执行某些功能
- `render props` 模式和高阶组件都可以实现组件状态逻辑复用
- 组件极简模型： `(state,props) =>UI`
