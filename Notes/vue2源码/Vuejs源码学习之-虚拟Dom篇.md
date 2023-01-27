# 虚拟Dom篇

## 1--vue中的虚拟Dom

## 1. 前言

虚拟DOM，这个名词作为当下的前端开发人员你一定不会陌生，至少会略有耳闻，但不会闻所未闻吧。这也是现在求职面试考察中非常高频的一个考点了。因为在当下的前端三大框架中关于虚拟DOM或多或少都有所涉及，那么接下来，我们就从源码角度出发，看看`Vue`中的虚拟DOM时怎样的。

## 2. 虚拟DOM简介

由于本系列文章是针对`Vue`源码深入学习的，所以着重分析在`Vue`中对虚拟DOM是如何实现的，而对于虚拟DOM本身这个概念不做大篇幅的展开讨论，仅从以下几个问题简单介绍：

1. 什么是虚拟DOM？

   所谓虚拟DOM，就是用一个`JS`对象来描述一个`DOM`节点，像如下示例：

   ```javascript
   <div class="a" id="b">我是内容</div>
   
   {
     tag:'div',        // 元素标签
     attrs:{           // 属性
       class:'a',
       id:'b'
     },
     text:'我是内容',  // 文本内容
     children:[]       // 子元素
   }
   ```

   

   我们把组成一个`DOM`节点的必要东西通过一个`JS`对象表示出来，那么这个`JS`对象就可以用来描述这个`DOM`节点，我们把这个`JS`对象就称为是这个真实`DOM`节点的虚拟`DOM`节点。

2. 为什么要有虚拟DOM？

   我们知道，`Vue`是数据驱动视图的，数据发生变化视图就要随之更新，在更新视图的时候难免要操作`DOM`,而操作真实`DOM`又是非常耗费性能的，这是因为浏览器的标准就把 `DOM` 设计的非常复杂，所以一个真正的 `DOM` 元素是非常庞大的，如下所示：

   ```javascript
   let div = document.createElement('div')
   let str = ''
   for (const key in div) {
     str += key + ''
   }
   console.log(str)
   ```

   

