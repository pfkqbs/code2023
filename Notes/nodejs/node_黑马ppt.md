[toc]

# node.js

## 简介

- `node` 是一个服务端运行 `javascript` 的环境,相当于我们的浏览器,采用的是 `chrome  v8` 引擎运行 `js` 代码,使用时间驱动,非阻塞和异步 `i/o` 模型等技术来提高性能
- `node`之父:瑞安.达尔(Ryan  Dahl)
- `node`中的 `js`  没有 `BOM` 和 `DOM` ,支持所有 `ES` 语法
- 在`node`中提供了一些服务器级别的操作`API`:
    - 文件的读写
    - 网络服务的构建
    - 网络构建
    - `http`服务器

- `node.js`   文件不要使用`node.js`来命名

- 载入对应的模块
    - `ES6`模块化规范
    - `common.js`模块化规范 - `node`采用的规范
        
    > 如果导入的路径没有任何前缀,直接是一个文件名,那么这个路径默认从`npm`包管理工具下的`node-modules`文件夹下去查找,使用该模块的方法来实现想要的操作,百分之90以上都是异步,而不是同步,所有的异步都有回调函数
    
- 如果导入的路径没有任何前缀,直接是一个文件名,那么这个路径默认从`npm`包管理工具下的`node-modules`文件夹下去查找
当前目录下必须加 <font color="red"> **./**</font>  比如  
```js
fs.readFile("./img","utf-8",function(err,data){
    if(err)  throw err
   console.log(data)     //设置可选参数"utf-8"

}   )
```
## `npm`

- 包管理工具
    - 提供了便捷的下载方式
- 命令符

### 安装-卸载-使用

- 控制面板 --> 应用程序 --> 找到 `node.js` --> 右键卸载
- 官网下载安装包: http://nodejs.cn/download/


|  `cmd` 命令 |  操作 |
|  :---- |  :---- |
| `node  -v`  |    查看`node.js`版本号    |
| `node`  |  进入命令操作    |
| `ctrl+c` |   退出当前的执行环境    |
| `npm install  第三方模块名  -g ` |    全局载入模块    |
| `npm install  第三方模块名  --save-dev` |     下载模块放到`devDependencies`    |
| `npm uninstall 第三方模块名`  |     卸载模块    |
| `npm install <包>`      |      安装依赖包     |
| `npm install`  |      根据依赖`package.json`下载模块    |
| `npm i <包> `     |      安装依赖包缩写     |
| `npm uninstall <包> `     |      卸载依赖包     |
| `npm un <包>  `    |      卸载依赖包缩写     |
| `npm update <包> `     |      更新最新版本的依赖包     |
| `npm up <包>`      |      更新最新版本的依赖包缩写     |
| `npm deprecate <包>[<版本>]`       |      <消息>发出弃用消息来更新包     |
| `npm list`      |      打印所有的依赖包和版本号信息     |
| `npm view <包名> <版本号>`      |      打印包数据     |
| `npm help`       |      帮助命令     |


## 模块分类

### `http`  请求应答服务模块
- `http` 模块用来创建 `web` 服务器的模块。
    
> `http` 模块是 `Node.js` 官方提供的、用来创建 `web` 服务器的模块。通过 `http` 模块提供的 `http.createServer()` 方法，就能方便的把一台普通的电脑，变成一台 Web 服务器，从而对外提供 W`eb 资源服务。
    
- 创建服务器
    - 引包 `const http = require('http');`
    - 创建 `http` 服务器 `var server = http.createServer((req,res)=>{});`
        - 回调函数有两个参数，`req`和`res`,顺序不可颠倒,`req`表示请求`request`,`res`表示响应`response`
        - 回调函数内部语句的一定要有`res.end();`，因为如果没有，浏览器会认为一直没有得到服务器的响应，则浏览器一直会处于被挂起的状态，此时浏览器内部有一个超时机制，一旦超时，则会报告错误
        - 对于`html`代码
            
            > `res.writeHead(200,{"Content-Type":"text/html;charset=UTF8"});`
        - 对于`css`文件
            
            > `res.writeHead(200,{"Content-Type":"text/css"});`
        - 对于图片
            
            > `res.writeHead(200,{"Content-Type":"image/jpg"});`
        - 纯文本       
            > `res.writeHead(200,{"Content-Type":"text/plain"});`

    - 让该服务器监听特定的端口号
        > `server.listen(3000,'192.168.155.1');`

        |  端口号 |  用于 |
        |  :----: |  :---- |
        | 21 端口：  |   `FTP` 文件传输服务   |
        | 22 端口：  |   `SSH` 远程连接服务   |
        | 23 端口：  |   `TELNET` 终端仿真服务   |
        | 25 端口：  |   `SMTP` 简单邮件传输服务   |
        | 53 端口：  |   `DNS` 域名解析服务   |
        | 80 端口：  |   `HTTP` 超文本传输服务   |
        | 443 端口：  |   `HTTPS` 加密的超文本传输服务   |
        | 3306 端口：  |   `MYSQL` 数据库端口   |
        | 5432 端口：  |   `PostgreSQL` 数据库端口   |
        | 6379 端口：  |   `Redis` 数据库端口   |
        | 8080 端口：  |   `TCP` 服务端默认端口   |
        | 8888 端口：  |   `Nginx` 服务器的端口   |
        | 9200 端口：  |   `Elasticsearch` 服务器端口   |
        | 27017 端口：  |   `mongoD` B数据库默认端口   |
        | 22122 端口：  |   `fastdfs` 服务器默认端口   |
    
- 案例
    ```js
    // 1.引入http模块
    const http = require("http");
    
    // 2.创建一个服务器实例
    const server = http.createServer();
    
    // 3. 监听request请求事件
    server.on('request',function(req,res){

    	//  req 表示请求的内容
    	//  req.url  表示请求的路径
    	//  res 表示响应的内容
    	//  res.write() 向客户端响应的内容
    	//  res.end() 结束响应并返回
    	//  res.setHeader() 设置响应头

    	console.log(req.url)
    	console.log(req.socket.remotePort)  //端口号
	    console.log(req.socket.remoteAddress) //IP地址

    	// 解决中文乱码
    	res.setHeader('Content-Type','text/plain; charset=utf8')	
    })
    
    // 4. 启动服务器，绑定端口号
    server.listen(3000,function(){
    	console.log("服务器启动成功")
    })
    ```

### `url` 处理模块
- `url` 模块提供用于网址处理和解析的实用工具
    > `req.url` 可以得到用户完整的请求地址
- 解析 `url` 步骤
    - 引包:  `const url = require('url');`
    - `url.parse()` 把一个完整的`url`地址分解为一个对象
        ```js
        const http = require('http');
        const url = require('url');
        var server = http.createServer((req,res)=>{
            if(req.url == '/favicon.ico'){
                return;
            };
            console.log(url.parse(req.url));
            res.end();
        });
        server.listen(3000,'192.168.155.1');
        ```
    - 常用的是 `url.parse(req.url)`
        - `url.parse(req.url).pathname`  ==> 一个文件路径的字符串
        - `url.parse(req.url,true).query` ==>  将所有的查询变为对象

### `fs` 文件系统模块
- `fs` 模块是用来操作文件的模块。
    > `fs` 模块是 `Node.js` 官方提供的、用来操作文件的模块。它提供了一系列的方法和属性，用来满足用户对文件的操作需求
- 常用方法
| 常用方法 |  操作  |
| :---- |  :----  |
| `fs.readFileSync()` |  同步读取指定文件中的内容  |
| `fs.readFile()` |  异步读取指定文件中的内容  |
| `fs.writeFile()`  | 异步向指定的文件中写入内容 |
| `fs.unlinkSync()` | 同步删除文件 |
| `fs.unlink(参数1路径,参数2回调函数)` | 异步删除文件 |
| `fs.copyFile()` | 拷贝文件 |
| `fs.mkdir("/img",function(err){})`  |  创建文件夹(文件夹英文director) |
| `fs.readdir("",function(err,files){})`  |  读取文件夹 |
| `fs.rmdir("./css/style",function(err){ })`  |  删除目录(删除文件夹) |

### `queryString` 模块
- `querystring` 这个模块，用来做 `url` 查询参数的解析
- 方法
    - `querystring.parse()`：对 `url` 查询参数（字符串）进行解析，生成易于分析的 `json` 格式。
    - `querystring.stringif()`：跟`querystring.parse()` 相反，用于拼接查询查询。

### `path` 路径模块

- `path` 模块是用来处理路径的模块
    > `path` 模块是` Node.js` 官方提供的、用来处理路径的模块。它提供了一系列的方法和属性，用来满足用户对路径的处理需求。
- 常用方法
    - `path.join()` 方法，用来将多个路径片段拼接成一个完整的路径字符串
    - `path.basename()` 方法，用来从路径字符串中，将文件名解析出来

### 自定义模块

- 自己手动创建的 `js` 文件

- 导入
    - `require("./aa.js")`
    - `var su=require("./sum.js")`  
        > 调用的时候     su.sum()
    - `var {sum,cheng} =require("./sum.js")`
        - 解构赋值
        - 调用的时候    sum()
- **注意**:
    - 导入的内容与当前相同执行哪个? 
        > 优先执行导入,都会执行
    - 导入的 `js` 文件变量与当前 `js` 文件相同,会冲突吗? 
        > `node` 中没有全局作用域,只有模块作用域,一个 `js` 文件的变量与另一个 `js` 文件的变量不会冲突
    - 头部导入一次,  尾部导入一次,怎么执行?
        > 缓存机制,一个文件加载一次即可,多次加载同一个模块没有任何意义
    - a文件引入了b, b引入了c, 现在运行a, c会运行吗?
        > 会,只要相互依赖,都会执行
    - 当前文件能直接调用另一个函数,怎么调用?
        > 函数必须导出  `exports.函数名=当前js的函数名`
        > `exports={sum:sum,cheng:cheng} //错误写法`
        > `modele.exports={   } //正确`

## `Express`

### 01-`Express` 简介

- 什么是 `Express`
    - `Express` 是基于 `Node.js` 平台，快速、开放、极简的 Web 开发框架。 
    - `Express` 的作用和` Node.js` 内置的 `http` 模块类似，是专门用来创建 `Web` 服务器的。
    - `Express` 的本质:就是一个 `npm` 上的第三方包，提供了快速创建 `Web` 服务器的便捷方法。
    - `Express` 的中文官网: http://www.expressjs.com.cn/

- `Express` 能做什么
    - 对于前端程序员来说，最常见的两种服务器，分别是:
        - `Web` 网站服务器:专门对外提供 `Web` 网页资源的服务器。
        - `API` 接口服务器:专门对外提供 `API` 接口的服务器。
    - 使用 `Express`，我们可以方便、快速的创建 `Web` 网站的服务器或 `API` 接口的服务器。

### 02-`Express` 的基本使用
- 安装
    > 在项目所处的目录中，终端命令:   `npm i express`

- 创建基本的 `Web` 服务器

    ```js
    //载入express
    const  express=require("express");
    //创建服务器
     const  app=express();

    //调用app.listen(端口号,启动成功后的回调函数)
     app.listen(3000,function(){

         console.log("http:127.0.0.1:3000");
     });
    ```
- 监听 `GET` 请求

    > 通过 `app.get()` 方法，可以监听客户端的 `GET` 请求，具体的语法格式如下:

    ```js
    //参数1:客户端请求的url地址
    //参数2:请求对应的处理函数
    //req为请求对象(包含了请求相关的数据和方法),
    //res为响应对象(包含了响应相关的数据和方法)

     app.get("/getList",function(req,res){
         res.send({     })
     })
    ```
- 监听 `POST` 请求
    > 通过 `app.post()` 方法，可以监听客户端的 `POST` 请求，具体的语法格式如下:
    ```js
    //参数1:客户端请求的url地址
    //参数2:请求对应的处理函数
    //req为请求对象(包含了请求相关的数据和方法),
    //res为响应对象(包含了响应相关的数据和方法)

    app.post("/getList",function(req,res){
        res.send({     })
    })
    ```
- 把内容响应给客户端
    > 通过 `res.send()` 方法，可以把处理好的内容，发送给客户端:
    ```js
    app.get("/user",function(req,res){
    //向客户端发送JSON对象
        res.send({name:"wang,age:18 })
    })

    app.post("/user",function(req,res){
    //向客户端发送文本对象
        res.send("请求成功")
    })
    ```
- 获取 `URL` 中携带的查询参数
    > 通过 `req.query` 对象，可以访问到客户端通过查询字符串的形式，发送到服务器的参数:
    ```js
    app.get("/",(req,res)=>{

    //req.query 默认是一个空对象
    //客户端使用?name=wang&age=20  这种查询字符串形式,发送至服务器的参数,
    //可以通过req.query  对象访问到,例如:req.query.name或者req.query.age

        console.log( req.query )
    })
    ```

- 获取 `URL` 中的动态参数
    > 通过 `req.params` 对象，可以访问到 `URL` 中，通过 : 匹配到的动态参数:

    ```js
    //URL  地址中,可以通过:参数名的形式,匹配动态参数值

    app.get('/user/:id', (req,res)=>{

    //req.params  默认是一个空对象
    //里面存放着通过:动态匹配到的参数值

    console.log(  req.params )
    })
    ```

### 03-托管静态资源

- `express.static()`

    > `express` 提供了函数 `express.static()`，通过它，可以创建一个静态资源服务器，通过如下代码就可以访问 `public` 目录下的图片、 `CSS` 文件、 `JavaScript` 文件: `app.use(express.static('public'))`

    > 现在，你就可以访问 public 目录中的所有文件了: 
    http://localhost:3000/images/bg.jpg 
    http://localhost:3000/css/style.css 
    http://localhost:3000/js/login.js 
    因此，存放静态文件的目录名不会出现在 URL 中。

    > **注意**: `Express` 在指定的静态目录中查找文件，并对外提供资源的访问路径。

- 托管多个静态资源目录
    - 如果要托管多个静态资源目录，请多次调用 `express.static()` 函数:
        - `app.use(express.static('public') );`
        - `app.use(express.static('files') );`

    - 访问静态资源文件时，`express.static()` 函数会根据目录的添加顺序查找所需的文件。

- 挂载路径前缀
    > 如果希望在托管的静态资源访问路径之前，挂载路径前缀，则可以使用如下的方式: 
    `app.use('/public', express.static('public'));`

    > 现在，你就可以通过带有 `/public` 前缀地址来访问 `public` 目录中的文件了: 
    http://localhost:3000/public/images/kitten.jpg 
    http://localhost:3000/public/css/style.css 
    http://localhost:3000/public/js/app.js

### 04-`nodemon`
- 为什么要使用 `nodemon`
    > 在编写调试 `Node.js` 项目的时候，如果修改了项目的代码，则需要频繁的手动 `close` 掉，然后再重新启动，非常繁琐。

    > 现在，我们可以使用 `nodemon` (https://www.npmjs.com/package/nodemon) 这个工具，它能够监听项目文件 的变动，当代码被修改后， `nodemon` 会自动帮我们重启项目，极大方便了开发和调试。

- 安装 `nodemon`

    > 在终端中，运行如下命令:`npm install -g nodemon`，即可将 `nodemon` 安装为全局可用的工具:

- 使用 `nodemon`

    > 传统的方式-->是运行命令: `node app.js` ，来启动项目。

    > ==>这样做的坏处是:代码被修改之后，需要手动重启项目。

    > 现在-->运行 `nodemon` 命令: `nodemon app.js` 来启动项目。==>这样做的好处是:代码 被修改之后，会被 `nodemon` 监听到，从而实现自动重启项目的效果。

### 05-`Express` 路由
- 什么是路由?
    > 广义上来讲，路由就是映射关系。

- `Express` 中的路由
    > 在 `Express` 中，路由指的是客户端的请求与服务器处理函数之间的映射关系。

    > `Express` 中的路由分 3 部分组成，分别是请求的类型、请求的 URL 地址、处理函数，格式如下:
    `app.METHOD(PATH,HANDLER)`

    - `Express` 中的路由的例子

    ```js
    //匹配GET请求,且请求uRL为/
    app.get('/', function(req,res){
    res.send('hello World')
    })

    //匹配post请求,且请求URL为/
    app.post('/', function(req,res){
    res.send('Got a POST request')
    })
    ```
- 路由的概念

    > 路由的匹配过程

    > 每当一个请求到达服务器之后，需要先经过路由的匹配，只有匹配成功之后，才会调用对应的处理函数。

    > 在匹配时，会按照路由的顺序进行匹配，如果请求类型和请求的 URL 同时匹配成功，则 `Express` 会将这次请求，转 交给对应的 `function` 函数进行处理。

    - 路由匹配的注意点:
        1 按照定义的先后顺序进行匹配
        2 请求类型和请求的URL同时匹配成功，才会调用对应的处理函数

- 路由的使用
    - 最简单的用法
        > 在 `Express` 中使用路由最简单的方式，就是把路由挂载到 `app` 上，示例代码如下:
        ```js
        const express =require('express');
        //创建文本服务器,命名为app
        const app=express();
        //挂载路由
        app.get('/',(req,res)=>{res.send('hello world')  } );
        app.post('/',(req,res)=>{res.send('Post Request')  } );

        //启动web服务器
        app.listen(3000,()=>{console.log("server running at http:127.0.0.1:3000")  })
        ```
    - 模块化路由
        - 为了方便对路由进行模块化的管理， `Express` 不建议将路由直接挂载到 `app` 上，而是推荐将路由抽离为单独的模块。
        - 将路由抽离为单独模块的步骤如下:
            - 1 创建路由模块对应的 `.js` 文件
            - 2 调用 `express.Router()` 函数创建路由对象
            - 3 向路由对象上挂载具体的路由
            - 4 使用 `module.exports` 向外共享路由对象
            - 5 使用 `app.use()` 函数注册路由模块
    - 创建路由模块
    ```js
    //导入express
    var  express =require('express');  
    //创作路由对象 
    var router=express.Router();          
    //挂载获取用户列表的路由
    router.get('./user/list',function(req.res)=>{   
    res.send("Get user List.");
    })
    //挂载添加用户列表的路由
    router.post('./user/add',function(req.res)=>{   
    res.send("Add user List.");
    })
    //向外导出路由对象
    module.exports=router;        
    ```
    - 注册路由模块
    ```js
    //1导入路由模块
    const userRouter=require('./router/user.js');

    //2  使用app.use()注册路由模块
    app.use(userRouter)
    ```

    - 为路由模块添加前缀
        - 类似于托管静态资源时，为静态资源统一挂载访问前缀一样，路由模块添加前缀的方式也非常简单:
    ```js
    //1导入路由模块
    const userRouter=require('./router/user.js')

    //2.使用app.use()  注册路由模块,并添加统一的访问前缀/api
    app.use('/api',userRouter)
    ```
### 06-`Express` 中间件

#### 中间件的概念
- 什么是中间件
    > 中间件(`Middleware` )，特指业务流程的中间处理环节。
- `Express` 中间件的调用流程
    > 当一个请求到达 `Express` 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理。
- `Express` 中间件的格式
    > `Express` 的中间件，本质上就是一个 `function` 处理函数， `Express` 中间件的格式如下:
    > 注意:
        中间件函数的形参列表中，必须包含 `next` 参数。
        而路由处理函数中只包含 `req` 和 `res`。

- `next` 函数的作用
    > `next` 函数是实现多个中间件连续调用的关键，
    > 它表示把流转关系转交给下一个中间件或路由。

#### `Express` 中间件的初体验
- 定义中间件函数
    > 可以通过如下的方式，定义一个最简单的中间件函数:

    ```js
    //常量mw所指向的,就是一个中间函数

    const mw=function (req,res,next){
    console.log('这是一个最简单的中间件函数')

    //注意:当前中间件的业务处理完毕后,必须调用next()函数
    //表示把流转关系交给了下一个中间件函数或路由

    next()
    }
    ```

- 全局生效的中间件
    > 客户端发起的任何请求，到达服务器之后，都会触发的中间件，叫做全局生效的中间件。 通过调用 `app.use(中间件函数)`，即可定义一个全局生效的中间件，示例代码如下:
    ```js
    //常量mw所指向的,就是一个中间函数
    const mw=function (req,res,next){
    console.log('这是一个最简单的中间件函数')
    //注意:当前中间件的业务处理完毕后,必须调用next()函数
    //表示把流转关系交给了下一个中间件函数或路由
    next()
    }

    //全局生效的中间件
    app.use(mw)
    ```
- 定义全局中间件的简化形式

    ```js
    //全局生效的中间件
    app.use(  function(req,res,next){
    console.log('这是一个简单的中间件函数')

    next()
    })
    ```
- 中间件的作用
    > 多个中间件之间，共享同一份 `req` 和 `res`。基于这样的特性，我们可以在上游的中间件中，统一为 `req` 或 `res` 对象添加自定义的属性或方法，供下游的中间件或路由进行使用。

- 定义多个全局中间件
    > 可以使用 `app.use()` 连续定义多个全局中间件。客户端请求到达服务器之后，会按照中间件定义的先后顺序依次进行 调用，示例代码如下:

    ```js
    //第一个全局中间件
    app.use(function(req,res,next){  
    console.log('调用了第一个全局中间件')
    next()
    })
    //第二个全局中间件
    app.use(function(req,res,next){ 
    console.log('调用了第二个全局中间件')
    next()
    })
    //q请求这个路由,会依次触发上述两个全局中间件
    app.get('./user',(req,res)=>{  
    res.send('Home page')
    })
    ```

- 局部生效的中间件
    > 不使用 `app.use()` 定义的中间件，叫做局部生效的中间件，示例代码如下:
    ```js
    //定义中间件函数  mw1
    const mw1=function(req,res,next){
    console.log('这是中间件函数');
    next()
    }
    //mw1 这个中间件只在'当前路由中生效',这种用法属于"局部生效的中间件"
    app.get('/',mw1,function(req,res){
    res.send('Home page')
    })
    //mw1这个中间件不会影响下面这个路由
    app.get("/user",function(req,res){res.send("User page")  })
    ```
- 定义多个局部中间件
    > 可以在路由中，通过如下两种等价的方式，使用多个局部中间件:
    ```js
    //以下两种写法是"完全等价"的,可根据自己的喜好,任意选择一种方式进行使用
    app.get('/',  mw1, mw2, (req,res)=>{res.send("Home page")  })
    app.get('/', [mw1, mw2], (req,res)=>{res.send("Home page")  })
    ```
    - 了解中间件的5个使用注意事项
        - 1 一定要在路由之前注册中间件
        - 2 客户端发送过来的请求，可以连续调用多个中间件进行处理
        - 3 执行完中间件的业务代码之后，不要忘记调用 `next()` 函数
        - 4 为了防止代码逻辑混乱，调用 `next()` 函数后不要再写额外的代码 
        - 5 连续调用多个中间件时，多个中间件之间，共享 `req` 和 `res` 对象

#### 中间件的分类
- 1 应用级别的中间件
    > 通过 `app.use()` 或 `app.get()` 或 `app.post()` ，绑定到 `app` 实例上的中间件，叫做应用级别的中间件，代码示例如下:

    ```js
    //应用级别的中间件(全局中间件)
    app.use((req,res,next)=>{
    next()
    })
    //应用级别的中间件(局部中间件)
    app.get('/',mw1,(req,res)=>{
    res.send("Home page")
    })
    ```

- 2 路由级别的中间件

    > 绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。它的用法和应用级别中间件没有任何区别。只不 过，应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上，代码示例如下:

- 3 错误级别的中间件

    > 错误级别中间件的作用:专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题。

    > 格式:错误级别中间件的 `function` 处理函数中，必须有 4 个形参，形参顺序从前到后，分别是 (err, req, res, next)。

    > **注意**:错误级别的中间件， 必须注册在所有路由之后!

- 4 `Express` 内置的中间件 

    -  错误级别中间件的 `function` 处理函数中，必须有 4 个形参，形参顺序从前到后，分别是 (err, req, res, next)。

    - **注意**:错误级别的中间件， 必须注册在所有路由之后!

- 5 第三方的中间件

    - 非 `Express` 官方内置的，而是由第三方开发出来的中间件，叫做第三方中间件。在项目中，大家可以按需下载并配置第三方中间件，从而提高项目的开发效率。

    - 例如:在 `express@4.16.0` 之前的版本中，经常使用 `body-parser` 这个第三方中间件，来解析请求体数据。使用步 骤如下:
        - 1 运行 `npm install body-parser` 安装中间件 
        - 2 使用 `require` 导入中间件
        - 3 调用 `app.use()` 注册并使用中间件

    - **注意**:Express 内置的 express.urlencoded 中间件，就是基于 `body-parser` 这个第三方中间件进一步封装出来的。

#### 自定义中间件

- 使用 `app.use()` 来定义全局生效的中间件
    > 代码如下:
    ```js
    app.use((req,res,next)=>{
    //中间件的业务逻辑
    })
    ```

- 监听 `req` 的 `data` 事件
    > 在中间件中，需要监听 `req` 对象的 `data` 事件，来获取客户端发送到服务器的数据。
    > 如果数据量比较大，无法一次性发送完毕，则客户端会把数据切割后，分批发送到服务器。所以 `data` 事件可能会触 发多次，每一次触发 `data` 事件时，获取到数据只是完整数据的一部分，需要手动对接收到的数据进行拼接。

- 监听 `req` 的 `end` 事件
    > 当请求体数据接收完毕之后，会自动触发 `req` 的 `end` 事件。
    > 因此，我们可以在 `req` 的 `end` 事件中，拿到并处理完整的请求体数据。示例代码如下:


- 使用 `querystring` 模块解析请求体数据

    > `Node.js` 内置了一个 `querystring` 模块，专门用来处理查询字符串。通过这个模块提供的 `parse()` 函数，可以轻松把 查询字符串，解析成对象的格式。示例代码如下:

- 将解析出来的数据对象挂载为 `req.body`0
    > 上游的中间件和下游的中间件及路由之间，共享同一份 `req` 和 `res`。因此，我们可以将解析出来的数据，挂载为 `req` 的自定义属性，命名为 `req.body`，供下游使用。示例代码如下:

- 将自定义中间件封装为模块
    > 为了优化代码的结构，我们可以把自定义的中间件函数，封装为独立的模块，示例代码如下:

    ```js
    //custom-body-parser.js模块中的代码
    const qs=require('querystring')
    function bodyParser(req,res,next){ /*省略其他代码*/  }
    module.exports=bodyParse//
    ```
### 07-使用 `Express` 写接口
- 创建基本的服务器
```js
//载入express
var express = require('express')
//创建服务器
var app = express();

