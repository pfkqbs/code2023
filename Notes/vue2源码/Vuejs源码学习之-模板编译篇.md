# 模板编译篇

## 1 综述

## 1. 前言

在前几篇文章中，我们介绍了`Vue`中的虚拟`DOM`以及虚拟`DOM`的`patch`(DOM-Diff)过程，而虚拟`DOM`存在的必要条件是得先有`VNode`，那么`VNode`又是从哪儿来的呢？这就是接下来几篇文章要说的模板编译。你可以这么理解：把用户写的模板进行编译，就会产生`VNode`。

## 2. 什么是模板编译

我们知道，在日常开发中，我们把写在``标签中的类似于原生`HTML`的内容称之为模板。这时你可能会问了，为什么说是“类似于原生`HTML`的内容”而不是“就是`HTML`的内容”？因为我们在开发中，在``标签中除了写一些原生`HTML`的标签，我们还会写一些变量插值，如，或者写一些`Vue`指令，如`v-on`、`v-if`等。而这些东西都是在原生`HTML`语法中不存在的，不被接受的。但是事实上我们确实这么写了，也被正确识别了，页面也正常显示了，这又是为什么呢？

这就归功于`Vue`的模板编译了，`Vue`会把用户在``标签中写的类似于原生`HTML`的内容进行编译，把原生`HTML`的内容找出来，再把非原生`HTML`找出来，经过一系列的逻辑处理生成渲染函数，也就是`render`函数，而`render`函数会将模板内容生成对应的`VNode`，而`VNode`再经过前几篇文章介绍的`patch`过程从而得到将要渲染的视图中的`VNode`，最后根据`VNode`创建真实的`DOM`节点并插入到视图中， 最终完成视图的渲染更新。

而把用户在``标签中写的类似于原生`HTML`的内容进行编译，把原生`HTML`的内容找出来，再把非原生`HTML`找出来，经过一系列的逻辑处理生成渲染函数，也就是`render`函数的这一段过程称之为模板编译过程。

## 3. 整体渲染流程