![img](https://vue-js.com/learn-vue/assets/img/1.a052465d.png)

上图中我们打印一个简单的空`div`标签，就打印出这么多东西，更不用说复杂的、深嵌套的`DOM`节点了。由此可见，直接操作真实`DOM`是非常消耗性能的。

那么有没有什么解决方案呢？当然是有的。我们可以用`JS`的计算性能来换取操作`DOM`所消耗的性能。

既然我们逃不掉操作`DOM`这道坎,但是我们可以尽可能少的操作`DOM`。那如何在更新视图的时候尽可能少的操作`DOM`呢？最直观的思路就是我们不要盲目的去更新视图，而是通过对比数据变化前后的状态，计算出视图中哪些地方需要更新，只更新需要更新的地方，而不需要更新的地方则不需关心，这样我们就可以尽可能少的操作`DOM`了。这也就是上面所说的用`JS`的计算性能来换取操作`DOM`的性能。

我们可以用`JS`模拟出一个`DOM`节点，称之为虚拟`DOM`节点。当数据发生变化时，我们对比变化前后的虚拟`DOM`节点，通过`DOM-Diff`算法计算出需要更新的地方，然后去更新需要更新的视图。

这就是虚拟`DOM`产生的原因以及最大的用途。

## 3. Vue中的虚拟DOM

前文我们介绍了虚拟`DOM`的概念以及为什么要有虚拟`DOM`，那么在`Vue`中虚拟`DOM`是怎么实现的呢？接下来，我们从源码出发，深入学习一下。

### 3.1 VNode类

我们说了，虚拟`DOM`就是用`JS`来描述一个真实的`DOM`节点。而在`Vue`中就存在了一个`VNode`类，通过这个类，我们就可以实例化出不同类型的虚拟`DOM`节点，源码如下：

```javascript
// 源码位置：src/core/vdom/vnode.js

export default class VNode {
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag                                /*当前节点的标签名*/
    this.data = data        /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.children = children  /*当前节点的子节点，是一个数组*/
    this.text = text     /*当前节点的文本*/
    this.elm = elm       /*当前虚拟节点对应的真实dom节点*/
    this.ns = undefined            /*当前节点的名字空间*/
    this.context = context          /*当前组件节点对应的Vue实例*/
    this.fnContext = undefined       /*函数式组件对应的Vue实例*/
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key           /*节点的key属性，被当作节点的标志，用以优化*/
    this.componentOptions = componentOptions   /*组件的option选项*/
    this.componentInstance = undefined       /*当前节点对应的组件的实例*/
    this.parent = undefined           /*当前节点的父节点*/
    this.raw = false         /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.isStatic = false         /*静态节点标志*/
    this.isRootInsert = true      /*是否作为跟节点插入*/
    this.isComment = false             /*是否为注释节点*/
    this.isCloned = false           /*是否为克隆节点*/
    this.isOnce = false                /*是否有v-once指令*/
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  get child (): Component | void {
    return this.componentInstance
  }
}
```

从上面的代码中可以看出：`VNode`类中包含了描述一个真实`DOM`节点所需要的一系列属性，如`tag`表示节点的标签名，`text`表示节点中包含的文本，`children`表示该节点包含的子节点等。通过属性之间不同的搭配，就可以描述出各种类型的真实`DOM`节点。

### 3.2 `VNode`的类型

上一小节最后我们说了，通过属性之间不同的搭配，`VNode`类可以描述出各种类型的真实`DOM`节点。那么它都可以描述出哪些类型的节点呢？通过阅读源码，可以发现通过不同属性的搭配，可以描述出以下几种类型的节点。

- 注释节点
- 文本节点
- 元素节点
- 组件节点
- 函数式组件节点
- 克隆节点

接下来，我们就把这几种类型的节点描述方式从源码中一一对应起来。

#### 3.2.1 注释节点

注释节点描述起来相对就非常简单了，它只需两个属性就够了，源码如下：

```javascript
// 创建注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```



从上面代码中可以看到，描述一个注释节点只需两个属性，分别是：`text`和`isComment`。其中`text`属性表示具体的注释信息，`isComment`是一个标志，用来标识一个节点是否是注释节点。

#### 3.2.2 文本节点

文本节点描述起来比注释节点更简单，因为它只需要一个属性，那就是`text`属性，用来表示具体的文本信息。源码如下：

```javascript
// 创建文本节点
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```



#### 3.2.3 克隆节点

克隆节点就是把一个已经存在的节点复制一份出来，它主要是为了做模板编译优化时使用，这个后面我们会说到。关于克隆节点的描述，源码如下：

```javascript
// 创建克隆节点
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
```



从上面代码中可以看到，克隆节点就是把已有节点的属性全部复制到新节点中，而现有节点和新克隆得到的节点之间唯一的不同就是克隆得到的节点`isCloned`为`true`。

#### 3.2.4 元素节点

相比之下，元素节点更贴近于我们通常看到的真实`DOM`节点，它有描述节点标签名词的`tag`属性，描述节点属性如`class`、`attributes`等的`data`属性，有描述包含的子节点信息的`children`属性等。由于元素节点所包含的情况相比而言比较复杂，源码中没有像前三种节点一样直接写死（当然也不可能写死），那就举个简单例子说明一下：

```javascript
// 真实DOM节点
<div id='a'><span>难凉热血</span></div>

// VNode节点
{
  tag:'div',
  data:{},
  children:[
    {
      tag:'span',
      text:'难凉热血'
    }
  ]
}
```



我们可以看到，真实`DOM`节点中:`div`标签里面包含了一个`span`标签，而`span`标签里面有一段文本。反应到`VNode`节点上就如上所示:`tag`表示标签名，`data`表示标签的属性`id`等，`children`表示子节点数组。

#### 3.2.5 组件节点

组件节点除了有元素节点具有的属性之外，它还有两个特有的属性：

- `componentOptions` :组件的option选项，如组件的`props`等
- `componentInstance` :当前组件节点对应的`Vue`实例

#### 3.2.6 函数式组件节点

函数式组件节点相较于组件节点，它又有两个特有的属性：

- `fnContext`:函数式组件对应的`Vue`实例
- `fnOptions`: 组件的option选项

#### 3.2.7 小结

以上就是`VNode`可以描述的多种节点类型，它们本质上都是`VNode`类的实例，只是在实例化的时候传入的属性参数不同而已。

### 3.3 `VNode`的作用

说了这么多，那么`VNode`在`Vue`的整个虚拟`DOM`过程起了什么作用呢？

其实`VNode`的作用是相当大的。我们在视图渲染之前，把写好的`template`模板先编译成`VNode`并缓存下来，等到数据发生变化页面需要重新渲染的时候，我们把数据发生变化后生成的`VNode`与前一次缓存下来的`VNode`进行对比，找出差异，然后有差异的`VNode`对应的真实`DOM`节点就是需要重新渲染的节点，最后根据有差异的`VNode`创建出真实的`DOM`节点再插入到视图中，最终完成一次视图更新。

## 4. 总结

本章首先介绍了虚拟`DOM`的一些基本概念和为什么要有虚拟`DOM`，其实说白了就是以`JS`的计算性能来换取操作真实`DOM`所消耗的性能。接着从源码角度我们知道了在`Vue`中是通过`VNode`类来实例化出不同类型的虚拟`DOM`节点，并且学习了不同类型节点生成的属性的不同，所谓不同类型的节点其本质还是一样的，都是`VNode`类的实例，只是在实例化时传入的属性参数不同罢了。最后探究了`VNode`的作用，有了数据变化前后的`VNode`，我们才能进行后续的`DOM-Diff`找出差异，最终做到只更新有差异的视图，从而达到尽可能少的操作真实`DOM`的目的，以节省性能。 

## 2 --`Vue`中的`Dom-Diff`

## 1. 前言

在上一篇文章介绍`VNode`的时候我们说了，`VNode`最大的用途就是在数据变化前后生成真实`DOM`对应的虚拟`DOM`节点，然后就可以对比新旧两份`VNode`，找出差异所在，然后更新有差异的`DOM`节点，最终达到以最少操作真实`DOM`更新视图的目的。而对比新旧两份`VNode`并找出差异的过程就是所谓的`DOM-Diff`过程。`DOM-Diff`算法是整个虚拟`DOM`的核心所在，那么接下来，我们就以源码出发，深入研究一下`Vue`中的`DOM-Diff`过程是怎样的。

## 2. patch

在`Vue`中，把 `DOM-Diff`过程叫做`patch`过程。patch,意为“补丁”，即指对旧的`VNode`修补，打补丁从而得到新的`VNode`，非常形象哈。那不管叫什么，其本质都是把对比新旧两份`VNode`的过程。我们在下面研究`patch`过程的时候，一定把握住这样一个思想：所谓旧的`VNode`(即`oldVNode`)就是数据变化之前视图所对应的虚拟`DOM`节点，而新的`VNode`是数据变化之后将要渲染的新的视图所对应的虚拟`DOM`节点，所以我们要以生成的新的`VNode`为基准，对比旧的`oldVNode`，如果新的`VNode`上有的节点而旧的`oldVNode`上没有，那么就在旧的`oldVNode`上加上去；如果新的`VNode`上没有的节点而旧的`oldVNode`上有，那么就在旧的`oldVNode`上去掉；如果某些节点在新的`VNode`和旧的`oldVNode`上都有，那么就以新的`VNode`为准，更新旧的`oldVNode`，从而让新旧`VNode`相同。

可能你感觉有点绕，没关系，我们在说的通俗一点，你可以这样理解：假设你电脑上现在有一份旧的电子版文档，此时老板又给了你一份新的纸质板文档，并告诉你这两份文档内容大部分都是一样的，让你以新的纸质版文档为准，把纸质版文档做一份新的电子版文档发给老板。对于这个任务此时，你应该有两种解决方案：一种方案是不管它旧的文档内容是什么样的，统统删掉，然后对着新的纸质版文档一个字一个字的敲进去，这种方案就是不用费脑，就是受点累也能解决问题。而另外一种方案是以新的纸质版文档为基准，对比看旧的电子版文档跟新的纸质版文档有什么差异，如果某些部分在新的文档里有而旧的文档里没有，那就在旧的文档里面把这些部分加上；如果某些部分在新的文档里没有而旧的文档里有，那就在旧的文档里把这些部分删掉；如果某些部分在新旧文档里都有，那就对比看有没有需要更新的，最后在旧的文档里更新一下，最终达到把旧的文档变成跟手里纸质版文档一样，完美解决。

对比以上两种方案，显然你和`Vue`一样聪明，肯定会选择第二种方案。第二种方案里的旧的电子版文档对应就是已经渲染在视图上的`oldVNode`，新的纸质版文档对应的是将要渲染在视图上的新的`VNode`。总之一句话：**以新的`VNode`为基准，改造旧的`oldVNode`使之成为跟新的`VNode`一样，这就是patch过程要干的事**。

说了这么多，听起来感觉好像很复杂的样子，其实不然，我们仔细想想，整个`patch`无非就是干三件事：

- 创建节点：新的`VNode`中有而旧的`oldVNode`中没有，就在旧的`oldVNode`中创建。
- 删除节点：新的`VNode`中没有而旧的`oldVNode`中有，就从旧的`oldVNode`中删除。
- 更新节点：新的`VNode`和旧的`oldVNode`中都有，就以新的`VNode`为准，更新旧的`oldVNode`。

OK，到这里，你就对`Vue`中的`patch`过程理解了一半了，接下来，我们就逐个分析，看`Vue`对于以上三件事都是怎么做的。

## [#](https://vue-js.com/learn-vue/virtualDOM/patch.html#_3-创建节点)3. 创建节点

在上篇文章中我们分析了，`VNode`类可以描述6种类型的节点，而实际上只有3种类型的节点能够被创建并插入到`DOM`中，它们分别是：元素节点、文本节点、注释节点。所以`Vue`在创建节点的时候会判断在新的`VNode`中有而旧的`oldVNode`中没有的这个节点是属于哪种类型的节点，从而调用不同的方法创建并插入到`DOM`中。

其实判断起来也不难，因为这三种类型的节点其特点非常明显，在源码中是怎么判断的：

```javascript
// 源码位置: /src/core/vdom/patch.js
function createElm (vnode, parentElm, refElm) {
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      	vnode.elm = nodeOps.createElement(tag, vnode)   // 创建元素节点
        createChildren(vnode, children, insertedVnodeQueue) // 创建元素节点的子节点
        insert(parentElm, vnode.elm, refElm)       // 插入到DOM中
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text)  // 创建注释节点
      insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)  // 创建文本节点
      insert(parentElm, vnode.elm, refElm)           // 插入到DOM中
    }
  }
```



从上面代码中，我们可以看出：

- 判断是否为元素节点只需判断该`VNode`节点是否有`tag`标签即可。如果有`tag`属性即认为是元素节点，则调用`createElement`方法创建元素节点，通常元素节点还会有子节点，那就递归遍历创建所有子节点，将所有子节点创建好之后`insert`插入到当前元素节点里面，最后把当前元素节点插入到`DOM`中。
- 判断是否为注释节点，只需判断`VNode`的`isComment`属性是否为`true`即可，若为`true`则为注释节点，则调用`createComment`方法创建注释节点，再插入到`DOM`中。
- 如果既不是元素节点，也不是注释节点，那就认为是文本节点，则调用`createTextNode`方法创建文本节点，再插入到`DOM`中。

> 代码中的`nodeOps`是`Vue`为了跨平台兼容性，对所有节点操作进行了封装，例如`nodeOps.createTextNode()`在浏览器端等同于`document.createTextNode()`

以上就完成了创建节点的操作，其完整流程图如下： ![img](https://vue-js.com/learn-vue/assets/img/2.02d5c7b1.png)

## [#](https://vue-js.com/learn-vue/virtualDOM/patch.html#_4-删除节点)4. 删除节点

如果某些节点再新的`VNode`中没有而在旧的`oldVNode`中有，那么就需要把这些节点从旧的`oldVNode`中删除。删除节点非常简单，只需在要删除节点的父元素上调用`removeChild`方法即可。源码如下：

```javascript
function removeNode (el) {
    const parent = nodeOps.parentNode(el)  // 获取父节点
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)  // 调用父节点的removeChild方法
    }
  }
```

## [#](https://vue-js.com/learn-vue/virtualDOM/patch.html#_5-更新节点)5. 更新节点

创建节点和删除节点都比较简单，而更新节点就相对较为复杂一点了，其实也不算多复杂，只要理清逻辑就能理解了。

更新节点就是当某些节点在新的`VNode`和旧的`oldVNode`中都有时，我们就需要细致比较一下，找出不一样的地方进行更新。

介绍更新节点之前，我们先介绍一个小的概念，就是什么是静态节点？我们看个例子：

```html
<p>我是不会变化的文字</p>
```

1

上面这个节点里面只包含了纯文字，没有任何可变的变量，这也就是说，不管数据再怎么变化，只要这个节点第一次渲染了，那么它以后就永远不会发生变化，这是因为它不包含任何变量，所以数据发生任何变化都与它无关。我们把这种节点称之为静态节点。

OK，有了这个概念以后，我们开始更新节点。更新节点的时候我们需要对以下3种情况进行判断并分别处理：

1. 如果`VNode`和`oldVNode`均为静态节点

   我们说了，静态节点无论数据发生任何变化都与它无关，所以都为静态节点的话则直接跳过，无需处理。

2. 如果`VNode`是文本节点

   如果`VNode`是文本节点即表示这个节点内只包含纯文本，那么只需看`oldVNode`是否也是文本节点，如果是，那就比较两个文本是否不同，如果不同则把`oldVNode`里的文本改成跟`VNode`的文本一样。如果`oldVNode`不是文本节点，那么不论它是什么，直接调用`setTextNode`方法把它改成文本节点，并且文本内容跟`VNode`相同。

3. 如果`VNode`是元素节点

   如果`VNode`是元素节点，则又细分以下两种情况：

   - 该节点包含子节点

     如果新的节点内包含了子节点，那么此时要看旧的节点是否包含子节点，如果旧的节点里也包含了子节点，那就需要递归对比更新子节点；如果旧的节点里不包含子节点，那么这个旧节点有可能是空节点或者是文本节点，如果旧的节点是空节点就把新的节点里的子节点创建一份然后插入到旧的节点里面，如果旧的节点是文本节点，则把文本清空，然后把新的节点里的子节点创建一份然后插入到旧的节点里面。

   - 该节点不包含子节点

     如果该节点不包含子节点，同时它又不是文本节点，那就说明该节点是个空节点，那就好办了，不管旧节点之前里面都有啥，直接清空即可。

OK，处理完以上3种情况，更新节点就算基本完成了，接下来我们看下源码中具体是怎么实现的，源码如下：

```javascript
// 更新节点
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  // vnode与oldVnode是否完全一样？若是，退出程序
  if (oldVnode === vnode) {
    return
  }
  const elm = vnode.elm = oldVnode.elm

  // vnode与oldVnode是否都是静态节点？若是，退出程序
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    return
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  // vnode有text属性？若没有：
  if (isUndef(vnode.text)) {
    // vnode的子节点与oldVnode的子节点是否都存在？
    if (isDef(oldCh) && isDef(ch)) {
      // 若都存在，判断子节点是否相同，不同则更新子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    }
    // 若只有vnode的子节点存在
    else if (isDef(ch)) {
      /**
       * 判断oldVnode是否有文本？
       * 若没有，则把vnode的子节点添加到真实DOM中
       * 若有，则清空Dom中的文本，再把vnode的子节点添加到真实DOM中
       */
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    // 若只有oldnode的子节点存在
    else if (isDef(oldCh)) {
      // 清空DOM中的子节点
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    // 若vnode和oldnode都没有子节点，但是oldnode中有文本
    else if (isDef(oldVnode.text)) {
      // 清空oldnode文本
      nodeOps.setTextContent(elm, '')
    }
    // 上面两个判断一句话概括就是，如果vnode中既没有text，也没有子节点，那么对应的oldnode中有什么就清空什么
  }
  // 若有，vnode的text属性与oldVnode的text属性是否相同？
  else if (oldVnode.text !== vnode.text) {
    // 若不相同：则用vnode的text替换真实DOM的文本
    nodeOps.setTextContent(elm, vnode.text)
  }
}
```



上面代码里注释已经写得很清晰了，接下来我们画流程图来梳理一下整个过程，流程图如下： ![img](https://vue-js.com/learn-vue/assets/img/3.7b0442aa.png)

通过对照着流程图以及代码，相信更新节点这部分逻辑你很容易就能理解了。

另外，你可能注意到了，如果新旧`VNode`里都包含了子节点，那么对于子节点的更新在代码里调用了`updateChildren`方法，而这个方法的逻辑到底是怎样的我们放在下一篇文章中展开学习。

## [#](https://vue-js.com/learn-vue/virtualDOM/patch.html#_6-总结)6. 总结

在本篇文章中我们介绍了`Vue`中的`DOM-Diff`算法：patch过程。我们先介绍了算法的整个思想流程，然后通过梳理算法思想，了解了整个`patch`过程干了三件事，分别是：创建节点，删除节点，更新节点。并且对每件事情都对照源码展开了细致的学习，画出了其逻辑流程图。另外对于更新节点中，如果新旧`VNode`里都包含了子节点，我们就需要细致的去更新子节点，关于更新子节点的过程我们在下一篇文章中展开学习。

## 3==更新子节点

## 1. 前言

在上一篇文章中，我们了解了`Vue`中的`patch`过程，即`DOM-Diff`算法。并且知道了在`patch`过程中基本会干三件事，分别是：创建节点，删除节点和更新节点。创建节点和删除节点都比较简单，而更新节点因为要处理各种可能出现的情况所以逻辑略微复杂一些，但是没关系，我们通过分析过程，对照源码，画逻辑流程图来帮助我们理解了其中的过程。最后我们还遗留了一个问题，那就是在更新节点过程中，新旧`VNode`可能都包含有子节点，对于子节点的对比更新会有额外的一些逻辑，那么在本篇文章中我们就来学习在`Vue`中是怎么对比更新子节点的。

## 2. 更新子节点

当新的`VNode`与旧的`oldVNode`都是元素节点并且都包含子节点时，那么这两个节点的`VNode`实例上的`children`属性就是所包含的子节点数组。我们把新的`VNode`上的子节点数组记为`newChildren`，把旧的`oldVNode`上的子节点数组记为`oldChildren`，我们把`newChildren`里面的元素与`oldChildren`里的元素一一进行对比，对比两个子节点数组肯定是要通过循环，外层循环`newChildren`数组，内层循环`oldChildren`数组，每循环外层`newChildren`数组里的一个子节点，就去内层`oldChildren`数组里找看有没有与之相同的子节点，伪代码如下：

```javascript
for (let i = 0; i < newChildren.length; i++) {
  const newChild = newChildren[i];
  for (let j = 0; j < oldChildren.length; j++) {
    const oldChild = oldChildren[j];
    if (newChild === oldChild) {
      // ...
    }
  }
}
```



那么以上这个过程将会存在以下四种情况：

- 创建子节点

  如果`newChildren`里面的某个子节点在`oldChildren`里找不到与之相同的子节点，那么说明`newChildren`里面的这个子节点是之前没有的，是需要此次新增的节点，那么就创建子节点。

- 删除子节点

  如果把`newChildren`里面的每一个子节点都循环完毕后，发现在`oldChildren`还有未处理的子节点，那就说明这些未处理的子节点是需要被废弃的，那么就将这些节点删除。

- 移动子节点

  如果`newChildren`里面的某个子节点在`oldChildren`里找到了与之相同的子节点，但是所处的位置不同，这说明此次变化需要调整该子节点的位置，那就以`newChildren`里子节点的位置为基准，调整`oldChildren`里该节点的位置，使之与在`newChildren`里的位置相同。

- 更新节点

  如果`newChildren`里面的某个子节点在`oldChildren`里找到了与之相同的子节点，并且所处的位置也相同，那么就更新`oldChildren`里该节点，使之与`newChildren`里的该节点相同。

OK，到这里，逻辑就相对清晰了，接下来我们只需分门别类的处理这四种情况就好了。

## 3. 创建子节点

如果`newChildren`里面的某个子节点在`oldChildren`里找不到与之相同的子节点，那么说明`newChildren`里面的这个子节点是之前没有的，是需要此次新增的节点，那么我们就创建这个节点，创建好之后再把它插入到`DOM`中合适的位置。

创建节点这个很容易，我们在上一篇文章的第三章已经介绍过了，这里就不再赘述了。

那么创建好之后如何插入到`DOM`中的合适的位置呢？显然，把节点插入到`DOM`中是很容易的，找到合适的位置是关键。接下来我们分析一下如何找这个合适的位置。我们看下面这个图： ![img](https://vue-js.com/learn-vue/assets/img/4.cb62f1aa.png)

上图中左边是新的`VNode`，右边是旧的`oldVNode`，同时也是真实的`DOM`。这个图意思是当我们循环`newChildren`数组里面的子节点，前两个子节点都在`oldChildren`里找到了与之对应的子节点，那么我们将其处理，处理过后把它们标志为已处理，当循环到`newChildren`数组里第三个子节点时，发现在`oldChildren`里找不到与之对应的子节点，那么我们就需要创建这个节点，创建好之后我们发现这个节点本是`newChildren`数组里左起第三个子节点，那么我们就把创建好的节点插入到真实`DOM`里的第三个节点位置，也就是所有已处理节点之后，OK，此时我们拍手称快，所有已处理节点之后就是我们要找的合适的位置，但是真的是这样吗？我们再来看下面这个图： ![img](https://vue-js.com/learn-vue/assets/img/5.bcb4dcee.png)

假如我们按照上面的方法把第三个节点插入到所有已处理节点之后，此时如果第四个节点也在`oldChildren`里找不到与之对应的节点，也是需要创建的节点，那么当我们把第四个节点也按照上面的说的插入到已处理节点之后，发现怎么插入到第三个位置了，可明明这个节点在`newChildren`数组里是第四个啊！

这就是问题所在，其实，我们应该把新创建的节点插入到所有未处理节点之前，这样以来逻辑才正确。后面不管有多少个新增的节点，每一个都插入到所有未处理节点之前，位置才不会错。

所以，**合适的位置是所有未处理节点之前，而并非所有已处理节点之后**。

## 4. 删除子节点

如果把`newChildren`里面的每一个子节点都循环一遍，能在`oldChildren`数组里找到的就处理它，找不到的就新增，直到把`newChildren`里面所有子节点都过一遍后，发现在`oldChildren`还存在未处理的子节点，那就说明这些未处理的子节点是需要被废弃的，那么就将这些节点删除。

删除节点这个也很容易，我们在上一篇文章的第四章已经介绍过了，这里就不再赘述了。

## 5. 更新子节点

如果`newChildren`里面的某个子节点在`oldChildren`里找到了与之相同的子节点，并且所处的位置也相同，那么就更新`oldChildren`里该节点，使之与`newChildren`里的该节点相同。

关于更新节点，我们在上一篇文章的第五章已经介绍过了，这里就不再赘述了。

## 6. 移动子节点

如果`newChildren`里面的某个子节点在`oldChildren`里找到了与之相同的子节点，但是所处的位置不同，这说明此次变化需要调整该子节点的位置，那就以`newChildren`里子节点的位置为基准，调整`oldChildren`里该节点的位置，使之与在`newChildren`里的位置相同。

同样，移动一个节点不难，关键在于该移动到哪，或者说关键在于移动到哪个位置，这个位置才是关键。我们看下图： ![img](https://vue-js.com/learn-vue/assets/img/6.b9621b4d.png)

在上图中，绿色的两个节点是相同节点但是所处位置不同，即`newChildren`里面的第三个子节点与真实`DOM`即`oldChildren`里面的第四个子节点相同但是所处位置不同，按照上面所说的，我们应该以`newChildren`里子节点的位置为基准，调整`oldChildren`里该节点的位置，所以我们应该把真实`DOM`即`oldChildren`里面的第四个节点移动到第三个节点的位置，通过上图中的标注我们不难发现，**所有未处理节点之前就是我们要移动的目的位置**。如果此时你说那可不可以移动到所有已处理节点之后呢？那就又回到了更新节点时所遇到的那个问题了：如果前面有新增的节点呢？

## 7. 回到源码

OK，以上就是更新子节点时所要考虑的所有情况了，分析完以后，我们回到源码里看看实际情况是不是我们分析的这样子的，源码如下：

```javascript
// 源码位置： /src/core/vdom/patch.js

if (isUndef(idxInOld)) {    // 如果在oldChildren里找不到当前循环的newChildren里的子节点
    // 新增节点并插入到合适位置
    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
} else {
    // 如果在oldChildren里找到了当前循环的newChildren里的子节点
    vnodeToMove = oldCh[idxInOld]
    // 如果两个节点相同
    if (sameVnode(vnodeToMove, newStartVnode)) {
        // 调用patchVnode更新节点
        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
        oldCh[idxInOld] = undefined
        // canmove表示是否需要移动节点，如果为true表示需要移动，则移动节点，如果为false则不用移动
        canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
    }
}
```



以上代码中，首先判断在`oldChildren`里能否找到当前循环的`newChildren`里的子节点，如果找不到，那就是新增节点并插入到合适位置；如果找到了，先对比两个节点是否相同，若相同则先调用`patchVnode`更新节点，更新完之后再看是否需要移动节点，注意，源码里在判断是否需要移动子节点时用了简写的方式，下面这两种写法是等价的：

```javascript
canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
// 等同于
if(canMove){
    nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
}
```



我们看到，源码里的实现跟我们分析的是一样一样的。

## 8. 总结

本篇文章我们分析了`Vue`在更新子节点时是外层循环`newChildren`数组，内层循环`oldChildren`数组，把`newChildren`数组里的每一个元素分别与`oldChildren`数组里的每一个元素匹配，根据不同情况作出创建子节点、删除子节点、更新子节点以及移动子节点的操作。并且我们对不同情况的不同操作都进行了深入分析，分析之后我们回到源码验证我们分析的正确性，发现我们的分析跟源码的实现是一致的。

最后，我们再思考一个问题：这样双层循环虽然能解决问题，但是如果节点数量很多，这样循环算法的时间复杂度会不会很高？有没有什么可以优化的办法？答案当然是有的，并且`Vue`也意识到了这点，也进行了优化，那么下篇文章我们就来分析当节点数量很多时`Vue`是怎么优化算法的。

## 4==优化更新子节点

## 1. 前言

在上一篇文章中，我们介绍了当新的`VNode`与旧的`oldVNode`都是元素节点并且都包含子节点时，`Vue`对子节点是

先外层循环`newChildren`数组，再内层循环`oldChildren`数组，每循环外层`newChildren`数组里的一个子节点，就去内层`oldChildren`数组里找看有没有与之相同的子节点，最后根据不同的情况作出不同的操作。

在上一篇文章的结尾我们也说了，这种方法虽然能够解决问题，但是还存在可优化的地方。比如当包含的子节点数量很多时，这样循环算法的时间复杂度就会变的很大，不利于性能提升。当然，`Vue`也意识到了这点，并对此也进行了优化，那么本篇文章，就来学习一下关于子节点更新的优化问题`Vue`是如何做的。

## 2. 优化策略介绍

假如我们现有一份新的`newChildren`数组和旧的`oldChildren`数组，如下所示：

```javascript
newChildren = ['新子节点1','新子节点2','新子节点3','新子节点4']
oldChildren = ['旧子节点1','旧子节点2','旧子节点3','旧子节点4']
```

如果按照优化之前的解决方案，那么我们接下来的操作应该是这样的：先循环`newChildren`数组，拿到第一个新子节点1，然后用第一个新子节点1去跟`oldChildren`数组里的旧子节点逐一对比，如果运气好一点，刚好`oldChildren`数组里的第一个旧子节点1与第一个新子节点1相同，那就皆大欢喜，直接处理，不用再往下循环了。那如果运气坏一点，直到循环到`oldChildren`数组里的第四个旧子节点4才与第一个新子节点1相同，那此时就会多循环了4次。我们不妨把情况再设想的极端一点，如果`newChildren`数组和`oldChildren`数组里前三个节点都没有变化，只是第四个节点发生了变化，那么我们就会循环16次，只有在第16次循环的时候才发现新节点4与旧节点4相同，进行更新，如下图所示： ![img](https://vue-js.com/learn-vue/assets/img/7.057d7609.jpg)

上面例子中只有四个子节点，好像还看不出来有什么缺陷，但是当子节点数量很多的时候，算法的时间复杂度就会非常高，很不利于性能提升。

那么我们该怎么优化呢？其实我们可以这样想，我们不要按顺序去循环`newChildren`和`oldChildren`这两个数组，可以先比较这两个数组里特殊位置的子节点，比如：

- 先把`newChildren`数组里的所有未处理子节点的第一个子节点和`oldChildren`数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作；
- 如果不同，再把`newChildren`数组里所有未处理子节点的最后一个子节点和`oldChildren`数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作；
- 如果不同，再把`newChildren`数组里所有未处理子节点的最后一个子节点和`oldChildren`数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将`oldChildren`数组里的该节点移动到与`newChildren`数组里节点相同的位置；
- 如果不同，再把`newChildren`数组里所有未处理子节点的第一个子节点和`oldChildren`数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将`oldChildren`数组里的该节点移动到与`newChildren`数组里节点相同的位置；
- 最后四种情况都试完如果还不同，那就按照之前循环的方式来查找节点。

其过程如下图所示： ![img](https://vue-js.com/learn-vue/assets/img/8.e4c85c40.png)

在上图中，我们把：

- `newChildren`数组里的所有未处理子节点的第一个子节点称为：新前；
- `newChildren`数组里的所有未处理子节点的最后一个子节点称为：新后；
- `oldChildren`数组里的所有未处理子节点的第一个子节点称为：旧前；
- `oldChildren`数组里的所有未处理子节点的最后一个子节点称为：旧后；

OK，有了以上概念以后，下面我们就来看看其具体是如何实施的。

## 3. 新前与旧前

把`newChildren`数组里的所有未处理子节点的第一个子节点和`oldChildren`数组里所有未处理子节点的第一个子节点做比对，如果相同，那好极了，直接进入之前文章中说的更新节点的操作并且由于新前与旧前两个节点的位置也相同，无需进行节点移动操作；如果不同，没关系，再尝试后面三种情况。 ![img](https://vue-js.com/learn-vue/assets/img/9.e017b452.png)

## 4. 新后与旧后

把`newChildren`数组里所有未处理子节点的最后一个子节点和`oldChildren`数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作并且由于新后与旧后两个节点的位置也相同，无需进行节点移动操作；如果不同，继续往后尝试。 ![img](https://vue-js.com/learn-vue/assets/img/10.cf98adc0.png)

## 5. 新后与旧前

把`newChildren`数组里所有未处理子节点的最后一个子节点和`oldChildren`数组里所有未处理子节点的第一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将`oldChildren`数组里的该节点移动到与`newChildren`数组里节点相同的位置； ![img](https://vue-js.com/learn-vue/assets/img/11.2ddb5ee5.png)

此时，出现了移动节点的操作，移动节点最关键的地方在于找准要移动的位置。我们一再强调，**更新节点要以新`VNode`为基准，然后操作旧的`oldVNode`，使之最后旧的`oldVNode`与新的`VNode`相同**。那么现在的情况是：`newChildren`数组里的最后一个子节点与`oldChildren`数组里的第一个子节点相同，那么我们就应该在`oldChildren`数组里把第一个子节点移动到最后一个子节点的位置，如下图：

![img](https://vue-js.com/learn-vue/assets/img/12.bace2f7f.png)

从图中不难看出，我们要把`oldChildren`数组里把第一个子节点移动到数组中**所有未处理节点之后**。

如果对比之后发现这两个节点仍不是同一个节点，那就继续尝试最后一种情况。

## 6. 新前与旧后

把`newChildren`数组里所有未处理子节点的第一个子节点和`oldChildren`数组里所有未处理子节点的最后一个子节点做比对，如果相同，那就直接进入更新节点的操作，更新完后再将`oldChildren`数组里的该节点移动到与`newChildren`数组里节点相同的位置；

![img](https://vue-js.com/learn-vue/assets/img/13.98dbc208.png)

同样，这种情况的节点移动位置逻辑与“新后与旧前”的逻辑类似，那就是`newChildren`数组里的第一个子节点与`oldChildren`数组里的最后一个子节点相同，那么我们就应该在`oldChildren`数组里把最后一个子节点移动到第一个子节点的位置，如下图：

![img](https://vue-js.com/learn-vue/assets/img/14.18c1c6dd.png)

从图中不难看出，我们要把`oldChildren`数组里把最后一个子节点移动到数组中**所有未处理节点之前**。

OK，以上就是子节点对比更新优化策略种的4种情况，如果以上4种情况逐个试遍之后要是还没找到相同的节点，那就再通过之前的循环方式查找。

## 7. 回到源码

思路分析完，逻辑理清之后，我们再回到源码里看看，验证一下源码实现的逻辑是否跟我们分析的一样。源码如下：

```javascript
// 循环更新子节点
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0               // oldChildren开始索引
    let oldEndIdx = oldCh.length - 1   // oldChildren结束索引
    let oldStartVnode = oldCh[0]        // oldChildren中所有未处理节点中的第一个
    let oldEndVnode = oldCh[oldEndIdx]   // oldChildren中所有未处理节点中的最后一个

    let newStartIdx = 0               // newChildren开始索引
    let newEndIdx = newCh.length - 1   // newChildren结束索引
    let newStartVnode = newCh[0]        // newChildren中所有未处理节点中的第一个
    let newEndVnode = newCh[newEndIdx]  // newChildren中所有未处理节点中的最后一个

    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    // 以"新前"、"新后"、"旧前"、"旧后"的方式开始比对节点
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // 如果oldStartVnode不存在，则直接跳过，比对下一个
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 如果新前与旧前节点相同，就把两个节点进行patch更新
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 如果新后与旧后节点相同，就把两个节点进行patch更新
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 如果新后与旧前节点相同，先把两个节点进行patch更新，然后把旧前节点移动到oldChilren中所有未处理节点之后
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // 如果新前与旧后节点相同，先把两个节点进行patch更新，然后把旧后节点移动到oldChilren中所有未处理节点之前
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 如果不属于以上四种情况，就进行常规的循环比对patch
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        // 如果在oldChildren里找不到当前循环的newChildren里的子节点
        if (isUndef(idxInOld)) { // New element
          // 新增节点并插入到合适位置
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 如果在oldChildren里找到了当前循环的newChildren里的子节点
          vnodeToMove = oldCh[idxInOld]
          // 如果两个节点相同
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // 调用patchVnode更新节点
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined
            // canmove表示是否需要移动节点，如果为true表示需要移动，则移动节点，如果为false则不用移动
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx) {
      /**
       * 如果oldChildren比newChildren先循环完毕，
       * 那么newChildren里面剩余的节点都是需要新增的节点，
       * 把[newStartIdx, newEndIdx]之间的所有节点都插入到DOM中
       */
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      /**
       * 如果newChildren比oldChildren先循环完毕，
       * 那么oldChildren里面剩余的节点都是需要删除的节点，
       * 把[oldStartIdx, oldEndIdx]之间的所有节点都删除
       */
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
```



读源码之前，我们先有这样一个概念：那就是在我们前面所说的优化策略中，节点有可能是从前面对比，也有可能是从后面对比，对比成功就会进行更新处理，也就是说我们有可能处理第一个，也有可能处理最后一个，那么我们在循环的时候就不能简单从前往后或从后往前循环，而是要从两边向中间循环。

那么该如何从两边向中间循环呢？请看下图： ![img](https://vue-js.com/learn-vue/assets/img/15.e9bdf5c1.png)

首先，我们先准备4个变量：

- **newStartIdx:**`newChildren`数组里开始位置的下标；
- **newEndIdx:**`newChildren`数组里结束位置的下标；
- **oldStartIdx:**`oldChildren`数组里开始位置的下标；
- **oldEndIdx:**`oldChildren`数组里结束位置的下标；

在循环的时候，每处理一个节点，就将下标向图中箭头所指的方向移动一个位置，开始位置所表示的节点被处理后，就向后移动一个位置；结束位置所表示的节点被处理后，就向前移动一个位置；由于我们的优化策略都是新旧节点两两更新的，所以一次更新将会移动两个节点。说的再直白一点就是：`newStartIdx`和`oldStartIdx`只能往后移动（只会加），`newEndIdx`和`oldEndIdx`只能往前移动（只会减）。

当开始位置大于结束位置时，表示所有节点都已经遍历过了。

OK，有了这个概念后，我们开始读源码：

1. 如果`oldStartVnode`不存在，则直接跳过，将`oldStartIdx`加1，比对下一个

   ```javascript
   // 以"新前"、"新后"、"旧前"、"旧后"的方式开始比对节点
   while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
   	if (isUndef(oldStartVnode)) {
           oldStartVnode = oldCh[++oldStartIdx]
         }
   }
   ```

   

2. 如果`oldEndVnode`不存在，则直接跳过，将`oldEndIdx`减1，比对前一个

   ```javascript
   else if (isUndef(oldEndVnode)) {
       oldEndVnode = oldCh[--oldEndIdx]
   }
   ```

   

3. 如果新前与旧前节点相同，就把两个节点进行`patch`更新，同时`oldStartIdx`和`newStartIdx`都加1，后移一个位置

   ```javascript
   else if (sameVnode(oldStartVnode, newStartVnode)) {
       patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
       oldStartVnode = oldCh[++oldStartIdx]
       newStartVnode = newCh[++newStartIdx]
   }
   ```

   

4. 如果新后与旧后节点相同，就把两个节点进行`patch`更新，同时`oldEndIdx`和`newEndIdx`都减1，前移一个位置

   ```javascript
   else if (sameVnode(oldEndVnode, newEndVnode)) {
       patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
       oldEndVnode = oldCh[--oldEndIdx]
       newEndVnode = newCh[--newEndIdx]
   }
   ```

   

5. 如果新后与旧前节点相同，先把两个节点进行`patch`更新，然后把旧前节点移动到`oldChilren`中所有未处理节点之后，最后把`oldStartIdx`加1，后移一个位置，`newEndIdx`减1，前移一个位置

   ```javascript
   else if (sameVnode(oldStartVnode, newEndVnode)) {
       patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
       canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
       oldStartVnode = oldCh[++oldStartIdx]
       newEndVnode = newCh[--newEndIdx]
   }
   ```

   

6. 如果新前与旧后节点相同，先把两个节点进行`patch`更新，然后把旧后节点移动到`oldChilren`中所有未处理节点之前，最后把`newStartIdx`加1，后移一个位置，`oldEndIdx`减1，前移一个位置

   ```javascript
   else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
       patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
       canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
       oldEndVnode = oldCh[--oldEndIdx]
       newStartVnode = newCh[++newStartIdx]
   }
   ```

   

7. 如果不属于以上四种情况，就进行常规的循环比对`patch`

8. 如果在循环中，`oldStartIdx`大于`oldEndIdx`了，那就表示`oldChildren`比`newChildren`先循环完毕，那么`newChildren`里面剩余的节点都是需要新增的节点，把`[newStartIdx, newEndIdx]`之间的所有节点都插入到`DOM`中

   ```javascript
   if (oldStartIdx > oldEndIdx) {
       refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
       addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
   }
   ```

   

9. 如果在循环中，`newStartIdx`大于`newEndIdx`了，那就表示`newChildren`比`oldChildren`先循环完毕，那么`oldChildren`里面剩余的节点都是需要删除的节点，把`[oldStartIdx, oldEndIdx]`之间的所有节点都删除

   ```javascript
   else if (newStartIdx > newEndIdx) {
       removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
   }
   ```

   

OK,处理完毕，可见源码中的处理逻辑跟我们之前分析的逻辑是一样的。

## 8. 总结

本篇文章中，我们介绍了`Vue`中子节点更新的优化策略，发现`Vue`为了避免双重循环数据量大时间复杂度升高带来的性能问题，而选择了从子节点数组中的4个特殊位置互相比对，分别是：新前与旧前，新后与旧后，新后与旧前，新前与旧后。对于每一种情况我们都通过图文的形式对其逻辑进行了分析。最后我们回到源码，通过阅读源码来验证我们分析的是否正确。幸运的是我们之前每一步的分析都在源码中找到了相应的实现，得以验证我们的分析没有错。以上就是`Vue`中的`patch`过程，即`DOM-Diff`算法所有内容了，到这里相信你再读这部分源码的时候就有比较清晰的思路了。

