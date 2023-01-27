## 引言

`webpack`的打包优化一直是个老生常谈的话题，常规的无非就分块、拆包、压缩等。

本文以我自己的经验向大家分享如何通过一些分析工具、插件以及`webpack`新版本中的一些新特性来显著提升`webpack`的打包速度和改善包体积，学会分析打包的瓶颈以及问题所在。

本文演示代码，仓库地址:https://github.com/Jack-cool/webpack4

## 速度分析 🏂

webpack 有时候打包很慢，而我们在项目中可能用了很多的 `plugin` 和 `loader`，想知道到底是哪个环节慢，下面这个插件可以计算 `plugin` 和 `loader` 的耗时。

```shell
yarn add -D speed-measure-webpack-plugin
```

配置也很简单，把 `webpack` 配置对象包裹起来即可：

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap({
  plugins: [
    new MyPlugin(),
    new MyOtherPlugin()
  ]
});
```

来看下在项目中引入`speed-measure-webpack-plugin`后的打包情况：![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZvYuibG1FvlTLMYhsHibjQP1ZJdOiaUJZ4wY0pcOXRJt1ia450oO6ZiaXwJQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)从上图可以看出这个插件主要做了两件事情：

- 计算整个打包总耗时
- 分析每个插件和 loader 的耗时情况 知道了具体`loader`和`plugin`的耗时情况，我们就可以“对症下药”了

## 体积分析 🎃

打包后的体积优化是一个可以着重优化的点，比如引入的一些第三方组件库过大，这时就要考虑是否需要寻找替代品了。

这里采用的是`webpack-bundle-analyzer`，也是我平时工作中用的最多的一款插件了。

它可以用交互式可缩放树形图显示`webpack`输出文件的大小。用起来非常的方便。

首先安装插件：

```shell
yarn add -D webpack-bundle-analyzer
```

安装完在`webpack.config.js`中简单的配置一下：

```js
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
    //  可以是`server`，`static`或`disabled`。
    //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
    //  在“静态”模式下，会生成带有报告的单个HTML文件。
    //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
    analyzerMode: "server",
    //  将在“服务器”模式下使用的主机启动HTTP服务器。
    analyzerHost: "127.0.0.1",
    //  将在“服务器”模式下使用的端口启动HTTP服务器。
    analyzerPort: 8866,
    //  路径捆绑，将在`static`模式下生成的报告文件。
    //  相对于捆绑输出目录。
    reportFilename: "report.html",
    //  模块大小默认显示在报告中。
    //  应该是`stat`，`parsed`或者`gzip`中的一个。
    //  有关更多信息，请参见“定义”一节。
    defaultSizes: "parsed",
    //  在默认浏览器中自动打开报告
    openAnalyzer: true,
    //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
    generateStatsFile: false,
    //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
    //  相对于捆绑输出目录。
    statsFilename: "stats.json",
    //  stats.toJson（）方法的选项。
    //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
    //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    statsOptions: null,
    logLevel: "info"
  )
  ]
}
```

然后在命令行工具中输入`npm run dev`，它默认会起一个端口号为 8888 的本地服务器：![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZDoaGtSGKRV1mfAalmHfIgiaiaeVhvEc1fP2aweHiaWvXV5hlksRAZpmug/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)图中的每一块清晰的展示了组件、第三方库的代码体积。

有了它，我们就可以针对体积偏大的模块进行相关优化了。

## 多进程/多实例构建 🏈

大家都知道 `webpack` 是运行在 `node` 环境中，而 `node` 是单线程的。`webpack` 的打包过程是 `io` 密集和计算密集型的操作，如果能同时 `fork` 多个进程并行处理各个任务，将会有效的缩短构建时间。

平时用的比较多的两个是`thread-loader`和`HappyPack`。

先来看下`thread-loader`吧，这个也是`webpack4`官方所推荐的。

## `thread-loader`

#### 安装

```shell
yarn add -D thread-loader
```

`thread-loader` 会将你的 `loader` 放置在一个 `worker` 池里面运行，以达到多线程构建。

> ❝
>
> 把这个 `loader` 放置在其他 `loader` 之前（如下面示例的位置）， 放置在这个 `loader` 之后的 `loader` 就会在一个单独的 `worker` 池(`worker pool`)中运行。
>
> ❞

#### 示例

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          "thread-loader",
          // your expensive loader (e.g babel-loader)
        ]
      }
    ]
  }
}
```