所谓渲染流程，就是把用户写的类似于原生`HTML`的模板经过一系列处理最终反应到视图中称之为整个渲染流程。这个流程在上文中其实已经说到了，下面我们以流程图的形式宏观的了解一下，流程图如下： ![img](https://vue-js.com/learn-vue/assets/img/1.f0570125.png)

从图中我们也可以看到，模板编译过程就是把用户写的模板经过一系列处理最终生成`render`函数的过程。

## 4. 模板编译内部流程

那么模板编译内部是怎么把用户写的模板经过处理最终生成`render`函数的呢？这内部的过程是怎样的呢？

### 4.1 抽象语法树`AST`

我们知道，用户在``标签中写的模板对`Vue`来说就是一堆字符串，那么如何解析这一堆字符串并且从中提取出元素的标签、属性、变量插值等有效信息呢？这就需要借助一个叫做抽象语法树的东西。

所谓抽象语法树，在计算机科学中，**抽象语法树**（**A**bstract**S**yntax**T**ree，AST），或简称**语法树**（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；而类似于if-condition-then这样的条件跳转语句，可以使用带有两个分支的节点来表示。——来自百度百科

我就知道，这段话贴出来也是白贴，因为看了也看不懂，哈哈。那么我们就以最直观的例子来理解什么是抽象语法树。请看下图： ![img](https://vue-js.com/learn-vue/assets/img/2.5596631a.png)

从图中我们可以看到，一个简单的`HTML`标签的代码被转换成了一个`JS`对象，而这个对象中的属性代表了这个标签中一些关键有效信息。如图中标识。 有兴趣的同学可以在这个网站在线转换试试：https://astexplorer.net/

### 4.2 具体流程

将一堆字符串模板解析成抽象语法树`AST`后，我们就可以对其进行各种操作处理了，处理完后用处理后的`AST`来生成`render`函数。其具体流程可大致分为三个阶段：

1. 模板解析阶段：将一堆模板字符串用正则等方式解析成抽象语法树`AST`；
2. 优化阶段：遍历`AST`，找出其中的静态节点，并打上标记；
3. 代码生成阶段：将`AST`转换成渲染函数；

这三个阶段在源码中分别对应三个模块，下面给出三个模块的源代码在源码中的路径：

1. 模板解析阶段——解析器——源码路径：`src/compiler/parser/index.js`;
2. 优化阶段——优化器——源码路径：`src/compiler/optimizer.js`;
3. 代码生成阶段——代码生成器——源码路径：`src/compiler/codegen/index.js`; 其对应的源码如下：

```javascript
// 源码位置: /src/complier/index.js

export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
    optimize(ast, options)
  }
  // 代码生成阶段：将AST转换成渲染函数；
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```



可以看到 `baseCompile` 的代码非常的简短主要核心代码。

- **const ast =parse(template.trim(), options)**:`parse` 会用正则等方式解析 `template` 模板中的指令、`class`、`style`等数据，形成`AST`。
- **optimize(ast, options)**: `optimize` 的主要作用是标记静态节点，这是 `Vue` 在编译过程中的一处优化，挡在进行`patch` 的过程中， `DOM-Diff` 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能。
- **const code =generate(ast, options)**: 将 `AST` 转化成 `render`函数字符串的过程，得到结果是 `render`函数 的字符串以及 `staticRenderFns` 字符串。

最终 `baseCompile` 的返回值

```js
{
 	ast: ast,
 	render: code.render,
 	staticRenderFns: code.staticRenderFns
 }
```



最终返回了抽象语法树( ast )，渲染函数( render )，静态渲染函数( staticRenderFns )，且`render` 的值为`code.render`，`staticRenderFns` 的值为`code.staticRenderFns`，也就是说通过 `generate`处理 `ast`之后得到的返回值 `code` 是一个对象。

下面再给出模板编译内部具体流程图，便于理解。流程图如下： ![img](https://vue-js.com/learn-vue/assets/img/3.15d9566b.png)

## 5. 总结

本篇文章首先引出了为什么会有模板编译，因为有了模板编译，才有了虚拟`DOM`，才有了后续的视图更新。接着介绍了什么是模板编译，以及介绍了把用户所写的模板经过层层处理直到最终渲染的视图中这个整体的渲染流程；最后介绍了模板编译过程中所需要使用的抽象语法树的概念以及分析了模板编译的具体实施流程，其流程大致分为三个阶段，分别是模板解析阶段、优化阶段和代码生成阶段。那么接下来的几篇文章将会把这三个阶段逐一进行分析介绍。

## 二 模板解析阶段（`HTML`解析器）

## 1. 前言

上篇文章中我们说到，在模板解析阶段主线函数`parse`中，根据要解析的内容不同会调用不同的解析器，

而在三个不同的解析器中最主要的当属`HTML`解析器，为什么这么说呢？因为`HTML`解析器主要负责解析出模板字符串中有哪些内容，然后根据不同的内容才能调用其他的解析器以及做相应的处理。那么本篇文章就来介绍一下`HTML`解析器是如何解析出模板字符串中包含的不同的内容的。

## 2. HTML解析器内部运行流程

在源码中，`HTML`解析器就是`parseHTML`函数，在模板解析主线函数`parse`中调用了该函数，并传入两个参数，代码如下：

```javascript
// 代码位置：/src/complier/parser/index.js

/**
 * Convert HTML string to AST.
 * 将HTML模板字符串转化为AST
 */
export function parse(template, options) {
   // ...
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    // 当解析到开始标签时，调用该函数
    start (tag, attrs, unary) {

    },
    // 当解析到结束标签时，调用该函数
    end () {

    },
    // 当解析到文本时，调用该函数
    chars (text) {

    },
    // 当解析到注释时，调用该函数
    comment (text) {

    }
  })
  return root
}
```



从代码中我们可以看到，调用`parseHTML`函数时为其传入的两个参数分别是：

- template:待转换的模板字符串；
- options:转换时所需的选项；

第一个参数是待转换的模板字符串，无需多言；重点看第二个参数，第二个参数提供了一些解析`HTML`模板时的一些参数，同时还定义了4个钩子函数。这4个钩子函数有什么作用呢？我们说了模板编译阶段主线函数`parse`会将`HTML`模板字符串转化成`AST`，而`parseHTML`是用来解析模板字符串的，把模板字符串中不同的内容出来之后，那么谁来把提取出来的内容生成对应的`AST`呢？答案就是这4个钩子函数。

把这4个钩子函数作为参数传给解析器`parseHTML`，当解析器解析出不同的内容时调用不同的钩子函数从而生成不同的`AST`。

- 当解析到开始标签时调用`start`函数生成元素类型的`AST`节点，代码如下；

  ```javascript
  // 当解析到标签的开始位置时，触发start
  start (tag, attrs, unary) {
  	let element = createASTElement(tag, attrs, currentParent)
  }
  
  export function createASTElement (tag,attrs,parent) {
    return {
      type: 1,
      tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      parent,
      children: []
    }
  }
  ```

  

  从上面代码中我们可以看到，`start`函数接收三个参数，分别是标签名`tag`、标签属性`attrs`、标签是否自闭合`unary`。当调用该钩子函数时，内部会调用`createASTElement`函数来创建元素类型的`AST`节点

- 当解析到结束标签时调用`end`函数；

- 当解析到文本时调用`chars`函数生成文本类型的`AST`节点；

  ```javascript
  // 当解析到标签的文本时，触发chars
  chars (text) {
  	if(text是带变量的动态文本){
      let element = {
        type: 2,
        expression: res.expression,
        tokens: res.tokens,
        text
      }
    } else {
      let element = {
        type: 3,
        text
      }
    }
  }
  ```

  

  当解析到标签的文本时，触发`chars`钩子函数，在该钩子函数内部，首先会判断文本是不是一个带变量的动态文本，如“hello ”。如果是动态文本，则创建动态文本类型的`AST`节点；如果不是动态文本，则创建纯静态文本类型的`AST`节点。

- 当解析到注释时调用`comment`函数生成注释类型的`AST`节点；

  ```javascript
  // 当解析到标签的注释时，触发comment
  comment (text: string) {
    let element = {
      type: 3,
      text,
      isComment: true
    }
  }
  ```

  

  当解析到标签的注释时，触发`comment`钩子函数，该钩子函数会创建一个注释类型的`AST`节点。

一边解析不同的内容一边调用对应的钩子函数生成对应的`AST`节点，最终完成将整个模板字符串转化成`AST`,这就是`HTML`解析器所要做的工作。

## 3. 如何解析不同的内容

要从模板字符串中解析出不同的内容，那首先要知道模板字符串中都会包含哪些内容。那么通常我们所写的模板字符串中都会包含哪些内容呢？经过整理，通常模板内会包含如下内容：

- 文本，例如“难凉热血”
- HTML注释，例如<!-- 我是注释 -->
- 条件注释，例如<!-- [if !IE]> -->我是注释<!--< ![endif] -->
- DOCTYPE，例如<!DOCTYPE html>
- 开始标签，例如<div>
- 结束标签，例如</div>

这几种内容都有其各自独有的特点，也就是说我们要根据不同内容所具有的不同的的特点通过编写不同的正则表达式将这些内容从模板字符串中一一解析出来，然后再把不同的内容做不同的处理。

下面，我们就来分别看一下`HTML`解析器是如何从模板字符串中将以上不同种类的内容进行解析出来。

### 3.1 解析HTML注释

解析注释比较简单，我们知道`HTML`注释是以`开头，以`-->`结尾，这两者中间的内容就是注释内容，那么我们只需用正则判断待解析的模板字符串`html`是否以`开头，若是，那就继续向后寻找`-->`，如果找到了，OK，注释就被解析出来了。代码如下：

```javascript
const comment = /^<!\--/
if (comment.test(html)) {
  // 若为注释，则继续查找是否存在'-->'
  const commentEnd = html.indexOf('-->')

  if (commentEnd >= 0) {
    // 若存在 '-->',继续判断options中是否保留注释
    if (options.shouldKeepComment) {
      // 若保留注释，则把注释截取出来传给options.comment，创建注释类型的AST节点
      options.comment(html.substring(4, commentEnd))
    }
    // 若不保留注释，则将游标移动到'-->'之后，继续向后解析
    advance(commentEnd + 3)
    continue
  }
}
```



在上面代码中，如果模板字符串`html`符合注释开始的正则，那么就继续向后查找是否存在`-->`，若存在，则把`html`从第4位（"<!--"长度为4）开始截取，直到`-->`处，截取得到的内容就是注释的真实内容，然后调用4个钩子函数中的`comment`函数，将真实的注释内容传进去，创建注释类型的`AST`节点。

上面代码中有一处值得注意的地方，那就是我们平常在模板中可以在``标签上配置`comments`选项来决定在渲染模板时是否保留注释，对应到上面代码中就是`options.shouldKeepComment`,如果用户配置了`comments`选项为`true`，则`shouldKeepComment`为`true`，则创建注释类型的`AST`节点，如不保留注释，则将游标移动到'-->'之后，继续向后解析。

`advance`函数是用来移动解析游标的，解析完一部分就把游标向后移动一部分，确保不会重复解析，其代码如下：

```javascript
function advance (n) {
  index += n   // index为解析游标
  html = html.substring(n)
}
```



为了更加直观地说明 `advance` 的作用，请看下图： ![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAACpCAYAAABK4GjNAAAgAElEQVR4nO2dB7QdRRnH54UXSkCkCgSQXqRDqCo9QFCkdxDpVUITLDTpvYOCEESq9N5LQELvNRTphCICEjF0Ir8559szb9/evXvv3XfvTt7/d849t+ze2d3Zma/NN7Nd47/DNcg777zjBg8e3OjfevHf//7Xfe9735vgylH95KP6yUf1k4/qJ5/+VD8DWi5VCCGE6ABSYEIIIaJECkwIIUSUSIEJIYSIEikwIYQQUdI1duzYhrMQy8oqmVBR/eSj+slH9ZOP6ief/lQ/3c1caAzplSpH5agclaNyJuxyFEIUQggRJVJgQgghokQKTAghRJRIgQkhhIgSKTAhhBBR0pICe+ONN9zOO+/slllmGXfIIYe4Tz75pKzzqstrr73m1lprLTdkyBC30korudNOO61txxZCCNF5mlZg33zzjbvsssvcI4884r7++mt33XXXuVGjRpV5bkIIIURNWvLAuru7yzoPIYQQoiGaVmATTTSRW3/99d1SSy3lFdm6667rll9++TLPTQghhKhJSy7UbLPN5s4888yyzkUIIYQojLIQhRBCRElLCuzaa6/1WYD2euyxx3K3ffHFF+7iiy/2oUd+4/2kk05yH330UWb53377rXvwwQfdbrvt5pZbbjn/ny233NLdd999flsReLz26aef7tZee23/fzImt9lmG5908tlnnyX7cQ577713cr7sd//99/co6+2333Ybb7xxsg/nNXbs2CZqTgghRKu0LQtj3Lhx7sgjj3Q33HBD8htK48ILL3SjR4/226abbrpkG8qO8OT555/foxz2RdEw5panxNjGsY466ij35ZdfJr+TMfn000/71xVXXOEOO+wwHwqdZppp3GabbeZeeOEFf67sd+WVV7pFFlnETTHFFD7r8vrrr3evvPKKL2fKKaf0Uwh4F0II0X7aFkI85ZRTeiivELyzkSNHJt/Hjx/vrr766l7Ky0C5oHzef//9mse76aab3BFHHNFDeaV57rnn3Kmnnuo+/fRT/32JJZZwm2yySbKdaQFPPvmk//zmm2+6G2+8Mdm20047uYUWWqhm2UIIIfqWtimwDz/80B166KHu4Ycf9qG57bbbrsf2Z599NlE2Y8aM8XPMDLycAw880P+PeWcjRozwXlMtPvjgA3fp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5ZR1PkVpV/3EWo7qJx/VTz6qn3z6U/1UNoQIKKif/OQnvX7nN1NeQggh+ieVVmCQNQ6m5A0hhBCVV2BZS0Vp+SghhBCVV2DTTjutW3DBBZPvfOY3IYQQ/ZvKKzDgcSlZn4UQQvRfolBgm2yySeZnIYQQ/ZfKPQ8sixlnnNEtvvjiyWchhBAiCgUGStwQQggREo0CU+q8EEKIkGgU2KyzztrpUxBCCFEhokjiEEJk89prr7m11lrLZ+fyzveq8Nhjj/nz4nXaaaflbr/22muT3//zn/+4X/3qV/73/fff333++eeZ5YfXnrdfFt9++637+OOP3UMPPeTPjbVVP/jgg8YvUnSUaDywsqHDHHroocn3v/zlL27eeef1n9944w131FFHuSeeeML97Gc/c3vuuaf7/ve/36lT7QUdnA737LPP+u/Dhg1zBx54oJt00kk7fGaiLBCwn376qX//8MMP3b///W/3/vvvu7ffftu98MILbsyYMW7DDTd0yy67bK//fvPNN+68887zjxzacsstaz7dHAWy4447tnyu9J2qTW9hiVfqj7pgbcCPPvrIvfTSS75vU3+vv/66+/rrr5P9u7u73csvv+ymn376Dp51fbLkltU913j88cf7RdCXXnpp9/vf/97NPPPMnTrVttBvFVgtaPCXXXaZe+SRR/z36667zi255JLu5z//eYfPTBih4N10003d3nvv7W644YakY2+99dZu9913b/k4WPSHHXaYu+WWW9w000zjTj/9dDfDDDMkxsNMM83krfc55pij5WOF0ObOPvvsuvu98sorbokllujx25dffumF2jnnnOO/P/zww+4Pf/iD++EPf1jqOTZLLaXJvQsFs0Hd84KFFlqo5tMpQtIGXhFQZnhjyyyzjJtoookK/69Z7r//frfXXnv54y6wwALuxBNPbNkAvfXWW/0LHnjgAd+OdtlllzJOt7IohJgB1piIAzp9WuD0hbCeZJJJenkyrAgz9dRTl36soivNvPjii76thvvzfZFFFvHKFTDECMfdfPPN3psTPcFDwQhCMW633XZtUV4YGXhJ5gGSYT3ddNO1XG5/lFv974rrQANef/31vXAghEiMffnll+/0aYkA7hGdNQwBzTLLLKUfZ8CAAb2EAgqTYzVi3TcKStGOw7Uy1oPQA5Toj3/8Y/+YIbyF9Plxzjyt4ayzznJ/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)

调用 `advance` 函数：

```js
advance(3)
```

1

得到结果：

![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAACjCAYAAACkJkh7AAAgAElEQVR4nO2dB7QcVRnH7wtPgYD0ltCLdASMNAkISJfeEaR3FAgISlWKgvQuhG6k9yaIdEIH6QQiASkJHUmA0In8Lufbc99kZnb27mx5+/6/c/a8t7uzd2bu3Pv1O9M14VtcBmPGjHEDBw7M+rowH330kfvBD37Qce2of/JR/+Sj/slH/ZNPO/RPv7r3LoQQok/SNW7cuEwPpCxN2amof/JR/+Sj/slH/ZNPO/RPd94BtJvLpnbUjtpRO2qnfdpRCEsIIUQUUiBCCCGikAIRQggRhRSIEEKIKKRAhBBCRCEFIoQQIgopECGEEFFIgQghhIhCCkQIIUQUTVMgr776qtttt93cMsss4w4//HA3duzYZu3avfLKK26dddZxgwYN8q+hQ4c2bd9CCNGpNEWBfP311+6KK65wjz76qPvqq6/cDTfc4IYPH96MXQshhGgQTfNAuru7m7UrIYQQTaApCmSSSSZxG220kVtqqaW8Itlggw3cCius0IxdCyGEaBBNcwvmnHNOd9ZZZzVrd0IIIRqMqrCEEEJE0TQFcv3111eqoHg9/vjjud99/vnn7pJLLvGhLz5bffXV3Zlnnuk++OCD1Pa/+eYb99BDD7k999zTLbfccv43W2+9tbv//vv9d0XgEZGnn366W2+99fzvqRjbfvvtfdL/008/rWzHMVBRtu6661a2e+CBB3q09cYbb7jNNtusck4c17hx4yJ6Tggh2pNuhGYe1b4vAg8r+fDDD3t89t5771XaTn6H8L3sssvcnXfeWfns/fff95VcI0aMcPvvv7+bdtppK9998cUX7uKLL3bXXHNNj3bYdsiQIV75fPnll5nnhYJhXyiocDsqxp5++mn/uvTSS92+++7rZp11Vv8dZcHPPvusVyxsx/5nmmkm179/f191xvajRo3y20455ZRuk002cR9//LF/pfVPWf3cTu1AOx1Pu7UD7XQ87dYOtNPxtFs70Orj6c57KHuZD22fZpppenw2wwwzVNpOfjds2DC/diONZ555xj3//PNu00039e8nTJjgLr/88omUh4Ewv+WWWyb6PDyvm266yZ1xxhleEWQxcuRIr9RYw4JCmHnmmb0CufLKK/33jz32mHvrrbfc4MGD/bHfe++9ld/uvvvubqWVVnJd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kKmmmspXWiXhM74TQggRR8crEEgLVSl8JYQQ9dEnFEhaqErhKyGEqI8+oUCmn356t8gii1TeL7jggv4zIYQQ8fQJBQKDBg2q/L/EEku08EiEEKIz6DMKZPPNN6/8v9FGG7XwSIQQojPoMwpklllmcUsuuaR/zTTTTK0+HNHHeOWVV9w666zjPWH+8r5dePzxx/1xkRc87bTTMr/ndf3111c+//DDD922227rP+d5Oln3kwvPPW+7NL755hv3wQcfuIcfftgf29577+3efffd2k9SNIS2f6AUA/aII46ovB86dGglHPXqq6+6o48+2j3xxBNu7bXXdvvss4+beuqpM9tqduKcCcaAf/bZZ/37Nddc0x166KFusskma+pxiMaBgPv444/93/fff9+999577u2333ZvvPGGe+GFF9zo0aPdJpts4pZddtmJfvv111+78847z4+HTTfdNPPu0QjwXXbZpe5jDedOuzBhwgTff/TFmDFjvLIYOXKkn9vPPPOM77+vvvqqsn13d7f7z3/+42acccYWHnV18uQWT0dFbt1xxx1uqaWWcgceeKCbddZZW3WoddH2CiQLBtwVV1zhHn30Uf/+hhtucD/5yU/cL37xi8zfqHS3uSAA1l13Xf//Flts4fbdd1930003VSbWdttt537zm9/UvR8s2iOPPNI/pni66aZzp59+upt55pkrynvAgAHeep1hhhnq3lfIpZde6o4//viq240aNcr9+Mc/7vHZF1984a688kp3+eWX+/c8JfOggw5yc8wxR6nHGEuW0uLahYLRoO/tMdELLbSQvwbTTDNN7j6SBlYRUCZ4I8sss4ybZJJJCv8ulgceeMANGTLE73eBBRZwp5xySt3K684773T//Oc//f8PPvigl1277757GYfbdHp1CAtrpBZmn312/xLNBys7OeEbISwnnXTSiSx5Ku6mnXba0vdVVJC8+OKLfqyGlX+8R9Ci3ABDiHDQLbfc4r0Z0RMsdIwQBPiOO+7YFOWBkr/99tsrHtDgwYNLMUKacezNotd6IFwEkuFMTkJYxFhXWGGFVh+WCOAaISjDEMRss81W+n769es3kTGBwmJftVi3tYIwsf1wrsT6ETqAEvvpT3/qVl55ZW8tJ4+PYyakcfbZZ3vvCQUyxRRT+Fwd32WRFgbNuh136JnVCseGFwKhN3LYYYe59ddf3/8fehDhccXeHpw7Q9CX88wzj5tzzjl9/+K5WT83G8JoeCCAscD1zLu7d1GIhIwYMaISwtpwww3rbrNVNEWBEOdEiNTqMVSDQXbWWWeV2qYoD4QIE+/NN99M9TYQmGWAsDbLMM3bYD9pVh9hUARCnsDOg3Lw+++/3/+fDMf8/ve/rwha+96gP4j1431gWZ9wwgnub3/7mzeAFl100dx9hqGidiYrPBUe/1/+8pfK55w33kUY9iInMnDgwFKPC1nEda8mi9ju3nvvrSTsUR5lRS8Yn3/+859LaSvJl19+6b73ve81pO00Gv5EwrfeesvHinHXsVJqJVmxMX78+FKewtWMJ3lZctDg4vIZf1txPK1ox8IxXEfaRGAzgUgkEm4qup9q25nlT3/Tx2C36p9yyind559/PtH+nnzySXfVVVf5kMhcc81Vk3WZPJ7ktbbzNRi3Ifbettl6660zzzP521jCuTN27Fiv5LCEQy688EL/4kFrBxxwgO+z+eef3919992VbawNlDK5DoNxbWM72R9pfPrpp5Vt7LolFX2Z47kWWUQxBB4CoGy4dx6GStHjqSa3GjVPzz33XK9ANthgg9yComrtFKVhTyTEwrrkkkvcxRdf7Cf34osvntkWA+maa65xN954o6+w4ELh+u+5554Tua4IBWsnrdLhRz/6kbdsrr322sr2f/3rX3tYdpwX7imJK5uce+yxh9thhx0KCRGsk9dff91PtKeeesr997//9Z/jghOu2Hnnnd28887rJ0U4IbiwCDM7J4QrYY9//OMf7rHHHvPVJ/SVtcPaFfotzULGwsOSIxn3/PPPew+PfuE8cYmpOAv3nbY9+2GFfnL7sp50xvmaEMczoE2Uh51/eC0NKpmw6ok9U8XEeybwwgsv7I9ztdVWc5NPPvlE+zKvg3Ni4tCu3SzT+h3hFu6P/Q8fPtw99NBDbq211vLXrUg1DP2DgKEAAG8ijWOPPda/sqBiMIukNR4+s6aeEFbY38mxmYQ+Izy81157ZW6TBl7VMcccUwnr5cF1tG34yzUKz6Oscfjaa6/5RHURWWQQuuL8gdJ/Qk0Q/i5WblEwEV5/woJUkVaTW4BHlye3mCsXXHCBP99tttnGbbzxxqnzJaSefi49hEWnouWHDRvmxo0b991Ovj0pLJk0KNNjQiCIDS4ygg4BUmvZIQMfYWgXgo6mGih5IR555JHKReBiIbCLKA8s2XPOOcefXxjbB873X//6l1tuueW8AqkGAy+tosXa4XG8O+20kx8g4WQk50OfJYUXA4GqDgQoFpP9Jmt79pO2fVkQz8fCD5l77rl9JVYaKNM0oUw/P/300/7FuDj88MMnSmbSR7xCaCus8kp6foxLJj3jjWtB21tttZX75S9/6au52pHeEsJC+V100UX+f3IoCDquY6gAMWqYR4BgxOuphlXUMY6qYbKI8KBZ2HmyyEAuYMAYHBfGSGilt4PcQjEk5ZadG4bXSSed5Offbrvt5lZZZZXMMvF6KE2BIFgZ2GeccYY/eN/4txeLhNH222/v7z+VBJf1xBNP7HERQvASeNUK5XZYrFjagHVPPNosOQbWc889V9meGn0Sd9XAakO782oGTDi8OI5vscUW858h9Em8Zlm+SWrdHghv/PrXv64pAd2sNQZ4CyggKpbqTWhiiV599dVeiF133XVeAHBt+exXv/qV23LLLatab70VE/CM6VNPPdX9/e9/959z3uQu6FtLokOYPE+Sl6zHW8dISRpbjSRPFjGuq+Uy8CYYZ0CeFYMwpFVyC8URyi08o6TcwuBkHmLkUphBpITFm/PNN5/3JjmX2JxfGnUrECYd7t7JJ5/sD9Y3mrhYdHjaZCdUEcZWCafsv//+/i/WItoYLVrr4MN6pHrDLgSuKIu7zGohORdeCMrzijzalvrzUHkQNsHCJazC77nAbFO0DBNrgbAJCgIFi1XGb7G08UwYhCgABoIpENzx8NjpY0Jd7J+wCr/h90be9kx8vgu3byWMEa4FYQDi1LjVfIZnwoSw2nmsMFzzMsIbJGl/97vfecGJQEWR0OcIn8suu8yHI7Cak1Zr0pNKJo3TBC6WM2FP+56wSNlJ4lpBwNpaKiAsTN+vvvrqPbbLWv9RDcYkc8JgLjeqTDlLFuFdEzJCFlUzOlCorNMwK5/CBiu1Nlolt/B6wrnMurek3LLqPpQLkQfCYPx96aWXvALhc8Ypx1qGIolWIAwCJjIHaJMmqTjyLhYdHQ5cOmK//farCEomLKtzWdGLG1oLhGJWXHFFLwC4iFjfCEm7EFwYq67AwihiOXO8DCwbFBwvg5Ly4fAcEH5FsUQerjHKg3188sknvnKJYzUrhr9MjjQXlP7hN+ybPrNbTmQRbs8+07YnpGXhh2ZCIpvErsEYo2+4nlhmpkCYSOTYylAgBoKcFcF4NqZIEK4ITYwGrjWVOGWFAUIhitAiPs+kRoAk501YUptGPTFshIvF+gHl+cc//tGPxaTgjOHf//53RSACoSH2R3+iqKwfLO9D/9L3JIFRylyXMO5PKClZvVdNFuFtFX14HLKCHAUwRwj9hKHdVsot+jGUW7bPNEyREBkIFQkvFvASLiOsWCTykke0AkGoHXXUUf4ka1EcBkIMV9GgM5InQ4f+8Ic/jDo+foe2tYtNPJFEFS51GJphwrJquRqEvV5++eXK+6WXXtpPgHpg4OOmEqbCHbacUZLQauNYEbQ2KZlsvDiW9dZbz58jyUgjb/vNNtvMT5Bw+1aDcmB1NhYe/6eBwG2UFZumSLBmERKxYToEHxM6LGVGwBC/ZjzefPPN3uNhm9/+9rdeeKIUal2lXRTLI1DYQLI1CcYKISkUphETwmI8p7Vv/UkIMbyvFQqDPmbO0s+mFJm75hFgSCTLtKvJoloqjAi3meFGZCApf1opt8KQma2PqUaWImF+4R2itOvJfZYSDEPAYREiYK2cslYYFGXWLzP4rHICKNl85513/IA1N5DBhgAtsl8EVliWiPVejwvIhPjTn/7kLSssnizlkQTvhLBZ8nkmlGNSxcHiyttuu80PuGrbk4xObt8q2D8hIe4bhTWepTyaAdcZYcQEy4MxwXVD8CFUQkHFPa4IszF5CYPgPYWWM3km5g2CwsIdzB0sTmL4zQCrHQMmBGHFvEG4h2EsPDHzVpMvQkRp+Y+09pk3zDuUGMUK4XoMBCT9hCyhOo4xQf/ec889lW2wnPPmaz2yiH1Z6S6suuqqVUPbzZRbFmo2uVXLujrkDXOqrPJhI9oDwYUikUTdMRfY3CNcUAYhcXYSN0WFLJMxTYjFWppYHlh4xJzpPOLovLCWzMKgvj3WUsg63qIQF06rRqKMFAsEKy0rSYf3g5uLpU681RKFwP/cqI0Jai5urdu3IomOwCaRm5z0hB5ILmJtcZuPRsG1JDdGWSavUKEzoUlOhs+RYTLiIWTdVTdNAYaWM5Yshgy5HdsX/YeyR2jFGmJFQekxHhC4lr8D7lRNaJUKunDxY60wrqz9EBQA5diUrNMf5oFwfVFalkS2Vdr0L3IF+I6xkKSaLCLMnFUOH8J4t32x72TyPI1myi0baya30taThWAIoYCIcKCQ7VrQL3i5rD0iXG3rpmKIViBcDE6EWncmHuVixPwY+BYmQYFQFkmyJxmjDVcPA64aC33C8jw6MIw31gquJcLTEl5YQ+HEZDAXvbdN8tYYVGlgocXGEGnHLiiDAW+Av/Qrx0gtfZYCARJueC/cYoJwCELPYqcIJCywMEZa6/bNBgVioQEEGovYEGRYd1hNJEcboUCYPFxL+sKEB2DdsTaE5DrXOBmWRbEhbKvdlp1xzpjG++AaoKg5V/JpCDvzNlAehIFsPIZlsEDegDAXHiOCzZL6CBbCS2Y5F1XkKDgWc9LXeAIIXwOPwkjmXsLbmhxyyCGpt+HgetmKb+B4GV8khIF8BzKB0J3NAeYX/WlJZM4XGYJMsG0I0abdf6wWWcScT8uHJO97ZaW7SdpJbqVVVtLvHA+eHDebtT4HohD0AaHIaje6LEopZbzEjcnwU4dPFQchCA6czD+CkcnI33D1J+WRWBTWSXQG1RPERoldYqExqC1xGgOTgzim7QMXMGbtBzDAsUDNVUfoMmCJHzJBEHS0jVBgkBWpaTcQBuQhmAi0wcLCLGHJObAP+pLcBvtFsXEMTEiEQtHt2Q/ufpJWJdFDsE7pW4QQk5SQUNmgoKmRDycnQoMkKK+8myUyfhAajHOUA7kmjtMsaooBCGGFVi8WPZOYsY6gMmGFdfyHP/whNxdH5Y+9ENpUjqWFTqrd9t0UDP2L5c45VLt9SgjGh5Fn0TO/EYSEX7B2mdshCLpQ+eLx0Kd4C8x5+jF89giKhbBNNarJIsLGSVkEhHRZewVppbvhebWz3MKjpWw/BOVJ4pz+q7YGplZKXUiIEETDEcfGYuQ+VVw4JkoyrksHcEKEVEyT4mbxCgnd6xgQ+ggCBmRo0Rdd+xGyxhpr+ItqNeJMDm71nASLsBqhFYM3gnVVBNxWu91EFghBO7dat28VjB0sdBQa15vwUKOxvAMgvLmlCde4SFEByo3STcPKeE2BYEQkBSzXItk245Dxwv6xnCluQECFAoJwEMldg/BKvXF3BAneEInyNKESlhxnkVXaa7dzZzGt3RwxCV5KGCK1bfhL7iGsYMIApaghmcfLI5RFeGcYRFmyqEjprtHucis8Nwu9EhJv1B2AG3I7dwYk5awMArRx2sN0AIuYmG9WiR3WSL33ySenkBaawUUssvYjhOMkzFDGg6nwUCjbTIPjqvXYDAQX1lBRq7LW7RsFVhLx6jQQILXc16cWOG+S2IQ58BgaUZGGgELAsObHjA9AEFAyi/Kgyo/wEJYzoaEw/8BvKYcF+gLDpdp9pqqBQMEKTz6npEwQXDyfJ81aDvMNGA5cf0DpooDCW4EgSGNLipFFKASTRawzSlKtdDdJO8st+ppn8BC+ouKKUGEjbx/f0LvxMhgYRCRp006ak8XiI/ZPogdLgdAQLiST2SqE6oH9MmiwMAxczSIJsjQY7JwPMU4GJYlQjpmJzXmgXIrcVp54L64vawy4jQYWGRYWJYgUIPB5WmULQocHM+EJYVGF+8a1pd/CxWl521NzzmBv9WI2YJCzaA9BwrlT6IByQ8BhRZLYR3mXCVYe+ypzZW4IQh4hiSce5lcMzpFYPwISz4scEBZyeFt4wi/20Cnge8YNyVHq+JPXrpZihjyjIbwNDAlhlBuhH4QtwpwQGLkK5hKeWLjC2dalWJw9maRN5hu4DrTD58ypM888s0fynX1SWk34KbboxWQR+0oq32qlu0laJbfyQmvGrrvu2tS78XZNyCklKut2ymXdFK3d2lH/5NOX+gevgMVxtiiP+yThRSSfMY7XyW/NEyH/gWJEeeAJguU4EHpYkXb3g/CWFgbeS3in15hquDAxHj4lEqFIKW5YYIDxwa0xEGT8tSQ7wpmqHixkBHTYP+E9zvB6MFwI25mS4H8MBzzBUNHiPdCWbYfFj5GBV1PLLWbyrjvnSMGGJb25zTrKodZ2aqGT5levfaCUEK3GHneKoMdbCi1trFQsUQQTyoLvCWFxfy28CrxCrF7i28n8F7FrPDIW4dnNBhHcKBU8V0JcVoodVtlAkWen0z4FIFkhGAoxUA7hLUiA7SkOoPqQ8yPxbw/DstJZwIpnYV/aUyBRBnY3aMDDpAgB5RsWdNAG1jS34sHzwDtB2OP9UxRC+2WENcNQGrmnRob0OpFe/UhbIVoJVjOJYoRbqDysKIG/xMIpByZBTn4Dy9lu2ZImYBHuvAgMoERMSGK5E5vHwscrCReb1QqhqzyLk+OifDkMOxOaZZ0O1rnlNIjT4zXgFYS3eMHDyHqEsCXECZ3yP+Fa8qXcFcG+xwviWfMUmuBtUL5sN0AkjIOyKUN5JENptZT1i++QByJEJMT4iYNb2IocFjfFZF2FFUggrLGWk6AIjjvuOC/AKB8lx0PCk3CK3UqeZChWMSEkrHET6Cgt8gTktCgXxVMYNWpU4cWH5AGqla9zfOSeCG8g3LMWBaMQUYwcK2WzHEe1HCDnQUgLpUCcH0VJqS8hLnIIVoWGJ8RfvILzzz/fl3ITKivyqIQioPQInxWpmhTpdH3rFmbmQMqK1XUq6p981D/5qH/yUf/k0wzcoJAAAAB3SURBVA7907AnEqodtaN21I7a6ex2lAMRQggRhRSIEEKIKKRAhBBCRCEFIoQQIgopECGEEFFIgQghhIhCCkQIIUQUUiBCCCGikAIRQggRhRSIEEKIKKRAhBBCRCEFIoQQIgopECGEEFFIgQghhIhCCkQIIUQU/weQWoUUjfSyOwAAAABJRU5ErkJggg==)

从图中可以看到，解析游标`index`最开始在模板字符串的位置0处，当调用了`advance(3)`之后，解析游标到了位置3处，每次解析完一段内容就将游标向后移动一段，接着再从解析游标往后解析，这样就保证了解析过的内容不会被重复解析。

### 3.2 解析条件注释

解析条件注释也比较简单，其原理跟解析注释相同，都是先用正则判断是否是以条件注释特有的开头标识开始，然后寻找其特有的结束标识，若找到，则说明是条件注释，将其截取出来即可，由于条件注释不存在于真正的`DOM`树中，所以不需要调用钩子函数创建`AST`节点。代码如下：

```javascript
// 解析是否是条件注释
const conditionalComment = /^<!\[/
if (conditionalComment.test(html)) {
  // 若为条件注释，则继续查找是否存在']>'
  const conditionalEnd = html.indexOf(']>')

  if (conditionalEnd >= 0) {
    // 若存在 ']>',则从原本的html字符串中把条件注释截掉，
    // 把剩下的内容重新赋给html，继续向后匹配
    advance(conditionalEnd + 2)
    continue
  }
}
```



### 3.3 解析DOCTYPE

解析`DOCTYPE`的原理同解析条件注释完全相同，此处不再赘述，代码如下：

```javascript
const doctype = /^<!DOCTYPE [^>]+>/i
// 解析是否是DOCTYPE
const doctypeMatch = html.match(doctype)
if (doctypeMatch) {
  advance(doctypeMatch[0].length)
  continue
}
```



### 3.4 解析开始标签

相较于前三种内容的解析，解析开始标签会稍微复杂一点，但是万变不离其宗，它的原理还是相通的，都是使用正则去匹配提取。

首先使用开始标签的正则去匹配模板字符串，看模板字符串是否具有开始标签的特征，如下：

```javascript
/**
 * 匹配开始标签的正则
 */
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)

const start = html.match(startTagOpen)
if (start) {
  const match = {
    tagName: start[1],
    attrs: [],
    start: index
  }
}

// 以开始标签开始的模板：
'<div></div>'.match(startTagOpen)  => ['<div','div',index:0,input:'<div></div>']
// 以结束标签开始的模板：
'</div><div></div>'.match(startTagOpen) => null
// 以文本开始的模板：
'我是文本</p>'.match(startTagOpen) => null
```



在上面代码中，我们用不同类型的内容去匹配开始标签的正则，发现只有``的字符串可以正确匹配，并且返回一个数组。

在前文中我们说到，当解析到开始标签时，会调用4个钩子函数中的`start`函数，而`start`函数需要传递3个参数，分别是标签名`tag`、标签属性`attrs`、标签是否自闭合`unary`。标签名通过正则匹配的结果就可以拿到，即上面代码中的`start[1]`，而标签属性`attrs`以及标签是否自闭合`unary`需要进一步解析。

1. 解析标签属性

   我们知道，标签属性一般是写在开始标签的标签名之后的，如下：

   ```html
   <div class="a" id="b"></div>
   ```

   1

   另外，我们在上面匹配是否是开始标签的正则中已经可以拿到开始标签的标签名，即上面代码中的`start[0]`，那么我们可以将这一部分先从模板字符串中截掉，则剩下的部分如下：

   ```html
    class="a" id="b"></div>
   ```

   1

   那么我们只需用剩下的这部分去匹配标签属性的正则，就可以将标签属性提取出来了，如下：

   ```javascript
   const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
   let html = 'class="a" id="b"></div>'
   let attr = html.match(attribute)
   console.log(attr)
   // ["class="a"", "class", "=", "a", undefined, undefined, index: 0, input: "class="a" id="b"></div>", groups: undefined]
   ```

   

   可以看到，第一个标签属性`class="a"`已经被拿到了。另外，标签属性有可能有多个也有可能没有，如果没有的话那好办，匹配标签属性的正则就会匹配失败，标签属性就为空数组；而如果标签属性有多个的话，那就需要循环匹配了，匹配出第一个标签属性后，就把该属性截掉，用剩下的字符串继续匹配，直到不再满足正则为止，代码如下：

   ```javascript
   const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
   const startTagClose = /^\s*(\/?)>/
   const match = {
    tagName: start[1],
    attrs: [],
    start: index
   }
   while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    advance(attr[0].length)
    match.attrs.push(attr)
   }
   ```

   

   在上面代码的`while`循环中，如果剩下的字符串不符合开始标签的结束特征（startTagClose）并且符合标签属性的特征的话，那就说明还有未提取出的标签属性，那就进入循环，继续提取，直到把所有标签属性都提取完毕。

   所谓不符合开始标签的结束特征是指当前剩下的字符串不是以开始标签结束符开头的，我们知道一个开始标签的结束符有可能是一个`>`（非自闭合标签），也有可能是`/>`（自闭合标签），如果剩下的字符串（如`>`）以开始标签的结束符开头，那么就表示标签属性已经被提取完毕了。

2. 解析标签是否是自闭合

   在`HTML`中，有自闭合标签（如``）也有非自闭合标签（如``），这两种类型的标签在创建`AST`节点是处理方式是有区别的，所以我们需要解析出当前标签是否是自闭合标签。

   解析的方式很简单，我们知道，经过标签属性提取之后，那么剩下的字符串无非就两种，如下：

   ```html
   <!--非自闭合标签-->
   ></div>
   ```

   

   或

   ```html
   <!--自闭合标签-->
   />
   ```

   所以我们可以用剩下的字符串去匹配开始标签结束符正则，如下：

   ```javascript
   const startTagClose = /^\s*(\/?)>/
   let end = html.match(startTagClose)
   '></div>'.match(startTagClose) // [">", "", index: 0, input: "></div>", groups: undefined]
   '/>'.match(startTagClose) // ["/>", "/", index: 0, input: "/><div></div>", groups: undefined]
   ```

   可以看到，非自闭合标签匹配结果中的`end[1]`为`""`，而自闭合标签匹配结果中的`end[1]`为`"/"`。所以根据匹配结果的`end[1]`是否是`""`我们即可判断出当前标签是否为自闭合标签，源码如下：

   ```javascript
   const startTagClose = /^\s*(\/?)>/
   let end = html.match(startTagClose)
   if (end) {
    match.unarySlash = end[1]
    advance(end[0].length)
    match.end = index
    return match
   }
   ```

经过以上两步，开始标签就已经解析完毕了，完整源码如下：

```javascript
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/


function parseStartTag () {
  const start = html.match(startTagOpen)
  // '<div></div>'.match(startTagOpen)  => ['<div','div',index:0,input:'<div></div>']
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index
    }
    advance(start[0].length)
    let end, attr
    /**
     * <div a=1 b=2 c=3></div>
     * 从<div之后到开始标签的结束符号'>'之前，一直匹配属性attrs
     * 所有属性匹配完之后，html字符串还剩下
     * 自闭合标签剩下：'/>'
     * 非自闭合标签剩下：'></div>'
     */
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      advance(attr[0].length)
      match.attrs.push(attr)
    }

    /**
     * 这里判断了该标签是否为自闭合标签
     * 自闭合标签如:<input type='text' />
     * 非自闭合标签如:<div></div>
     * '></div>'.match(startTagClose) => [">", "", index: 0, input: "></div>", groups: undefined]
     * '/><div></div>'.match(startTagClose) => ["/>", "/", index: 0, input: "/><div></div>", groups: undefined]
     * 因此，我们可以通过end[1]是否是"/"来判断该标签是否是自闭合标签
     */
    if (end) {
      match.unarySlash = end[1]
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}
```



通过源码可以看到，调用`parseStartTag`函数，如果模板字符串符合开始标签的特征，则解析开始标签，并将解析结果返回，如果不符合开始标签的特征，则返回`undefined`。

解析完毕后，就可以用解析得到的结果去调用`start`钩子函数去创建元素型的`AST`节点了。

在源码中，`Vue`并没有直接去调`start`钩子函数去创建`AST`节点，而是调用了`handleStartTag`函数，在该函数内部才去调的`start`钩子函数，为什么要这样做呢？这是因为虽然经过`parseStartTag`函数已经把创建`AST`节点必要信息提取出来了，但是提取出来的标签属性数组还是需要处理一下，下面我们就来看一下`handleStartTag`函数都做了些什么事。`handleStartTag`函数源码如下：

```javascript
function handleStartTag (match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash

    if (expectHTML) {
      // ...
    }

    const unary = isUnaryTag(tagName) || !!unarySlash

    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i]
      const value = args[3] || args[4] || args[5] || ''
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
      lastTag = tagName
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end)
    }
  }
```



`handleStartTag`函数用来对`parseStartTag`函数的解析结果进行进一步处理，它接收`parseStartTag`函数的返回值作为参数。

`handleStartTag`函数的开始定义几个常量：

```javascript
const tagName = match.tagName       // 开始标签的标签名
const unarySlash = match.unarySlash  // 是否为自闭合标签的标志，自闭合为"",非自闭合为"/"
const unary = isUnaryTag(tagName) || !!unarySlash  // 布尔值，标志是否为自闭合标签
const l = match.attrs.length    // match.attrs 数组的长度
const attrs = new Array(l)  // 一个与match.attrs数组长度相等的数组
```

1
2
3
4
5

接下来是循环处理提取出来的标签属性数组`match.attrs`，如下：

```javascript
for (let i = 0; i < l; i++) {
    const args = match.attrs[i]
    const value = args[3] || args[4] || args[5] || ''
    const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
    ? options.shouldDecodeNewlinesForHref
    : options.shouldDecodeNewlines
    attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
    }
}
```



上面代码中，首先定义了 `args`常量，它是解析出来的标签属性数组中的每一个属性对象，即`match.attrs` 数组中每个元素对象。 它长这样：

```javascript
const args = ["class="a"", "class", "=", "a", undefined, undefined, index: 0, input: "class="a" id="b"></div>", groups: undefined]
```

1

接着定义了`value`，用于存储标签属性的属性值，我们可以看到，在代码中尝试取`args`的`args[3]`、`args[4]`、`args[5]`，如果都取不到，则给`value`复制为空

```javascript
const value = args[3] || args[4] || args[5] || ''
```

1

接着定义了`shouldDecodeNewlines`，这个常量主要是做一些兼容性处理， 如果 `shouldDecodeNewlines` 为 `true`，意味着 `Vue` 在编译模板的时候，要对属性值中的换行符或制表符做兼容处理。而`shouldDecodeNewlinesForHref`为`true` 意味着`Vue`在编译模板的时候，要对`a`标签的 `href`属性值中的换行符或制表符做兼容处理。

```javascript
const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
    ? options.shouldDecodeNewlinesForHref
    : options.shouldDecodeNewlinesconst value = args[3] || args[4] || args[5] || ''
```



最后将处理好的结果存入之前定义好的与`match.attrs`数组长度相等的`attrs`数组中，如下：

```javascript
attrs[i] = {
    name: args[1],    // 标签属性的属性名，如class
    value: decodeAttr(value, shouldDecodeNewlines) // 标签属性的属性值，如class对应的a
}
```



最后，如果该标签是非自闭合标签，则将标签推入栈中（关于栈这个概念后面会说到），如下：

```javascript
if (!unary) {
    stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
    lastTag = tagName
}
```



如果该标签是自闭合标签，现在就可以调用`start`钩子函数并传入处理好的参数来创建`AST`节点了，如下：

```javascript
if (options.start) {
    options.start(tagName, attrs, unary, match.start, match.end)
}
```



以上就是开始标签的解析以及调用`start`钩子函数创建元素型的`AST`节点的所有过程。

### 3.5 解析结束标签

结束标签的解析要比解析开始标签容易多了，因为它不需要解析什么属性，只需要判断剩下的模板字符串是否符合结束标签的特征，如果是，就将结束标签名提取出来，再调用4个钩子函数中的`end`函数就好了。

首先判断剩余的模板字符串是否符合结束标签的特征，如下：

```javascript
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const endTagMatch = html.match(endTag)

'</div>'.match(endTag)  // ["</div>", "div", index: 0, input: "</div>", groups: undefined]
'<div>'.match(endTag)  // null
```



上面代码中，如果模板字符串符合结束标签的特征，则会获得匹配结果数组；如果不合符，则得到null。

接着再调用`end`钩子函数，如下：

```javascript
if (endTagMatch) {
    const curIndex = index
    advance(endTagMatch[0].length)
    parseEndTag(endTagMatch[1], curIndex, index)
    continue
}
```



在上面代码中，没有直接去调用`end`函数，而是调用了`parseEndTag`函数，关于`parseEndTag`函数内部的作用我们后面会介绍到，在这里你暂时可以理解为该函数内部就是去调用了`end`钩子函数。

### 3.6 解析文本

```text
终于到了解析最后一种文本类型的内容了，为什么要把解析文本类型放在最后一个介绍呢？我们仔细想一下，前面五种类型都是以`<`开头的，只有文本类型的内容不是以`<`开头的，所以我们在解析模板字符串的时候可以先判断一下字符串是不是以`<`开头的，如果是则继续判断是以上五种类型的具体哪一种，而如果不是的话，那它肯定就是文本了。
```

1

解析文本也比较容易，在解析模板字符串之前，我们先查找一下第一个`<`出现在什么位置，如果第一个`<`在第一个位置，那么说明模板字符串是以其它5种类型开始的；如果第一个`<`不在第一个位置而在模板字符串中间某个位置，那么说明模板字符串是以文本开头的，那么从开头到第一个`<`出现的位置就都是文本内容了；如果在整个模板字符串里没有找到`<`，那说明整个模板字符串都是文本。这就是解析思路，接下来我们对照源码来了解一下实际的解析过程，源码如下：

```javascript
let textEnd = html.indexOf('<')
// '<' 在第一个位置，为其余5种类型
if (textEnd === 0) {
    // ...
}
// '<' 不在第一个位置，文本开头
if (textEnd >= 0) {
    // 如果html字符串不是以'<'开头,说明'<'前面的都是纯文本，无需处理
    // 那就把'<'以后的内容拿出来赋给rest
    rest = html.slice(textEnd)
    while (
        !endTag.test(rest) &&
        !startTagOpen.test(rest) &&
        !comment.test(rest) &&
        !conditionalComment.test(rest)
    ) {
        // < in plain text, be forgiving and treat it as text
        /**
           * 用'<'以后的内容rest去匹配endTag、startTagOpen、comment、conditionalComment
           * 如果都匹配不上，表示'<'是属于文本本身的内容
           */
        // 在'<'之后查找是否还有'<'
        next = rest.indexOf('<', 1)
        // 如果没有了，表示'<'后面也是文本
        if (next < 0) break
        // 如果还有，表示'<'是文本中的一个字符
        textEnd += next
        // 那就把next之后的内容截出来继续下一轮循环匹配
        rest = html.slice(textEnd)
    }
    // '<'是结束标签的开始 ,说明从开始到'<'都是文本，截取出来
    text = html.substring(0, textEnd)
    advance(textEnd)
}
// 整个模板字符串里没有找到`<`,说明整个模板字符串都是文本
if (textEnd < 0) {
    text = html
    html = ''
}
// 把截取出来的text转化成textAST
if (options.chars && text) {
    options.chars(text)
}
```



源码的逻辑很清晰，根据`<`在不在第一个位置以及整个模板字符串里没有`<`都分别进行了处理。

值得深究的是如果`<`不在第一个位置而在模板字符串中间某个位置，那么说明模板字符串是以文本开头的，那么从开头到第一个`<`出现的位置就都是文本内容了，接着我们还要从第一个`<`的位置继续向后判断，因为还存在这样一种情况，那就是如果文本里面本来就包含一个`<`，例如`1<2`。为了处理这种情况，我们把从第一个`<`的位置直到模板字符串结束都截取出来记作`rest`，如下：

```javascript
 let rest = html.slice(textEnd)
```

1

接着用`rest`去匹配以上5种类型的正则，如果都匹配不上，则表明这个`<`是属于文本本身的内容，如下：

```javascript
while (
    !endTag.test(rest) &&
    !startTagOpen.test(rest) &&
    !comment.test(rest) &&
    !conditionalComment.test(rest)
) {

}
```



如果都匹配不上，则表明这个`<`是属于文本本身的内容，接着以这个`<`的位置继续向后查找，看是否还有`<`，如果没有了，则表示后面的都是文本；如果后面还有下一个`<`，那表明至少在这个`<`到下一个`<`中间的内容都是文本，至于下一个`<`以后的内容是什么，则还需要重复以上的逻辑继续判断。代码如下：

```javascript
while (
    !endTag.test(rest) &&
    !startTagOpen.test(rest) &&
    !comment.test(rest) &&
    !conditionalComment.test(rest)
) {
    // < in plain text, be forgiving and treat it as text
    /**
    * 用'<'以后的内容rest去匹配endTag、startTagOpen、comment、conditionalComment
    * 如果都匹配不上，表示'<'是属于文本本身的内容
    */
    // 在'<'之后查找是否还有'<'
    next = rest.indexOf('<', 1)
    // 如果没有了，表示'<'后面也是文本
    if (next < 0) break
    // 如果还有，表示'<'是文本中的一个字符
    textEnd += next
    // 那就把next之后的内容截出来继续下一轮循环匹配
    rest = html.slice(textEnd)
}
```



最后截取文本内容`text`并调用4个钩子函数中的`chars`函数创建文本型的`AST`节点。

## 4. 如何保证AST节点层级关系

上一章节我们介绍了`HTML`解析器是如何解析各种不同类型的内容并且调用钩子函数创建不同类型的`AST`节点。此时你可能会有个疑问，我们上面创建的`AST`节点都是单独创建且分散的，而真正的`DOM`节点都是有层级关系的，那如何来保证`AST`节点的层级关系与真正的`DOM`节点相同呢？

关于这个问题，`Vue`也注意到了。`Vue`在`HTML`解析器的开头定义了一个栈`stack`，这个栈的作用就是用来维护`AST`节点层级的，那么它是怎么维护的呢？通过前文我们知道，`HTML`解析器在从前向后解析模板字符串时，每当遇到开始标签时就会调用`start`钩子函数，那么在`start`钩子函数内部我们可以将解析得到的开始标签推入栈中，而每当遇到结束标签时就会调用`end`钩子函数，那么我们也可以在`end`钩子函数内部将解析得到的结束标签所对应的开始标签从栈中弹出。请看如下例子：

加入有如下模板字符串：

```html
<div><p><span></span></p></div>
```

1

当解析到开始标签``时，就把`div`推入栈中，然后继续解析，当解析到``时，再把`p`推入栈中，同理，再把`span`推入栈中，当解析到结束标签``时，此时栈顶的标签刚好是`span`的开始标签，那么就用`span`的开始标签和结束标签构建`AST`节点，并且从栈中把`span`的开始标签弹出，那么此时栈中的栈顶标签`p`就是构建好的`span`的`AST`节点的父节点，如下图：

![img](https://vue-js.com/learn-vue/assets/img/7.6ca1dbf0.png)

这样我们就找到了当前被构建节点的父节点。这只是栈的一个用途，它还有另外一个用途，我们再看如下模板字符串：

```html
<div><p><span></p></div>
```

按照上面的流程解析这个模板字符串时，当解析到结束标签``时，此时栈顶的标签应该是`p`才对，而现在是`span`，那么就说明`span`标签没有被正确闭合，此时控制台就会抛出警告：‘tag has no matching end tag.’相信这个警告你一定不会陌生。这就是栈的第二个用途： 检测模板字符串中是否有未正确闭合的标签。

OK，有了这个栈的概念之后，我们再回看上一章`HTML`解析器解析不同内容的代码。

## 5. 回归源码

### 5.1 HTML解析器源码

以上内容都了解了之后，我们回归源码，逐句分析`HTML`解析器`parseHTML`函数，函数定义如下：

```javascript
function parseHTML(html, options) {
	var stack = [];
	var expectHTML = options.expectHTML;
	var isUnaryTag$$1 = options.isUnaryTag || no;
	var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
	var index = 0;
	var last, lastTag;

	// 开启一个 while 循环，循环结束的条件是 html 为空，即 html 被 parse 完毕
	while (html) {
		last = html;
		// 确保即将 parse 的内容不是在纯文本标签里 (script,style,textarea)
		if (!lastTag || !isPlainTextElement(lastTag)) {
		   let textEnd = html.indexOf('<')
              /**
               * 如果html字符串是以'<'开头,则有以下几种可能
               * 开始标签:<div>
               * 结束标签:</div>
               * 注释:<!-- 我是注释 -->
               * 条件注释:<!-- [if !IE] --> <!-- [endif] -->
               * DOCTYPE:<!DOCTYPE html>
               * 需要一一去匹配尝试
               */
            if (textEnd === 0) {
                // 解析是否是注释
        		if (comment.test(html)) {

                }
                // 解析是否是条件注释
                if (conditionalComment.test(html)) {

                }
                // 解析是否是DOCTYPE
                const doctypeMatch = html.match(doctype)
                if (doctypeMatch) {

                }
                // 解析是否是结束标签
                const endTagMatch = html.match(endTag)
                if (endTagMatch) {

                }
                // 匹配是否是开始标签
                const startTagMatch = parseStartTag()
                if (startTagMatch) {

                }
            }
            // 如果html字符串不是以'<'开头,则解析文本类型
            let text, rest, next
            if (textEnd >= 0) {

            }
            // 如果在html字符串中没有找到'<'，表示这一段html字符串都是纯文本
            if (textEnd < 0) {
                text = html
                html = ''
            }
            // 把截取出来的text转化成textAST
            if (options.chars && text) {
                options.chars(text)
            }
		} else {
			// 父元素为script、style、textarea时，其内部的内容全部当做纯文本处理
		}

		//将整个字符串作为文本对待
		if (html === last) {
			options.chars && options.chars(html);
			if (!stack.length && options.warn) {
				options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
			}
			break
		}
	}

	// Clean up any remaining tags
	parseEndTag();
	//parse 开始标签
	function parseStartTag() {

	}
	//处理 parseStartTag 的结果
	function handleStartTag(match) {

	}
	//parse 结束标签
	function parseEndTag(tagName, start, end) {

	}
}
```



上述代码中大致可分为三部分：

- 定义的一些常量和变量
- while 循环
- 解析过程中用到的辅助函数

我们一一来分析：

首先定义了几个常量，如下

```javascript
const stack = []       // 维护AST节点层级的栈
const expectHTML = options.expectHTML
const isUnaryTag = options.isUnaryTag || no
const canBeLeftOpenTag = options.canBeLeftOpenTag || no   //用来检测一个标签是否是可以省略闭合标签的非自闭合标签
let index = 0   //解析游标，标识当前从何处开始解析模板字符串
let last,   // 存储剩余还未解析的模板字符串
    lastTag  // 存储着位于 stack 栈顶的元素
```

接着开启`while` 循环，循环的终止条件是 模板字符串`html`为空，即模板字符串被全部编译完毕。在每次`while`循环中， 先把 `html`的值赋给变量 `last`，如下：

```javascript
last = html
```

这样做的目的是，如果经过上述所有处理逻辑处理过后，`html`字符串没有任何变化，即表示`html`字符串没有匹配上任何一条规则，那么就把`html`字符串当作纯文本对待，创建文本类型的`AST`节点并且如果抛出异常：模板字符串中标签格式有误。如下：

```javascript
//将整个字符串作为文本对待
if (html === last) {
    options.chars && options.chars(html);
    if (!stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
    }
    break
}
```

接着，我们继续看`while`循环体内的代码：

```javascript
while (html) {
  // 确保即将 parse 的内容不是在纯文本标签里 (script,style,textarea)
  if (!lastTag || !isPlainTextElement(lastTag)) {

  } else {
    // parse 的内容是在纯文本标签里 (script,style,textarea)
  }
}
```

在循环体内，首先判断了待解析的`html`字符串是否在纯文本标签里，如`script`,`style`,`textarea`，因为在这三个标签里的内容肯定不会有`HTML`标签，所以我们可直接当作文本处理，判断条件如下：

```javascript
!lastTag || !isPlainTextElement(lastTag)
```

前面我们说了，`lastTag`为栈顶元素，`!lastTag`即表示当前`html`字符串没有父节点，而`isPlainTextElement(lastTag)` 是检测 `lastTag` 是否为是那三个纯文本标签之一，是的话返回`true`，不是返回`fasle`。

也就是说当前`html`字符串要么没有父节点要么父节点不是纯文本标签，则接下来就可以依次解析那6种类型的内容了，关于6种类型内容的处理方式前文已经逐个介绍过，此处不再重复。

### 5.2 parseEndTag函数源码

接下来我们看一下之前在解析结束标签时遗留的`parseEndTag`函数，该函数定义如下：

```javascript
function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName
    if (start == null) start = index
    if (end == null) end = index

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase()
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`
          )
        }
        if (options.end) {
          options.end(stack[i].tag, start, end)
        }
      }

      // Remove the open elements from the stack
      stack.length = pos
      lastTag = pos && stack[pos - 1].tag
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end)
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end)
      }
      if (options.end) {
        options.end(tagName, start, end)
      }
    }
  }
}
```



该函数接收三个参数，分别是结束标签名`tagName`、结束标签在`html`字符串中的起始和结束位置`start`和`end`。

这三个参数其实都是可选的，根据传参的不同其功能也不同。

- 第一种是三个参数都传递，用于处理普通的结束标签
- 第二种是只传递`tagName`
- 第三种是三个参数都不传递，用于处理栈中剩余未处理的标签

如果`tagName`存在，那么就从后往前遍历栈，在栈中寻找与`tagName`相同的标签并记录其所在的位置`pos`，如果`tagName`不存在，则将`pos`置为0。如下：

```javascript
if (tagName) {
    for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break
        }
    }
} else {
    // If no tag name is provided, clean shop
    pos = 0
}
```



接着当`pos>=0`时，开启一个`for`循环，从栈顶位置从后向前遍历直到`pos`处，如果发现`stack`栈中存在索引大于`pos`的元素，那么该元素一定是缺少闭合标签的。这是因为在正常情况下，`stack`栈的栈顶元素应该和当前的结束标签`tagName` 匹配，也就是说正常的`pos`应该是栈顶位置，后面不应该再有元素，如果后面还有元素，那么后面的元素就都缺少闭合标签 那么这个时候如果是在非生产环境会抛出警告，告诉你缺少闭合标签。除此之外，还会调用 `options.end(stack[i].tag, start, end)`立即将其闭合，这是为了保证解析结果的正确性。

```javascript
if (pos >= 0) {
	// Close all the open elements, up the stack
	for (var i = stack.length - 1; i >= pos; i--) {
		if (i > pos || !tagName ) {
			options.warn(
				("tag <" + (stack[i].tag) + "> has no matching end tag.")
			);
		}
		if (options.end) {
			options.end(stack[i].tag, start, end);
		}
	}

	// Remove the open elements from the stack
	stack.length = pos;
	lastTag = pos && stack[pos - 1].tag;
}
```



最后把`pos`位置以后的元素都从`stack`栈中弹出，以及把`lastTag`更新为栈顶元素:

```js
stack.length = pos;
lastTag = pos && stack[pos - 1].tag;
```



接着，如果`pos`没有大于等于0，即当 `tagName` 没有在 `stack` 栈中找到对应的开始标签时，`pos` 为 -1 。那么此时再判断 `tagName` 是否为`br` 或`p`标签，为什么要单独判断这两个标签呢？这是因为在浏览器中如果我们写了如下`HTML`：

```html
<div>
    </br>
    </p>