// 内置的express 解析表单的中间件
app.use(express.urlencoded({extended: false}))

//解决跨域方法1:
// app.use("*", function(req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader("Access-Control-Allow-Methods", "*");
// 	res.setHeader("Access-Control-Allow-Headers", "content-type");
// 	next();
// });

//解决跨域方法2:
var cors = require('cors');
app.use(cors())

//载入路由
var router = require('./09.user')
//使用路由
app.use('/api',router)

//调用app.listen方法,指定端口号并启动文本服务器
app.listen(8081,function(){
    console.log(" it is running")
})
```
- 创建 `API` 路由模块
```js
//apiRouter.js[路由模块]
const express =require("express);
const apiRouter=express.Router();


module.exports=api.Router

//api.js[导入并注册路由模块]
const apiRouter=require('./apiRouter.js')
app.use('./api',apiRouter)
```
- 编写 `GET` 接口
```js
apiRouter.get('./get',(req,res)=>{
//1获取到客户端通过查询字符串,发送到服务器的数据
const query=req.query;

//2 调用res.send() 方法,把数据响应给客户端
res.send({
status:0,                        //状态  0表示成功,1表示失败
msg:"GET请求成功",    //状态描述
data:query                   //需要响应给客户端的具体数据
})
})
```
- 编写 `POST` 接口
```js
 apiRouter.post('./post',(req,res)=>{
//1获取到客户端通过请求体, 发送到服务器的URL-encoded数据
const  body=req.body;

//2 调用res.send() 方法,把数据响应给客户端
res.send({
status:0,                        //状态  0表示成功,1表示失败
msg:"post请求成功",    //状态描述消息
data:body                   //需要响应给客户端的具体数据
})
})
```
- `CORS` 跨域资源共享
    - 接口的跨域问题
        -  刚才编写的 `GET` 和 `POST` 接口，存在一个很严重的问题:不支持跨域请求。 解决接口跨域问题的方案主要有两种:
            - 1 `CORS` (主流的解决方案，推荐使用)
            - 2 `JSONP` (有缺陷的解决方案:只支持 `GET` 请求)

    - `cors` 是 `Express` 的一个第三方中间件。
        - 通过安装和配置 `cors` 中间件，可以很方便地解决跨域问题。 
        - 使用步骤分为如下 3 步:
            - 1 运行 `npm install cors` 安装中间件
            - 2 使用 `const cors = require('cors')` 导入中间件
            - 3 在路由之前调用` app.use(cors())` 配置中间件

    - 什么是 `CORS`

        > `CORS` (`Cross-Origin Resource Sharing`，跨域资源共享)由一系列 `HTTP` 响应头组成，这些 `HTTP` 响应头决定
        浏览器是否阻止前端 `JS` 代码跨域获取资源。
        浏览器的同源安全策略默认会阻止网页“跨域”获取资源。但如果接口服务器配置了 `CORS` 相关的 `HTTP` 响应头， 就可以解除浏览器端的跨域访问限制。

    - **`CORS` 的注意事项**

        1 `CORS` 主要在服务器端进行配置。客户端浏览器无须做任何额外的配置，即可请求开启了 `CORS` 的接口。

        2 `CORS` 在浏览器中有兼容性。只有支持 `XMLHttpRequest Level2` 的浏览器，才能正常访问开启了 `CORS` 的服 务端接口(例如:`IE10+`、`Chrome4+`、`FireFox3.5+`)。

    - `CORS` 响应头部 
        - `Access-Control-Allow-Origin`

        响应头部中可以携带一个 `Access-Control-Allow-Origin` 字段，其语法如下:`Access-Control-Allow-Origin: <origin> | *`

        `origin` 参数的值指定了允许访问该资源的外域 `URL`。 
        例如，下面的字段值将只允许来自 http://itcast.cn 的请求:
        `res.setHeader(' Access-Control-Allow-Origin',  'http://itcast.cn' )`

        如果指定了 `Access-Control-Allow-Origin` 字段的值为通配符 `*`，表示允许来自任何域的请求，示例代码如下:
        ```js
        res.setHeader(' Access-Control-Allow-Origin',  '*'  )
        ```
    - `CORS` 响应头部 - `Access-Control-Allow-Headers`

        -  默认情况下，`CORS `仅支持客户端向服务器发送如下的 9 个请求头:
            - `Accept`
            - `Accept-Language`
            - `Content-Language`
            - `DPR`
            - `Downlink`
            - `Save-Data`
            - `Viewport-Width`
            - `Width` 
            - `Content-Type` (值仅限于 `text/plain`、`multipart`/`form-data/application/x-www-form-urlencoded` 三者之一)

        - 允许客户端额外向服务器发送` Content-Type`  请求头和`X-Custom-Header` 请求头
        - **注意**:多个请求头之间使用英文的逗号进行分割
        - `res.setHeader('Access-Control-Allow-Header','Content-Type','X-Custom-Header')`

        - 如果客户端向服务器发送了额外的请求头信息，则需要在服务器端，通过 `Access-Control-Allow-Headers` 对额外 的请求头进行声明，否则这次请求会失败!

    - `CORS` 响应头部 - `Access-Control-Allow-Methods`

        > 默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。
        > 如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源，则需要在服务器端，通过 Access-Control-Alow-Methods 来指明实际请求所允许使用的 HTTP 方法。
        > 示例代码如下:

    - `CORS` 请求的分类
        -  客户端在请求 `CORS` 接口时，根据请求方式和请求头的不同，可以将 `CORS` 的请求分为两大类，分别是:
            - 简单请求
                - 同时满足以下两大条件的请求，就属于简单请求:
                    - 1 请求方式:`GET` 、 `POST` 、 `HEAD` 三者之一
                    - 2 `HTTP` 头部信息不超过以下几种字段:
                        - 无自定义头部字段、
                        - `Accept`
                        - `Accept-Language`
                        - `Content-Language`
                        - `DPR`
                        - `Downlink`
                        - `Save-Data`
                        - `Viewport-Width`
                        - `Width` 
                        - `Content-Type`(只有三个值application/x-www-form-  - urlencoded、multipart/form-data、text/plain)

            - 预检请求

                - 只要符合以下任何一个条件的请求，都需要进行预检请求:
                    - 1 请求方式为 `GET`、`POST`、`HEAD` 之外的请求 `Method` 类型 
                    - 2 请求头中包含自定义头部字段
                    - 3 向服务器发送了 `application/json` 格式的数据
                    > 在浏览器与服务器正式通信之前，浏览器会先发送 `OPTION` 请求进行预检，以获知服务器是否允许该实际请求，所以这一 次的 `OPTION` 请求称为“预检请求”。服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。

            - 简单请求和预检请求的区别:

                > **简单请求的特点**:客户端与服务器之间只会发生一次请求。 
                > **预检请求的特点**:客户端与服务器之间会发生两次请求，`OPTION` 预检请求成功之后，才会发起真正的请求。

- `JSONP` 接口
    - 概念:浏览器端通过 `<script>` 标签的 `src` 属性，请求服务器上的数据，同时，服务器返回一个函数的调用。这种请求数据的方式叫做 `JSONP`。
    - 特点:
        - `JSONP` 不属于真正的 `Ajax` 请求，因为它没有使用 `XMLHttpRequest` 这个对象。        
        - `JSONP` 仅支持 `GET` 请求，不支持 `POST`、`PUT`、`DELETE` 等请求。
