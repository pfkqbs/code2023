[TOC]

# 变化侦测篇

## 1. 综述前言

众所周知，`Vue`  最大的特点之一就是数据驱动视图，那么什么是数据驱动视图呢？在这里，我们可以把数据理解为状态，而视图就是用户可直观看到页面。页面不可能是一成不变的，它应该是动态变化的，而它的变化也不应该是无迹可寻的，它或者是由用户操作引起的，亦或者是由后端数据变化引起的，不管它是因为什么引起的，我们统称为它的状态变了，它由前一个状态变到了后一个状态，页面也就应该随之而变化，所以我们就可以得到如下一个公式：

**UI = render(state)**

上述公式中：状态`state`是输入，页面`UI`输出，状态输入一旦变化了，页面输出也随之而变化。我们把这种特性称之为数据驱动视图。

OK，有了基本概念以后，我们再把上述公式拆成三部分：`state`、`render()`以及`UI`。我们知道`state`和`UI`都是用户定的，而不变的是这个`render()`。所以`Vue`就扮演了`render()`这个角色，当`Vue`发现`state`变化之后，经过一系列加工，最终将变化反应在`UI`上。

那么第一个问题来了，`Vue`怎么知道`state`变化了呢？

## 2. 什么是变化侦测

那  `Vue  `是怎么知道  `state`  变化了呢？换句话说，数据变化了是怎么通知给 `Vue` 呢？那么，这就引出了  `Vue`  中的变化侦测。

变化侦测就是追踪状态，亦或者说是数据的变化，一旦发生了变化，就要去更新视图。

变化侦测可不是个新名词，它在目前的前端三大框架中均有涉及。在  `Angular`  中是通过脏值检查流程来实现变化侦测；在  `React`  是通过对比虚拟  `DOM`  来实现变化侦测，而在  `Vue`  中也有自己的一套变化侦测实现机制。

那么，接下来我们就通过阅读源码来学习一下`Vue`是怎么实现自己的对数据变化进行侦测的机制。

## 3. 总结

首先，我们知道了什么是数据驱动视图。数据驱动视图简单来说就是数据变化引起视图变化，那么第一步就是先要知道数据什么时候发生变化，也就是说对数据的变化要进行侦测。

其次，数据的变化侦测在三大框架中均有涉及，不同的框架有着自己的一套侦测机制。

最后，我们从源码出发，学习在  `Vue`  中是如何对数据进行变化侦测的。

## 1. Object的变化侦测-前言

在上一篇文章中，我们知道：数据驱动视图的关键点则在于我们如何知道数据发生了变化，只要知道数据在什么时候变了，那么问题就变得迎刃而解，我们只需在数据变化的时候去通知视图更新即可。

要想知道数据什么时候被读取了或数据什么时候被改写了，其实不难，  `JS`  为我们提供了  `Object.defineProperty`  方法，通过该方法我们就可以轻松的知道数据在什么时候发生变化。

## 2. 使Object数据变得“可观测”

数据的每次读和写能够被我们看的见，即我们能够知道数据什么时候被读取了或数据什么时候被改写了，我们将其称为数据变的‘可观测’。

要将数据变的‘可观测’，我们就要借助前言中提到的  `Object.defineProperty`  方法了，在本文中，我们就使用这个方法使数据变得“可观测”。

首先，我们定义一个数据对象`car`：

```javascript
let car = {
  'brand':'BMW',
  'price':3000
}
```

我们定义了这个  `car`  的品牌  `brand   ` 是  `BMW`  ,价格  `price ` 是3000。现在我们可以通过    `car.brand `   和    `car.price`    直接读写这个  `car`  对应的属性值。但是，当这个  `car`  的属性被读取或修改时，我们并不知情。那么应该如何做才能够让  `car ` 主动告诉我们，它的属性被修改了呢？

接下来，我们使用  `Object.defineProperty() ` 改写上面的例子：

```javascript
let car = {}
let val = 3000
Object.defineProperty(car, 'price', {
  enumerable: true,
  configurable: true,
  get(){
    console.log('price属性被读取了')
    return val
  },
  set(newVal){
    console.log('price属性被修改了')
    val = newVal
  }
})
```


