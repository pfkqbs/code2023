[toc]

Time:2021-03
ther:gaogang
class: 2008A

## ES6

学习网站： https://es6.ruanyifeng.com/

###  箭头函数
- 普通函数
```js
//普通函数 this 指向调用时所在的对象(可变)
let fn = function fn(a, b) {
    console.log(a, b);
}
fn(1, 2);
```

- 箭头函数:
    - 箭头函数this指向声明时所在的对象(不可变)
    ```js
    let fn2 = (c, d) => {
        console.log(c, d);
    }
    fn2(3, 4);
    ```
    - 如果只有一个参数,可以省略圆括号
    ```js
    let fn3 = c => {
    }
    fn3(6);
    ```
    - 如果函数体内只有一条 return 语句,可以省略 {} return
    ```js
    let fn4 = d => d;
    fn4(7)
    ```
- 箭头函数与普通函数的区别:
    - this 指向问题：普通函数 `this` 指向调用时所在的对象(可变); 箭头函数 `this` 指向定义时所在对象(不可改变)
    ```js
    let obj={"name":"gao","age":18};

    function fn(){
        console.log(this);
    }

    fn();//this-->window 

    fn.call(obj);//fn-->this-->obj

    let fn2=()=>{
        console.log(this);
    }

    fn2();

    fn2.call(obj)//无法改变this指向,还是window
    ```
    - 构造函数问题：普通函数 可以当做构造函数  可以 `new`;  箭头函数 不可以当做构造函数,不可以 `new`
    ```js
    function Gou(name, age) {
        this.name = name;
        this.age = age;
    }

    let o1 = new Gou("Gao", 19);

    console.log(o1);

    //Gou {name: "Gao", age: 19}
    //-----------------------

    let Gou2 = (name, age) => {
        this.name = name;
        this.age = age;
    }
    let o2 = new Gou2("wang", 18);
    console.log(o2);
    ```
    - 参数问题：普通函数  `arguments` 获取所有的实参,组成伪数组 ; 箭头函数不可以使用 `arguments` 用 `rest` 参数(...参数)
    ```js
    function fn3(){
        console.log(arguments);
    }

    fn3(1,2,3,4,5);

     let fn4=(...x)=>{
        console.log(x);
     }

    fn4(1,2.3,4,5);//箭头函数无arguments,可以使用...
    //普通函数可以使用...????--->可以 
    function fn5(...x){
        console.log(x);
    }
    fn5(1,2,3,4,5);   //可以使用...
    ```
    - 不可以使用 `yield` 命令,因为箭头函数不能用作 `Generator` 函数;首先可以把它理解成 `Generator` 函数是一个状态机,封装了多个内部状态.
    ```js
     function *fn5(){//写法或者function* fn5()
         yield '1';
         yield '2';
         yield '3';    //yield产出
         return "d"
     }
    let f = fn5();
    for( let v of f){
           console.log(v);
    }
    console.log( f.next() );
    console.log( f.next() );
    console.log( f.next() );
    console.log( f.next() );
    //console.log( f.next() );
    //console.log( f.next() );
    //console.log( f.next() );
    ```
### Symbol 
```js
let a = Symbol();
let b = Symbol();

console.log(a);
console.log(b);

console.log(a == b, a === b);

```

```js

//应用-->对象的key,保证唯一,不被覆盖
//组长:对象{name:"gao"}
//自己:对象{name:"王"}

let obj = {
    [a]: "gao"
};

let obj2 = {
    [b]: "王"
};
console.log(obj[a]);
console.log(obj2);

//将obj2合并到obj对象上,----如果属性名相同,覆盖,但是属性名是Symbol独一无二

Object.assign(obj, obj2);
console.log("合并后", obj);
```
### Set

```js
//Set :类似数组的数据结构,但是成员值唯一
let a = new Set([1, 2, 3, 1, 2]);

//类数组转数组
let arr = Array.from(a);
console.log(a);
console.log(arr);

//是否存在
console.log(a.has(1)); //true
console.log(a.has(2)); //true
console.log(a.has(3)); //true
console.log(a.has(4)); //false

//添加add()
a.add(555);
console.log(a);

//删除 delete()
a.delete(2);
console.log(a);

//清空clear();
// a.clear();
console.log(a);

//属性size长度
console.log(a.size);
```
### Map

```js
//定义一个普通的对象，key 为字符串
let obj = {
    "name": "gao",
    "12": 23232
}; //key为字符串
console.log(obj);


//map  :类似对象的数据结构,但是 key 可以为任何数据类型

//定义一个Map()结构
let m = new Map();

// 设置值set()
m.set(true, "呵呵"); //这里key为true,可以为null,还可以为function     
m.set(1, "哈哈"); //这里key为true,可以为null,还可以为function     
m.set(2, "嘻嘻"); //这里key为true,可以为null,还可以为function     
console.log(m);

//获取值get(key)
console.log(m.get(true));
console.log(m.get(1));
console.log(m.get(2));

//是否存在has(key)
console.log(m.has(12)); //false
console.log(m.has(2)); //true

//删除 delete(key)
m.delete(1);
console.log(m);

//清空clear()
m.clear();
console.log(m);

//属性size
console.log(m.size);

//遍历keys
for (let v of m.keys) {
    console.log(v);
}
//遍历values
for (let v of m.values) {
    console.log(v);
}
//遍历keys和values
for (let v of m.entries) {
    console.log(v);
}
```
### `Proxy`
<font color="red">`Proxy` 与 `Object.defineProperty` 优劣对比</font>
<font color="red">`Proxy` 的优势如下</font>:

!!!`Proxy` 可以直接监听  对象  而非属性；
!!!`Proxy` 可以直接监听  数组  的变化；
!!!`Proxy` 有多达 13 种拦截方法,不限于 `apply`、`ownKeys`、`deleteProperty`、`has` 等等是 `Object.defineProperty` 不具备的；
!!!`Proxy` 返回的是一个  新对象  ,我们可以只操作新的对象达到目的,而 `Object.defineProperty` 只能遍历对象属性直接修改；
`Proxy` 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

`Object.defineProperty` 的优势如下:
兼容性好，支持 IE9，而 `Proxy` 的存在浏览器兼容性问题,而且无法用 `polyfill` 磨平，因此 `Vue` 的作者才声明需要等到下个大版本( 3.0 )才能用 `Proxy` 重写。 

```js
//Proxy用于修改某些操作的默认行为
let obj = {
    "name": "gao",
    "age": 18
};

//取值
let p = new Proxy(obj, {

    //target䯮对象,key为读取的属性名
    get: function (target, key, value) {
        console.log("获取值key是", key, "获取值value", value);
        return target[key];
    },

    //target目标对象,key修改的属性名,value修改的值
    set: function (target, key, value) {
        console.log("target", target);
        console.log("key", key);
        console.log("value", value);

        target[key] = value;
    }
})

console.log(p.name); //读取操作,自动执行get方法

p.age = 999; //设置操作,自动执行set方法

console.log("p",p);

```
### `Object.defineProperty`

```js
//定义一个对象
let obj = {
    "name": "wang",
    "age": 12
};

// 遍历对象
for (let key in obj) {
    Object.defineProperty(obj, key, {
        get: function () {
            console.log("获取值了");
        },
        set: function () {
            console.log("设置值了");
        }
    })
}

obj.age; //获取值
obj.name = '888888'; //设置值
obj.age = 000;
```
### `Reflect`
`Reflect` 操作对象的方法 
1 将属于语言内部的方法,放在 Reflect 上
2 修改了一些方法的返回值,比如报错改为 false
13个方法

```js
//get(目标对象,属性名)
let obj = {
    "name": "gao",
    "age": 13
};
console.log(obj);
console.log(Reflect.get(obj, "name"));
//set(目标对象.属性名,值)
obj.age = 999;
Reflect.set(obj, "age", "999999")
console.log(obj);

function FancyThing() {
    this.name = "gao";
    this.age = 19;
}

FancyThing.prototype.sex = "男";
FancyThing.prototype.sex = function () {
    console.log("哈哈");
};

const myObj = new FancyThing();

//获取原型对象
console.log(Reflect.getPrototypeOf(myObj));

//设置原型对象
let obj3 = {
    "hobby": "dfssdfsdf"
};

Reflect.setPrototypeOf(myObj, obj3);

//获取
console.log( Reflect.getPrototypeOf(myObj) );
```

### `promise`
**为什么使用 `promise`**??  回调函数事件--解决了什么问题??  优化回调函数事件,挽回回调地狱
**`promise` 定义**:  是一个容器,里面保存着某个未来才会结束的事件的结果,(通常是一个异步操作)
**有3个状态**:  进行中(`pending`),  已成功(`fulfilled`),  已失败(`rejected`),
**两个结果**:  进行中-->已成功(`resolved`),  进行中-->已失败(`rejected`)

- 优点/特点:
    - 对象的状态不收外界影响;
    - 一旦状态改变,就不在改变,任何时候都可以得到这个结果

- 缺点:
    - 1无法取消 `promise` ,一旦新建它就会立即执行,无法中途取消
    - 2如果不设置回调函数, `Promise` 内部抛出的错误,不会反应到外部
    - 3当处于进行中 `pending` 状态时,无法得知目前进展到哪一个阶段(刚刚开始还是即将完成)

```js
//-->传统方式,多层嵌套导致 回调地狱
//---------------------------------
$.get("/地址1", function (val) {
    
    if (姓名) {
        $.get("/地址2", function () {
            
            if (订单号) {
                $.get("/地址3", function () {
                    
                    if (订单详情) {
                        $.get("/地址3", function () {
                            
                            if (评价) {

                            }
                        })
                    }

                })
            }

        })
    }

})
//------------------------------------

//定义--创建--
let err = 200;
console.log(1); //--1

//定义一个promise
let p = new Promise(function (resolved, rejected) {

        console.log(2); //--2,一旦新建它就会立即执行

        //异步操作
        if (err == 200) {
            resolved("成功的结果");
        } else {
            resolved("失败的结果");
        }
})

console.log(3); //--3

//调用
p.then(function (res) {
    console.log("成功", res);
}, function (res) {
    console.log("失败", res);
})
console.log(4);//--4

//  catch  捕获错误  .then可串联写   finally只要状态发生改变都会执行(不管成功失败)  
p.then(function (res) {
    console.log("成功", res); //---异步的结果
}).catch(function (res) {
    console.log("失败", res); 
}).finally(function(){
    console.log("哈哈哈"); 
})

//1234打印顺序是?????    :1-2-3-4-成功

//从上到下,先同步后异步,
```

### `promise` 的使用 ( `Ajax` 简单封装 `axios` )
- 原生 `Ajax` 

```js
let xhr = new XMLHttpRequest();
xhr.open("GET", "./promise.json", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
    }
}

```
- `Ajax` 封装 类似 `jquery` 