## HappyPack

#### 安装

```
yarn add -D happypack
```

`HappyPack` 可以让 `Webpack` 同一时间处理多个任务，发挥多核 `CPU` 的能力，将任务分解给多个子进程去并发的执行，子进程处理完后，再把结果发送给主进程。通过多进程模型，来加速代码构建。![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZQlWIF3JyFTMFb3eTrhU96OSgamSlrGvoib0ic793icSWXib1j2HQ4JIuqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

#### 示例

```js
// webpack.config.js
const HappyPack = require('happypack');

exports.module = {
  rules: [
    {
      test: /.js$/,
      // 1) replace your original list of loaders with "happypack/loader":
      // loaders: [ 'babel-loader?presets[]=es2015' ],
      use: 'happypack/loader',
      include: [ /* ... */ ],
      exclude: [ /* ... */ ]
    }
  ]
};

exports.plugins = [
  // 2) create the plugin:
  new HappyPack({
    // 3) re-add the loaders you replaced above in #1:
    loaders: [ 'babel-loader?presets[]=es2015' ]
  })
];
```

这里有一点需要说明的是，`HappyPack`的作者表示已不再维护此项目，这个可以在`github`仓库看到：![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)作者也是推荐使用`webpack`官方提供的`thread-loader`。

> ❝
>
> `thread-loader` 和 `happypack` 对于小型项目来说打包速度几乎没有影响，甚至可能会增加开销，所以建议尽量在大项目中采用。
>
> ❞

## 多进程并行压缩代码 🛵

通常我们在开发环境，代码构建时间比较快，而构建用于发布到线上的代码时会添加压缩代码这一流程，则会导致计算量大耗时多。

`webpack`默认提供了`UglifyJS`插件来压缩`JS`代码，但是它使用的是单线程压缩代码，也就是说多个`js`文件需要被压缩，它需要一个个文件进行压缩。所以说在正式环境打包压缩代码速度非常慢(因为压缩`JS`代码需要先把代码解析成用`Object`抽象表示的`AST`语法树，再应用各种规则分析和处理`AST`，导致这个过程耗时非常大)。

所以我们要对压缩代码这一步骤进行优化，常用的做法就是多进程并行压缩。

目前有三种主流的压缩方案：

- parallel-uglify-plugin
- uglifyjs-webpack-plugin
- terser-webpack-plugin

## `parallel-uglify-plugin`

上面介绍的`HappyPack`的思想是使用多个子进程去解析和编译`JS`,`CSS`等，这样就可以并行处理多个子任务，多个子任务完成后，再将结果发到主进程中，有了这个思想后，`ParallelUglifyPlugin` 插件就产生了。

当`webpack`有多个`JS`文件需要输出和压缩时，原来会使用`UglifyJS`去一个个压缩并且输出，而`ParallelUglifyPlugin`插件则会开启多个子进程，把对多个文件压缩的工作分给多个子进程去完成，但是每个子进程还是通过`UglifyJS`去压缩代码。并行压缩可以显著的提升效率。

#### 安装

```
yarn add -D webpack-parallel-uglify-plugin
```

#### 示例

```
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      // Optional regex, or array of regex to match file against. Only matching files get minified.
      // Defaults to /.js$/, any file ending in .js.
      test,
      include, // Optional regex, or array of regex to include in minification. Only matching files get minified.
      exclude, // Optional regex, or array of regex to exclude from minification. Matching files are not minified.
      cacheDir, // Optional absolute path to use as a cache. If not provided, caching will not be used.
      workerCount, // Optional int. Number of workers to run uglify. Defaults to num of cpus - 1 or asset count (whichever is smaller)
      sourceMap, // Optional Boolean. This slows down the compilation. Defaults to false.
      uglifyJS: {
        // These pass straight through to uglify-js@3.
        // Cannot be used with uglifyES.
        // Defaults to {} if not neither uglifyJS or uglifyES are provided.
        // You should use this option if you need to ensure es5 support. uglify-js will produce an error message
        // if it comes across any es6 code that it can't parse.
      },
      uglifyES: {
        // These pass straight through to uglify-es.
        // Cannot be used with uglifyJS.
        // uglify-es is a version of uglify that understands newer es6 syntax. You should use this option if the
        // files that you're minifying do not need to run in older browsers/versions of node.
      }
    }),
  ],
};
```

> ❝
>
> `webpack-parallel-uglify-plugin`已不再维护，这里不推荐使用
>
> ❞

## `uglifyjs-webpack-plugin`

#### 安装

```
yarn add -D uglifyjs-webpack-plugin
```

#### 示例

```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {},
        ie8: false
      },
      parallel: true
    })
  ]
};
```

其实它和上面的`parallel-uglify-plugin`类似，也可通过设置`parallel: true`开启多进程压缩。

## `terser-webpack-plugin`

不知道你有没有发现：`webpack4` 已经默认支持 `ES6`语法的压缩。

而这离不开`terser-webpack-plugin`。

#### 安装

```
yarn add -D terser-webpack-plugin
```

#### 示例

```
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
};
```

## 预编译资源模块 🚀

### 什么是预编译资源模块？

在使用`webpack`进行打包时候，对于依赖的第三方库，比如`vue`，`vuex`等这些不会修改的依赖，我们可以让它和我们自己编写的代码分开打包，这样做的好处是每次更改我本地代码的文件的时候，`webpack`只需要打包我项目本身的文件代码，而不会再去编译第三方库。

那么第三方库在第一次打包的时候只打包一次，以后只要我们不升级第三方包的时候，那么`webpack`就不会对这些库去打包，这样的可以快速的提高打包的速度。其实也就是`预编译资源模块`。

`webpack`中，我们可以结合`DllPlugin` 和 `DllReferencePlugin`插件来实现。

### `DllPlugin`是什么？

它能把第三方库代码分离开，并且每次文件更改的时候，它只会打包该项目自身的代码。所以打包速度会更快。

`DLLPlugin` 插件是在一个额外独立的`webpack`设置中创建一个只有`dll`的`bundle`，也就是说我们在项目根目录下除了有`webpack.config.js`，还会新建一个`webpack.dll.js`文件。

`webpack.dll.js`的作用是把所有的第三方库依赖打包到一个`bundle`的`dll`文件里面，还会生成一个名为 `manifest.json`文件。该`manifest.json`的作用是用来让 `DllReferencePlugin` 映射到相关的依赖上去的。

### `DllReferencePlugin`又是什么？

这个插件是在`webpack.config.js`中使用的，该插件的作用是把刚刚在`webpack.dll.js`中打包生成的`dll`文件引用到需要的预编译的依赖上来。

什么意思呢？就是说在`webpack.dll.js`中打包后比如会生成 `vendor.dll.js`文件和`vendor-manifest.json`文件，`vendor.dll.js`文件包含了所有的第三方库文件，`vendor-manifest.json`文件会包含所有库代码的一个索引，当在使用`webpack.config.js`文件打包`DllReferencePlugin`插件的时候，会使用该`DllReferencePlugin`插件读取`vendor-manifest.json`文件，看看是否有该第三方库。

`vendor-manifest.json`文件就是一个第三方库的映射而已。

### 怎么在项目中使用？

上面说了这么多，主要是为了方便大家对于`预编译资源模块`和`DllPlugin` 和、`DllReferencePlugin`插件作用的理解（我第一次使用看了好久才明白～～）

先来看下完成的项目目录结构：![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZWrwG4AicMnvv13wIS9bR4BVTgictAzyc9jSr1v22BuYgcBSk7o9kGOEQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

主要在两块配置，分别是`webpack.dll.js`和`webpack.config.js`（对应这里我是`webpack.base.js`）

#### `webpack.dll.js`

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash', 'jquery'],
    react: ['react', 'react-dom']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, './dll/[name].manifest.json')
    })
  ]
}
```

这里我拆了两部分：`vendors`（存放了`lodash`、`jquery`等）和`react`（存放了 react 相关的库，`react`、`react-dom`等）

#### `webpack.config.js`(对应我这里就是`webpack.base.js`)

```js
const path = require("path");
const fs = require('fs');
// ...
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');

