[TOC]




# vue3.0

# `TypeScript`

### ts变量声明

#### 0：语法： 

变量声明语法：冒号 : 前面是变量名称，后面是变量类型。

#### 1:布尔类型: true / false 值：

```
const registered: boolean = false
const done: boolean = Boolean(0)
```

#### 2:数字类型：

```js
let decLiteral: number = 6
let goldenSection: number = 0.618
let hexLiteral: number = 0xf00d
let binaryLiteral: number = 0b1010
let octalLiteral: number = 0o744
let notANumber: number = NaN
```

#### 3:字符串类型  

```js
let protagonist: string = "js大师"
let partner: string = 'js小学生'

let protagonist2: string = 'Sherlock'
let sentence: string = `华生是${protagonist2}的朋友、助手和室友。`
```

#### 4:void类型

 当一个函数没有返回值时，可以将其返回值类型定义为 void

```js
function doNothing(): void {
    let a  = 10
  }
```

 声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null

声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null

```
let nothing: void = undefined
```

#### 5：null 类型和 undefined 类型

 一般项目是默认开启 --strictNullChecks 检测的，如果你将 tsconfig.json 中 strictNullChecks 选项设置为 false，下面这种操作不会报错，不过尽量不要这么做：

```
let num: number = undefined
let list: number[] = undefined
let name1: string = undefined
```

####   6：数组类型

第一种在元素类型后接上 []

```
let list2: number[] = [1, 2, 3]
let names: string[] = ['Sherlock', 'Watson', 'Mrs. Hudson']
```

另一种方式是使用数组泛型（泛型后续会单独介绍），Array<元素类型>

```
let list3: Array<number> = [1, 2, 3]
let names2: Array<string> = ['Sherlock', 'Watson', 'Mrs. Hudson']
```

混合各种元素类型

```
let list4: any[] = ['Sherlock', 1887]
```

####  7:any类型

有时候接收来自用户的输入，我们是不能确定其变量类型的。这种情况下，我们不希望类型检查器对这些值进行检查，而是直接让它们通过编译阶段的检查，此时可以使用 any：

```
let input: any = 'nothing'

input = 0                   // ok
input = true                // ok
input = []                  // ok
input = null                // ok
input = Symbol('any')       // ok
```

如果一个数据是 any 类型，那么可以访问它的任意属性，即使这个属性不存在：

```
let anything: any = 10

anything.eat()              // ok
anything.name               // ok
anything[0]                 // ok
new anything()              // ok
anything()                  // ok
```

从上面的例子中可以看到，any 类型几乎可以做任何操作，这样很容易编写类型正确但是执行异常的代码。我们使用 TypeScript 就是为了代码的健壮性，所以要尽量减少 any 的使用。

#### 8：object类型

object 表示非原始类型(non-primitive type)：

```
let obj: object
```

枚举类型

```
enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}

obj = TokenType
obj = [1, 2, 3]
obj = [1, 'string'] // 元组类型
obj = { a: 1 }
```

可以看到枚举、数组、元组和普通对象都是 object 类型。

可以看到枚举、数组、元组和普通对象都是 object 类型。

#### 9： 容易混淆的点

TypeScript 中描述类型要用 小写，比如 boolean、number、string等；
大写开头的如 Boolean、Number、String 代表的是 JavaScript 的构造函数:

```
let a: Number = new Number('10') // a === 10 为 false
let b: number = Number('10') // b === 10 为 true

a instanceof Number // true
b instanceof Number // false代码解释：
```

第 1 行，通过 new Number('10') 得到的是一个构造函数，本质是一个对象。

第 2 行，Number('10') 与 10 都是声明一个数字 10 的方法，本质就是一个数字。

第 4 - 5 行，instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。a 是一个对象，它的 __proto__ 属性指向该对象的构造函数的原型对象 Number，所以为 true。b 是一个数字，所以为 false。

__proto__ 是非标准属性，你也可以使用 Object.getPrototypeOf() 方法来访问一个对象的原型：

```typescript
a.__proto__ === Object.getPrototypeOf(a) // true
```

#### 小结：

- TypeScript 中描述类型要用 `小写`。
- 不要滥用 `any` !



## Flutter框架  跨平台