```js

function $my(obj) {
    let {type = "GET", url, success} = obj;
    let xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    }
}

// 使用封装好的 Ajax 调接口
$my({
    type: "GET",
    url: "./promise.json",
    success: function (res) {
        console.log(res);
    }
})
```
- `ajax-promise`  封装 `Ajax`
```js
// ajax-promise  封装 Ajax

function $ajax(obj) {
    let {
        type = "GET", url, success
    } = obj;
    let xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send();

    return new Promise(function (ok, no) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status == 200){
                    //成功
                ok(xhr.responseText);
                } 
            }else{
                //失败
                    no("请求失败")
            }
        }
    })
}

// promise-ajax 封装的 ajax 调用
$ajax({
    type:"GET",
    url:"./promise.json"
}).then(function(res){
    console.log(res);
}).catch(function(res){
    console.log(res);
})
```

封装好的 `ajax` 参考  库 `axios` :  http://www.axios-js.com/
`.all` 合并,只要有一个失败都失败
`.race` 那个先成功出来那个

```js

let x = 200;
let a = new Promise(function (ok, no) {
    if (x == 200) {
        ok("a 成功")
    } else {
        no("a 失败")
    }
})

let y = 200;
let b = new Promise(function (ok, no) {
    if (x == 200) {
        ok("b 成功")
    } else {
        no("b 失败")
    }
})

//all合并  类似&& 逗成功才成功,只要有一个失败都失败,回调

//race,竞争  类似|| 哪个成功执行那个回调函数

Promise.all([a, b]).then(function (res) {
    console.log(res);
    //0: "b成功"
    //1: "b成功"
}).catch(function(res){
        console.log(res);
})

```
### `class`类
回顾面向对象继承
```js
//构造函数
function Gou(name) {
    this.name = name;

}

//共享的方法 - 放在原型对象上
Gou.prototype.say = function () {
    console.log("哈哈哈哈");
}

//实例化,得到对象
let fu = new Gou("gao");

//使用对象
console.log(fu);

// 继承
function Zi(name) {
    Gou.call(this, name) //类式继承/借用构造函数继承/改变this指向实现继承
}

Zi.prototype = new Gou(); //原型链继承

// 实例化子类
let z = new Zi("gao");

console.log(z);

```
`class` 类

```js
//es6 -------class类
//使用场景:封装组件, react 框架语法使用(难上手,难写,原生js必须过关,灵活度高)
class Lei {
    //属性
    constructor(name) {
        this.name = name;
    }
    //方法
    say() {
        console.log("生生世世");
    }
}
let obj = new Lei("gao");
console.log("obj",obj);

obj.say()

//继承  关键词 extends 
class Zilei extends Lei {
    //  多态: 属性  方法

    //-------------------------
    //   constructor(){
    //       this.age = 18;     //出错
    //   }
    //--------------------------

    constructor(name) {
        super(name)     //子类构造函数中必须使用 super()  指向父类的构造函数
        this.age = 18;   //子类自己的属性
    }

    //子类自己的方法
    run() {
        console.log("哈哈");
    }
}
let obj2 = new Zilei("gao");
console.log(obj2);
```
### 模块化
四大步骤：创建模块 --> 导出模块 -->    导入模块 -->   使用

```js
// 2.js

//1---创建模块
let a=123;
//2---导出模块
export default a;
```

```js
// 1.js

//3---载入模块
import a from "./2.js"
//4---使用模块
console.log(a);
//a为自定义,随便起
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <script src="./2.js"></script>
    <script src="./1.js"></script> -->
   
    <!-- 这里type="module"  -->
    <script src="./1.js" type="module"></script>

    
</head>
<body> 
    <script>

    </script>
</body>
</html>
```
总结一下：
- 如果导出方式`export default a` 那么载入方式 `import 自定义变量名 from "./2.js"`
- 如果导出方式`export  a=123;` 那么载入方式 `import { a } from "./2.js"`

### `async`  异步函数
如果有 `return` ===> 有返回值 ===> 返回值是 `promise` 对象 ===> 获取返回值通过 `.then`
`await`   `promise` 成功的返回值,如果有 成功的返回值,执行下一步, 如果没有成功的返回值，则会报错,停止执行.
```js

let err = 200;//错误改为400测试一下

// 定义一个 promise 对象
let x = new Promise(function(ok,no){
    if(err == 200){
        ok("正确,成功返回值")
    }else{
        no("错误,失败返回值")
    }
})

async function fn(){

    //await 等待
    let a = await x; //await 后可以是一个 promise 对象
    let b = await 789;//await 后也可以是值，
    return [a,b];

}
console.log( fn() ); 

fn().then(function(res){
    console.log(res);
})
```
应用：
```js
//封装好的 AJax
function $ajax(obj) {
    let {
        type = "GET", url, success
    } = obj;
    let xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send();

    return new Promise(function (ok, no) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status == 200){
                    //成功
                ok(xhr.responseText);
                } 
            }else{
                //失败
                    no("请求失败")
            }
        }
    })
}

// 进一步使用 async 和 await

async function fn(){
    let a = await $ajax({'type':"get","url":"./1.json"})
    let b = await $ajax({'type':"get","url":"./1.json"})
    let c = await $ajax({'type':"get","url":"./1.json"})
    // console.log(a)
    // console.log(b)
    // console.log(c)
    return [JSON.parse(a),JSON.parse(b),JSON.parse(c)]
}

fn.then( res => console.log(res) )
```
### `webpack` 自动化模块化打包
- 文档： https://www.webpackjs.com/concepts/

- `webpack`: 模块化打包机（根据模块依赖打包文件）
- 默认：打包 `js` 文件
- 核心概念：
    - 入口(`entry`)
    - 输出(`output`)
    - `loader`: `css-loader` / `file-loader`
    - 插件(`plugin`): (删除已打包文件，压缩js，压缩css)
    - 模式(`mode`)
    - 浏览器兼容性(`browser compatibility`)
    - 环境(`environment`)

- 按照 `webpack` 指南进行配置 https://www.webpackjs.com/guides/getting-started/

- 构建服务器热加载开发环境： `webpack-dev-server`
- 插件 plugins: 
    - 输出html：html-webpack-plugins
    - 清理dist 目录： clean-webpack-plugin

## vue 
文档： https://cn.vuejs.org/

Hello World小项目开始
通过 cdn 使用vue :

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

```
`js` 使用严格模式：`use strict`

### **1/渐进式框架**

vue是一套构建用户界面的渐进式框架,采用自底向上增量开发的设计,vue的核心库只关注视图层,不仅易于上手,还便于与第三方库或既有项目整合;

渐进式表现:声明式渲染-->组件系统-->客户福安路由-->大数据状态管理-->构建工具

### **2两个核心(最大的亮点):**

**响应式数据绑定(双向数据绑定):**    当数据发生变化的时候,视图自动更新,即双向数据同步,原理利用了es6中放入Object definedProperty中的setter/getter代理数据,监控对数据的操作.

组合的视图组件(虚拟Dom):    即页面最终映射为一个组件树,采用树形结构进行设计,方便维护,重用.

### **3  虚拟`Dom`**

利用再去爱内存中生成与真实`Dom`与之对应的数据结构,这个在内存中生成的结构称之为虚拟Dom,当数据发生变化时,能够智能的计算出重新渲染组件的最小代价并应用到`Dom`操作上.

### **4 `MVVM`**

`MVVM`是`model-View-ViewModel`的缩写,它是一种基于前端开发的架构模式,起核心是提供对View和`ViewModel`的双向数据绑定,这使得`ViewModel`的状态改变可以自动传递给

`M`:`Model`(数据层,也就是指数据,前端是`js`)

`V`:`View`(也就是指`Dom`层或用户界面)

`VM`:`ViewModel`处理数据和界面的中间层,也就是指`vue`

**5声明式渲染**

`Vue.js` 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 `DOM` 的系统

额外补充:渲染分为:命令式渲染和声明式渲染

命令式渲染:命令我们的程序去做什么,程序就会跟着你的命令去一步一步执行

声明式渲染:只需要告诉程序想要的效果,其他的交给程序去做:



`vue.js`安装:

`CDN`:  对于制作原型或学习，你可以这样使用最新版本

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
```

### `NPM`:

在用 `Vue` 构建大型应用时推荐使用 `NPM` 安装。`NPM` 能很好地和诸如 或模块打包器配合使用。同时 `Vue` 也提供配套工具来开发。

```shell
$ npm install vue
```

### **看`vue.js`源码:**

`component`组件
`direction`指令
`filte`r控制器

### **`vue` 的生命周期**

`beforeCreate`
`created`
`beforeMount`
`mounted`
`beforeUpdated`
`updated`
`beforeDestroy`
`destroyed`
`activated`
`deactived`
`errorCaptured`
`serverPrefetch`

**`vue` 数组方法,只有`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`能够监听到**

```html
<!--view视图层-->
<div id="app">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: '#app',//vue操作的作用域
  //定义数据--model数据模型
  data: {
    message: 'Hello Vue!'
  }
})
//上面是id起作用,class是不起作用的,源码中是用queryselector
```

`v-bind` attribute 被称为**指令**。指令带有前缀 `v-`，以表示它们是 Vue 提供的特殊 attribute。

### 1 `v-for` 渲染列表

`v-for`指令可以绑定数组的数据来渲染一个项目列表

```html
<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```js
var app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      { text: '学习 JavaScript' },
      { text: '学习 Vue' },
      { text: '学习 React' }
    ]
  }
})
```

### 2 `v-if`



```html
    <!-- //v-if会加载或移除不满足条件的写法 -->
    <div id="app">
       <h1>当前的年龄是--{{ age }} </h1>
       <p v-if="age>18" > 年龄大于18 </p>
       <p v-else-if="age==18" > 年龄等于18</p>
       <p v-else > 年龄小于18 </p>
    </div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        age:80
    }
})
```

### 3 `v-show`

`v-if`  `v-show` 区别：
    `v-if` 满足条件,加载节点,不满足条件,移除节点
    `v-show` 满足条件,显示,不满足条件,`css`样式`display:none`

*使用场景:
    频繁切换:使用 `v-show`,
    不频繁切换使用`v-if`*

*性能:
    `vmv-show`:初始消耗高,切换时消耗低*
    `v-if`:初始消耗低,切换时消耗高 

```html
    <div id="app">
     <h1>当前年龄是</h1>
     <p v-show="age>18">年龄>18</p>
     <p v-show="age==18">年龄=18</p>
     <p v-show="age<18">年龄<18</p>
    </div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
           age:18
    }
})
```

### 4  `v-text`

```html
<div id="app">
    <div>{{ a }}</div>
    <div>{{ b }}</div>

    <div v-text="a"></div>
    <div v-text="b"></div>

    <div v-html="a"></div>
    <div v-html="b"></div>