const plugins = [
  // ...
];

const files = fs.readdirSync(path.resolve(__dirname, './dll'));
files.forEach(file => {
  if(/.*\.dll.js/.test(file)) {
    plugins.push(new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, './dll', file)
    }))
  }
  if(/.*\.manifest.json/.test(file)) {
    plugins.push(new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, './dll', file)
    }))
  }
})

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: []
  },
  plugins,

  output: {
    // publicPath: "./",
    path: path.resolve(__dirname, "dist")
  }
}
```

这里为了演示省略了很多代码，项目完整代码在这里

由于上面我把第三方库做了一个拆分，所以对应生成也就会是多个文件，这里读取了一下文件，做了一层遍历。

最后在`package.json`里面再添加一条脚本就可以了：

```js
"scripts": {
    "build:dll": "webpack --config ./webpack.dll.js",
  },
```

运行`yarn build:dll`就会生成本小节开头贴的那张项目结构图了～

## 利用缓存提升二次构建速度 🍪

一般来说，对于静态资源，我们都希望浏览器能够进行缓存，那样以后进入页面就可以直接使用缓存资源，页面打开速度会显著加快，既提高了用户的体验也节省了宽带资源。

当然浏览器缓存方法有很多种，这里只简单讨论下在`webpack`中如何利用缓存来提升二次构建速度。

在`webpack`中利用缓存一般有以下几种思路：

- `babel-loader`开启缓存
- 使用`cache-loader`
- 使用`hard-source-webpack-plugin`

### `babel-loader`

`babel-loader`在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积冗余，同时也会减慢编译效率。

可以加上`cacheDirectory`参数开启缓存：

```js
 {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{
      loader: "babel-loader",
      options: {
        cacheDirectory: true
      }
    }],
  },
