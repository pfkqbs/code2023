随着我们的项目项目越做越大，引入的第三方库会越来越多，打包的依赖也越来越多，每次 build 的时间越来越长，打包出来的文件会越来越大。最糟糕的是单页面应用首页白屏时间长，用户体验差。



此时优化 webpack 打包方法不可回避。下面我们来整理一下常用的webpack打包优化方法。

关于优化，首先我们要明确几个问题：

1. 我们优化的目标是什么？
2. 有哪些点可以进行优化？如何优化？

优化的目的

很明显，我们优化的最终目的就是提高页面加载速度，提高产品用户体验，主要包括以下几个方面：

- 减小打包后的文件大小
- 首页按需引入文件，减少白屏时间
- 优化 webpack 打包时间

分析 webpack 打包性能瓶颈

明确目标之后，首先我们来分析一下 webpack 打包性能瓶颈，找出问题所在，然后才能对症下药。

### 1、webpack-bundle-analyzer 分析体积

`webpack-bundle-analyzer` 可以扫码打包后内容并构建其成可视化的界面，我们可以在可视化的界面中找出不必要的依赖或者体积过大的包，有针对性地进行优化。

- vue-cli3 需要安装依赖 `webpack-bundle-analyzer`

```shell
npm install webpack-bundle-analyzer -D
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
plugins:[
  new BundleAnalyzerPlugin(),
]
```

- vue-cli2 直接在命令行输入 `npm run build --report`, 构建完成后会在 8888 端口展示大小

![图片](https://mmbiz.qpic.cn/mmbiz_png/qMicvibdvl7p0z2gZpySP0kLzolX2fjwAxCfOykJQvXDtSPHl7c9t1juxwC1PK1CLv2xs4kVJJeaibcGPibgELmnxw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

从以上的界面中，我们可以得到以下信息：

- 打包出的文件中都包含了什么，以及模块之间的依赖关系
- 每个文件的大小在总体中的占比，找出较大的文件，思考一下为什么，是否有替换方案，是否使用了它包含了不必要的依赖？
- 是否有重复的依赖项，对此可以如何优化？
- 每个文件的压缩后的大小。

### 2、测量构建时间

我们可以通过 `speed-measure-webpack-plugin` 测量你的 webpack 构建期间各个阶段花费的时间。

1. 步骤一：安装依赖包

```shell
npm install speed-measure-webpack-plugin --save-dev
```

1. 配置 vue.config.js

```js
// 分析打包时间
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
// ...
module.exports = {
  configureWebpack: smp.wrap({
    plugins: [new BundleAnalyzerPlugin()]
  })
}
```

打包构建后会看到以下输出

![图片](https://mmbiz.qpic.cn/mmbiz_png/qMicvibdvl7p0z2gZpySP0kLzolX2fjwAxQ6QOWgibE3juZjkicJgPDsRHCC3lUuzb6tNUAjcyQ8kq4vKLk0cn3wKg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

从以上的界面中，我们可以得到以下信息：

- 分析整个打包总耗时；
- 每个插件和 loader 的耗时情况；

## **找出问题所在后我们开始来总结一下优化方法。**

## 1、 按需加载

单页面应用最大的一个问题就是，他把整个工程作为一个入口打包成一个模块，所以在首页会加载了一些没用到的资源，造成首页渲染速度慢，“白屏时间”过长，给用户不好的体验。我们可以从以下几个方面进行按需加载：

1.1 路由组件按需加载

```js
const router = [
  {
    path: '/index',
    component: resolve =>require.ensure([], () => resolve(require('@/components/index')))
  },
  {
    path: '/about',
    component: resolve =>require.ensure([], () => resolve(require('@/components/about')))
  }
]
```

1.2 第三方组件和插件。按需加载需引入第三方组件

```js
// 引入全部组件
import ElementUI from'element-ui'
import'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 按需引入组件
import { Button } from'element-ui'
Vue.component(Button.name, Button)
```

1.3 对于一些插件，如果只是在个别组件中用的到，也可以不要在 main.js 里面引入，而是在组件中按需引入

```js
// 在main.js引入
import Vue from vue
import Vuelidate from'vuelidate'
Vue.use(Vuelidate)

// 按组件按需引入
import { Vuelidate } from'vuelidate'
```

## 2、优化 loader 配置

- 优化正则匹配——减少文件查询时间
- 通过`cacheDirectory`选项开启缓存——减少再次打包时间
- 通过 `include、exclude` 来减少被处理的文件。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      include: [resolve('src')]
    }
  ]
}
```

**注意：保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader。**

## 3、优化文件路径——省下搜索文件的时间

- `extension` 配置之后可以不用在 require 或是 import 的时候加文件扩展名,会依次尝试添加扩展名进行匹配。
- `alias` 通过配置别名可以加快 webpack 查找模块的速度。

```js
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
```

- `module.noParse`:让 webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。因为如 `jQuery` 、`echart` 等库庞大又没有采用模块化标准，让 webpack 去解析这些文件耗时又没有意义。

```js
module:{
	noParse:/jquery/, //不去解析jquery中的依赖库
  ...
},
```

## 4、生产环境关闭 sourceMap

- `sourceMap` 本质上是一种映射关系，打包出来的 js 文件中的代码可以映射到代码文件的具体位置,这种映射关系会帮助我们直接找到在源代码中的错误。
- 打包速度减慢，生产文件变大，所以开发环境使用 `sourceMap`，生产环境则关闭。

## 5、代码压缩

`uglifyJsPlugin` 是 vue-cli 默认使用的压缩代码方式，用来对js文件进行压缩，从而减小js文件的大小，加速load速度。它使用的是单线程压缩代码，打包时间较慢，所以可以在开发环境将其关闭，生产环境部署时再把它打开。

```js
plugins: [
  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: true,
    parallel: true
  })