</div>
```

```js
const vm = new Vue({
    el: "#app",
    data: {
        a: "hhhhh",
        b: "<h1>呵呵</h1>"
    }
})
```

### 5  `v-bind`

```html
<!-- src href class id  title alt border 自定义 属性前v-bind:属性值就是变量 -->
<!--     v-bind可简写为: -->
<div id="app">
     <a v-bind:href="g">{{ f }}</a>
    
     <img v-bind:src="h" alt=""/>
     <p v-bind:class="j">123</p>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        f:"淘宝",
        g:"https://www.taobao.com",
        h:"./",
        j:"b"
    }
})
```



### 6    `v-model`

```html
<!-- 载入Vue -->
<script src="./vue.js"></script>

<!-- 设置或获取表单数据,双向数据绑定的表现 -->
<div id="app">
    <input type="text" v-model="user">
    <h1>输入的值为: {{ user }}</h1>
</div>
<script>
    const vm=new Vue({
        el:"#app",
        data:{
            user:"gao"
        }
    })
```

### **7  `v-model`修饰符案例**

```html
<!-- v-model.lazy失去焦点再判断 -->
<!-- v-model.trim去首尾空格 -->
<!-- v-model.number转数字类型 -->
<!-- 可多个一起使用 -->
<div id="app">
    <!-- 文本框 -->
    <input type="text" v-model.lazy.number="age">
    <h1>输入值为:  {{ age }}</h1>
    <h1>输入值为:  {{  typeof age }}</h1>

    <!-- 单选 -->
    男:<input type="radio" name="sex" value="男" v-model="sex">
    女:<input type="radio" name="sex" value="女" v-model="sex" >
    <h1>  {{ sex }}</h1>

    <!-- 多选框 -->
    <input type="checkbox"  v-model="sex">是否同意
    <hr/>

    <!-- 多个复选框 -->
    <input type="checkbox" v-model="hobby" value="新闻">新闻
    <input type="checkbox"  v-model="hobby" value="科技">科技
    <input type="checkbox"  v-model="hobby" value="体育">体育
    <input type="checkbox"  v-model="hobby" value="财经">财经
    <h1>  {{ hobby }}</h1>

    <!-- 下拉1 --->
    <select name="" id=""  v-model="address">
        <option value="陕西">陕西</option>
        <option value="山西">山西</option>
        <option value="广西">广西</option>
        <option value="江西">江西</option>
    </select>
    <h1>  {{ address }}</h1>

    <!-- 下拉2 -multiple为可多选-->
    <select name="" id="" multiple  v-model="address2">
        <option value="陕西">陕西</option>
        <option value="山西">山西</option>
        <option value="广西">广西</option>
        <option value="江西">江西</option>
    </select>
    <h1>  {{ address2 }}</h1>

    <!-- 文本域 -->
    <textarea  rows="5" cols="30" maxlength="10" v-model="msg">

    </textarea>
    <p>输入的值是{{msg}}</p>
    <p>输入了{{msg.length}}个字</p>
    <p>可输入{{msg}}个字,还可以输入  {{10-msg.length}}个字</p>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        age:18,
        sex:"女",
        one:"",
        hobby:[],
        address:"",
        address2:[],
        msg:""
    }
})
```

### 8 `v-bind `class

```css
.font{
    font-size: 30px;
}
.color{
    color: red;
}
```

```html
<div id="app">
    <p v-bind:class="x" >字体放大</p>
    <p v-bind:class="[x,y]" >字体放大,颜色为红</p>
    <p v-bind:class="[{'font':a>b},{'color':c>d}]" > a>b 字体放大, c>d 颜色为红 </p>
    <p v-bind:class="{'font':a>b,'color':c>d}" > a>b 字体放大, c>d 颜色为红 </p>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        x:"font",
        y:"color",
        a:9,
        b:2,
        c:8,
        d:4
    }
})
```

### 9  `v-on`  绑定事件

```html
<div id="app">
    <button v-on:click="one">点击</button>
    <button v-on:click="two(1,2,3)">点击传参数</button>
</div>
```

```js
const vm = new Vue({
    el: "#app",
    methods: {
        one(){
            alert("哈哈")
        },
        two(...x){
            console.log(x);
        }
    },
})
```

### 10  赋值解构

```html
<div id="app">
<input type="text" v-model.number="a">
+
<input type="text" v-model.number="b">
={{ sum }}

<h1>{{ sum }}</h1>
</div>
```

```js
const vm = new Vue({
    el:"#app",
    data:{
        a:"",
        b:""
    },
    //使用场景:多个值 影响一个值的变化
    //computed计算属性,优点:计算结果会缓存
    computed:{
        /*
            "属性名":function (){
                return 计算结果
            }
        */
        "sum":function(){
            return this.a +this.b
        }
    }
})
```

### 11  filter过滤

```js
let arr=[
    {"id":11,"name":"wan","sex":"男","age":18},
    {"id":21,"name":"wng","sex":"男","age":18},
    {"id":31,"name":"ang","sex":"男","age":18},
    {"id":41,"name":"wa","sex":"男","age":18},
    {"id":51,"name":"ng","sex":"男","age":18},
]
 //-----------方法1---------------------------
//将name中包含g字母取出组成新的数组
/* var arr2=[];
for (var i=0;i<arr.length;i++){
    if( arr[i].name.indexOf('g')>=0){
            arr2.push( arr[i] );
    }
}
console.log(arr2); */
 //--------------方法2------------------
let arr2=arr.filter( function(value,index){
    return value.name.includes("g")
})
console.log(arr2);
//-----------------方法2的简写---------------------

let arr2=arr.filter( value=>value.name.includes("g"))

console.log(arr2);
```

### 12 搜索

```html
<div id="app">
        <input type="text" v-model="search">
        <ul>
            <li v-for="(item,index) in info" :key="index"> {{ item.name }} </li>
            <li v-show="info.length==0">暂无数据</li>
        </ul>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        arr:[
            {"name":"gao"},
            {"name":"li"},
            {"name":"wang"},
            {"name":"zhou"},
            {"name":"san"},
        ] ,
        search:"",
    },       
    computed:{
            info(){
                return this.arr.filter(val=>val.name.includes(this.search))
            }
        }
})
```

### 13  多条件搜索

```html
<div id="app">
        <input type="text" v-model="sname" placeholder="姓名">
        <input type="text" v-model="sage" placeholder="年龄">
        <ul>
            <li v-for="(item,index) in info" :key="index"> {{ item.name }}----{{ item.age }} </li>
            <li v-show="info.length==0">暂无数据</li>
        </ul>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        arr:[
            {"name":"gao","age":15},
            {"name":"li","age":15},
            {"name":"wang","age":15},
            {"name":"zhou","age":15},
            {"name":"san","age":15},
        ] ,
        sname:"",
        sage:"",
    },       
    computed:{
            info(){
                return this.arr.filter(val=>{
                    return  val.name.includes(this.sname) && val.age.toString().includes(this.sage) })
            }
        }
})
```

### `vue` 综合案例  +  本地存储  +  学生信息 增删改

html部分：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>   vue  综合案例  +   增删改查 + 本地存储  </title>
    <!-- <script src="./vue.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>

<body>
    <div id="app">
        <!-- 添加 -->
        <form action=""  v-show="!editFlag">
            <div>
                <label for="">姓名</label>
                <input type="text" v-model="user" />
            </div>
            <div>
                <label for="">年龄</label>
                <input type="number" v-model.number="age" />
            </div>
            <div>
                <label for="">地址</label>
                <select name="" id="" v-model="address" >
                    <option value="陕西">陕西</option>
                    <option value="山西">山西</option>
                    <option value="江西">江西</option>
                    <option value="广西">广西</option>
                </select>
                <div>
                    <label for="">男</label>
                    <input type="radio" value="男" name="sex" v-model="sex"/>
                    <label for="">女</label>
                    <input type="radio" value="女" name="sex"  v-model="sex"/>
                </div>
                <div>
                    <label for="">唱歌</label>
                    <input type="checkbox" value="唱歌" id="" v-model="hobby"/>
                    <label for="">跳舞</label>
                    <input type="checkbox" value="跳舞" id="" v-model="hobby"/>
                    <label for="">玩游戏</label>
                    <input type="checkbox" value="玩游戏" id="" v-model="hobby"/>
                    <label for="">运动</label>
                    <input type="checkbox" value="运动" id="" v-model="hobby"/>
                </div>
                <div>
                    <!-- <label for="" style="visibility:hidden" ></label> -->
                    <input type="button" value="添加" @click="add"/>
                    <!-- v-on简写为@ -->
                </div>

            </div>
        </form>
        <hr />
        <form action="" v-show="editFlag">
            <div>
                <label for="">姓名</label>
                <input type="text" v-model="euser"/>
            </div>
            <div>
                <label for="">年龄</label>
                <input type="number" v-model="eage"/>
            </div>
            <div>
                <label for="">地址</label>
                <select name="" id=""  v-model="eaddress">
                    <option value="陕西">陕西</option>
                    <option value="山西">山西</option>
                    <option value="江西">江西</option>
                    <option value="广西">广西</option>
                </select>
                <div>
                    <label for="">男</label>
                    <input type="radio" value="男" v-model="esex"/>
                    <label for="">女</label>
                    <input type="radio" value="女" v-model="esex"/>
                </div>
                <div>
                    <label for="">唱歌</label>
                    <input type="checkbox" value="唱歌" v-model="ehobby"/>

                    <label for="">跳舞</label>
                    <input type="checkbox" value="跳舞"  v-model="ehobby"/>

                    <label for="">玩游戏</label>
                    <input type="checkbox" value="玩游戏"  v-model="ehobby"/>

                    <label for="">运动</label>
                    <input type="checkbox" value="运动" v-model="ehobby"/>
                </div>
                <div>
                    <input type="text" placeholder="唯一标识" v-model="eid" disabled/>
                    <input type="button" value="确认修改" @click="editOk()">
                </div>

            </div>
        </form>
        <!-- 搜索 -->
        <input type="search" placeholder="请输入姓名搜索" v-model="search" />
        <hr />
        <!-- 展示 -->
        <table border="1">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>地址</th>
                    <th>性别</th>
                    <th>爱好</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in arr" :key="item.id">
                    <td> {{ index+1 }} </td>
                    <td> {{ item.user }} </td>
                    <td> {{ item.age }} </td>
                    <td> {{ item.address }} </td>
                    <td> {{ item.sex }} </td>
                    <td> {{ item.hobby.join("/") }} </td>
                    <td>
                        <button v-on:click="del(item.id)">删除</button>
                        <button @click="edit(item.id)">修改</button>
                    </td>
                </tr>
                <tr v-if="arr.length == 0">
                    <th colspan="7">暂无数据</th>
                </tr>
            </tbody>
        </table>
        <!-- 修改 -->


    </div>


    <script src="./curd.js"></script>
</body>

</html>
```
js代码：
```js
const vm = new Vue({
    el: "#app",
    data: {
        user: "",   //姓名
        age: "",    //年龄
        address: "",//地址
        sex: "",    //性别
        hobby: [],  //爱好    //info为天机的数组存储
        info: localStorage.getItem("curd0308") ? JSON.parse(localStorage.getItem("curd0308")).info : [],
        editFlag: false,
        //修改-->data定义值,然后才有数据双向绑定
        eid:"",
        euser: "",//修改姓名
        eage: "",//修改年龄
        eaddress: "",//修改地址
        esex: "",//修改性别
        ehobby: [],//修改爱好
        //搜索
        search: ""

    },
    methods: {

        //添加
        add() {
            let {user,age,address,sex,hobby} = this;
            if(!user){
                alert("请输入姓名！")
                return;
            }
            if(!age){
                alert("请输入年龄！")
                return;
            }
            if(!address){
                alert("请输入地址！")
                return;
            }
            if(!sex){
                alert("请输入性别！")
                return;
            }
            if(hobby.length == 0){
                alert("请输入爱好！")
                return;
            }
            let id = new Date().getTime();

            this.info.push({  id,  user,  age,  address,  sex,  hobby   });

            localStorage.setItem("curd0308", JSON.stringify({"info": this.info}));
        },

        //删除  通过id找到下标 通过下标删除
        del(id) {
            // console.log('id',id);
            let confirmVal = confirm('确认要删除？')
            if(confirmVal == true){
                let indexId = this.info.findIndex(val => {
                    return val.id == id;
                })
                this.info.splice(indexId, 1);
    
                localStorage.setItem("curd0308", JSON.stringify({"info": this.info }));
            }
        },

        //修改按钮,通过id找到要修改的数据
        edit(eid) {
            console.log(eid);
            this.editFlag = true; //显示修改表单

            //通过id找到下标
            let index = this.info.findIndex(val => {
                return val.id == eid;
            })
            console.log(this.info[index]);
            let {id,user,age,address,sex,hobby} = this.info[index];//修改那条数据
            this.eid = id;
            this.euser = user;
            this.eage = age;
            this.eaddress = address;
            this.asex = sex;
            this.ehobby = hobby;

        },
        //确认修改
        editOk() {
            let {eid,euser,eage,eaddress,esex,ehobby} = this;
            //通过下标找数据
            let index = this.info.findIndex(val => {
                return val.id == eid;
            })

            this.info[index].user = euser;
            this.info[index].age = eage;
            this.info[index].user = eaddress;
            this.info[index].user = esex;
            this.info[index].user = ehobby;
            this.info[index].user = euser;
            this.info[index].user = euser;
            //储存
            localStorage.setItem("curd0308", JSON.stringify({ "info": this.info}));
            //隐藏
            this.editFlag = false;
        },
    },

    //计算属性
    computed: {
        "arr": function () {
            return this.info.filter(val => {
                // return val.user == this.search
                return val.user.includes(this.search)
            })
        }
    }
})
```

