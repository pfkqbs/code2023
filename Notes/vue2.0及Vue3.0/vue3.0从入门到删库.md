[toc]

## 1、Vue3是个啥

### 1.1 什么是 Vue？

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。

*MVVM（Model-View-ViewModel）架构*

- 『View』：视图层（UI 用户界面）
- 『ViewModel』：业务逻辑层（一切 js 可视为业务逻辑）
- 『Model』：数据层（存储数据及对数据的处理如增删改查）



![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9l8MMeoRBrzCZib4pDV88N3meM3URPoe4dpvBGe8FialJQmGySAbcTRdVl2btOVbSAWH8cYhxofFWkA/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



vue3官网地址 https://cn.vuejs.org/



### 1.2 回顾下vue2与vue3

看如下的图 我们发现传统的vue2选项式方式 逻辑比较分散 代码量一旦多起来后可读性差 可维护性差，对比vue3的组合式 逻辑分明 可维护性更高。（！！但是不代表Vue3不能用选项式方式哦）

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9l8MMeoRBrzCZib4pDV88N3m7Gj6bq77jicYY3m52P6qF92hibvbZGvicPYsDpdQ5A4ghb2oghlr8iauXg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



### 1.3 vue3新特性介绍

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9l8MMeoRBrzCZib4pDV88N3mWiaap5sgY6T2Pd6OmQdrkSibicdfzxT2OmtUGSqOSXLeI832HlbB3Nq2w/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



### 1.4  重写双向绑定

- vue2
  - 基于`Object.defineProperty()`实现 
- vue3 基于`Proxyproxy`
  - 与`Object.defineProperty(obj, prop, desc)`方式相比有以下优势：
    - 丢掉麻烦的备份数据
    - 省去for in 循环
    - 可以监听数组变化
    - 代码更简化
    - 性能更高
    - 可以监听动态新增的属性；
    - 可以监听删除的属性 ；
    - 可以监听数组的索引和 length 属性；

```js
 const proxyObj = new Proxy(obj,{
	get : function (target,prop) {
		return prop in target ? target[prop] : 1    
	},    
	set : function (target,prop,value) {
		target[prop] = 'dayu-yyds';
	}
})
```



### 1.5  优化VNode

在Vue2中,每次更新diff,都是全量对比,

Vue3则只对比带有标记的,这样大大减少了非动态内容的对比消耗

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9l8MMeoRBrzCZib4pDV88N3myYUicKKYvwtRq7bqLWOZhdYxj2sViaGtgpiboseiavXIiaGOF6gFF60vJgA/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



### 1.6  patch flag 优化静态树



```html
<span>Hello world!</span>
<span>Hello world!</span>
<span>Hello world!</span>
<span>Hello world!</span>
<span>{{msg}}</span>
<span>Hello world!</span>
<span>Hello world! </span>
```

`Vue3` 编译后的 `Vdom` 是这个样子的



```js
export function render(_ctx，_cache，$props，$setup，$data，$options){
	return (
		_openBlock(),
		_createBlock(_Fragment,null，[
			_createvNode( "span", null,"Hello world ! "),
			_createvNode( "span",null，"Hello world! "),
			_createvNode( "span"，null，"Hello world! "),
			_createvNode( "span", null，"Hello world! "),
			_createVNode("span", null，_toDisplaystring(_ctx.msg)，1/* TEXT */)，
			_createvNode( "span", null，"Hello world! "),
			_createvNode( "span", null，"Hello world! ")
		]，
	64/*STABLE_FRAGMENT */)
)}
```



### 1.7  新增了 patch flag 标记



```html
TEXT = 1 // 动态文本节点
CLASS=1<<1,1 // 2//动态
classSTYLE=1<<2，// 4 //动态style
PROPS=1<<3,// 8 //动态属性，但不包含类名和样式
FULLPR0PS=1<<4,// 16 //具有动态key属性，当key改变时，需要进行完整的diff比较。
HYDRATE_ EVENTS = 1 << 5，// 32 //带有监听事件的节点
STABLE FRAGMENT = 1 << 6, // 64 //一个不会改变子节点顺序的fragment
KEYED_ FRAGMENT = 1 << 7, // 128 //带有key属性的fragment 或部分子字节有key
UNKEYED FRAGMENT = 1<< 8, // 256 //子节点没有key 的fragment
NEED PATCH = 1 << 9, // 512 //一个节点只会进行非props比较
DYNAMIC_SLOTS = 1 << 10 // 1024 // 动态slot
HOISTED = -1 // 静态节点
BALL = -2
```



我们发现创建动态 dom 元素的时候，VDom 除了模拟出来了它的基本信息之外，还给它加了一个标记：1 /* TEXT */ 这个标记就叫做 patch flag（补丁标记）。

patch flag 的强大之处在于，当你的 diff 算法走到 _createBlock 函数的时候，会忽略所有的静态节点，只对有标记的动态节点进行对比，而且在多层的嵌套下依然有效。

尽管 JavaScript 做 Vdom 的对比已经非常的快，但是 patch flag 的出现还是让 Vue3 的 Vdom 的性能得到了很大的提升，尤其是在针对大组件的时候。

### 1.8  Vue3支持 Fragment

vue3 允许我们支持多个根节点

```vue
<template>  
	<div>aa</div>  
	<div>bb</div>
</template>
```



同时支持render JSX 写法

```js
render() {      
	return (          
		<>              
			{this.visable ? (                  
				<div>{this.obj.name}</div>              
			) : (                  
				<div>{this.obj.age}</div>              
			)}              
			<input v-model={this.val}></input>              
			{[1, 2, 3].map((v) => {                 
				return <div>{v}</div>;              
			})}          
		</>      
	);  
}
```



同时新增了多 v-model 用法 ， Suspense， teleport

### 1.9  Vue3 Tree shaking

简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码。

在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到而Vue3源码引入tree shaking特性，将全局 API 进行分块。

如果你不使用其某些功能，它们将不会包含在你的基础包中就是比如你要用watch 就是import {watch} from 'vue' 其他的computed 没用到就不会给你打包减少体积。

### 2.0  Vue 3 Composition Api

Setup 语法糖式编程

例如 ref reactive watch computed toRefs toRaws等会在后续几个章节详解。

## 2、Ref全家桶

### 2.1 ref

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个 `.value` property，指向该内部值。可以设置基本类型也可以设置引用类型。



**案例**

我们这样操作是无法改变视图中的message值，因为message 不是响应式的无法被vue 跟踪



```vue
<template>  
	<div>    
        <button @click="changeMsg">change</button>    
        <div>{{ message }}</div>  
    </div>
</template>  

<script setup>
    let message = "我是message" 
    const changeMsg = () => {   
        message = "change msg了" //视图不会变化
    }
</script>
```



改为 ref 定义

```vue
<template>  
	<div>    
    	<button @click="changeMsg">change</button>    
    	<div>{{ message }}</div>  
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    let message = ref("我是message") 
    const changeMsg = () => {   
        message.value = "change msg了" //视图会变化
	}
</script>
```



### 2.2 isRef

判断是不是一个ref对象

```vue
<script setup>
    import { ref,isRef } from 'vue'
    let message = ref("我是message")
    
    let notRef = 123
    console.log(isRef(message)); //true
    console.log(isRef(notRef)); //false
</script>
```

### 2.3  ref 小妙招

控制台更好的展示ref打印数据，我们可以在谷歌浏览器这么设置下

没设置前打印ref值：
![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kYLp3jA4oglh5dFL2X6kdYszLGez0u6F48ic5YAssSPAvVDeUf9h7EFgmNw6OFvguj4OZksbTP7lQ/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kYLp3jA4oglh5dFL2X6kdYurTZqxicXaR4RP62Gvfm6cmiaBjDIicPnlBoPABibkVTWWBnU3ZDapNhpg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kYLp3jA4oglh5dFL2X6kdYUO1iaWoVbPqoI6ZicckfULgeOicYiaOrzQLmiamYMqy98SFSx8YdNicOBgvQ/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

设置后：

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kYLp3jA4oglh5dFL2X6kdY0wURpib2JwjEmvYCsGXwBcicsEUfYq4ViaopncK9W9MGXiagUawmL35ftw/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



### 2.4  shallowRef

创建一个跟踪自身 `.value` 变化的 ref，但不会使其值也变成响应式的

**例子**

修改其属性是非响应式的这样是不会改变的



```vue
<template>  
	<div>    
    	<button @click="changeMsg">change</button>    
    	<div>{{ message }}</div>  
    </div>
</template>  

<script setup>
    import { shallowRef } from 'vue'
	let message = shallowRef({  name: "小鱼"}) 
    
	const changeMsg = () => {  
   	 message.value.name = '大鱼'
	}
</script>
```



例子2

这样是可以被监听到的修改value

```js
import { shallowRef } from 'vue'
let message = shallowRef({  name: "小鱼"}) 

const changeMsg = () => {  
	message.value = { name: "大鱼" }
}
```



### 2.5  triggerRef 

强制更新页面DOM

这样也是可以改变值的

```vue
<template>  
	<div>    
		<button @click="changeMsg">change</button>    
		<div>{{ message }}</div>  
	</div>
</template> 

<script setup>
	import { shallowRef,triggerRef } from 'vue'
	let message = shallowRef({  name: "大鱼"}) 
    
	const changeMsg = () => {  
		message.value.name = '大大鱼'  
		triggerRef(message)
	}
</script> 
```



### 2.6  customRef

自定义ref 

customRef是个工厂函数要求我们返回一个对象并且实现get和set适合去做防抖之类的，项目中很少会用到

```vue
<template>   
	<div ref="div">小鱼Ref</div>  
	<hr>  
	<div>{{ name }} </div>  
	<hr>  
	<button @click="change">修改 customRef</button> 
</template> 

<script setup>
import { ref, reactive, onMounted, shallowRef, customRef } from 'vue' 
	function myRef(value) {  
		let timer;  
		return customRef((track, trigger) => {    
			return {      
				get() {        
					track()        
					return value      
				},      
				set(newVal) {        
					clearTimeout(timer)        
					timer =  setTimeout(() => {          
						console.log('触发了set')          
                    	value = newVal          
						trigger()        
					},500)      
				}    
			}  
		})
    }  
const name = myRef('小鱼')  
const change = () => {  name.value = '大鱼'}
</script>
```

## 3、Reactive全家桶

### 3.1  reactive

用来绑定复杂的数据类型 例如 对象 数组

`reactive`	 源码约束了我们的类型

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kXMHxNZpHMZKg93MicYLjyN7CO1ENLmVovtASdk6fKEG0x21y7vAW0YibYno11682LVJKict49c5vBg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

他是不可以绑定普通的数据类型，这样是不允许 会给我们报错

```js
import { reactive} from 'vue' 
let person = reactive('Hello World!')
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9kXMHxNZpHMZKg93MicYLjyNgaIC89oEpriaxX6uJmyXTxnuvczsSYe6tSsXDnvkmqLiajTaSHVzgXcg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

绑定普通的数据类型 我们可以 使用上一篇讲到 **ref**

你如果用 ref 去绑定对象 或者 数组 等复杂的数据类型 我们看源码里面其实也是 去调用 reactive

使用reactive 去修改值无须.value



reactive 基础用法

```js
import { reactive } from 'vue'
let person = reactive({   name:"小鱼"})

person.name = "大鱼"
```



数组异步赋值问题

这样赋值页面是不会变化的因为会脱离响应式

```js
let person = reactive([])
setTimeout(() => {  
	person = [1, 2, 3]  
	console.log(person);  
},1000)
```



**解决方案1**

使用push



```js
import { reactive } from 'vue'
let person = reactive([])
setTimeout(() => {  
    const arr = [1, 2, 3]  
    person.push(...arr)  
    console.log(person);  
},1000)
```

**
**

**解决方案2**

包裹一层对象

```js
let person = reactive({ list:[]})
setTimeout(() => {  
	const arr = [1, 2, 3]  
	person.list = arr;  
	console.log(person);  
},1000)
```



### 3.2 readonly

拷贝一份proxy对象将其设置为只读

```js
import { reactive, readonly } from 'vue'
const person = reactive({count:1})
const copy = readonly(person)  

//person.count++  
copy.count++
```



### 3.3  shallowReactive 

只能对浅层的数据 如果是深层的数据只会改变值 不会改变视图

案例

```vue
<template>  
	<div>    
    	<div>{{ state }}</div>    
    	<button @click="change1">test1</button>    
    	<button @click="change2">test2</button>  
    </div>
</template> 

<script setup>
    import { shallowReactive } from 'vue' 
    const obj = {  
        a: 1,  
        first: {    
            b: 2,    
            second: {      
                c: 3    
            }  
        }} 
    const state = shallowReactive(obj) 
    //可以
    function change1() { 
        state.a = 7
    }
    //不可以
    function change2() {  
        state.first.b = 8  
        state.first.second.c = 9  
        console.log(state);
    }
</script> 
```

##  4、认识to系列

### 4.1  `toRef toRefs toRaw`

**toRef**

如果原始对象是非响应式的就不会更新视图 数据是会变的



```vue
<template>   
	<div>      
   	 	<button @click="change">按钮</button>      
    	{{state}}   
    </div>
</template> 
<script setup>
    import { reactive, toRef } from 'vue' 
    const obj = {   
        foo: 1,   
        bar: 1
    }  
    const state = toRef(obj, 'bar')// bar 转化为响应式对象 
    const change = () => {   
        state.value++   
        console.log(obj, state); 
    }
</script>
```



如果原始对象是响应式的是会更新视图并且改变数据的



**toRefs**

可以帮我们批量创建ref对象主要是方便我们解构使用



```js
import { reactive, toRefs } from 'vue'
const obj = reactive({   foo: 1,   bar: 1}) 
let { foo, bar } = toRefs(obj) 

foo.value++
console.log(foo, bar);
```



**toRaw**

将响应式对象转化为普通对象



```js
import { reactive, toRaw } from 'vue' 

const obj = reactive({   foo: 1,   bar: 1})  

const state = toRaw(obj)// 响应式对象转化为普通对象 

const change = () => {    
    console.log(obj, state); 
}
```

## 5、认识computed，watch和watchEffect

### 5.1、computed用法

计算属性就是当依赖的属性的值发生变化的时候，才会触发他的更改，如果依赖的值不发生变化，使用的是缓存中的属性值。

#### 5.1.1  函数形式

```js
import { computed, ref } from 'vue'
let price = ref(0) 

let mPrice = computed(()=> `$` + price.value )  //随price的变化而变化
price.value = 500
```

#### 5.1.2 对象形式

```vue
<template>   
	<div>{{ mPrice }}</div>   
	<div @click="mPrice = 200">click</div>
</template> 

<script setup>
    import { computed, ref } from 'vue'
    let price = ref(1)
    let mPrice = computed({   
        get() => {      
        	return price.value   
    	},   
        set(value) => {      
        	price.value = 'set' + value   
   	 	}
    })
</script>
```

#### 5.1.3 **说明：**

Getter 不应有副作用：

*计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，不要在 getter 中做异步请求或者更改 DOM！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用监听器根据其他响应式状态的变更来创建副作用。*



避免直接修改计算属性值：

*从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。*





### 5.2  watch用法

watch 需要侦听特定的数据源，并在单独的回调函数中执行副作用

watch第一个参数监听源，

第二个参数回调函数cb（newVal,oldVal），

第三个参数一个options配置项是一个对象

{

  immediate:true //是否立即调用一次

  deep:true //是否开启深度监听

}



监听Ref 案例



```js
import { ref, watch } from 'vue' 
let message = ref({    
	nav:{        
		bar:{            
			name: ''        
		}    
	}
})  
watch(message, (newVal, oldVal) => {    
	console.log('新的值----', newVal);    
	console.log('旧的值----', oldVal);
},{    
	immediate:true,    
	deep:true
})
```



当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值：



```js
import { ref, watch } from 'vue' 

let m1= ref('')
let m2= ref('') 

watch([m1, m2], ([m1New, m2New], [preM1, preM2]) => {    

})
```



监听Reactive (使用reactive监听深层对象开启和不开启deep 效果一样)



```js
import { watch ,reactive} from 'vue' 
let message = reactive({    
    nav:{        
        bar:{            
            name: ''        
        }    
    }})  
watch(message, (newVal, oldVal) => {    
    console.log('新的值----', newVal);    
    console.log('旧的值----', oldVal);
})
```



监听reactive 单一值



```js
import { watch ,reactive} from 'vue' 
let message = reactive({    
    name: '',    
    name2: ''
})  

watch(()=>message.name, (newVal, oldVal) => {    
    console.log('新的值----', newVal);    
    console.log('旧的值----', oldVal);
})
```



### 5.3 watchEffect用法

立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

如果用到message 就只会监听message 就是用到几个监听几个 而且是非惰性 会默认调用一次



```js
let message = ref('')
let message2 = ref('') 

watchEffect(() => {    
    console.log('message2', message2.value);
})
```



### 5.4 清除副作用

就是在触发监听之前会调用一个函数可以处理你的逻辑



```js
import { watchEffect, ref } from 'vue'

let message = ref('')
let message2 = ref('') 

watchEffect((oninvalidate) => {    
    // 未完成处理    
    oninvalidate(()=>{            })    
    console.log('message2', message2.value);
})
```



**停止跟踪 watchEffect 返回一个函数 调用之后将停止更新**



```js
const stop =  watchEffect((oninvalidate) => {    
	oninvalidate(()=>{})    
	console.log('message2', message2.value);
})

stop();
```



副作用刷新时机 flush 一般使用post，表示组件更新后执行。还有pre表示组件更新前执行，sync表示强制效果始终同步触发。

**onTrigger 可以帮助我们调试 watchEffect，一般很少用到**



```js
watchEffect(() => {}, {  
    flush: 'post',  
    onTrack(e) {    
        debugger  
    },  
    onTrigger(e) {    
       debugger  
    }
})
```

## 6、组合式写法父子组件通信

父组件通过属性绑定一个数据传递给子组件，然后子组件通过 **defineProps()** 宏来声明父组件传过来的值。

如以下代码，给Menu组件 传递了一个title 字符串类型



```vue
<template>    
	<div class="layout">        
		<Menu title="我是标题"></Menu>        
		<div class="layout-right">            
		<Header></Header>            
		<Content></Content>        
		</div>    
	</div>
</template>
```

传递变量需要加v-bind 简写冒号（:）

```vue
<template>    
	<div class="layout">        
    	<Menu :data="data"  title="我是标题"></Menu>        
    	<div class="layout-right">            
        	<Header></Header>            
        	<Content></Content>        
    	</div>    
	</div>
</template> 
<script setup>
    import Menu from './Menu/index.vue'
    import Header from './Header/index.vue'
    import Content from './Content/index.vue'
    import { reactive } from 'vue'; 
    const data = reactive([1, 2, 3])
</script>
```



子组件接受值

**defineProps是无须引入的直接使用即可**



```js
defineProps({    
    title:{      
        type: String      
        default: '',            
    },    
    data: {      
        type: Array,      
        default: ()=> []      // 这边还可以配置其他参考vue文档    
    }
})
```



子组件给父组件传参是通过 **defineEmits** 派发一个事件

```vue
<template>    
	<div class="menu">        
    	<button @click="clickTap">派发给父组件</button>    
    </div>
</template> 

<script setup>
    
	import { reactive } from 'vue'
	const list = reactive([1, 2, 3]) 
	const emit = defineEmits(['on-click'])
    
	const clickTap = () => {    
		emit('on-click', list)
	}
</script>
```



我们在子组件绑定了一个click 事件 然后通过 **defineEmits** 注册了一个自定义事件

点击click 触发 emit 去调用我们注册的事件 然后传递参数

父组件接受子组件的事件

```vue
<template>    
	<div class="layout">        
    	<Menu @on-click="getList"></Menu>        
    	<div class="layout-right">            
    		<Header></Header>            
    		<Content></Content>        
    	</div>    
    </div>
</template> 
<script setup>
    import Menu from './Menu/index.vue'
    import Header from './Header/index.vue'
    import Content from './Content/index.vue'
    import { reactive } from 'vue'; 
    const data = reactive([1, 2, 3]) 
    const getList = list => {    
        console.log(list, '父组件接受子组件');
    }
</script>
```



我们从Menu 组件接受子组件派发的事件on-click 后面是我们自己定义的函数名称getList会把参数返回过来。



*知识点：父组件传递给子组件的属性值也可以是一个函数，所以也可以使用类似react的方式传递给子组件一个函数，子组件触发该函数并带上参数的方式进行父子之间的事件通信。不过在vue中一般推荐emit的写法。*



子组件暴露给父组件内部属性通过 **defineExpose**

我们从父组件获取子组件实例通过 **ref**

```vue
<Menu ref="menus"></Menu> 

const menus = ref(null)
```



然后打印 menus.value 发现没有任何属性

这时候父组件想要读到子组件的属性可以通过 **defineExpose** 暴露

```js
const list = reactive([1, 2, 3]) 

defineExpose({ list })
```



这样父组件就可以取到值了

```vue
<template>  
<Menu ref="menus"></Menu>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    const menus = ref(null)
	onMounted(() => {  
    	if (menus.value) {    
       	 	console.log(menus.value.list) //能获取到子组件暴露的值  
    	}
<script>
```

## 7、slot插槽

插槽就是子组件中提供给父组件使用的一个占位符，用`<slot></slot>` 表示，父组件可以在这个占位符中填充任何模板代码，如 文本、HTML、组件等，填充的内容会替换子组件的`<slot></slot>`标签。

### 7.1  匿名插槽

在子组件放置一个插槽

```vue
<template>    
	<div>       
        <slot></slot>    
    </div>
</template>
```



父组件使用插槽

在父组件给这个插槽填充内容

```vue
<Layout>    
	<template v-slot>        
		<div>abc</div>    
	</template>
</Layout>
```



### 7.2  具名插槽

具名插槽其实就是给插槽取个名字。一个子组件可以放多个插槽，而且可以放在不同的地方，而父组件填充内容时，可以根据这个名字把内容填充到对应插槽中

```vue
<div>    
	<div>子组件==</div>    
	<slot name="header"></slot>        
	<slot></slot>     
	<slot name="footer"></slot>
</div>
```



父组件使用需对应名称

```vue
<Layout>    
	<template v-slot:header>       
		<div>1</div>   
	</template>  

	<template v-slot>       
		<div>2</div>   
	</template>  

	<template v-slot:footer>       
		<div>3</div>   
	</template>
</Layout>
```



 插槽简写用 # 代替 

```vue
<Layout>    
	<template #header>       
		<div>1</div>   
	</template>   
	<template #default>       
		<div>2</div>   
	</template>   
	<template #footer>       
		<div>3</div>   
	</template>
</Layout>
```



### 7.3 作用域插槽

在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

```vue
<div>      
  	<slot name="header"></slot> 
    
	<div>          
		<div v-for="item in 10">              
  			<slot :data="item"></slot>          
		</div>      
  	</div>  
    
  	<slot name="footer"></slot>  
</div>
```



父组件可以通过解构方式取值

```vue
 <Layout>    
 	<template #header>        
 		<div>1</div>    
 	</template>   
    
 	<template #default="{ data }">        
 		<div>{{ data }}</div>    
 	</template>   
    
 	<template #footer>        
 		<div>3</div>    
 	</template>
 </Layout>
```



### 7.4  动态插槽

插槽可以是一个变量名

```vue
<Layout>      
	<template #[name]>          
		<div>23</div>      
    </template>  
</Layout>
```

```js
const name = ref('header')
```



## 8、 依赖注入Provide & Inject

**Prop 跨组件传递问题**

通常情况下，当我们需要从父组件向子组件传递数据时，会使用 `props`。

想象一下这样的结构：有一些多层级嵌套的组件，形成了一颗巨大的组件树，而某个深层的子组件需要一个较远的祖先组件中的部分数据。在这种情况下，如果仅使用 `props` 则必须将其沿着组件链逐级传递下去，这会很麻烦

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9nFkekRP7vY3t0HWUYAu0tc8wpiaQUEcUOf6UjAWTqNvtC5rHltcDRYXU0BBVsGZsrgD6ibz1qNYEbg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

虽然这里的 `<Footer>` 组件可能根本不关心这些 `props`，但为了使 DeepChild组件 能访问到它们，仍然需要定义并向下传递。如果组件链路非常长，可能会影响到更多这条路上的组件。这一问题被称为“prop 逐级透传”，显然是我们希望尽量避免的情况。

**provide** 可以在祖先组件中指定我们想要提供给后代组件的数据或方法，而在任何后代组件中，我们都可以使用 inject 来接收 `provide` 提供的数据或方法。

![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9nFkekRP7vY3t0HWUYAu0tcJytTjlMJTdo4WF1FjARUeO4ss2c8B9HwBAIzw1T9R0FiamveeYne0Cw/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)



**Provide (提供数据)**

要为组件后代提供数据，需要使用到 provide() 函数：



```js
<script setup>
    import { provide } from 'vue'
	provide('count',  10)
</script>
```



provide() 函数接收两个参数。第一个参数被称为注入名，可以是一个字符串或是一个 Symbol。后代组件会用注入名来查找期望注入的值。一个组件可以多次调用 provide()，使用不同的注入名，注入不同的依赖值。

第二个参数是提供的值，值可以是任意类型，包括响应式的状态，比如一个 ref：

```js
import { ref, provide } from 'vue'

const count = ref(10)
provide('count', count)
```



**应用层 Provide**

除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide('count',  10)
```



在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写插件时会特别有用，因为插件一般都不会使用组件形式来提供值。



**Inject (注入\**Provide提供的数据\**)**

要获取上层组件提供的数据，需使用 inject() 函数：

```js
<script setup>
    import { inject } from 'vue'
	const count = inject('count')//也可以提供默认值,当上层组件没提供 count属性时// 
    const count = inject('count', 0)
</script>
```



如果提供的值是一个 ref，注入进来的会是该 ref 对象，而不会自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

**
**

**响应式数据配合使用**

当注入响应式的数据时，尽可能将对响应式状态的变更保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都在同一个组件内，使其更容易维护。

我们可能需要在注入方组件中更改数据。在这种情况下，在供给方组件内声明并提供一个更改数据的方法函数：



```js
<script setup>
    import { provide, ref } from 'vue'
	const count= ref(1)
	const setCount = (val) => {  count.value = val}
	provide('pCount', {  count,  setCount})
</script>
```



```vue
<script setup>
	import { inject } from 'vue'
	const { count, setCount} = inject('pCount')
    
    const changeCount = ()=> {  
        setCount(count.value++)
    }
</script>

<template>  
    <button @click="changeCount ">{{ count}}</button>
</template>
```

## 9、深入v-model


![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9khe9YEScia0mGst47s9k4oLehyuORwXrJ8ias15ZyP1Ys1Mx09kZegiaCVBAia6yHIrEElZknIM6dmbw/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

v-model 其实是一个语法糖 通过props 和 emit组合而成的，在我们日常的项目中用到的频率很高。



**表单值绑定**

这块的话我就拿输入框举个例子，不详细说了，具体可以看官方文档的表单输入绑定章节。**
**

如何让输入框的值和javascript中的变量绑定，我们可以这样写



```vue
<input  
       :value="inputVal"  
       @input="event => inputVal = event.target.value"/>
<div>
    this is: {{ inputVal }}
</div>
```

但是这样写的话有点麻烦。我们就可以用v-model语法糖来简化代码

```vue
<input v-model="inputVal"/>
<div>this is: {{ inputVal }}</div>
```

v-model可以和所有的原生表单类型控件的值绑定



**自定义组件的v-model**

v-model其实在vue2和vue3中的用法是不太一样的

- prop：`value` -> `modelValue`；
- 事件：`input` -> `update:modelValue`；
- `v-bind` 的 `.sync` 修饰符和组件的 `model` 选项已移除
- 新增 支持多个v-model
- 新增 支持自定义 修饰符 Modifiers

举个弹框🌰

子组件代码



```vue
<template>     
	<div v-if='propData.modelValue ' class="dialog">         
        <div class="dialog-header">             
            <div>标题</div><div @click="close">x</div>         
    </div>         
        <div class="dialog-content">            内容         </div>              
    </div>
</template> 

<script setup> 
    const propData = defineProps(['modelValue']) 
    const emit = defineEmits(['update:modelValue']) 
    const close = () => {     
        emit('update:modelValue',false)
    }
</script> 

<style lang='less'>
    .dialog{    
        width: 300px;    
        height: 300px;    
        border: 1px solid #DDD;    
        position: fixed;    
        left:50%;    
        top:50%;    
        transform: translate(-50%, -50%);    
        &-header{        
            border-bottom: 1px solid #DDD;        
            display: flex;        
            justify-content: space-between;        
            padding: 10px;    
        }    
        &-content{        
            padding: 10px;    
        }}
</style>
```



父组件代码



```vue
<template>  
	<button @click="showDialog =! showDialog">开关{{show}}</button>  
	<Dialog v-model="showDialog"></Dialog>
</template> 

<script setup>
    import Dialog from "./Dialog/index.vue";
    import { ref } from 'vue'
    const showDialog = ref(false)
</script>
```



绑定多个v-model案例

子组件代码



```vue
<template>     
	<div v-if='modelValue ' class="dialog">         
    	<div class="dialog-header">             
        	<div>标题---{{title}}</div><div @click="close">x</div>         
    	</div>         
    	<div class="dialog-content">            内容         </div>              
    </div>
</template> 

<script setup>
    const emit = defineEmits(['update:modelValue','update:title'])
    
    const close = () => {     
        emit('update:modelValue', false)     
        emit('update:title', '我是title要变了')}
</script> 
<style lang='less'>
    .dialog{    
        width: 300px;    
        height: 300px;    
        border: 1px solid #DDD;    
        position: fixed;    
        left:50%;    
        top:50%;    
        transform: translate(-50%,-50%);    
        &-header{        
            border-bottom: 1px solid #DDD;        
            display: flex;        
            justify-content: space-between;        
            padding: 10px;    }    
        &-content{        
            padding: 10px;    
        }
    }
</style>
```



父组件代码

```
<template>  <button @click="showDialog =! showDialog">    开关{{showDialog}} ----- {{title}}  </button>  <Dialog v-model:title='title' v-model="showDialog"></Dialog></template> <script setup lang='ts'>import Dialog from "./Dialog/index.vue";import { ref } from 'vue'const showDialog = ref(false)const title = ref('我是标题')</script>
```



**自定义修饰符**

添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件。在下面的示例中，创建了一个组件，其中包含默认为空对象的 modelModifiers prop

```vue
<script setup>
    const propData = defineProps(['modelValue', 'title', 'modelModifiers', 'titleModifiers']) 
    
    const emit = defineEmits(['update:modelValue', 'update:title']) 
    
    const close = () => {    
        console.log(propData.modelModifiers);     
        emit('update:modelValue', false)    
        emit('update:title', '我是title变了')
    }
    
</script>
```

## 10、directive自定义指令

directive在vue3和vue2中存在不少差异，属于破坏性更新。

**介绍**

除了Vue自带的一系列指令，像v-if，v-for等之外，Vue也支持我们开发自定义指令（Custom Directives）。

一个自定义指令由一个包含类似组件生命周期的对象来定义。钩子函数会接受它所绑定的元素和传递的一些其他参数。

**指令钩子函数**

- created 元素初始化的时候
- beforeMount 指令绑定到元素后调用 只调用一次
- mounted 元素插入父级dom调用
- beforeUpdate 元素被更新之前调用
- update 这个周期方法被移除 改用updated
- beforeUnmount 在元素被移除前调用
- unmounted 指令被移除后调用 只调用一次

*vue2的钩子函数bind inserted update componentUpdated unbind*

### 10.1  **在setup内定义局部指令**

但这里有一个需要注意的限制：必须以 vNameOfDirective 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。



```vue
<template>  
	<button @click="show = !show">开关{{show}} - {{title}}</button>  
	<Dialog  v-move-directive="{background:'green',flag:show}"></Dialog>
</template>
```



```js
const vMoveDirective = {  
created: () => {    
    console.log("初始化");  },  
    beforeMount(...args) {    // 在元素上做些操作    
        console.log("初始化一次");  
    },  
    mounted(el, dir) {    
        el.style.background = dir.value.background;    
        console.log("初始化");  
    },  
    beforeUpdate() {    
            console.log("更新之前");  
    },  
    updated() {    
        console.log("更新结束");  
    },  
    beforeUnmount(...args) {    
          console.log(args);    
        console.log("卸载之前");  
    },  
    unmounted(...args) {    
        console.log(args);    
        console.log("卸载完成");  
    },
};
```



**生命周期钩子参数详解**

第一个 el 当前绑定的DOM 元素

第二个 binding

- instance：使用指令的组件实例。
- value：传递给指令的值。例如，在 v-my-directive="1 + 2" 中，该值为 3。
- oldValue：先前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否有更改都可用。
- arg：传递给指令的参数(如果有的话)。例如在 v-my-directive:foo 中，arg 为 "foo"。
- modifiers：包含修饰符(如果有的话) 的对象。例如在 v-my-directive.foo.bar 中，修饰符对象为 {foo: true，bar: true}。
- dir：一个对象，在注册指令时作为参数传递。例如，在以下指令中



![图片](https://mmbiz.qpic.cn/mmbiz_png/KaniaSHbNr9nDWGibenQ72YDkGjBf3lpuyiasDRtGQXGNfbvyZxicw7Z7k39NCaFwB5apFSpZoeicZ4lq92v0Fm6L0A/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1)

第三个 当前元素的虚拟DOM 也就是Vnode

第四个 prevNode 上一个虚拟节点，仅在 `beforeUpdate` 和 `updated` 钩子中可用 

**
**

**指令函数简写
**

你可能想在 `mounted` 和 `updated` 时触发相同行为，而不关心其他的钩子函数。那么你可以通过将这个函数模式实现

```vue
<template>   
	<div>      
    	<input v-model="value" />      
    	<A v-move="{ background: value }"></A>   
    </div>
</template>

<script setup>
    import A from './components/A.vue'
    import { ref } from 'vue'
    let value = ref('')
    
	const vMove = (el, {value}) => {   
    	el.style.background = value.background
    }
</script>


<style></style>
```



**案例权限按钮**

```vue
<template>   
	<div class="btns">       
    	<button v-has-show="'shop:create'">创建</button>        
   		 <button v-has-show="'shop:edit'">编辑</button>        
    	<button v-has-show="'shop:delete'">删除</button>   
    </div>
</template> 

<script setup>
    import { ref, reactive } from 'vue'
    
	//permission
    localStorage.setItem('userId','dayu') 
    
    //mock后台返回的数据
    const permission = [    
        'dayu:shop:edit',    
        'dayu:shop:create',    
        'dayu:shop:delete'
    ]
    const userId = localStorage.getItem('userId')
    const vHasShow = (el,bingding) => {   
    	if(!permission.includes(userId+':'+ bingding.value)){       
    	el.style.display = 'none'   
        }
    }
</script> 

<style scoped lang='less'>
    .btns{    
    	button{        
    		margin: 10px;    
        }
    }
</style>
```

## 11、自定义hooks

vue3的自定义hooks主要用来处理复用代码逻辑的一些封装。

在vue2中我们可以通过混入（mixins），将这些多个相同的逻辑抽离出来，各个组件只需要引入mixins，就能实现一次写代码，多组件受益的效果。

**mixins的弊端也很明显**

第一点：组件的data、methods、filters等会覆盖mixins里的同名data、methods、filters。

第二点：变量和方法来源不明确（隐式传入），不利于阅读，使代码变得难以维护。

第三点：命名空间冲突，多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。



Vue3 的自定义hook的功能可以替换原来的mixins，帮助我们提高代码的复用性和可维护性, 让我们能在不同的组件中利用 hooks 函数封装功能。



**案例**

定义一个hook函数获取鼠标的坐标，命名一般为useXXX并导出。



```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {  
    
	// 被组合式函数封装和管理的状态  
	const x = ref(0)  
	const y = ref(0)

	// 组合式函数可以随时更改其状态。  
	function update(event) {    
		x.value = event.pageX    
	y.value = event.pageY  
	}
    
      // 一个组合式函数也可以挂靠在所属组件的生命周期上  
      // 来启动和卸载副作用
 	onMounted(() => window.addEventListener('mousemove', update))  
 	onUnmounted(() => window.removeEventListener('mousemove', update))
    
  	// 通过返回值暴露所管理的状态  
  	return { x, y }
}
```





在组件中使用该hook

```js
<script setup>import { useMouse } from './mouse.js'
const { x, y } = useMouse()</script>
<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

## 12、定义全局变量

由于Vue3 没有Prototype 属性 使用 app.config.globalProperties 代替。

如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级。



### 12.1**vue2定义方式**

```js
// 之前 (Vue 2.x)
Vue.prototype.$http = () => {};
Vue.prototype.$msg = 'abc';
```

### 12.2  **vue3定义方式**

```js
// 之后 (Vue 3.x)
const app = createApp({});
app.config.globalProperties.$http = () => {};
app.config.globalProperties.$msg = 'abc';
```



### 12.3  **在选项式vue3中使用**

```js
export default {  
	mounted() {    
		console.log(this.$msg); // 'abc'    
		this.$http();  
	}
}
```



### 12.4  **在组合式vue3中使用**

```js
import { getCurrentInstance } from 'vue';

//第一种方式
const { appContext } = getCurrentInstance();
const msg = appContext.config.globalProperties.$msg;
const httpFn = appContext.config.globalProperties.$http;

//第二种方式
const app = getCurrentInstance();
const msg = app?.proxy?.$msg;
const httpFn = app?.proxy?.$http;
```



不过也可以使用依赖注入的方式存储和获取全局变量

首先在入口文件

```js
const app = createApp(App) 

// 配置全局变量 页面中使用 inject 接收

app.provide('global',{
	store,
	axios}) 
app.mount('#app')
```



在需要接受的页面使用 inject 接受



```js
<script lang="ts" setup>
	import { inject } from 'vue'; 
	// 获取全局对象`
	const global = inject('global')
	global.axios(). 
</script>
```

## 13、自定义插件(Plugins）

插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码。

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

- 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。
- 通过 app.provide() 使一个资源可被注入进整个应用。
- 向 app.config.globalProperties 中添加一些全局实例属性或方法
- 一个可能上述三种都包含了的功能库 (例如 vue-router)。



插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。安装函数会接收到安装它的应用实例和传递给 app.use() 的额外选项作为参数：

```js
const plugin = {  install(app, options) {  }}
```



在使用 createApp() 初始化 Vue 应用程序后，你可以通过调用 use() 方法将插件添加到你的应用程序中。

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, { //额外参数})
```



### 13.1  **实现一个loading插件**

Loading.Vue



```vue
<template>    
	<div v-if="isShow" class="loading">        
    	<div class="loading-content">Loading...</div>    
    </div>
</template>   

<script setup>
    import { ref } from 'vue';
    const isShow = ref(false)//定位loading 的开关 
    const show = () => {    
        isShow.value = true}
    const hide = () => {    
        isShow.value = false}//对外暴露 当前组件的属性和方法
    defineExpose({    
        isShow,    
        show,    
        hide})
</script>  

<style scoped lang="less">
    .loading {    
        position: fixed;    
        inset: 0;   
        background: rgba(0, 0, 0, 0.8);    
        display: flex;    
        justify-content: center;    
        align-items: center;    
    	&-content {        
    		font-size: 30px;        
    		color: #fff;    
        }
    }
</style>
```



Loading.js

```js
import {  createVNode, render, VNode, App } from 'vue';
import Loading from './index.vue' 

export default {    
    install(app: App) {   
        
        //createVNode vue提供的底层方法 可以给我们组件创建一个虚拟DOM 也就是Vnode        
        const vnode = createVNode(Loading)        
        
        //render 把我们的Vnode 生成真实DOM 并且挂载到指定节点        
        render(vnode, document.body)        
        
        // Vue 提供的全局配置 可以自定义        
        app.config.globalProperties.$loading = {            
            show: () => vnode.component?.exposed?.show(),            
            hide: () => vnode.component?.exposed?.hide()        
        }     
    }
}
```



main.js

```js
import Loading from './components/loading' 
let app = createApp(App) 

app.use(Loading)   
app.mount('#app')
```



使用方法

```vue
<template>   
	<div></div> 
</template> 

<script setup >
    import { ref,reactive,getCurrentInstance} from 'vue'
    const  instance = getCurrentInstance() 
    instance?.proxy?.$Loading.show()
	setTimeout(()=>{  
        instance?.proxy?.$Loading.hide()
    },5000)
</script>
```