```

`ParallelUglifyPlugin` 开启多个子进程，把对多个文件压缩的工作分别给多个子进程去完成，每个子进程其实还是通过 `UglifyJS` 去压缩代码，但是变成了并行执行。

`ParallelUglifyPlugin` 还可以缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。

```js
plugins: [
  new ParallelUglifyPlugin({
    //cacheDir 用于配置缓存存放的目录路径。
    cacheDir: '.cache/',
    sourceMap: true,
    uglifyJS: {
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }
  })
]
```

**打包速度和打包后的文件大小对比**

| 方法                 | 文件大小 | 打包速度 |
| :------------------- | :------- | :------- |
| 不用插件             | 14.6M    | 32s      |
| UglifyJsPlugin       | 12.9M    | 33s      |
| ParallelUglifyPlugin | 7.98M    | 17s      |

从上面可以看出，无论是打包时间还是打包后的文件大小，`ParallelUglifyPlugin`的方法都是最优的。

## 6、提取公共代码

在用 webpack 打包的时候，对于一些不经常更新的第三方库，比如 `react，lodash，vue` 我们希望能和自己的代码分离开，这样既能减小打包的总体积，也能避免单个包体积过大。

## **webpack 社区有以下两种方案：**

### **6.1、CommonsChunkPlugin 及 splitChunks**

webpack3 使用 `CommonsChunkPlugin` 的实现：

`CommonsChunkPlugin`主要是用来提取第三方库和公共模块，避免首屏加载的bundle文件或者按需加载的bundle文件体积过大，从而导致加载时间过长，这是webpack 优化打包的一大利器。

```js
plugins: [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function(module, count) {
      console.log(module.resource, `引用次数${count}`)
      //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
      returnmodule.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: 'initial',
    minChunks: 2
  })
]
```

`CommonsChunkPlugin` 的配置参数

- name：可以是已经存在的chunk（一般指入口文件）对应的name，那么就会把公共模块代码合并到这个chunk上；否则，会创建名字为name的commons chunk进行合并
- filename：指定commons chunk的文件名。
- chunks：指定source chunk，即指定从哪些chunk当中去找公共模块，省略该选项的时候，默认就是entry chunks
- minChunks：既可以是数字，也可以是函数，还可以是Infinity。

webpack4 使用 `splitChunks` 的实现：
`splitChunks` 是webpack有一个默认配置，这也符合webpack4的开箱即用的特性

```js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          priority: 1, //添加权重
          test: /node_modules/, //把这个目录下符合下面几个条件的库抽离出来
          chunks: 'initial', //刚开始就要抽离
          minChunks: 2//重复2次使用的时候需要抽离出来
        },
        common: {
          //公共的模块
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
}
```

### 6.2、DLLPlugin

这是在一个额外的独立的 webpack 设置中创建一个只有 dll 的 bundle(dll-only-bundle)。这个插件会生成一个名为 manifest.json 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

**使用步骤如下**

#### 6.2.1、在build下创建 `webpack.dll.config.js`

```js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    vendor: [
      'vue-router',
      'vuex',
      'vue/dist/vue.common.js',
      'vue/dist/vue.js',
      'vue-loader/lib/component-normalizer.js',
      'vue',
      'axios',
      'echarts'
    ]
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dist', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    // 建议加上代码压缩插件，否则dll包会比较大。
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
```

#### 6.2.2、在 `webpack.prod.conf.js` 的 plugin 后面加入配置

```js
new webpack.DllReferencePlugin({
    manifest: require('../dist/vendor-manifest.json')
})
```

#### 6.2.3、`package.json`文件中添加快捷命令`(build:dll)`

```js
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "lint": "eslint --ext .js,.vue src",
    "build": "node build/build.js",
    "build:dll": "webpack --config build/webpack.dll.conf.js"
  }