### 计算属性

```html
<div id="app">
<input type="text" v-model.number="a">
+
<input type="text" v-model.number="b">
={{ sum }}

<h1>{{ sum }}</h1>
</div>
```

```js
const vm=new Vue({
    el:"#app",
    data:{
        a:"",
        b:""
    },
    //使用场景:多个值 影响一个值的变化
    //computed计算属性,优点:计算结果会缓存
    computed:{
        /*
            "属性名":function (){
                return 计算结果
            }
        */
        "sum":function(){
            return this.a +this.b
        }
    }
})
```

### 过滤 `filter`

```js
let arr=[
    {"id":11,"name":"wan","sex":"男","age":18},
    {"id":21,"name":"wng","sex":"男","age":18},
    {"id":31,"name":"ang","sex":"男","age":18},
    {"id":41,"name":"wa","sex":"男","age":18},
    {"id":51,"name":"ng","sex":"男","age":18},
]

//-----------方法1---------------------------

//将name中包含g字母取出组成新的数组

var arr1 = [];
for (var i=0;i<arr.length;i++){
    if( arr[i].name.indexOf('g')>=0){
            arr1.push( arr[i] );
    }
}
console.log(arr1);

 //--------------方法2------------------

let arr2 = arr.filter( function(value,index){
    return value.name.includes("g")
})
console.log(arr2);

//-----------------方法2的简写----------------------------

let arr3 = arr.filter( value => value.name.includes("g")) 
// let arr3 = arr.filter( value => value.name.includes("g")) //模糊搜索

console.log(arr3);
```

### vue 搜索功能
```html
<div id="app">
        <input type="text" v-model="search">
        <ul>
            <li v-for="(item,index) in info" :key="index"> {{ item.name }} </li>
            <li v-show="info.length==0">暂无数据</li>
        </ul>
</div>
```
```js
const vm=new Vue({
    el:"#app",
    data:{
        arr:[
            {"name":"gao"},
            {"name":"li"},
            {"name":"wang"},
            {"name":"zhou"},
            {"name":"san"},
        ] ,
        search:"",
    },       
    computed:{
            info(){
                return this.arr.filter(val => val.name.includes( this.search ))
            }
        }
})

```

### vue 多条件搜索
```html
<div id="app">
        <input type="text" v-model="sname" placeholder="姓名">
        <input type="text" v-model="sage" placeholder="年龄">
        <ul>
            <li v-for="(item,index) in info" :key="index"> {{ item.name }}----{{ item.age }} </li>
            <li v-show="info.length==0">暂无数据</li>
        </ul>
</div>
```
```js
const vm = new Vue({
    el:"#app",
    data:{
        arr:[
            {"name":"gao","age":15},
            {"name":"li","age":15},
            {"name":"wang","age":15},
            {"name":"zhou","age":15},
            {"name":"san","age":15},
        ] ,
        sname:"",
        sage:"",
    },       
    computed:{
            info(){
                return this.arr.filter(val=>{
                    return  val.name.includes(this.sname) && val.age.toString().includes(this.sage) })
            }
        }
})
```

### v-for 循环渲染 数组 对象 数字 字符串等

```html
<div id="app">
    <!-- for  in 或者 for  of都可以 -->
    <!-- key必须是惟一的 -->
    <!-- 数组 -->
    <ul>
        <li v-for="(item,index) in arr" :key="index" > {{ item }} ---{{index}}</li>
    </ul>
    <!-- 数字10 -->
    <ul>
        <li v-for="(item,index) in num"> <button>{{ item }}</button></li>
    </ul>
    <!-- 对象 -->
    <ul>
        <li  v-for="(value,key,index) in obj"  :key="index"  >   {{ value }} ---{{key}}--{{ index }} </li>
    </ul>
    <!-- 字符串 -->
    <ul>
        <li v-for="(item,index) in str"  :key="index"   >  {{ item }} ---{{ index }} </li>
    </ul>
</div>
```
```js
const vm=new Vue({
    el:"#app",
    data:{
    arr:["aa","bb","cc"],
    num:5,
    obj:{"name":"wang","age":15,"address":"陕西"},
    str:"abcdefg"
    }
})
```

### 事件对象
```html
<div id="app">
    <button @click="one">111不传参数</button>
    <button v-on:click="two(1,$event)">222传参数</button>
</div>
```
```js
 const vm = new Vue({
    el: "#app",
    data: {
        one(event) {
            console.log(event); //事件对象,有一个隐藏参数,也可以写其他名字
            console.log(this);
        },
        two(a, e) {
            console.log(a, e);//事件对象需要用$event导出
            console.log( e.target.innerText);//获取按钮内容
        }
    }
})
```

### 事件修饰符

```html
<div id="app">
    <form @submit.prevent>
        <input type="text">
        <button @click="one">提交</button>
        <button @click.prevent="two">添加</button>
        <button>修改</button>
    </form>
</div>
```

```js
//event.preventDefault()阻止默认事件
//按钮标签里@click.prevent="two"
//form标签里@submit.prevent
const vm = new Vue({
    el: "#app",
    data: {
        one(event) {
            event.preventDefault(); //阻止默认事件,不会刷新

            //console.log(event);
        },
        two(event) {
            console.log(event); //click后加prevent
        }
    }
})
```

### 阻止事件冒泡
```html
<div id="app">
    <div @click="infoFn">
        通知:下课后都出去抽烟...<button @click.stop="del">删除</button>
    </div>
    <button @click.once="num+=1"> 赞{{num}}</button>
</div>
```

```js
 //@click.stop阻止事件冒泡

//event.stopPropagation();//阻止冒泡

// @click.once="num+=1"//一次

var vm = new Vue({
    el: "#app",
    data: {
        num:1,
    },
    methods: {
        infoFn() {
            alert("进入详情,查看详细通知")
        },
        del(event) {
            //event.stopPropagation();//阻止冒泡

            alert("删除") //点击删除,还显示进入详情
        }
    },
})
```

### 按键 修饰符

```html
<div id="app">
    <input type="text" @keyup.enter="fn">
</div>
```

```js
//写键盘码.13  回车

//@keyup.enter按下回车事件--按键修饰符

//@keyup.left按左方向键事件--按键修饰符

//@keyup.right 按右方向键事件--按键修饰符

//@keyup.up 按上方向键事件--按键修饰符

//@keyup.down 按下左方向键事件--按键修饰符

var vm = new Vue({
    el: "#app",
    data: {

    },
    methods: {
        /*  fn(event){
                console.log(event.keyCode);
            } */
        fn() {
            console.log("拔下来回车");
        }
    },
})
```

### 事件监听 `watch` 监听基本数据类型

```html
<div id="app">
    <!-- <input type="text" v-model="search" @input="fn"> -->
    <input type="text" v-model="search">
    <p>搜索框搜索的值是{{ search }}</p>
</div>
    
```
```js
const vm = new Vue({
    el: "#app",
    data: {
        search: " "
    },
    //watch事件监听  一个值变化影响多个值
    watch: {
        "search": function (n, old) {
                console.log("当前值",n);
                console.log("上次值",old);
                //ajax请求
        }
    },
    methods: {
        fn() {
            console.log("搜索的的值发生变化", this.search);
            //ajax请求
        }
    },
})
```

### 事件监听 `watch` 监听对象

```html
<div id="app">
    <input type="text" v-model="obj.search">
    <p>搜索框搜索的值是{{ obj.search }}</p>
</div>   
```
```js
 const vm = new Vue({
    el: "#app",
    data: {
        obj: {
            search: ""
        },
    },
    //watch事件监听  一个值变化影响多个值
    watch: {
        obj: {
            handler: function (n) {
                console.log("当前值", n);
                
            }, //ajax请求
            deep: true,//深度监听
            immediate:true//添加之后第一次也可以监听得到
        }
    },
    methods: {
        fn() {
            console.log("搜索的的值发生变化", this.search);
            //ajax请求
        }
    },
})
```