**介绍：**Flutter 是 Google 推出的一个移动应用开发框架，支持跨平台，即开发者可以通过 Dart 语言实现一套代码同时在 Android 和 IOS 平台上运行。Flutter 除了跨平台这个特性，还在于其提供了流畅的、高保真的 UI 体验，Flutter 内置的组件，丰富的 API ，响应式框架等都给开发带来了便利。

开发方式  性能  热更新  介入成本   行业使用情况

React Native

Flutter

使用VSCode  必须安装插件：  

①Flutter；

②Dart

③Awesome Flutter Snippets

新建项目  Application   然后查看目录

main.dart文件中：

 常量 const  变量var

```dart
void main(){
 const consNum = 10;
 const double doubleValue = 3.22;
 final int age = 20;  //只能初始化一次
    
//定义变量
    var str= 'hhhshsh';
    print(str);
 
}
```

# taro  

### node 版本16.13.0
```
npm  i -g 
```
```
npm i -g @tarojs/cli    安装了3.4.4
```
```
初始化 taro into app
```

# java
- 最好的跨平台开源编程语言：
	- 最核心：跨越多种操作系统
    - 开源：开放源代码（安全 完整  放心使用）
- 历程：  
		-->1995 (javaSE 1.0)  梦的开始
        -->2002 (JavaSE 1.4)  JAVA旧石器时代的坚持
        -->2006 (J2SE 5)  引入注解等重要特性
        -->2009 Orical公司收购SUN公司
        -->2014 (J2SE 8)  JAVA的代名词，90%的公司在使用
        -->2020 (J2SE 14)  更好的性能 更多的特性，更强大的功能
        -->未来

- J2SE：标准版，提供了JAvA语言的最核心的功能，是其他版本的基础

- J2EE：企业版，针对企业应用开发提供了更多高级功能

- J2ME：嵌入式版，可为智能设备开发应用程序，目前已极少使用。

- Java 第一段代码
- 
```java
//类
public class HelloWorld{
    public static void main(String[] args){
        System.out.println("Hello World")
    }
}
```
- 搭建Java 开发环境
	- 分两步：
		- 1、安装Java 开发工具包 Java Development Kit (JDK) 作用：运行Java程序核心下载版本对应的版本：JDK 8  window-64位安装包  用户注册Orical公司网站，进行下载安装包双击 下一步 更换安装目录，进行安装随后出现 jre1.8.0_261的安装向导,这是什么？安装在Java目录下，和JDK同级目录。

    --------------------------------------------------------|           
    |             JDK  Java开发包                           |       
    |  提供开发Java程序必须的工具   (开发人员安装)           | 
    |                                                       |
    |   |--------------------------------------------|      |
    |   |                                            |      |
    |   |     JRE Java 运行环境.    (普通用户安装)    |      |
    |   |                                            |      |
    |   |   |-----------------------------------|    |      |
    |   |   |                                   |    |      |       
    |   |   |   JVM Java 虚拟机运行程序的核心   |    |       |       
    |   |   |                                   |    |       |       
    |   |   |-----------------------------------|    |       |       
    |   |                                            |       |
    |   |--------------------------------------------        |
    |                                                        |
    |--------------------------------------------------------|
    
    2  安装JAVA interlij IDEA  是JAVA领域公认的最好的编码工具  智能工具语法提示及语法分析，有很多快捷键
    
    如何下载  官网 下载版本分 Ultimate(商业版)-->收费的功能强大  Community(社区版)-->免费的。
    
    选择安装路径，下一步，勾选64-bit launcher  之后install
    
    第一次安装运行  安装配置向导(界面设置，安装哪些性能插件)
    
    右下角 Configure 选择 Structure for New project(为所有新工程设置默认选项)
    
    如果安装成功JDK   下拉选项就会有  1.8 java  version “1.8.0_261”这个选项  OK按钮
    
    使用IDEA
    
      +New project  创建新工程
    
        左侧选中的是JAVA  右侧是  1.8 java  version “1.8.0_261”  next
    
        设置：工程名称Project name  及工程目录 Project location   -->finish
    
        src下 右键 New -> Java Class(创建Java类)
    
        使用快捷键psvm  即可生成  `public static void main`
    
        使用快捷键sout  即可生成  `System.out.println`
    
        右键 Run  运行  下方会出现运行结果