通过  `Object.defineProperty() ` 方法给`car`定义了一个  `price`  属性，并把这个属性的读和写分别使用`get()`和`set()`进行拦截，每当该属性进行读或写操作的时候就会触发  `get()`  和  `set()`  。如下图：

![img](https://vue-js.com/learn-vue/assets/img/1.86404441.png)

可以看到，`car`已经可以主动告诉我们它的属性的读写情况了，这也意味着，这个`car`的数据对象已经是“可观测”的了。

为了把`car`的所有属性都变得可观测，我们可以编写如下代码：

```javascript
// 源码位置：src/core/observer/index.js

/**
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
export class Observer {
  constructor (value) {
    this.value = value
    // 给value新增一个__ob__属性，值为该value的Observer实例
    // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
    def(value,'__ob__',this)
    if (Array.isArray(value)) {
      // 当value为数组时的逻辑
      // ...
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值
 */
function defineReactive (obj,key,val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key]
  }
  if(typeof val === 'object'){
      new Observer(val)
  }
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      console.log(`${key}属性被读取了`);
      return val;
    },
    set(newVal){
      if(val === newVal){
          return
      }
      console.log(`${key}属性被修改了`);
      val = newVal;
    }
  })
}
```


在上面的代码中，我们定义了`observer`类，它用来将一个正常的`object`转换成可观测的`object`。

并且给`value`新增一个 `__ob__ ` 属性，值为该`value`的`Observer`实例。这个操作相当于为`value`打上标记，表示它已经被转化成响应式了，避免重复操作

然后判断数据的类型，只有  `object  `类型的数据才会调用  `walk ` 将每一个属性转换成  `getter/setter`  的形式来侦测变化。 最后，在`defineReactive`中当传入的属性值还是一个  `object`  时使用  `new observer（val）`  来递归子属性，这样我们就可以把`obj`中的所有属性（包括子属性）都转换成`getter/seter`  的形式来侦测变化。 也就是说，只要我们将一个`object`传到`observer`中，那么这个`object`就会变成可观测的、响应式的`object`。

`observer`类位于源码的`src/core/observer/index.js`中。

那么现在，我们就可以这样定义`car`:

```javascript
let car = new Observer({
  'brand':'BMW',
  'price':3000
})
```



这样，`car`的两个属性都变得可观测了。

## 3. 依赖收集

### 3.1 什么是依赖收集

在上一章中，我们迈出了第一步：让`object`数据变的可观测。变的可观测以后，我们就能知道数据什么时候发生了变化，那么当数据发生变化时，我们去通知视图更新就好了。那么问题又来了，视图那么大，我们到底该通知谁去变化？总不能一个数据变化了，把整个视图全部更新一遍吧，这样显然是不合理的。此时，你肯定会想到，视图里谁用到了这个数据就更新谁呗。对！你想的没错，就是这样。

视图里谁用到了这个数据就更新谁，我们换个优雅说法：我们把"谁用到了这个数据"称为"谁依赖了这个数据",我们给每个数据都建一个依赖数组(因为一个数据可能被多处使用)，谁依赖了这个数据(即谁用到了这个数据)我们就把谁放入这个依赖数组中，那么当这个数据发生变化的时候，我们就去它对应的依赖数组中，把每个依赖都通知一遍，告诉他们："你们依赖的数据变啦，你们该更新啦！"。这个过程就是依赖收集。

### 3.2 何时收集依赖？何时通知依赖更新？

明白了什么是依赖收集后，那么我们到底该在何时收集依赖？又该在何时通知依赖更新？

其实这个问题在上一小节中已经回答了，我们说过：谁用到了这个数据，那么当这个数据变化时就通知谁。所谓谁用到了这个数据，其实就是谁获取了这个数据，而可观测的数据被获取时会触发  `getter ` 属性，那么我们就可以在  `getter`  中收集这个依赖。同样，当这个数据变化时会触发  `setter`  属性，那么我们就可以在  `setter ` 中通知依赖更新。

总结一句话就是：**在getter中收集依赖，在setter中通知依赖更新**。

### 3.3 把依赖收集到哪里

明白了什么是依赖收集以及何时收集何时通知后，那么我们该把依赖收集到哪里？

在3.1小节中也说了，我们给每个数据都建一个依赖数组，谁依赖了这个数据我们就把谁放入这个依赖数组中。单单用一个数组来存放依赖的话，功能好像有点欠缺并且代码过于耦合。我们应该将依赖数组的功能扩展一下，更好的做法是我们应该为每一个数据都建立一个依赖管理器，把这个数据所有的依赖都管理起来。OK，到这里，我们的依赖管理器`Dep`类应运而生，代码如下：

```javascript
// 源码位置：src/core/observer/dep.js
export default class Dep {
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }
  // 删除一个依赖
  removeSub (sub) {
    remove(this.subs, sub)
  }
  // 添加一个依赖
  depend () {
    if (window.target) {
      this.addSub(window.target)
    }
  }
  // 通知所有依赖更新
  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

/**
 * Remove an item from an array
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```


在上面的依赖管理器`Dep`类中，我们先初始化了一个`subs`数组，用来存放依赖，并且定义了几个实例方法用来对依赖进行添加，删除，通知等操作。

有了依赖管理器后，我们就可以在getter中收集依赖，在setter中通知依赖更新了，代码如下：

```javascript
function defineReactive (obj,key,val) {
  if (arguments.length === 2) {
    val = obj[key]
  }
  if(typeof val === 'object'){
    new Observer(val)
  }
  const dep = new Dep()  //实例化一个依赖管理器，生成一个依赖管理数组dep
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      dep.depend()    // 在getter中收集依赖
      return val;
    },
    set(newVal){
      if(val === newVal){
          return
      }
      val = newVal;
      dep.notify()   // 在setter中通知依赖更新
    }
  })
}
```



在上述代码中，我们在`getter`中调用了`dep.depend()`方法收集依赖，在`setter`中调用`dep.notify()`方法通知所有依赖更新。

## 4. 依赖到底是谁

通过上一章节，我们明白了什么是依赖？何时收集依赖？以及收集的依赖存放到何处？那么我们收集的依赖到底是谁？

虽然我们一直在说”谁用到了这个数据谁就是依赖“，但是这仅仅是在口语层面上，那么反应在代码上该如何来描述这个”谁“呢？

其实在`Vue`中还实现了一个叫做`Watcher`的类，而`Watcher`类的实例就是我们上面所说的那个"谁"。换句话说就是：谁用到了数据，谁就是依赖，我们就为谁创建一个`Watcher`实例。在之后数据变化时，我们不直接去通知依赖更新，而是通知依赖对应的`Watch`实例，由`Watcher`实例去通知真正的视图。

`Watcher`类的具体实现如下：

```javascript
export default class Watcher {
  constructor (vm,expOrFn,cb) {
    this.vm = vm;
    this.cb = cb;
    this.getter = parsePath(expOrFn)
    this.value = this.get()
  }
  get () {
    window.target = this;
    const vm = this.vm
    let value = this.getter.call(vm, vm)
    window.target = undefined;
    return value
  }
  update () {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}

/**
 * Parse simple path.
 * 把一个形如'data.a.b.c'的字符串路径所表示的值，从真实的data对象中取出来
 * 例如：
 * data = {a:{b:{c:2}}}
 * parsePath('a.b.c')(data)  // 2
 */
const bailRE = /[^\w.$]/
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```


谁用到了数据，谁就是依赖，我们就为谁创建一个`Watcher`实例，在创建`Watcher`实例的过程中会自动的把自己添加到这个数据对应的依赖管理器中，以后这个`Watcher`实例就代表这个依赖，当数据变化时，我们就通知`Watcher`实例，由`Watcher`实例再去通知真正的依赖。

那么，在创建`Watcher`实例的过程中它是如何的把自己添加到这个数据对应的依赖管理器中呢？

下面我们分析`Watcher`类的代码实现逻辑：

1. 当实例化`Watcher`类时，会先执行其构造函数；
2. 在构造函数中调用了`this.get()`实例方法；
3. 在`get()`方法中，首先通过`window.target = this`把实例自身赋给了全局的一个唯一对象`window.target`上，然后通过`let value = this.getter.call(vm, vm)`获取一下被依赖的数据，获取被依赖数据的目的是触发该数据上面的`getter`，上文我们说过，在`getter`里会调用`dep.depend()`收集依赖，而在`dep.depend()`中取到挂载`window.target`上的值并将其存入依赖数组中，在`get()`方法最后将`window.target`释放掉。
4. 而当数据变化时，会触发数据的`setter`，在`setter`中调用了`dep.notify()`方法，在`dep.notify()`方法中，遍历所有依赖(即watcher实例)，执行依赖的`update()`方法，也就是`Watcher`类中的`update()`实例方法，在`update()`方法中调用数据变化的更新回调函数，从而更新视图。

简单总结一下就是：`Watcher`先把自己设置到全局唯一的指定位置（`window.target`），然后读取数据。因为读取了数据，所以会触发这个数据的`getter`。接着，在`getter`中就会从全局唯一的那个位置读取当前正在读取数据的`Watcher`，并把这个`watcher`收集到`Dep`中去。收集好之后，当数据发生变化时，会向`Dep`中的每个`Watcher`发送通知。通过这样的方式，`Watcher`可以主动去订阅任意一个数据的变化。为了便于理解，我们画出了其关系流程图，如下图：

![img](https://vue-js.com/learn-vue/assets/img/3.0b99330d.jpg)

以上，就彻底完成了对`Object`数据的侦测，依赖收集，依赖的更新等所有操作。

## 5. 不足之处

虽然我们通过`Object.defineProperty`方法实现了对`object`数据的可观测，但是这个方法仅仅只能观测到`object`数据的取值及设置值，当我们向`object`数据里添加一对新的`key/value`或删除一对已有的`key/value`时，它是无法观测到的，导致当我们对`object`数据添加或删除值时，无法通知依赖，无法驱动视图进行响应式更新。

当然，`Vue`也注意到了这一点，为了解决这一问题，`Vue`增加了两个全局API:`Vue.set`和`Vue.delete`，这两个API的实现原理将会在后面学习全局API的时候说到。

## 6. 总结

首先，我们通过`Object.defineProperty`方法实现了对`object`数据的可观测，并且封装了`Observer`类，让我们能够方便的把`object`数据中的所有属性（包括子属性）都转换成`getter/seter`的形式来侦测变化。

接着，我们学习了什么是依赖收集？并且知道了在`getter`中收集依赖，在`setter`中通知依赖更新，以及封装了依赖管理器`Dep`，用于存储收集到的依赖。

最后，我们为每一个依赖都创建了一个`Watcher`实例，当数据发生变化时，通知`Watcher`实例，由`Watcher`实例去做真实的更新操作。

其整个流程大致如下：

1. `Data`通过`observer`转换成了`getter/setter`的形式来追踪变化。

2. 当外界通过`Watcher`读取数据时，会触发`getter`从而将`Watcher`添加到依赖中。

3. 当数据发生了变化时，会触发`setter`，从而向`Dep`中的依赖（即Watcher）发送通知。

4. `Watcher`接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。

## 1. Array的变化侦测--前言

   上一篇文章中我们介绍了`Object`数据的变化侦测方式，本篇文章我们来看一下对`Array`型数据的变化`Vue`是如何进行侦测的。

   为什么`Object`数据和`Array`型数据会有两种不同的变化侦测方式？

   这是因为对于`Object`数据我们使用的是`JS`提供的对象原型上的方法`Object.defineProperty`，而这个方法是对象原型上的，所以`Array`无法使用这个方法，所以我们需要对`Array`型数据设计一套另外的变化侦测机制。

   万变不离其宗，虽然对`Array`型数据设计了新的变化侦测机制，但是其根本思路还是不变的。那就是：还是在获取数据时收集依赖，数据变化时通知依赖更新。

   下面我们就通过源码来看看`Vue`对`Array`型数据到底是如何进行变化侦测的。

## 2. 在哪里收集依赖

   首先还是老规矩，我们得先把用到`Array`型数据的地方作为依赖收集起来，那么第一问题就是该在哪里收集呢？

   其实`Array`型数据的依赖收集方式和`Object`数据的依赖收集方式相同，都是在`getter`中收集。那么问题就来了，不是说`Array`无法使用`Object.defineProperty`方法吗？无法使用怎么还在`getter`中收集依赖呢？

   其实不然，我们回想一下平常在开发的时候，在组件的`data`中是不是都这么写的：

   ```javascript
   data(){
     return {
       arr:[1,2,3]
     }
   }
   ```



   想想看，`arr`这个数据始终都存在于一个`object`数据对象中，而且我们也说了，谁用到了数据谁就是依赖，那么要用到`arr`这个数据，是不是得先从`object`数据对象中获取一下`arr`数据，而从`object`数据对象中获取`arr`数据自然就会触发`arr`的`getter`，所以我们就可以在`getter`中收集依赖。

   总结一句话就是：**Array型数据还是在getter中收集依赖。**

## 3. 使Array型数据可观测

   上一章节中我们知道了`Array`型数据还是在`getter`中收集依赖，换句话说就是我们已经知道了`Array`型数据何时被读取了。

   回想上一篇文章中介绍`Object`数据变化侦测的时候，我们先让`Object`数据变的可观测，即我们能够知道数据什么时候被读取了、什么时候发生变化了。同理，对于`Array`型数据我们也得让它变的可观测，目前我们已经完成了一半可观测，即我们只知道了`Array`型数据何时被读取了，而何时发生变化我们无法知道，那么接下来我们就来解决这一问题：当`Array`型数据发生变化时我们如何得知？

### 3.1 思路分析

   `Object`的变化时通过`setter`来追踪的，只有某个数据发生了变化，就一定会触发这个数据上的`setter`。但是`Array`型数据没有`setter`，怎么办？

   我们试想一下，要想让`Array`型数据发生变化，那必然是操作了`Array`，而`JS`中提供的操作数组的方法就那么几种，我们可以把这些方法都重写一遍，在不改变原有功能的前提下，我们为其新增一些其他功能，例如下面这个例子：

   ```javascript
   let arr = [1,2,3]
   arr.push(4)
   Array.prototype.newPush = function(val){
     console.log('arr被修改了')
     this.push(val)
   }
   arr.newPush(4)
   ```



   在上面这个例子中，我们针对数组的原生`push`方法定义个一个新的`newPush`方法，这个`newPush`方法内部调用了原生`push`方法，这样就保证了新的`newPush`方法跟原生`push`方法具有相同的功能，而且我们还可以在新的`newPush`方法内部干一些别的事情，比如通知变化。

   是不是很巧妙？`Vue`内部就是这么干的。

### 3.2 数组方法拦截器

   基于上一小节的思想，在`Vue`中创建了一个数组方法拦截器，它拦截在数组实例与`Array.prototype`之间，在拦截器内重写了操作数组的一些方法，当数组实例使用操作数组方法时，其实使用的是拦截器中重写的方法，而不再使用`Array.prototype`上的原生方法。如下图所示：

   ![img](https://vue-js.com/learn-vue/assets/img/2.b446ab83.png)

   经过整理，`Array`原型中可以改变数组自身内容的方法有7个，分别是：`push`,`pop`,`shift`,`unshift`,`splice`,`sort`,`reverse`。那么源码中的拦截器代码如下：

   ```javascript
   // 源码位置：/src/core/observer/array.js
   
   const arrayProto = Array.prototype
   // 创建一个对象作为拦截器
   export const arrayMethods = Object.create(arrayProto)
   
   // 改变数组自身内容的7个方法
   const methodsToPatch = [
     'push',
     'pop',
     'shift',
     'unshift',
     'splice',
     'sort',
     'reverse'
   ]
   
   /**
    * Intercept mutating methods and emit events
    */
   methodsToPatch.forEach(function (method) {
     const original = arrayProto[method]      // 缓存原生方法
     Object.defineProperty(arrayMethods, method, {
       enumerable: false,
       configurable: true,
       writable: true,
       value:function mutator(...args){
         const result = original.apply(this, args)
         return result
       }
     })
   })
   ```



   在上面的代码中，首先创建了继承自`Array`原型的空对象`arrayMethods`，接着在`arrayMethods`上使用`object.defineProperty`方法将那些可以改变数组自身的7个方法遍历逐个进行封装。最后，当我们使用`push`方法的时候，其实用的是`arrayMethods.push`，而`arrayMethods.push`就是封装的新函数`mutator`，也就后说，实标上执行的是函数`mutator`，而`mutator`函数内部执行了`original`函数，这个`original`函数就是`Array.prototype`上对应的原生方法。 那么，接下来我们就可以在`mutato`r函数中做一些其他的事，比如说发送变化通知。

   ### 3.3 使用拦截器

   在上一小节的图中，我们把拦截器做好还不够，还要把它挂载到数组实例与`Array.prototype`之间，这样拦截器才能够生效。

   其实挂载不难，我们只需把数据的`__proto__`属性设置为拦截器`arrayMethods`即可，源码实现如下：

   ```javascript
   // 源码位置：/src/core/observer/index.js
   export class Observer {
     constructor (value) {
       this.value = value
       if (Array.isArray(value)) {
         const augment = hasProto
           ? protoAugment
           : copyAugment
         augment(value, arrayMethods, arrayKeys)
       } else {
         this.walk(value)
       }
     }
   }
   // 能力检测：判断__proto__是否可用，因为有的浏览器不支持该属性
   export const hasProto = '__proto__' in {}
   
   const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
   
   /**
    * Augment an target Object or Array by intercepting
    * the prototype chain using __proto__
    */
   function protoAugment (target, src: Object, keys: any) {
     target.__proto__ = src
   }
   
   /**
    * Augment an target Object or Array by defining
    * hidden properties.
    */
   /* istanbul ignore next */
   function copyAugment (target: Object, src: Object, keys: Array<string>) {
     for (let i = 0, l = keys.length; i < l; i++) {
       const key = keys[i]
       def(target, key, src[key])
     }
   }
   ```



   上面代码中首先判断了浏览器是否支持`__proto__`，如果支持，则调用`protoAugment`函数把`value.__proto__ = arrayMethods`；如果不支持，则调用`copyAugment`函数把拦截器中重写的7个方法循环加入到`value`上。

   拦截器生效以后，当数组数据再发生变化时，我们就可以在拦截器中通知变化了，也就是说现在我们就可以知道数组数据何时发生变化了，OK，以上我们就完成了对`Array`型数据的可观测。

   ## 4. 再谈依赖收集

   ### 4.1 把依赖收集到哪里

   在第二章中我们说了，数组数据的依赖也在`getter`中收集，而给数组数据添加`getter/setter`都是在`Observer`类中完成的，所以我们也应该在`Observer`类中收集依赖，源码如下：

   ```javascript
   // 源码位置：/src/core/observer/index.js
   export class Observer {
     constructor (value) {
       this.value = value
       this.dep = new Dep()    // 实例化一个依赖管理器，用来收集数组依赖
       if (Array.isArray(value)) {
         const augment = hasProto
           ? protoAugment
           : copyAugment
         augment(value, arrayMethods, arrayKeys)
       } else {
         this.walk(value)
       }
     }
   }
   ```



   上面代码中，在`Observer`类中实例化了一个依赖管理器，用来收集数组依赖。

   ### 4.2 如何收集依赖

   在第二章中我们说了，数组的依赖也在`getter`中收集，那么在`getter`中到底该如何收集呢？这里有一个需要注意的点，那就是依赖管理器定义在`Observer`类中，而我们需要在`getter`中收集依赖，也就是说我们必须在`getter`中能够访问到`Observer`类中的依赖管理器，才能把依赖存进去。源码是这么做的：

   ```javascript
   function defineReactive (obj,key,val) {
     let childOb = observe(val)
     Object.defineProperty(obj, key, {
       enumerable: true,
       configurable: true,
       get(){
         if (childOb) {
           childOb.dep.depend()
         }
         return val;
       },
       set(newVal){
         if(val === newVal){
           return
         }
         val = newVal;
         dep.notify()   // 在setter中通知依赖更新
       }
     })
   }
   
   /**
    * Attempt to create an observer instance for a value,
    * returns the new observer if successfully observed,
    * or the existing observer if the value already has one.
    * 尝试为value创建一个0bserver实例，如果创建成功，直接返回新创建的Observer实例。
    * 如果 Value 已经存在一个Observer实例，则直接返回它
    */
   export function observe (value, asRootData){
     if (!isObject(value) || value instanceof VNode) {
       return
     }
     let ob
     if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
       ob = value.__ob__
     } else {
       ob = new Observer(value)
     }
     return ob
   }
   ```



   在上面代码中，我们首先通过`observe`函数为被获取的数据`arr`尝试创建一个`Observer`实例，在`observe`函数内部，先判断当前传入的数据上是否有`__ob__`属性，因为在上篇文章中说了，如果数据有`__ob__`属性，表示它已经被转化成响应式的了，如果没有则表示该数据还不是响应式的，那么就调用`new Observer(value)`将其转化成响应式的，并把数据对应的`Observer`实例返回。

   而在`defineReactive`函数中，首先获取数据对应的`Observer`实例`childOb`，然后在`getter`中调用`Observer`实例上依赖管理器，从而将依赖收集起来。

   ### 4.3 如何通知依赖

   到现在为止，依赖已经收集好了，并且也已经存放好了，那么我们该如何通知依赖呢？

   其实不难，在前文说过，我们应该在拦截器里通知依赖，要想通知依赖，首先要能访问到依赖。要访问到依赖也不难，因为我们只要能访问到被转化成响应式的数据`value`即可，因为`vaule`上的`__ob__`就是其对应的`Observer`类实例，有了`Observer`类实例我们就能访问到它上面的依赖管理器，然后只需调用依赖管理器的`dep.notify()`方法，让它去通知依赖更新即可。源码如下：

   ```javascript
   /**
    * Intercept mutating methods and emit events
    */
   methodsToPatch.forEach(function (method) {
     const original = arrayProto[method]
     def(arrayMethods, method, function mutator (...args) {
       const result = original.apply(this, args)
       const ob = this.__ob__
       // notify change
       ob.dep.notify()
       return result
     })
   })
   ```



   上面代码中，由于我们的拦截器是挂载到数组数据的原型上的，所以拦截器中的`this`就是数据`value`，拿到`value`上的`Observer`类实例，从而你就可以调用`Observer`类实例上面依赖管理器的`dep.notify()`方法，以达到通知依赖的目的。

   OK，以上就基本完成了`Array`数据的变化侦测。

   ## 5. 深度侦测

   在前文所有讲的`Array`型数据的变化侦测都仅仅说的是数组自身变化的侦测，比如给数组新增一个元素或删除数组中一个元素，而在`Vue`中，不论是`Object`型数据还是`Array`型数据所实现的数据变化侦测都是深度侦测，所谓深度侦测就是不但要侦测数据自身的变化，还要侦测数据中所有子数据的变化。举个例子：

   ```javascript
   let arr = [
     {
       name:'NLRX'，
       age:'18'
     }
   ]
   ```



   数组中包含了一个对象，如果该对象的某个属性发生了变化也应该被侦测到，这就是深度侦测。

   这个实现起来比较简单，源码如下：

   ```javascript
   export class Observer {
     value: any;
     dep: Dep;
   
     constructor (value: any) {
       this.value = value
       this.dep = new Dep()
       def(value, '__ob__', this)
       if (Array.isArray(value)) {
         const augment = hasProto
           ? protoAugment
           : copyAugment
         augment(value, arrayMethods, arrayKeys)
         this.observeArray(value)   // 将数组中的所有元素都转化为可被侦测的响应式
       } else {
         this.walk(value)
       }
     }
   
     /**
      * Observe a list of Array items.
      */
     observeArray (items: Array<any>) {
       for (let i = 0, l = items.length; i < l; i++) {
         observe(items[i])
       }
     }
   }
   
   export function observe (value, asRootData){
     if (!isObject(value) || value instanceof VNode) {
       return
     }
     let ob
     if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
       ob = value.__ob__
     } else {
       ob = new Observer(value)
     }
     return ob
   }
   ```



   在上面代码中，对于`Array`型数据，调用了`observeArray()`方法，该方法内部会遍历数组中的每一个元素，然后通过调用`observe`函数将每一个元素都转化成可侦测的响应式数据。

   而对应`object`数据，在上一篇文章中我们已经在`defineReactive`函数中进行了递归操作。

   ## 6. 数组新增元素的侦测

   对于数组中已有的元素我们已经可以将其全部转化成可侦测的响应式数据了，但是如果向数组里新增一个元素的话，我们也需要将新增的这个元素转化成可侦测的响应式数据。

   这个实现起来也很容易，我们只需拿到新增的这个元素，然后调用`observe`函数将其转化即可。我们知道，可以向数组内新增元素的方法有3个，分别是：`push`、`unshift`、`splice`。我们只需对这3中方法分别处理，拿到新增的元素，再将其转化即可。源码如下：

   ```javascript
   /**
    * Intercept mutating methods and emit events
    */
   methodsToPatch.forEach(function (method) {
     // cache original method
     const original = arrayProto[method]
     def(arrayMethods, method, function mutator (...args) {
       const result = original.apply(this, args)
       const ob = this.__ob__
       let inserted
       switch (method) {
         case 'push':
         case 'unshift':
           inserted = args   // 如果是push或unshift方法，那么传入参数就是新增的元素
           break
         case 'splice':
           inserted = args.slice(2) // 如果是splice方法，那么传入参数列表中下标为2的就是新增的元素
           break
       }
       if (inserted) ob.observeArray(inserted) // 调用observe函数将新增的元素转化成响应式
       // notify change
       ob.dep.notify()
       return result
     })
   })
   ```



   在上面拦截器定义代码中，如果是`push`或`unshift`方法，那么传入参数就是新增的元素;如果是`splice`方法，那么传入参数列表中下标为2的就是新增的元素，拿到新增的元素后，就可以调用`observe`函数将新增的元素转化成响应式的了。

   ## 7. 不足之处

   前文中我们说过，对于数组变化侦测是通过拦截器实现的，也就是说只要是通过数组原型上的方法对数组进行操作就都可以侦测到，但是别忘了，我们在日常开发中，还可以通过数组的下标来操作数据，如下：

   ```javascript
   let arr = [1,2,3]
   arr[0] = 5;       // 通过数组下标修改数组中的数据
   arr.length = 0    // 通过修改数组长度清空数组
   ```

 

   而使用上述例子中的操作方式来修改数组是无法侦测到的。 同样，`Vue`也注意到了这个问题， 为了解决这一问题，`Vue`增加了两个全局API:`Vue.set`和`Vue.delete`，这两个API的实现原理将会在后面学习全局API的时候说到。

   ## 8. 总结

   在本篇文章中，首先我们分析了对于`Array`型数据也在`getter`中进行依赖收集；其次我们发现，当数组数据被访问时我们轻而易举可以知道，但是被修改时我们却很难知道，为了解决这一问题，我们创建了数组方法拦截器，从而成功的将数组数据变的可观测。接着我们对数组的依赖收集及数据变化如何通知依赖进行了深入分析；最后我们发现`Vue`不但对数组自身进行了变化侦测，还对数组中的每一个元素以及新增的元素都进行了变化侦测，我们也分析了其实现原理。

   以上就是对`Array`型数据的变化侦测分析。