### 面试题：`methods` `computed`和 `watch` 的区别：
- `computed`： 计算属性，会缓存，多个值影响一个值，依赖的值发生改变，计算属性则就会改变
- `watch`：监听，一个值对应多个值
- `methods`： 调用一次执行一次

### 面试题：`v-if` 与 `v-for` 优先级哪个高？

在同一个节点 `v-for` 比 `v-if` 优先级高,先循环再判断

```html
<div id="app">
    <ul v-if="arr.length > 0">
        <li v-for="(item,index) in arr">{{ item.name }}</li>
    </ul>
</div>
```
```js
//在同一个节点v-for比v-if优先级高,先循环再判断
var  vm = new Vue({
    el:"#app",
    data:{
        arr:[
            {"name":"gao"},
            {"name":"wang"},
        ]
    }
})
```

### 局部组件
只能在当前 vue 实例中使用：
```js
new Vue({
    //...

    //创建局部组件
    components:{
        "组件名"：{
            template:`
            <div></div>`
        }
        
    }
})
```

```html
<div id="app">

    <!-- <h1>大标题</h1> -->
    <my-big-title></my-big-title>

    <!--  <h2>小标题</h2> -->
    <my-small-title></my-small-title>

</div>     
```

```js
Vue.component("myBigTitle", {
    template: `
    <h1>大标题</h1>
    `
})


//局部组件,全局可以写多个,是components
const vm = new Vue({
    el: "#app",

    components: {
        "mySmallTitle": {
            template: `
    <h2>小标题</h2>
    `
        }
    },
    data: {},
    methods: {},
    watch: {},
    computed: {}
})
```

### 全局组件
```css
* {
    padding: 0;
    margin: 0;
}

#app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.content {
    flex: 1;
    overflow: auto;
}
```
```html
<!-- 原则---把多个页面可重复使用,有独立功能的,页面,css,js等文件封装出 -->

    <!-- 大的用全局,小的用局部 -->
    <div id="app">
        <!-- <div>顶部搜索</div> -->
        <my-header> </my-header>
        <!-- <my-header/> -->
        <!-- 下面不出来 -->

        <!-- <div class="content">
            <div>轮播</div>
            <div>图文</div>
        </div> -->
        <my-content></my-content>
        <!-- <div>底部</div> -->
        <my-footer></my-footer>

    </div>
```
```js
//全局组件//my-header驼峰式可以,调用是必须为横线
//全局组件一定要在new vue的上方
//template里面   有且只有一个根节点

Vue.component("my-header", {
    template: `
    <div>顶部搜索</div>
    `
})

Vue.component("myFooter", {
    template: `<div> 底部 </div>`
})

Vue.component("myContent", {
    template: `
    <div class="content">
        <my-swiper></my-swiper>
        <div>图文</div>
    </div>`
})
// 内容里面还有轮播,单独拆出轮播
Vue.component("mySwiper", {
    template: `<div> 轮播-----13213213 </div>`
})
//局部组件
const vm = new Vue({
    el: "#app",
    data: {},
    methods: {},
    watch: {},
    computed: {}
})
```

### 组件中定义数据 `data` 为什么是一个函数返回一个对象？

```html
<!-- v-for="item in 10"调用10次,one标签里写文字不管用,相关用得使用插槽 -->

<div id="app">
    <one v-for="item in 10"> </one>
</div>
```
```js
//全局  --组件  data必须是函数,返回一个对象

//组件是独立的,多个组件用一份数据会造成不独立,data为函数,每次调用

//文本及数组

//里面写结构,调用时写参数

Vue.component("one", {
    data() {
        return {
            "text": "哈哈",
            "arr": ["aa", "bb", "cc"]
        }
    },
    template: `
    <div>
        <h1> {{ text }}</h1>
        <ul>
        <li v-for="(item,index) in arr " :key="index" @click="fn(index)">{{ item }} </li>
        </ul>
    </div>
    `,
    methods: {
        fn(index) {
            alert(index);
        }
    },
})

const vm = new Vue({
    el: "#app",
})
```
`data` 是一个对象,复用的是一个地址
`data` 是一个函数，返回一个对象，则会开辟一个新地址

看下面代码：

```js
//定义一个对象
let data1 = {"name":"abc"}

console.log(data1)// 调用一次
console.log(data1.name = "aaa")// 调用一次
console.log(data1)// 调用一次  前面更改后 所有的都改变了
console.log(data1)// 调用一次  也变了


function data2(){
    return {"name":"abc"}
}

//调用函数
console.log( data2().name = "aaaaaaaa" )
console.log( data2() )    //修改后  后面不会改变
console.log( data2() )
console.log( data2() )
```

### 静态 `props`
```html
<div id="app">
    <!-- 子组件 -->
        
    <!-- 头部    欢迎高先生如果是变量x前加v-bind -->
    <my-title x="欢迎李女士" y="你好"   obj= '{"msg": "15点了"}'></my-title>

    <!--内容     秒杀活动 -->
    <my-title x="秒杀活动" y="即将开始"  obj= '{"msg": "15点了"}'></my-title>

    <!--底部     关于我们 -->
    <my-title x="关于我们" y="请打电话"  obj= '{"msg": "15点了"}'></my-title>
</div>      
```
```js
//调用时组件传参  使用props
//调用:<组件名 自定义属性名="要传递的值"><组件名>
//创建组件:
//Vue.componte("组件名",{props:["自定义属性名"],template:{`    `}})

Vue.component("myTitle", {
    props:["x","y","obj"],
    template: `
    <div>
        <h1> {{ x }}--{{ y }}--{{ JSON.parse(obj).msg }} </h1>
    </div>
    `
})
//根组件
var vm = new Vue({
    el: "#app",

})

```

### 动态 `props`
```html
<div id="app">
    <!-- 顶部导航 -->
    <!--  <div>
        <h1>哈哈哈</h1>
        <ul>
            <li>66</li>
            <li>77</li>
        </ul>
    </div> -->
    <my-nav v-bind:x="topnav"></my-nav>
    <!-- 内容导航 -->
    <my-nav v-bind:x="contentnav"></my-nav>
    <!-- 底部导航 -->
    <my-nav v-bind:x="footernav"></my-nav>
</div>      
```
```js
Vue.component("myNav",{
    //props:["x"],
    //props验证
    props:{
        "x":String
    },
    template:`
    <div>
        <h1>{{ x.title }}</h1>
        <ul>
            <li v-for="(item,index) in  x.nav" :key="index" >{{item.bar}}</li>          
        </ul>
    </div>
    `
})
const vm = new Vue({
    el: "#app",
    data: {
        topnav: {
            title: "哈哈哈",
            nav: [{
                    "bar": 123
                },
                {
                    "bar": 456
                },
            ]
        },
        contentnav: {
            title: "哈哈哈",
            nav: [{
                    "bar": 111
                },
                {
                    "bar": 222
                },
            ]
        },
        footernav: {
            title: "哈哈哈",
            nav: [{
                    "bar": 888
                },
                {
                    "bar": 999
                },
            ]
        },

    }
})

```

### 图文组件

```html
<div id="app">
    <!-- 图文区域 -->
    <!--  <div>     
        <div class="item">       
            <div class="item-left">
                <img src="./img/01.jpg" alt="">
            </div>          
            <div class="item-right">
                <p>名称:</p>
                <p>产地:</p>
            </div>
        </div>
        <div class="item">          
            <div class="item-left">
                <img src="./img/02.jpg" alt="">
            </div>          
            <div class="item-right">
                <p>名称:</p>
                <p>产地:</p>
            </div>
        </div>
        <div class="item">
            
            <div class="item-left">
                <img src="./img/03.jpg" alt="">
            </div>         
            <div class="item-right">
                <p>名称:</p>
                <p>产地:</p>
            </div>
        </div>
    </div> -->
    <tw v-for="(item,index) in arr"  :key ='index' v-bind:info="item" >
    </tw>
</div>
```
```js
Vue.component("tw",{
    props:["info"],
    template:`
    <div class="item">              
        <div class="item-left">
            <img :src="info.img" alt="">
        </div>              
        <div class="item-right">
            <p>名称:{{ info.name }}</p>
            <p>产地:{{ info.address }}</p>
        </div>
    </div>
    `
})
var vm = new Vue({
    el: "#app",
    data: {
            arr:[
                {"img":"./img/01.jpg","name":"小狗","address":"shanxi"},
                {"img":"./img/02.jpg","name":"小狗","address":"shanxi"},
                {"img":"./img/03.jpg","name":"小狗","address":"shanxi"},
            ]
    }
})
```

### 封装九宫格组件

注意： 不足一行，对其方式 

```css
.nav {
    width: 100vw;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.nav-item {
    width: 23vw;
    text-align: center;
}

.nav-item>img {
    width: 100%;
    height: 190px;
}
```
```html
<div id="app">
    <!-- 九宫格 -->
    <!--  <div class="nav">
        <div class="nav-item">  
            <img src="./img/01.jpg" alt="">
            <p>111</p>
        </div>
    </div>

    <div class="nav">
        <div class="nav-item">  
            <img src="./img/01.jpg" alt="">
            <p>111</p>
        </div>
    </div> -->
    <jiu-nav></jiu-nav>
</div>
```

```js
Vue.component("jiuNav", {
    data() {
        return {
            arr: [
                {"src":"./img/01.jpg","name":"dog11"},
                {"src":"./img/02.jpg","name":"dog12"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
                {"src":"./img/03.jpg","name":"dog13"},
            ]
        }
    },
    template: `
    <div class="nav">
        <jiu-nav-item v-for="item in arr" v-bind:xx="item"> </jiu-nav-item>
        <div 
            class="nav-item" 
            v-for="item in (arr.length %4 ==0? 0:4-arr.length %4)"> 
        </div>
    </div>
    `
})

Vue.component("jiuNavItem", {
    props:["xx"],
    template: `
    <div class="nav-item">  
        <img :src="xx.src" alt="">
        <p> {{ xx.name }} </p>
    </div>
    `
})
const vm = new Vue({
    el: "#app",
    data: {

    }
})
```

### 父 -> 子 通信
**应用**：父组件中有数据 `title`,传给子组件去使用
- 在父组件中，子组件开始标签上**自定义属性**去传递给子组件`:自定义属性="title"`
- 在子组件中 使用 `props` 接收自定义属性名，传值
- 为什么不能写为局部组件？写在new vue()里的局部组件是无需属性集合，会报错 ！
```html
<div id="app">
    <fu> </fu>
</div>
```
```js
//双向数据绑定,单向数据流,从上到下

// 父组件
Vue.component("fu", {
    data(){
        return {
            title: "哈哈哈啊"
        }
    },
    template: `
    <div>
        <h1> 父组件 : 值是--{{ title }}</h1>             
        <zi :fuvalue="title"> </zi>
    </div>
    `
})

//子组件
Vue.component("zi", {
    props: ['fuvalue'],     //接收父组件传值
    template: `        
        <div>
            <h2>子组件：值是父亲组件传递的 {{ fuvalue }} </h2>
        </div>         
    `
})

const  vm = new Vue({
    el: "#app",
})
```