```

生产环境打包的时候先`npm run build:dll`命令会在打包目录下生成 `vendor-manifest.json` 文件与 vendor.dll.js 文件。然后`npm run build`生产其他文件。

#### 6.2.4、根目录下的入口`index.html`加入引用

```js
<script type="text/javascript" src="./vendor.dll.js"></script>
```



### 7、CDN 优化

CDN 的全称是 `Content Delivery Network`，即内容分发网络。CDN 是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN 的关键技术主要有内容存储和分发技术。

随着项目越做越大，依赖的第三方 npm 包越来越多，构建之后的文件也会越来越大。再加上又是单页应用，这就会导致在网速较慢或者服务器带宽有限的情况出现长时间的白屏。此时我们可以使用CDN的方法，优化网络加载速度。

#### 7.1、将 `vue、vue-router、vuex、element-ui 和 axios` 这五个库，全部改为通过 CDN 链接获取，在 `index.html`里插入 相应链接。

```js
<head>
  <link rel="stylesheet" href="https://cdn.bootcss.com/element-ui/2.0.7/theme-chalk/index.css" />
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
  <script src="https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js"></script>
  <script src="https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js"></script>
  <script src="https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js"></script>
  <script src="https://cdn.bootcss.com/element-ui/2.6.1/index.js"></script>
  <!-- built files will be auto injected -->
</body>
```

#### 7.2、在 `webpack.config.js` 配置文件

```js
module.exports = {
 ···
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      'Axios':'axios'
    }
  },
```

#### 7.3、卸载依赖的 npm 包

```
npm uninstall axios element-ui vue vue-router vuex
```

#### 7.4、修改 `main.js` 文件里之前的引包方式

```js
// import Vue from 'vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import VueRouter from 'vue-router'

import App from'./App.vue'
import routes from'./router'
import utils from'./utils/Utils'

Vue.use(ELEMENT)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash', //路由的模式
  routes
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
```



### 8、多进程解析和处理文件



由于运行在 Node.js 之上的 webpack 是单线程模型的，所以 webpack 需要处理的事情需要一件一件的做，不能多件事一起做。当 webpack 需要打包大量文件时，打包时间就会比较漫长。

以下两个方法能让 webpack 在同一时刻处理多个任务发挥多核 CPU 电脑的功能，提升构建速度。

#### 8.1、thread loader

把这个 `thread loader` 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。

在 worker 池(worker pool)中运行的 loader 是受到限制的。例如：

- 这些 loader 不能产生新的文件。
- 这些 loader 不能使用定制的 loader API（也就是说，通过插件）。
- 这些 loader 无法获取 webpack 的选项设置。

每个 worker 都是一个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: ['thread-loader', 'expensive-loader']
      }
    ]
  }
}
```

#### 8.2、HappyPack

`HappyPack` 能让 webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。要注意的是 HappyPack 对 file-loader、url-loader 支持的不友好，所以不建议对该 loader 使用。

使用方法如下：

8.2.1. HappyPack 插件安装

```
npm i -D happypack
```

8.2.2. `webpack.base.conf.js` 文件对 module.rules 进行配置

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['happypack/loader?id=babel'],
      include: [resolve('src'), resolve('test')],
      exclude: path.resolve(__dirname, 'node_modules')
    },
    {
      test: /\.vue$/,
      use: ['happypack/loader?id=vue']
    }
  ]
}
```

8.2.3. 在生产环境 `webpack.prod.conf.js` 文件进行配置

```js
const HappyPack = require('happypack')
// 构造出共享进程池，在进程池中包含5个子进程
const HappyPackThreadPool = HappyPack.ThreadPool({ size: 5 })
plugins: [
  new HappyPack({
    // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
    id: 'babel',
    // 如何处理.js文件，用法和Loader配置中一样
    loaders: ['babel-loader?cacheDirectory'],
    threadPool: HappyPackThreadPool
  }),
  new HappyPack({
    id: 'vue', // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
    loaders: [
      {
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ],
    threadPool: HappyPackThreadPool
  })
]
```

**注意，当项目较小时，多线程打包反而会使打包速度变慢。**

## 总结

1. 比较实用的方法: 按需加载，优化 loader 配置，关闭生产环境的 sourceMap，CDN 优化。
2. vue-cli 已做的优化：代码压缩，提取公共代码，我们可以再根据自身需要进行相关配置优化。
3. 一切优化因以不影响业务代码为前提。