```

### `cache-loader`

在一些性能开销较大的 `loader` 之前添加此 `loader`，以将结果缓存到磁盘里。

#### 安装

```shell
yarn add -D cache-loader
```

#### 使用

`cache-loader` 的配置很简单，放在其他 `loader` 之前即可。修改`Webpack` 的配置如下:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: [
          'cache-loader',
          ...loaders
        ],
        include: path.resolve('src')
      }
    ]
  }
}
```

> ❝
>
> 请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 `loader` 使用此 `loader`。
>
> ❞

### `hard-source-webpack-plugin`

`HardSourceWebpackPlugin` 为模块提供了中间缓存，缓存默认的存放路径是: `node_modules/.cache/hard-source`。

配置 `hard-source-webpack-plugin`后，首次构建时间并不会有太大的变化，但是从第二次开始，构建时间大约可以减少 `80%`左右。

#### 安装

```shell
yarn add -D hard-source-webpack-plugin
```

#### 使用

```js
// webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: // ...
  output: // ...
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
```

> ❝
>
> `webpack5`中会内置`hard-source-webpack-plugin`。
>
> ❞

## 缩小构建目标/减少文件搜索范围 🍋

有时候我们的项目中会用到很多模块，但有些模块其实是不需要被解析的。这时我们就可以通过缩小构建目标或者减少文件搜索范围的方式来对构建做适当的优化。

### 缩小构建目标

主要是`exclude` 与 `include`的使用：

- exclude: 不需要被解析的模块
- include: 需要被解析的模块

```js
// webpack.config.js
const path = require('path');
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // include: path.resolve('src'),
        use: ['babel-loader']
      }
    ]
  }
```

这里`babel-loader`就会排除对`node_modules`下对应 `js` 的解析，提升构建速度。

### 减少文件搜索范围

这个主要是`resolve`相关的配置，用来设置模块如何被解析。通过`resolve`的配置，可以帮助`Webpack`快速查找依赖，也可以替换对应的依赖。

- `resolve.modules`：告诉 `webpack` 解析模块时应该搜索的目录
- `resolve.mainFields`：当从 `npm` 包中导入模块时（例如，`import * as React from 'react'`），此选项将决定在 `package.json` 中使用哪个字段导入模块。根据 `webpack` 配置中指定的 `target` 不同，默认值也会有所不同
- `resolve.mainFiles`：解析目录时要使用的文件名，默认是`index`
- `resolve.extensions`：文件扩展名

```js
// webpack.config.js
const path = require('path');
module.exports = {
  ...
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/umd/react.production.min.js')
    }, //直接指定react搜索模块，不设置默认会一层层的搜寻
    modules: [path.resolve(__dirname, 'node_modules')], //限定模块路径
    extensions: ['.js'], //限定文件扩展名
    mainFields: ['main'] //限定模块入口文件名
```

## 动态 Polyfill 服务 🦑

介绍`动态Polyfill`前，我们先来看下什么是`babel-polyfill`。

### 什么是 babel-polyfill?

`babel`只负责语法转换，比如将`ES6`的语法转换成`ES5`。但如果有些对象、方法，浏览器本身不支持，比如：