### 子 -> 父 通信
**应用**：子组件中的数据给父组件使用
**方法**：
- 在子组件中通过`$emit('自定义事件名',传的数据)`将数据传递给父组件
- 在父组件中子组件开始标签上 自定义一个事件`@自定义事件名="方法名"` 而方法的形参就是传递的值
```html
<div id="app">
    <fu></fu>
</div>
```
```js
//父
Vue.component("fu", {
    data(){
        return {
            x:"  "
        }
    },
    template: `
        <div>
            <h1>父组件的值是:  子组件传递的是{{ x }} </h1>
            <hr/>
            <zi v-on:@chuanshuju="xx"> </zi>
        </div>
        `,
        methods:{
            xx(res){
                //console.log(res);
                this.x = res;
            }
        }
})

//子
Vue.component("zi", {
    data() {
        return {
            num:123456
        }
    },
    template: `
        <div>
            <h2>子组件的值是:  {{ num }} </h2>
            <button @click="chuan" >传递给父组件</button>
        </div>
        `,
        methods:{
            chuan(){
                this.$emit("chuanshuju",this.num)
            }
        }
})

const vm = new Vue({
    el: "#app",
})
```

### 非父子 ( 兄弟 ) 通信
- 子组件先传父组件，父组件再传另一子组件

```html
<div id="app">
    <fu></fu>
</div>
```
```js

//父
Vue.component("fu", {
    data(){ return{ num:""}  },
    template: `
    <div>
    <one v-on:onevalfn="getone"> </one>
        
    <hr/>
        <two :num="num"></two>
    </div>
    `,
    methods:{
        getone(res){
            //console.log(res);
            this.num = res;
    } 
    },
})

//one
Vue.component("one", {
    data(){
        return { num:123456 }
        },
    template: `
    <div>
            <h1>one组件 值是 {{ num }} </h1>
            <button @click="chuan">传递给  two </button>
        </div>
    `,
    method:{
        chuan(){
            this.$emit(" onevalfn",this.num)
        }
    }
})

//two
Vue.component("two", {
    props:['num'],
    template: `
    <div>
            <h2>two接受one  组件的值是:{{ num }}.</h2>
        </div>
    `
})
const vm = new Vue({
    el: "#app",

})
```
- `bus` 传值
    - 通过 `bus.$emit('oneNumFn',this.num)` 传值
    - 通过 `bus.$on("oneNumFn",(res)=>{this.num = res })` 接收值
```html
<div id="app">
    <fu></fu>
</div>
```
```js
const bus = new Vue();

//父
Vue.component("fu", {
    data(){ 
        return { }  
    },
    template: `
    <div>
        <one></one>                   
        <hr/>
        <two></two>
    </div>
    `,
    methods:{} ,
})

//one
Vue.component("one", {
    data(){
        return {               
            num:123456 
        }
    },
    template: `
    <div>
            <h1>one组件 值是 {{ num }} </h1>
            <button @click="chuan">传递给  two </button>
        </div>
    `,
    methods:{
        chuan(){
            bus.$emit('oneNumFn',this.num)
        }
    }
})

//two
Vue.component("two", {
    data(){
        return {
            num:""
        }
    },
    template: `
    <div>
        <h2>two接受one  组件的值是:{{ num }}</h2>
    </div>
    `,
    mounted(){
        bus.$on("oneNumFn",(res)=>{
            console.log(res)
            this.num = res
        })

    }
})

const vm = new Vue({
    el: "#app",

})
```


### TodoList 案例
- 思路：
    - 1 静态页
    - 2 切组件 
        - todolist
        - add
        - list
        - filter
    - 3 todolist [todoArr、all、tab]
    - 4 add 组件
        - 按下回车获取输入值
            - data 中定义 TODO
            - v-model 绑定
            - @keyup.enter
        - 将输入框的值传递给 todolist 组件
            this.$emit(事件名，数据)
    - 5 todolist 接收 add 组件传值 组成数组，传递给list组件
        <add @事件名='回调函数名'></add>
        回调函数名(res){
            this.todoArr.push({
                "id":new Date().getTime(),
                "todo":res,
                "check":false
            })
        }
        <list :todoArr="todoArr"></list>
    - 6 list 组件接收  todoArr ，循环 
        props:['todoArr']
        v-for=""

代码如下：
todolist/todolist.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../vue.js"></script>
    <style>
        .ok{
            text-decoration: line-through;
        }
        .active{
            color:red;
        }
    </style>
</head>
<body>
    <div id="app">
        <todolist> </todolist>
    </div>
    <script src="./add.js"></script>
    <script src="./list.js"></script>
    <script src="./filter.js"></script>
    <script src="./todolist.js"></script>
    <script>
        const vm = new Vue({
            el:"#app",
            
        })
    </script>
</body>
</html>
```
todolist/add.js
```js
Vue.component("add",{
    data(){
      return {
          todoVal :"",  //输入框的值        
          all:""       //全选框
      }
    },
    template:
    `
    <div>
        <input 
        type="checkbox"  
        v-model="all" 
        @change="allFn()" />

        <input 
        type="text" 
        v-model="todoVal"  
        @keyup.enter="addFn()" />
    </div>
    `,
    methods: {
        addFn(){
            // 判断非空后回车添加
            if(!this.todoVal){
                alert("请输入！")
                return;
            }
            //非空的话， 将input输入框的值传给todolist
            this.$emit("addTodoVal",this.todoVal)

            //回车后情况输入框
            this.todoVal = ""
        },
        allFn(){
            console.log(this.all)
            this.$emit('addall',this.all)
            
        }
    },
})
```
todolist/list.js
```js
Vue.component("list", {
    props: ['todoArr'],
    template: 
    `
    <div>
        <div v-for="(item,index) in todoArr" 
        :key="item.id"> 
            <input 
                type="checkbox" 
                v-model="item.check"
                />

            <span :class="{'ok':item.check}"> {{ item.todo }} </span>

            <button @click="del(item.id)" >删除</button>
        </div>
    </div>
    `,
    methods: {
        del(id) {
            // console.log(id);
            this.$emit("listDelId",id)
        },

    }
});
```
todolist/filter.js
```js
Vue.component("filters",{
    props:['nowtab'],
    template:
    `
    <div>
         <button @click="tab('all')" :class="{active:nowtab == 'all' }">全部</button>
         <button @click="tab('ok')" :class="{active:nowtab == 'ok' }"> 已完成 true </button>
         <button @click="tab('no')" :class="{active:nowtab == 'no' }"> 未完成 false </button>
     </div>
    `,
    methods:{
        tab(flag){
            console.log(flag);
            this.$emit('tabval',flag)
        }
    }
})
```
todolist/todolist.js
```js
Vue.component("todolist",{
    data() {
        return {
            todoArr:[],
            tab:""
        }
    },
    template:
    `
    <div>
        <!-- 录入 -->
        <add @addTodoVal="getTodoVal"
            @addall="allTodoArr"> </add>

        <!-- 展示 -->
        <list  
            :todoArr="info"  
            @listDelId="delTodoArr"
            > 
        </list>
        
        <!-- 筛选 -->
        <filters @tabval="tabTodoArr" :nowtab="tab"> </filters>
    </div>
    `,
    methods: {
        //接受add组件传递的input框输入值
        getTodoVal(res){
           console.log(res);

           this.todoArr.push({
               "id":new Date().getTime(),
               "todo":res,
               "check":false
           })
        },

        //接收 add 组件的全选框的值 改变 todoArr 中的 check 值
        allTodoArr(res){
            this.todoArr.map(val=>{
                console.log(val);
                val.check = res;
            })
        },

        //接受list组件传递的id删除todolist中  一条数据
        delTodoArr(res){
            console.log(res);
            //通过id找下标
            let index = this.todoArr.findIndex(val => val.id == res);
            this.todoArr.splice(index,1)
        },
        //接收 filter 组件 传递的筛选值
        tabTodoArr(res){
            console.log(res);
            this.tab = res
        },
    },
    computed:{
        info(){
            if(this.tab == 'all'){
                return this.todoArr;
            }else if(this.tab == 'ok'){
                return this.todoArr.filter( val=> val.check == true);
            }else{
                return this.todoArr.filter( val=> val.check == false);
            }
        }
    }
})
```

### `ref` 的作用
- 绑在标签上 获取标签
- 绑在组件上 获取组件
- 父组件 获取 子组件的数据 和方法 ==> 使用 ref
```html
<div id="app">
    <!-- ref绑定在 html 标签上 -->
    <h1 ref="x" >哈哈</h1>

    <!-- ref 绑在组件上  -->
    <one ref="y"></one>
</div>
```
```js
Vue.component('one',{
    template:`
    <div>
        <p>123</p>
    </div>
    `,
    methods:{
        fn(){
            console.log("666")
        }
    }
})
const vm = new Vue({
    el:"#app",
    mounted(){
        // 父组件 获取 子组件的数据 和方法 ==> 使用 ref
        console.log( this.$refs.x )//ref绑定在 html 标签上 ,获取 html dom 标签
        console.log( this.$refs.y )//ref 绑在组件上, 获取 vue 组件实例
         this.$refs.y.fn() //父组件 获取 子组件的数据 和方法 ==> 使用 ref

    }
})
```
### `this.$children` 及 `this.$parent`

`this.$children` 获取所有子组件的实例对象

```html
<div id="app">
    <fu ref="y"></fu>
</div>
```
```js
 Vue.component('fu',{
    template:`
    <div>
        <zi></zi>
    </div>
    `,
    mounted(){               
            console.log('获取子组件', this.$children );
            console.log('获取子组件的数据', this.$children[0].x);
            this.$children[0].fn();  //调用子组件的方法               
    }
})

Vue.component('zi',{
    data(){
        return {
            x:"1111111"
        }
    },
    template:`
    <div>
        <p>123</p>
    </div>
    `,
    methods:{
        fn(){
            console.log('666');
        }
    },
    mounted(){
        console.log( this.$parent )   //获取父组件实例
    }
})

const vm = new Vue({
    el:"#app",
})
```

### `provide` 和 `inject`
```html
<div id="app">
    <ye></ye>