</div>
```



浏览器会自动把` `标签解析为正常的 <br>标签，而对于``浏览器则自动将其补全为``，所以`Vue`为了与浏览器对这两个标签的行为保持一致，故对这两个便签单独判断处理，如下：

```javascript
if (lowerCasedTagName === 'br') {
    if (options.start) {
        options.start(tagName, [], true, start, end)  // 创建<br>AST节点
    }
}
// 补全p标签并创建AST节点
if (lowerCasedTagName === 'p') {
    if (options.start) {
        options.start(tagName, [], false, start, end)
    }
    if (options.end) {
        options.end(tagName, start, end)
    }
}
```



以上就是对结束标签的解析与处理。

另外，在`while`循环后面还有一行代码：

```javascript
parseEndTag()
```

这行代码执行的时机是`html === last`，即`html`字符串中的标签格式有误时会跳出`while`循环，此时就会执行这行代码，这行代码是调用`parseEndTag`函数并不传递任何参数，前面我们说过如果`parseEndTag`函数不传递任何参数是用于处理栈中剩余未处理的标签。这是因为如果不传递任何函数，此时`parseEndTag`函数里的`pos`就为0，那么`pos>=0`就会恒成立，那么就会逐个警告缺少闭合标签，并调用 `options.end`将其闭合。

## 6. 总结

本篇文章主要介绍了`HTML`解析器的工作流程以及工作原理，文章比较长，但是逻辑并不复杂。

首先介绍了`HTML`解析器的工作流程，一句话概括就是：一边解析不同的内容一边调用对应的钩子函数生成对应的`AST`节点，最终完成将整个模板字符串转化成`AST`。

接着介绍了`HTML`解析器是如何解析用户所写的模板字符串中各种类型的内容的，把各种类型的解析方式都分别进行了介绍。

其次，介绍了在解析器内维护了一个栈，用来保证构建的`AST`节点层级与真正`DOM`层级一致。

了解了思想之后，最后回归源码，学习了源码中一些处理细节的地方。

## 三 优化阶段

## 1. 前言

在前几篇文章中，我们介绍了模板编译流程三大阶段中的第一阶段模板解析阶段，在这一阶段主要做的工作是用解析器将用户所写的模板字符串解析成`AST`抽象语法树，理论上来讲，有了`AST`就可直接进入第三阶段生成`render`函数了。其实不然，`Vue`还是很看重性能的，只要有一点可以优化的地方就要将其进行优化。在之前介绍虚拟`DOM`的时候我们说过，有一种节点一旦首次渲染上了之后不管状态再怎么变化它都不会变了，这种节点叫做静态节点，如下：

```html
<ul>
    <li>我是文本信息</li>
    <li>我是文本信息</li>
    <li>我是文本信息</li>
    <li>我是文本信息</li>
    <li>我是文本信息</li>