- 全局对象：`Promise`、`WeakMap` 等。
- 全局静态函数：`Array.from`、`Object.assign` 等。
- 实例方法：比如 `Array.prototype.includes` 等。

此时，需要引入`babel-polyfill`来模拟实现这些对象、方法。

这种一般也称为`垫片`。

### 怎么使用`babel-polyfill`？

使用也非常简单，在`webpack.config.js`文件作如下配置就可以了：

```js
module.exports = {
  entry: ["@babel/polyfill", "./app/js"],
};
```

### 为什么还要用`动态Polyfill`？

`babel-polyfill`由于是一次性全部导入整个`polyfill`，所以用起来很方便，但与此同时也带来了一个大问题：文件很大，所以后续的方案都是针对这个问题做的优化。

来看下打包后`babel-polyfill`的占比：![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZiaIHR6VJ4pXs6Yt31L2YJWwSicsJy3sUGibANdSavib8TCU0neIlL6vTtA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)占比 29.6%，有点太大了！

介于上述原因，`动态Polyfill`服务诞生了。通过一张图来了解下`Polyfill Service`的原理：![图片](https://mmbiz.qpic.cn/mmbiz_png/LNrWl4n5XIJygjcAjkYcTpYepkd1dxyZS3EMcPygc3PBG8h97863ITJZWicFsMaicwRVJsFwG1QmBKcSbXRVrVWA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

每次打开页面，浏览器都会向`Polyfill Service`发送请求，`Polyfill Service`识别 `User Agent`，下发不同的 `Polyfill`，做到按需加载`Polyfill`的效果。

### 怎么使用`动态Polyfill`服务？

采用官方提供的服务地址即可：

```js
//访问url，根据User Agent 直接返回浏览器所需的 polyfills
https://polyfill.io/v3/polyfill.min.js
```

## `Scope Hoisting` 🦁

### 什么是`Scope Hoisting`？

`Scope hoisting` 直译过来就是「作用域提升」。熟悉 `JavaScript` 都应该知道「函数提升」和「变量提升」，`JavaScript` 会把函数和变量声明提升到当前作用域的顶部。「作用域提升」也类似于此，`webpack` 会把引入的 `js` 文件“提升到”它的引入者顶部。

`Scope Hoisting` 可以让 `Webpack` 打包出来的代码文件更小、运行的更快。

### 启用`Scope Hoisting`

要在 `Webpack` 中使用 `Scope Hoisting` 非常简单，因为这是 `Webpack` 内置的功能，只需要配置一个插件，相关代码如下：

```js
// webpack.config.js
const webpack = require('webpack')

module.exports = mode => {
  if (mode === 'production') {
    return {}
  }

  return {
    devtool: 'source-map',
    plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
  }
}
```

### 启用`Scope Hoisting`后的对比

让我们先来看看在没有 `Scope Hoisting` 之前 `Webpack` 的打包方式。

假如现在有两个文件分别是

- `constant.js`:

```js
export default 'Hello,Jack-cool';
```

- 入口文件 `main.js`:

```js
import str from './constant.js';
console.log(str);
```

以上源码用 `Webpack` 打包后的部分代码如下：

```js
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var __WEBPACK_IMPORTED_MODULE_0__constant_js__ = __webpack_require__(1);
    console.log(__WEBPACK_IMPORTED_MODULE_0__constant_js__["a"]);
  }),
  (function (module, __webpack_exports__, __webpack_require__) {
    __webpack_exports__["a"] = ('Hello,Jack-cool');
  })
]
```

在开启 `Scope Hoisting` 后，同样的源码输出的部分代码如下：

```js
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var constant = ('Hello,Jack-cool');
    console.log(constant);
  })
]
```

从中可以看出开启 `Scope Hoisting` 后，函数申明由两个变成了一个，`constant.js` 中定义的内容被直接注入到了 `main.js` 对应的模块中。这样做的好处是：

- 代码体积更小，因为函数申明语句会产生大量代码；
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。

`Scope Hoisting` 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。因此只有那些被引用了一次的模块才能被合并。

> ❝
>
> 由于 `Scope Hoisting` 需要分析出模块之间的依赖关系，因此源码必须采用 `ES6` 模块化语句，不然它将无法生效。
>
> ❞

## 参考

极客时间 【玩转 webpack】