</div>
```

```js
Vue.component('ye',{
    data(){
        return {
            name:"qiao"
        }
    },
    provide(){
        return {
            closeCurrent:this.closeCurrent,
        }
    },
    template:`
    <div>
        yeye--
        <fu></fu>
    </div>
    `,
    methods: {
        closeCurrent () {
            console.log("你好")
        }
    }
})
Vue.component('fu',{
    template:`
    <div>fufu
        <zi></zi>
    </div>
    `
})
Vue.component('zi',{
    inject:['closeCurrent'],
    template:`
    <div>
        zizi
    </div>
    `,
    mounted(){
        this.closeCurrent()
    }
})
const vm = new Vue({
    el:"#app",
})
```
### $attrs 和 $listeners
```html
<div id="app">
    <ye></ye>
</div>
```
```js
Vue.component('ye',{
    data(){
        return {
            a:"qiao",
            b:"18",
            c:"",

        }
    },
    template:`
    <div>
        ye:  {{ c }}
        <fu :a="a" :b="b" @sunchuan="fun"></fu>
    </div>
    `,
    methods:{
        fun(res){
            console.log(res);
            this.c = res
        }
    }
})
Vue.component('fu',{
    template:`
    <div>fu:{{ $attrs }}
        <zi :yeval="$attrs"  v-on="$listeners"></zi>
    </div>
    `
})
Vue.component('zi',{
    props:['yeval'],
    data(){
        return {
            sunData:"111"
        }
    },
    template:`
    <div>
        zi: {{yeval }}---{{sunData }}
        <button @click="fn">点击</button>
    </div>
    `,
    methods:{
        fn(){
            this.$emit('sunchuan',this.sunData)
        }
    }
})
const vm = new Vue({
    el:"#app",
})
```
### 组件通信方式

- 父子： `props`/`$emit` 、 `$ref`、  `$children`/`$parent`
- 兄弟、非父子： `event bus`(`$emit`/`$on`)
- 跨层：`provide`/`inject`、`$atters`/`$listeners`
- 复杂： 本地存储、 `vuex`:

### 单页面应用 `SPA`
- 根据路径的不同显示不同组件，页面不刷新
- 模块化开发: `vue/cli` (底层： `webpack` 搭建开发的服务器、打包 --node)
- `yarn`包管理器: 
    - 安装`yarn`: `npm install -g yarn`
    - 查看版本号： `yarn -V` 或者 `yarn --version`
    - `vscode` 如果安装失败 则需要修改注册表
        `get-ExecutionPolicy`
        `set-ExecutionPolicy RemoteSigned`
    - 下载模块：`yarn add 包名`   
    - 卸载模块：`yarn remove 包名`
    - 全局下载`vue/cli`脚手架: `npm install -g @vue/cli`或者`yarn global @vue/cli`


### 单文件组件

```vue
<template>
    <div>
        <!-- ... -->
    </div>
</template>
<script>
    export default {
        data(){
            return {

            }
        },
        methods:{

        }
    }
</script>
<style lang="scss" scoped>
</style>
```

###  案例 ：计算属性 computed 实现购物车

  小需求：复选框，全部选中 则表头显示为全部选中。

```vue
<template>
    <div>
        <div class="top">
            是否全选：
            <span v-if="isCheck" style="color:red">是</span>
            <span v-else>否</span>
        </div>
        <div 
            class="bottom"
            v-for="(item,index) in datalist" 
            :key="index" >
            <label >
                <input type="checkbox"
                    v-model="item.isCheck" />
                {{ item.name}}
            </label>
        </div>
    </div>
</template>
<script >
export default {
    data(){
        return{
            datalist:[
                {isCheck:false,name:"苹果"},
                {isCheck:false,name:"橘子"},
                {isCheck:false,name:"香蕉"},
            ]
        }
    },
    //侦听datalist中的每一项，如果全部勾选了就说明是全选状态
    computed:{
        //判断是否全选
        isCheck(){
            for(var item of this.datalist){
                //只有一个item项目的isCheck为false，就说明没有被全选
                if(!item.isCheck ){
                    return false
                }
            }
            
            //跳出循环后 如果没有返回false。就说明是全选状态
                return true
        }
    },
    methods: {       
    },
};
</script>
<style scoped>
</style>
```

 稍微加点难度的需求： 复选框，全部选中 则表头显示为全部选中。并计算价格，实现购物车的功能

```vue
<template>
    <div>
        <table>
            <tr>
                <th>
                    <input type="checkbox" v-model="isChecked" style="color:red">全选</input>
                <th>商品名称</th>
                <th>价格</th>
                <th>数量</th>
                <th>金额</th>
            </tr>
            <tr v-for="(item,index) in datalist" :key="index">
                <td>
                    <input v-model="item.isCheck" type="checkbox">
                </td>
                <td>{{item.name}}</td>
                <td>{{item.price}}</td>
                <td>
                    <input 
                        type="number"
                        :min="0" 
                        v-model.number="item.num"
                        style="width:50px"
                        @input="amtCom(item.num,index)"/>
                </td>
                <!-- <td>￥{{(item.num*item.price).toFixed(2)}}</td> -->
                <td>{{item.amt}}</td>
            </tr>
        </table>
        <div>总金额：{{comCount}}</div>
    </div>
</template>

<script >


export default {
    data(){
        return{
            datalist:[
                {isCheck:false,name:"苹果",price:1.11111,num:0,amt:0},
                {isCheck:false,name:"橘子",price:1.1,num:0,amt:0},
                {isCheck:false,name:"香蕉",price:1,num:0,amt:0},
            ],
            count:"",

        }
    },
    //侦听datalist中的每一项，如果全部勾选了就说明是全选状态
    computed:{
        //注意这里  它可以是一个函数
        comCount(){
            let price=0
            for(var item of this.datalist){

                if(item.isCheck){
                    price += item.amt
                }
            // console.log(parseInt(price));
            }
            return price.toFixed(2)
        },

        //判断是否全选  注意这里  它必须是一个对象，包含2个函数（set额get）
        isChecked:{

            //设置状态
            set(val){
                console.log(val);
                if(val){
                    this.datalist.map( item=>item.isCheck=true)
                }else{
                    this.datalist.map( item=>item.isCheck=false)
                }
            },

            //获取状态
            get(){
                for(var item of this.datalist){
                    //只有一个item项目的isCheck为false，就说明没有被全选
                    if(!item.isCheck ){
                        return false
                    }
                }               
                //跳出循环后 如果没有返回false。就说明是全选状态
                    return true
            }
        }
    },
    created() {       
    },
    methods: {
        amtCom(num,index){
            this.datalist[index].amt=Math.floor( (this.datalist[index].price*num)*100 )/100
        }        
    },
};

</script>
<style scoped>
</style>
```



### 模块化开发

@vue/cli	-- 脚手架 （配置默认开发环境 -- webpack）

#### 1、安装@vue/cli

```shell
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

```shell
vue --version
#OR
vue -V
```

#### 2、通过 @vue/cli 创建项目

##### 1）命令

```powershell
vue create 	项目名
```

##### 2）使用图形化界面

```shell
vue ui
```

##### 3）创建一个项目

```
vue create 文件名

选择  Manually select features

配置时:按空格选中或者取消 上下 方向键选择  回车执行下一步
? Check the features needed for your project:
 (*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
>(*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing 
 
 选择 版本2.x 还是 3.x ?:
 ? Choose a version of Vue.js that you want to start the project with (Use arro
w keys)
> 2.x
  3.x 

选择less/sass/stylus:
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supporte
d by default):
  Sass/SCSS (with dart-sass)
  Sass/SCSS (with node-sass)       选sass一般选择这个
> Less
  Stylus 
  
  
 选择ESLint: 
  ? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
> ESLint + Prettier                 

? Pick additional lint features: (Press <space> to select, <a> to toggle all,
<i> to invert selection)
>(*) Lint on save
 ( ) Lint and fix on commit 
 
 
 ? Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)

> In dedicated config files
  In package.json 
  
```

##### 4). 进入项目   

```shell
cd 文件名
```

##### 5)、设置

##### 6)、运行项目

```shell
npm run serve
```



##### 拉取 2.x 模板 (旧版本)

```bash
全局下载
npm install -g @vue/cli-init

创建项目
vue init webpack 项目名
```

> `Vue cli`  3/4 构建项目的目录结构
> node_modules ----  项目依赖（vue 、babel、vue-router、vuex 、webpack相关，）
> public		 ----  公共文件  / 静态资源/ 根目录
    > public/index.html	     主模版
    > public/favicon.ico	 网站图标
> src			         开发目录 / 开发源代码
    > src/assets			 静态资源（第三方库）
    > ​src/utils              工具类
    > ​src/api                请求的文件
    > ​src/style              样式文件
    > ​src/components	        `vue` 组件
    > ​src/router				路由
    > ​src/store				`vuex` 
    > ​src/views				页面组件--视图组件	 
    > ​src/APP.vue			    根组件
    > ​src/main.js			    项目入口文件（ `new Vue（）` ）	
> .browserslistrc		    浏览器支持情况
> .gitignore				`git` 不维护的文件    当前是一个仓库
> babel.config.js		   `babel` 配置   
> package.json			   项目依赖配置文件
> README.md			       项目说明
> vue.config.js              `vue` 配置



### `vue` 使用脚手架开发安装`vscode`插件

安装 `vscode` 插件： `vetur`: 解除错误提示
安装 `vscode` 插件： `Vue VSCode Snippets`：快速生成`vue`文件模板

### `totolist` 案例



### tab 选项卡功能案例


### vue-router 
创建项目时，选择 vue-router 常见成功后，看项目文件目录：
main.js

```js
/* 引入router文件夹下的index.js */
import router from './router'

new Vue({
  router,   //新增加的
  render: h => h(App)
}).$mount('#app')
```
router/index.js
```js
/*  1-- 导入 vue  */
import Vue from 'vue'


/*  2--导入vue-router */
import VueRouter from 'vue-router'

/* 导入 HomeView 组件 */
import HomeView from '../views/HomeView.vue'

/*  3--使用 VueRouter*/
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

/*  4-- 创建 router 实例 */
const router = new VueRouter({
  routes
})

/* 5--导出 router */
export default router


```

### 配置 `router.js`

需求： 
url后/home    App.ue中加载 home 组件
url后/info    App.vue中加载 info 组件

router/index.js
```js
/*  1-- 导入 vue  */
import Vue from 'vue'


/*  2--导入vue-router */
import VueRouter from 'vue-router'

/* 导入 HomeView 组件 */
import Home from '../views/Home.vue'

/*  3--使用 VueRouter*/
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home  /* 先在上面载入 */
  },
  {
    path: '/info',
    name: 'info',

    /* 路由懒加载的方式载入 */
    component: () => import('../views/Info.vue')
  }
]

/*  4-- 创建 router 实例 */
const router = new VueRouter({
  routes
})

/* 5--导出 router */
export default router

```

App.vue

```vue
<template>
  <div id="app">

    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/info">Info</router-link>
    </nav>

    <router-view/>
  </div>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

/* 选中时为绿色 */
nav a.router-link-exact-active {
  color: #42b983;
}
</style>
```