</ul>
```



在上面代码中，`ul`标签下面有5个`li`标签，每个`li`标签里的内容都是不含任何变量的纯文本，也就是说这种标签一旦第一次被渲染成`DOM`节点以后，之后不管状态再怎么变化它都不会变了，我们把像`li`的这种节点称之为静态节点。而这5个`li`节点的父节点是`ul`节点，也就是说`ul`节点的所有子节点都是静态节点，那么我们把像`ul`的这种节点称之为静态根节点。

OK，有了静态节点和静态根节点这两个概念之后，我们再仔细思考，模板编译的最终目的是用模板生成一个`render`函数，而用`render`函数就可以生成与模板对应的`VNode`，之后再进行`patch`算法，最后完成视图渲染。这中间的`patch`算法又是用来对比新旧`VNode`之间存在的差异。在上面我们还说了，静态节点不管状态怎么变化它是不会变的，基于此，那我们就可以在`patch`过程中不用去对比这些静态节点了，这样不就又可以提高一些性能了吗？

所以我们在模板编译的时候就先找出模板中所有的静态节点和静态根节点，然后给它们打上标记，用于告诉后面`patch`过程打了标记的这些节点是不需要对比的，你只要把它们克隆一份去用就好啦。这就是优化阶段存在的意义。

上面也说了，优化阶段其实就干了两件事：

1. 在`AST`中找出所有静态节点并打上标记；
2. 在`AST`中找出所有静态根节点并打上标记；

优化阶段的源码位于`src/compiler/optimizer.js`中，如下：

```javascript
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // 标记静态节点
  markStatic(root)
  // 标记静态根节点
  markStaticRoots(root, false)
}
```

接下来，我们就对所干的这两件事逐个分析。

## 2. 标记静态节点

从`AST`中找出所有静态节点并标记其实不难，我们只需从根节点开始，先标记根节点是否为静态节点，然后看根节点如果是元素节点，那么就去向下递归它的子节点，子节点如果还有子节点那就继续向下递归，直到标记完所有节点。代码如下：

```javascript
function markStatic (node: ASTNode) {
  node.static = isStatic(node)
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}
```



在上面代码中，首先调用`isStatic`函数标记节点是否为静态节点，该函数若返回`true`表示该节点是静态节点，若返回`false`表示该节点不是静态节点，函数实现如下：

```javascript
function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // 包含变量的动态文本节点
    return false
  }
  if (node.type === 3) { // 不包含变量的纯文本节点
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```

该函数的实现过程其实也说明了如何判断一个节点是否为静态节点。还记得在`HTML`解析器在调用钩子函数创建`AST`节点时会根据节点类型的不同为节点加上不同的`type`属性，用`type`属性来标记`AST`节点的节点类型，其对应关系如下：

| type取值 | 对应的AST节点类型      |
| -------- | ---------------------- |
| 1        | 元素节点               |
| 2        | 包含变量的动态文本节点 |
| 3        | 不包含变量的纯文本节点 |

所以在判断一个节点是否为静态节点时首先会根据`type`值判断节点类型，如果`type`值为2，那么该节点是包含变量的动态文本节点，它就肯定不是静态节点，返回`false`；

```javascript
if (node.type === 2) { // 包含变量的动态文本节点
    return false
}
```

如果`type`值为2，那么该节点是不包含变量的纯文本节点，它就肯定是静态节点，返回`true`；

```javascript
if (node.type === 3) { // 不包含变量的纯文本节点
    return true
}
```

如果`type`值为1,说明该节点是元素节点，那就需要进一步判断。

```javascript
node.pre ||
(
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
)
```

如果元素节点是静态节点，那就必须满足以下几点要求：

- 如果节点使用了`v-pre`指令，那就断定它是静态节点；

- 如果节点没有使用

  ```
  v-pre
  ```

  指令，那它要成为静态节点必须满足：

  - 不能使用动态绑定语法，即标签上不能有`v-`、`@`、`:`开头的属性；
  - 不能使用`v-if`、`v-else`、`v-for`指令；
  - 不能是内置组件，即标签名不能是`slot`和`component`；
  - 标签名必须是平台保留标签，即不能是组件；
  - 当前节点的父节点不能是带有 `v-for` 的 `template` 标签；
  - 节点的所有属性的 `key` 都必须是静态节点才有的 `key`，注：静态节点的`key`是有限的，它只能是`type`,`tag`,`attrsList`,`attrsMap`,`plain`,`parent`,`children`,`attrs`之一；

标记完当前节点是否为静态节点之后，如果该节点是元素节点，那么还要继续去递归判断它的子节点，如下：

```javascript
for (let i = 0, l = node.children.length; i < l; i++) {
    const child = node.children[i]
    markStatic(child)
    if (!child.static) {
        node.static = false
    }
}
```

注意，在上面代码中，新增了一个判断：

```javascript
if (!child.static) {
    node.static = false
}
```

这个判断的意思是如果当前节点的子节点有一个不是静态节点，那就把当前节点也标记为非静态节点。为什么要这么做呢？这是因为我们在判断的时候是从上往下判断的，也就是说先判断当前节点，再判断当前节点的子节点，如果当前节点在一开始被标记为了静态节点，但是通过判断子节点的时候发现有一个子节点却不是静态节点，这就有问题了，我们之前说过一旦标记为静态节点，就说明这个节点首次渲染之后不会再发生任何变化，但是它的一个子节点却又是可以变化的，就出现了自相矛盾，所以我们需要当发现它的子节点中有一个不是静态节点的时候，就得把当前节点重新设置为非静态节点。

循环`node.children`后还不算把所有子节点都遍历完，因为如果当前节点的子节点中有标签带有`v-if`、`v-else-if`、`v-else`等指令时，这些子节点在每次渲染时都只渲染一个，所以其余没有被渲染的肯定不在`node.children`中，而是存在于`node.ifConditions`，所以我们还要把`node.ifConditions`循环一遍，如下：

```javascript
if (node.ifConditions) {
    for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
            node.static = false
        }
    }
}
```

同理，如果当前节点的`node.ifConditions`中有一个子节点不是静态节点也要将当前节点设置为非静态节点。

以上就是标记静态节点的全部逻辑。

## 3. 标记静态根节点

寻找静态根节点根寻找静态节点的逻辑类似，都是从`AST`根节点递归向下遍历寻找，其代码如下：

```javascript
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}
```



上面代码中，首先`markStaticRoots` 第二个参数是 `isInFor`，对于已经是 `static` 的节点或者是 `v-once` 指令的节点，`node.staticInFor = isInFor`，如下：

```javascript
if (node.static || node.once) {
    node.staticInFor = isInFor
}
```

着判断该节点是否为静态根节点，如下：

```javascript
// For a node to qualify as a static root, it should have children that
// are not just static text. Otherwise the cost of hoisting out will
// outweigh the benefits and it's better off to just always render it fresh.
// 为了使节点有资格作为静态根节点，它应具有不只是静态文本的子节点。 否则，优化的成本将超过收益，最好始终将其更新。
if (node.static && node.children.length && !(
    node.children.length === 1 &&
    node.children[0].type === 3
)) {
    node.staticRoot = true
    return
} else {
    node.staticRoot = false
}
```



从代码和注释中我们可以看到，一个节点要想成为静态根节点，它必须满足以下要求：

- 节点本身必须是静态节点；
- 必须拥有子节点 `children`；
- 子节点不能只是只有一个文本节点；

否则的话，对它的优化成本将大于优化后带来的收益。

如果当前节点不是静态根节点，那就继续递归遍历它的子节点`node.children`和`node.ifConditions`，如下：

```javascript
if (node.children) {
    for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
    }
}
if (node.ifConditions) {
    for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
    }
}
```



这里的原理跟寻找静态节点相同，此处就不再重复。

## 4. 总结

本篇文章介绍了模板编译过程三大阶段的第二阶段——优化阶段。

首先，介绍了为什么要有优化阶段，是为了提高虚拟`DOM`中`patch`过程的性能。在优化阶段将所有静态节点都打上标记，这样在`patch`过程中就可以跳过对比这些节点。

接着，介绍了优化阶段主要干了两件事情，分别是从构建出的`AST`中找出并标记所有静态节点和所有静态根节点。

最后，分别通过逐行分析源码的方式分析了这两件事具体的内部工作原理。

## 四代码生成阶段

## 1. 前言

经过前几篇文章，我们把用户所写的模板字符串先经过解析阶段解析生成对应的抽象语法树`AST`，接着再经过优化阶段将`AST`中的静态节点及静态根节点都打上标记，现在终于到了模板编译三大阶段的最后一个阶段了——代码生成阶段。所谓代码生成阶段，到底是要生成什么代码？答：要生成`render`函数字符串。

我们知道，`Vue`实例在挂载的时候会调用其自身的`render`函数来生成实例上的`template`选项所对应的`VNode`，简单的来说就是`Vue`只要调用了`render`函数，就可以把模板转换成对应的虚拟`DOM`。那么`Vue`要想调用`render`函数，那必须要先有这个`render`函数，那这个`render`函数又是从哪来的呢？是用户手写的还是`Vue`自己生成的？答案是都有可能。我们知道，我们在日常开发中是可以在`Vue`组件选项中手写一个`render`选项，其值对应一个函数，那这个函数就是`render`函数，当用户手写了`render`函数时，那么`Vue`在挂载该组件的时候就会调用用户手写的这个`render`函数。那如果用户没有写呢？那这个时候`Vue`就要自己根据模板内容生成一个`render`函数供组件挂载的时候调用。而`Vue`自己根据模板内容生成`render`函数的过程就是本篇文章所要介绍的代码生成阶段。

现在我们知道了，所谓代码生成其实就是根据模板对应的抽象语法树`AST`生成一个函数，通过调用这个函数就可以得到模板对应的虚拟`DOM`。

## 2. 如何根据AST生成render函数

通过上文我们知道了，代码生成阶段主要的工作就是根据已有的`AST`生成对应的`render`函数供组件挂载时调用，组件只要调用的这个`render`函数就可以得到`AST`对应的虚拟`DOM`的`VNode`。那么如何根据`AST`生成`render`函数呢？这其中是怎样一个过程呢？接下来我们就来细细剖析一下。

假设现有如下模板：

```html
<div id="NLRX"><p>Hello {{name}}</p></div>
```

1

该模板经过解析并优化后对应的`AST`如下：

```javascript
ast = {
    'type': 1,
    'tag': 'div',
    'attrsList': [
        {
            'name':'id',
            'value':'NLRX',
        }
    ],
    'attrsMap': {
      'id': 'NLRX',
    },
    'static':false,
    'parent': undefined,
    'plain': false,
    'children': [{
      'type': 1,
      'tag': 'p',
      'plain': false,
      'static':false,
      'children': [
        {
            'type': 2,
            'expression': '"Hello "+_s(name)',
            'text': 'Hello {{name}}',
            'static':false,
        }
      ]
    }]
  }
