[toc]

单页面应用：



#### `react` 初始化项目: 

命令`npx create-react-app` 后面的`my-app`为项目名称

```shell
#推荐使用 
npx create-react-app my-app
#或       
npm init react-app my-app
#或       
yarn create react-app my-app
```

启动项目 , 在根目录执行命令:

```sh
npm start   
#或者
yarn start
```

#### **在脚手架中使用react**

1导入react和react-dom两个包

```js
import React from 'react'
import ReactDOM from 'react-dom'
```

2 调用React.createElement() 方法创建react元素

3  调用ReactDOM.render() 方法渲染react元素到页面中

### **jsx**

**什么是jsx**

 createElement()的问题:

 繁琐不简洁

不直观 无法一眼看出描述的结构

不优雅 用户体验不爽

jsx是javaScriptde 的简写, 表示在JavaScript代码XML(HTML)格式的代码

优势: 声明式语法更加直观 与HTML结构相同, 降低了学习成本, 提升了开发效率

#### **`jsx`是`React`的核心内容**

```js
<div className="shopping-list">
  <h1>Shopping List</h1>
  <ul>
    <li>123</li>
    <li>456</li>
  </ul>
</div>
```

**使用步骤:**

1 使用JSX语法创建react元素

2 使用ReactDOM.render()方法渲染react元素到页面中

```js
//使用JSX语法  创建react元素
const title= <h1> Hello JSX <span> 这是span </span> </h1>
    //渲染创建好的React元素
ReactDOM.render(title,root)
```

#### **小结:**

 推荐使用JSX语法创建React元素

写JSX就跟写HTML一样 更加直观 友好

JSX语法更能体现React的声明式特点 (描述ui长什么样)

#### **思考:  为什么脚手架中可以使用JSX语法?**

1  JSX不是标准ECMAScript语法  它是ECMAScript的语法扩展

2  需要使用babel编译处理后 才能在浏览器环境中使用.

3  create-react-app  脚手架中已经默认有该配置  无需手动配置.

4  编译JSX语法的包尾   @babel/preset-react

#### **JSX的基本使用 需要注意点:**

1  React元素的属性名使用  驼峰命名法

2  特殊属性名: class --> className  for --> htmlFor    tabindex-->tabIndex

3 没有子节点的React元素可以用   />   结束

4  推荐:  使用小括号包裹 JSX  ,  从而避免 JS 中的自动插入分号陷阱

```js
//使用小括号包裹JSX
const dv=(
  <div>Hello JSX</div>
)
```

### **JSX中使用JavaScript表达式**

#### **嵌入js表达式**

数据存储在JS中

语法:{ JAVAScript 表达式 }

注意: 语法中是单大括号 不是双大括号!

```js
const name="jack"
const dv=(
<div> 你好 我叫:{name} </div>
)
```

#### **JSX的条件渲染:**

场景: loading 效果

条件渲染:根据条件渲染特定的JSX结构

```jsx
const loadData=()=>{
if (isLoading) {return <div>数据加载中 请稍后...</div>  }
 return (
   <div>数据加载完成, 此处显示加载后的数据</div>
  )
}

const dv=(
  <div>
  { loadingData() }
  </div>
)
```