### 配置子路由 及 设置路由重定向
router/index.js
```js
/*  1-- 导入 vue  */
import Vue from 'vue'


/*  2--导入vue-router */
import VueRouter from 'vue-router'

/* 导入 HomeView 组件 */
import HomeView from '../views/Home.vue'

/*  3--使用 VueRouter*/
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children:[
      {
      path: "home1",
      name: "home1",
      component: () => import( '../views/Home1.vue')
      },
      {
      path: "home2",
      name: "home2",
      component: () => import( '../views/Home2.vue')
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import( '../views/AboutView.vue')
  },
  {
    path: '/',
    redirect:"/home/home1"   /* 路由重定向 */
  }
]

/*  4-- 创建 router 实例 */
const router = new VueRouter({
  routes
})

/* 5--导出 router */
export default router

```
App.vue
```vue
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

/* 选中时为绿色 */
nav a.router-link-exact-active {
  color: #42b983;
}
</style>

```
Home.vue
```vue
<template>
  <div class="home">

    <nav>
      <router-link to="/home/home1">Home1</router-link> |
      <router-link to="/home/home2">home2</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  components: {
    
  }
}
</script>

```

### 面试题： `vue` 给对象新增属性，页面没有响应

__原 理__：由于 `vue` 会在初始化实例时对属性执行 `getter` `setter` 转化，所以 属性必须在`data`对象上存在，才能让`vue` 将它转换为响应式的。

__`Vue` 双向绑定的原理__：`vue` 采用 数据劫持 结合发布者--订阅者 模式的方式，通过  `Object.defineProperty()` 劫持 data 属性的`setter`、`getter` 在数据变动发布消息给订阅者，触发相应的监听回调。

__解决__：`vue `提供了 `$set` 方法用来触发视图更新：`this.$set("this.obj","y",888)`
```js
data(){
    return {
        obj:{
            x:777
        }
    }
},
mounted(){
    this.obj.y = 888
},
```
```js
for(let key in obj){
    Object.defineProperty(obj,key,{
        set(){
            //input 改变了 obj.x 的值 ==> obj:{x== input 的值 }
        },
        get(){
            // 当页面上 {{ obj.x }} 自动的===》通知订阅者 将 {{obj.x }} ===> 1
        }
    })
}
```
### vue 扩展学习了解

`vue` 创建项目时 
○ Choose Vue version                  选择版本 一般要选
○ Babel                               `ES6`转`ES5`  一般要选
○ TypeScript                          `js`超集 增加数据类型检测 一般不选
○ Progressive Web App (PWA) Support   创建目录  一般不选
○ Router                              路由 根据实际需要选择
○ Vuex                                `vuex` 数据管理 根据实际需要选择
○ Css pre-processors                  `css` 预处理器 根据实际需要选择
○ Linter-Formatter                    格式检测 一般不选
○ Unit Testing                        单元测试 一般不选
○ E2E Testing                         测试 一般不选

适当了解 `TypeScript`
学习 `uni-app` 小程序多端

### 移动端案例
- 涉及知识点：
    - 子路由配置
    - 路由别名设置
    - 路由传参 `params`和`query` 的区别
    - `$router` 和 `$route` 的区别
    - 调接口 `axios` 的简单封装及 `axios` 的安装及使用
    - 点击我的 再点首页 缓存起来,不会再次请求接口，解决办法 `keep-alive` 标签包裹 `router-view` 标签 :`<keep-alive>   <router-view>  </router-view>  </keep-alive>`
    - 路由懒加载的作用：按需加载组件 及  分包
    - 组件的加载、卸载涉及 两个钩子函数： 加载（激活）：`activated(){}`  离开（失活）：`deactivated(){}`
    - 监听路由变化 ，获取路由传参的参数





`mockjs` 模拟数据或者 模拟 `get` 请求可以写一个 `json` 文件

- 使用原生 `ajax`  及 `json` 模拟 `get` 请求

```js
const xhr = new XMLHttpRequest();
xhr.open("get",'/list.json',true);
xhr.send();
let _this = this    //或者下面的函数写成箭头函数
xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
        // console.log( xhr.responseText )
        let obj = JSON.parse(  xhr.responseText )
        console.log( obj )

        //赋值
        _this.arr =  obj.info
    }
}
```
- 使用 `promise` 封装 `ajax` 
```js
function get(url){
    const xhr = new XMLHttpRequest();
    xhr.open("get",url,true);
    xhr.send();
    return new Promise(function(ok,no){
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4  ){
               if(xhr.status == 200){
                   ok(JSON.parse(  xhr.responseText )) 
               }else{
                    no({"err":"no"})
               }              
            }
        }
    })

}
export default get;
```
- `promise` 封装的 `ajax`  `.then()`去获取相应数据
```js
//调接口
get('/list.json')
.then(res=>{
    // console.log('res',res)
    this.arr = res.info
})
.catch(res=>{
    console.log(res)
})
```
- 使用 `async` 和 `await` 调接口 
```js
async getList2(){
    let res = await get('/list.json')  //请求出错了，后面的都不执行了，怎么规避呢 使用try catch
    this.arr = res.info
}
```
- 使用 `async` 和 `await` 调接口 请求出错了，后面的都不执行了，怎么规避呢？
```js
 async getList2(){
    try{
        let res = await get('/list.json')  //请求出错了，后面的都不执行了，怎么规避呢 使用try catch
        this.arr = res.info
    }catch{
        alert('请求错误！')
    }
}

```
- 使用第三方库 `axios`
> 官方网站： http://www.axios-js.com/zh-cn/docs/
> 安装 `npm i axios -S`

局部载入
```js
// 第一步 组件内局部 载入 axios
import axios from 'axios'

//使用 axios
axios.get('./list.josn').then(res=>{
    console.log(res)
    this.arr = res.data.info
})
```

`main.js`  全局载入
```js
import axios from 'axios'
Vue.prototype.$http = axios;

```

全局载入后，在组件中使用：

```js
this.$http.get('/list.json').then(res=>{
    console.log( res )
})

```
编程式导航
- <font color="red">`$router` 编程式导航的方法：（跳转、前进、后退）</font>
- <font color="red">`$route`  路由信息对象 （地址、参数）</font>

```js
// 方法1----添加历史记录可前进后退
this.$router.push('/info')  

// 方法2----添加历史记录可前进后退
this.$router.push({"name":'info'}) 

// 方法3----添加历史记录可前进后退
this.$router.push({"path":'/info'})  

//方法4----替换页面  无前进和后退
this.$router.replace('/info') 
```
跳转到详情页后，每个商品应该详情页是不一样的。
__跳转详情页 怎么传参？路由传参__
- 路由传参：
    - __`params`传参: http://127.0.0.1:8080/info/1/2/3__
        - <font color="red">这种传参地址上不表现，可以传参数，不能刷新，不能分享</font>
        - 路由配置：`path:"/info/:myid/:xx"`       
        - __路由跳转方式1__： ```this.$router.push(`/info/${id}/xx`)```    
        - __路由跳转方式2__： `this.$router.push({"name":"info",params:{myid:id} })`
    - __`quwey`传参: http://127.0.0.1:8080/info?d=1&num=10&search=7__
        - <font color="red">这种传参地址上表现，可以传参数，可以刷新 ,可以分享  </font>
        - __路由跳转方式1__： ```this.$router.push(`/info?id=${id}&xx=xxxx`)```   
        - __路由跳转方式2__： `this.$router.push({"name":"info",query:{"id":id} }) `  
        - __路由跳转方式3__： `this.$router.push({"path":"/info",query:{"id":id} }) ` 
- 路由懒加载：
    - 路由变化时加载相关组件
    - 打包时 分包
- 打包：查看 `package.json` 文件中的命令： `npmn run build`

- 监听路由变化 ，获取路由传参的参数
```js
// 第一种方法： watch 监听路由信息改变 获取路由参数
watch:{
    $route:{
        handler:function(newvalue){
            console.log( newvalue.query )
        },
        deep:true,
        immediate:true
    }
}
```

```js
// 方法 2：  挂载完成钩子函数
updated(){
    console.log( this.$route.query )
}
```
```js
//方法3： 路由守卫、路由生命周期函数、路由钩子函数


```
l路由守卫钩子函数：

- 全局 -- 写在路由配置文件 `index.js` 中  （ 全部路由变化 ）

    - 改变前/ 进入前：  拦截操作  `router.beforeEach(to，from，next){  }`
    - 改变后/ 进入后：  获取路由信息    `router.afterEach(to，from，next){  }`
    - 进入完成/ 解析守卫：  获取路由信息   `router.beforeResolve(to，from，next){  }` 

- 组件内 -- 写在组件中  （ 当前组件涉及的路由变化 ）

    - 进入前 ： `beforeRouteEnter(to，from，next){  }`
    - 改变： `beforeRouteUpdate(to，from，next){  }`
    - 离开：`beforeRouteLeave(to，from，next){  }`

- 独享 -- 写在路由配置文件  `index.js` 中，  （ 当前路由变化 ）
- 路由元信息
```js
meta:{
    title:"首页"
}
```
然后 可以在跳转后设置页面的标题： `router.afterEach` 中设置 `document.title = to.meta.title`

### 组件生命周期/ 钩子函数
- 创建阶段
    - 创建前  `beforeCreate`
    - 创建后   `created`
- 挂载阶段
    -  挂载前  `beforeMount`
    -  挂载后  `mounted`   --获取 真实 dom 节点
- 更新阶段（data/props发生改变）
    -  更新前  `beforeUpdate`
    -  更新后  `updated`
- 卸载、销毁阶段
    -  销毁前   `beforeDestroy`
    -  销毁后  `destroyed`
- keep-alive :
    - `activated`
    - `deactivated`


### 项目打包 
`npm run build`
打包后，打开index.htmL 一堆404的报错
css js 文件引入` /` 改为  `./` 
让他默认 `vue.config.js` 配置 相关即可修改
```js
publicPath:'./',   //打包默认路径

```

###  vuex
文档： https://vuex.vuejs.org/zh/index.html
#### vuex  是什么?
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式 + 库。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

需求：
one 组件 --X name：高  （登录后保存的用户名）
two: 组件 需要 name （主页  欢迎 xx）
three： 组件也需要 并且修改了  name："wang"  (个人中心---)
Four: 组件 也需要 （购物车）

### `autoprefixer` : 
autoprefixer 插件 就可以帮我们自动补齐前缀，解放双手，关怀前端人的心智负担。它和 less、scss 这样的预处理器不同，它属于后置处理器，所谓 预处理器 是指在打包之前进行处理，所谓 后置处理器 是在代码打包生成后再进行处理。
autoprefixer 其实是 postcss 的一个插件，postCss 本身是一个用 JavaScript 工具和插件转换 CSS 代码的工具，他提供了许多强大的处理 CSS 的功能，