```



下面我们就来根据已有的这个`AST`来生成对应的`render`函数。生成`render`函数的过程其实就是一个递归的过程，从顶向下依次递归`AST`中的每一个节点，根据不同的`AST`节点类型创建不同的`VNode`类型。接下来我们就来对照已有的模板和`AST`实际演示一下生成`render`函数的过程。

1. 首先，根节点`div`是一个元素型`AST`节点，那么我们就要创建一个元素型`VNode`，我们把创建元素型`VNode`的方法叫做`_c(tagName,data,children)`。我们暂且不管`_c()`是什么，只需知道调用`_c()`就可以创建一个元素型`VNode`。那么就可以生成如下代码：

   ```javascript
   _c('div',{attrs:{"id":"NLRX"}},[/*子节点列表*/])
   ```

   1

2. 根节点`div`有子节点，那么我们进入子节点列表`children`里遍历子节点，发现子节点`p`也是元素型的，那就继续创建元素型`VNode`并将其放入上述代码中根节点的子节点列表中，如下：

   ```javascript
   _c('div',{attrs:{"id":"NLRX"}},[_c('p'),[/*子节点列表*/]])
   ```

   1

3. 同理，继续遍历`p`节点的子节点，发现是一个文本型节点，那就创建一个文本型`VNode`并将其插入到`p`节点的子节点列表中，同理，创建文本型`VNode`我们调用`_v()`方法，如下：

   ```javascript
   _c('div',{attrs:{"id":"NLRX"}},[_c('p'),[_v("Hello "+_s(name))]])
   ```

   1

4. 到此，整个`AST`就遍历完毕了，我们将得到的代码再包装一下，如下：

   ```javascript
   `
   with(this){
       reurn _c(
           'div',
           {
               attrs:{"id":"NLRX"},
           }
           [
               _c('p'),
               [
                   _v("Hello "+_s(name))
               ]
           ])
   }
   `
   ```

   

5. 最后，我们将上面得到的这个函数字符串传递给`createFunction`函数（关于这个函数在后面会介绍到），`createFunction`函数会帮我们把得到的函数字符串转换成真正的函数，赋给组件中的`render`选项，从而就是`render`函数了。如下：

   ```javascript
   res.render = createFunction(compiled.render, fnGenErrors)
   
   function createFunction (code, errors) {
     try {
       return new Function(code)
     } catch (err) {
       errors.push({ err, code })
       return noop
     }
   }
   ```

   

以上就是根据一个简单的模板所对应的`AST`生成`render`函数的过程，理论过程我们已经了解了，那么在源码中实际是如何实现的呢？下面我们就回归源码分析其具体实现过程。

## 3. 回归源码

代码生成阶段的源码位于`src/compiler/codegen/index.js` 中，源码虽然很长，但是逻辑不复杂，核心逻辑如下：

```javascript
export function generate (ast,option) {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```



```javascript
const code = generate(ast, options)
```

调用`generate`函数并传入优化后得到的`ast`，在`generate`函数内部先判断`ast`是否为空，不为空则调用`genElement(ast, state)`函数创建`VNode`，为空则创建一个空的元素型`div`的`VNode`。然后将得到的结果用`with(this){return ${code}}`包裹返回。可以看出，真正起作用的是`genElement`函数，下面我们继续来看一下`genElement`函数内部是怎样的。

`genElement`函数定义如下：

```javascript
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      const data = el.plain ? undefined : genData(el, state)

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```



`genElement`函数逻辑很清晰，就是根据当前 `AST` 元素节点属性的不同从而执行不同的代码生成函数。虽然元素节点属性的情况有很多种，但是最后真正创建出来的`VNode`无非就三种，分别是元素节点，文本节点，注释节点。接下来我们就着重分析一下如何生成这三种节点类型的`render`函数的。

### 3.1 元素节点

生成元素型节点的`render`函数代码如下：

```javascript
const data = el.plain ? undefined : genData(el, state)

const children = el.inlineTemplate ? null : genChildren(el, state, true)
code = `_c('${el.tag}'${
data ? `,${data}` : '' // data
}${
children ? `,${children}` : '' // children
})`
```

1
2
3
4
5
6
7
8

生成元素节点的`render`函数就是生成一个`_c()`函数调用的字符串，上文提到了`_c()`函数接收三个参数，分别是节点的标签名`tagName`，节点属性`data`，节点的子节点列表`children`。那么我们只需将这三部分都填进去即可。

1. 获取节点属性data

   首先判断`plain`属性是否为`true`，若为`true`则表示节点没有属性，将`data`赋值为`undefined`；如果不为`true`则调用`genData`函数获取节点属性`data`数据。`genData`函数定义如下：

   ```javascript
   export function genData (el: ASTElement, state: CodegenState): string {
     let data = '{'
     const dirs = genDirectives(el, state)
     if (dirs) data += dirs + ','
   
       // key
       if (el.key) {
           data += `key:${el.key},`
       }
       // ref
       if (el.ref) {
           data += `ref:${el.ref},`
       }
       if (el.refInFor) {
           data += `refInFor:true,`
       }
       // pre
       if (el.pre) {
           data += `pre:true,`
       }
       // 篇幅所限，省略其他情况的判断
       data = data.replace(/,$/, '') + '}'
       return data
   }
   ```

   

   我们看到，源码中`genData`虽然很长，但是其逻辑非常简单，就是在拼接字符串，先给`data`赋值为一个`{`，然后判断存在哪些属性数据，就将这些数据拼接到`data`中，最后再加一个`}`，最终得到节点全部属性`data`。

2. 获取子节点列表children

   获取子节点列表`children`其实就是遍历`AST`的`children`属性中的元素，然后根据元素属性的不同生成不同的`VNode`创建函数调用字符串，如下：

   ```javascript
   export function genChildren (el):  {
       if (children.length) {
           return `[${children.map(c => genNode(c, state)).join(',')}]`
       }
   }
   function genNode (node: ASTNode, state: CodegenState): string {
     if (node.type === 1) {
       return genElement(node, state)
     } if (node.type === 3 && node.isComment) {
       return genComment(node)
     } else {
       return genText(node)
     }
   }
   ```

   

3. 上面两步完成之后，生成`_c（）`函数调用字符串，如下：

   ```javascript
   code = `_c('${el.tag}'${
           data ? `,${data}` : '' // data
         }${
           children ? `,${children}` : '' // children
         })`
   ```

   

### 3.2 文本节点

文本型的`VNode`可以调用`_v(text)`函数来创建，所以生成文本节点的`render`函数就是生成一个`_v(text)`函数调用的字符串。`_v()`函数接收文本内容作为参数，如果文本是动态文本，则使用动态文本`AST`节点的`expression`属性，如果是纯静态文本，则使用`text`属性。其生成代码如下：

```javascript
export function genText (text: ASTText | ASTExpression): string {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}
```



### 3.3 注释节点

注释型的`VNode`可以调用`_e(text)`函数来创建，所以生成注释节点的`render`函数就是生成一个`_e(text)`函数调用的字符串。`_e()`函数接收注释内容作为参数，其生成代码如下：

```javascript
export function genComment (comment: ASTText): string {
  return `_e(${JSON.stringify(comment.text)})`
}
```



## 4. 总结

本篇文章介绍了模板编译三大阶段的最后一个阶段——代码生成阶段。

首先，介绍了为什么要有代码生成阶段以及代码生成阶段主要干什么。我们知道了，代码生成其实就是根据模板对应的抽象语法树`AST`生成一个函数供组件挂载时调用，通过调用这个函数就可以得到模板对应的虚拟`DOM`。

接着，我们通过一个简单的模板演示了把模板经过递归遍历最后生成`render`函数的过程。

最后，我们回归源码，通过分析源码了解了生成`render`函数的具体实现过程。

## 五 总结

## 1. 前言

到现在，模板编译的三大阶段就已经全部介绍完毕了，接下来本篇文章，就以宏观角度回顾并梳理一下模板编译整个流程是怎样的。

首先，我们需要搞清楚模板编译的最终目的是什么，它的最终目的就是：把用户所写的模板转化成供`Vue`实例在挂载时可调用的`render`函数。或者你可以这样简单的理解为：模板编译就是一台机器，给它输入模板字符串，它就输出对应的`render`函数。

我们把模板编译的最终目的只要牢记在心以后，那么模板编译中间的所有的变化都是在为达到这个目的而努力。

接下来我们就以宏观角度来梳理一下模板编译的整个流程。

## 2. 整体流程

上文说了，模板编译就是把模板转化成供`Vue`实例在挂载时可调用的`render`函数。那么我们就从`Vue`实例挂载时入手，一步一步从后往前推。我们知道，`Vue`实例在挂载时会调用全局实例方法——`$mount`方法(关于该方法后面会详细介绍)。那么我们就先看一下`$mount`方法，如下：

```javascript
Vue.prototype.$mount = function (el){
  const options = this.$options
  // 如果用户没有手写render函数
  if (!options.render) {
    // 获取模板，先尝试获取内部模板，如果获取不到则获取外部模板
    let template = options.template
    if (template) {

    } else {
      template = getOuterHTML(el)
    }
    const { render, staticRenderFns } = compileToFunctions(template, {
      shouldDecodeNewlines,
      shouldDecodeNewlinesForHref,
      delimiters: options.delimiters,
      comments: options.comments
    }, this)
    options.render = render
    options.staticRenderFns = staticRenderFns
  }
}
```



从上述代码中可以看到，首先从`Vue`实例的属性选项中获取`render`选项，如果没有获取到，说明用户没有手写`render`函数，那么此时，就像上一篇文章中说的，需要`Vue`自己将模板转化成`render`函数。接着获取模板，先尝试获取内部模板，如果获取不到则获取外部模板。最后，调用`compileToFunctions`函数将模板转化成`render`函数，再将`render`函数赋值给`options.render`。

显然，上面代码中的核心部分是调用`compileToFunctions`函数生成`render`函数的部分，如下：

```javascript
const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
```



将模板`template`传给`compileToFunctions`函数就可以得到`render`函数，那这个`compileToFunctions`函数是怎么来的呢？

我们通过代码跳转发现`compileToFunctions`函数的出处如下：

```javascript
const { compile, compileToFunctions } = createCompiler(baseOptions)
```



我们发现，`compileToFunctions`函数是 `createCompiler` 函数的返回值对象中的其中一个，`createCompiler` 函数顾名思义他的作用就是创建一个编译器。那么我们再继续往前推，看看`createCompiler` 函数又是从哪来的。

`createCompiler` 函数出处位于源码的`src/complier/index.js`文件中，如下：

```javascript
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
    optimize(ast, options)
  }
  // 代码生成阶段：将AST转换成渲染函数；
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```



可以看到，`createCompiler`函数是又 调用`createCompilerCreator` 函数返回得到的，`createCompilerCreator` 函数接收一个`baseCompile`函数作为参数。我们仔细看这个`baseCompile`函数，这个函数就是我们所说的模板编译三大阶段的主函数。将这个函数传给`createCompilerCreator` 函数就可以得到`createCompiler`函数，那么我们再往前推，看一下`createCompilerCreator` 函数又是怎么定义的。

`createCompilerCreator` 函数的定义位于源码的`src/complier/create-compiler.js`文件中，如下：

```javascript
export function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {

  }
}
```



可以看到，调用`createCompilerCreator` 函数会返回`createCompiler`函数，同时我们也可以看到`createCompiler`函数的定义，如下：

```javascript
function createCompiler (baseOptions) {
  function compile (){

  }
  return {
    compile,
    compileToFunctions: createCompileToFunctionFn(compile)
  }
}
```



在`createCompiler`函数的内部定义了一个子函数`compile`，同时返回一个对象，其中这个对象的第二个属性就是我们在开头看到的`compileToFunctions`，其值对应的是`createCompileToFunctionFn(compile)`函数的返回值，那么我们再往前推，看看`createCompileToFunctionFn(compile)`函数又是怎么样的。

`createCompileToFunctionFn(compile)`函数的出处位于源码的`src/complier/to-function.js`文件中，如下：

```javascript
export function createCompileToFunctionFn (compile) {
  return function compileToFunctions (){
    // compile
    const res = {}
    const compiled = compile(template, options)
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })
    return res
  }
}

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```



可以看到，调用`createCompileToFunctionFn`函数就可以得到`compileToFunctions`函数了，终于推到头了，原来最开始调用`compileToFunctions`函数是在这里定义的，那么我们就来看一下`compileToFunctions`函数内部都干了些什么。

`compileToFunctions`函数内部会调用传入的`compile`函数，而这个`compile`函数是`createCompiler`函数内部定义的子函数，如下：

```javascript
function compile (template,options) {
  const compiled = baseCompile(template, finalOptions)
  compiled.errors = errors
  compiled.tips = tips
  return compiled
}
```



在`compile`函数内部又会调用传入的`baseCompile`函数，而这个`baseCompile`函数就是我们所说的模板编译三大阶段的主线函数，如下：

```javascript
function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 模板解析阶段：用正则等方式解析 template 模板中的指令、class、style等数据，形成AST
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化阶段：遍历AST，找出其中的静态节点，并打上标记；
    optimize(ast, options)
  }
  // 代码生成阶段：将AST转换成渲染函数；
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
```



那么现在就清晰了，最开始调用的`compileToFunctions`函数内部调用了`compile`函数，在`compile`函数内部又调用了`baseCompile`函数，而`baseCompile`函数返回的是代码生成阶段生成好的`render`函数字符串。所以在`compileToFunctions`函数内部调用`compile`函数就可以拿到生成好的`render`函数字符串，然后在`compileToFunctions`函数内部将`render`函数字符串传给`createFunction`函数从而变成真正的`render`函数返回出去，最后将其赋值给`options.render`。为了便于更好的理解，我们画出了其上述过程的流程图，如下：

![img](https://vue-js.com/learn-vue/assets/img/8.ad277be0.jpg)

以上，就是模板编译的整体流程。