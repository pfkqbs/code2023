[toc]

# `nodejs` 的简介和安装

##  一个基于`Chrome V8` 引擎的服务器 `JS` 运行环境。发明人：`Ryan Dahl`。发布日期2009年5月

## 安装`Nodejs`
- 可以安装在`windows` `mac`  `linux` 上。
- 中文官网：http://nodejs.cn
- 按照自己计算机运行环境进行下载安装包
- 路径不用改，直接安装

创建服务器读取文件
```js
// 导入http模块
const http = require('http');

// 导入fs模块
const fs = require('fs');

// 创建服务器
const server = http.createServer((req,res)=>{
    fs.readFile('./data.json',(err,data)=>{
        res.end(data)
    })
})

// 监听端口
server.listen(3000)
```

思考路由跳转怎么显式？

## 路由
通过路由进行页面的读取，这个就是顶层路由设计
顶层路由设计：
- 物理文件层次和`URL`是没有任何关系的
- `Nodejs`是可以做顶层路由设计的，一个页面`URL`是可以自定义的
- 用户输入的`url` 是可以映射任何HTML页面的。

比如：
 http://127.0.0.1:3000/answers  用户的回答
 http://127.0.0.1:3000/ask  用户提问
 http://127.0.0.1:3000/videos  
 ...

老一代的路由实际都是映射服务器的物理文件夹目录
比如：http://127.0.0.1:3000/user=9999&psd=9999

```js
// 导入http模块
const http = require('http');

// 导入fs模块
const fs = require('fs');

// 创建服务器
const server = http.createServer((req,res)=>{

    // 设置字符集
    // res.setHeader('Context-Type',"text/html;charset=utf-8");
    res.setHeader("Context-Type","text/html;charset=UTF-8");

    var url = req.url;

    // 使用正则表达式进行信息获取

    let arr = url.match(/\/user\/(.+)\/(.+)$/);
    console.log(arr);
    if(!arr){
        res.end("<h1>无页面显式</h1>")
        return;
    }
    const $1 = arr[1];
    const $2 = arr[2];

    const user = {
        "zhoujielun":"周杰伦",
        "wujing":"吴京",
    }
    const list = {
        "post":"文章",
        "ask":"提问",
        "answer":"回答",
        "pins":"想法",
    }

    res.write("<h1>" + user[$1] +  ",你好：</h1>")
    res.end(`<h1> 欢迎来到 ${list[$2]} 板块 </h1>`)
   
})

// 监听端口
server.listen(3000)
```
当有图片时，图片的物理地址时http://127.0.0.1:3000/star/zhoujielun.png,但是，图片的物理物理存放地址是C:node_study/public/images,所以不能按需加载
解决办法就是对每一张图片进行请求
```js
// 导入http模块
const http = require('http');

// 导入fs模块
const fs = require('fs');

// 创建服务器
const server = http.createServer((req,res)=>{

    // 设置字符集
    res.setHeader('Context-Type',"text/html;charset=UTF8");

    if(req.url === "/star"){
        fs.readFile('./003.html',(err,data)=>{
            res.end(data)
        })
    }else if(req.url === "/star/images/zhoujielun.png"){

        res.setHeader("Context-Type","image/png");

        fs.readFile('./images/zhoujielun.png',(err,data)=>{
            res.end(data)
        })

    } else{
        res.end('页面错误')
    }   
})

// 监听端口
server.listen(3000)
```
问题： 如果图片很多？怎么请求？不仅仅是图片 `css` 文件也是 怎么办？
解决办法是 `express` 

常见 `ContextType` 文件类型

| 文件格式类型 | `ContextType` 设置文件头   | 
| :-----:   |  :-----:  | 
| json   |   application/json text/x-json   | 
| ez   |   application/andrew-inset,   |
| hqx   |   application/mac-binhex40,   | 
| cpt   |   application/mac-compactpro,   | 
| doc   |   application/msword,   | 
| bin   |   application/octet-stream,   |
| dms   |   application/octet-stream,   |
| lha   |   application/octet-stream,   |
| lzh   |   application/octet-stream,   |
| exe   |   application/octet-stream,   |
| class   |   application/octet-stream,   |
| so   |   application/octet-stream,   |
| dll   |   application/octet-stream,   |
| oda   |   application/oda,   |
| pdf   |   application/pdf,   |
| ai   |   application/postscript,   |
| eps   |   application/postscript,   |
| ps   |   application/postscript,   |
| smi   |   application/smil,   |
| smil   |   application/smil,   |
| mif   |   application/vnd.mif,   |
| xls   |   application/vnd.ms-excel,   |
| ppt   |   application/vnd.ms-powerpoint   |
| wbxml   |   application/vnd.wap.wbxml,   |
| wmlc   |   application/vnd.wap.wmlc,   |
| wmlsc   |   application/vnd.wap.wmlscriptc,   |
| bcpio   |   application/x-bcpio,   |
| vcd   |   application/x-cdlink,   |
| pgn   |   application/x-chess-pgn,   |
| cpio   |   application/x-cpio,   |
| csh   |   application/x-csh,   |
| dcr   |   application/x-director,   |
| dir   |   application/x-director,   |
| dxr   |   application/x-director,   |
| dvi   |   application/x-dvi,   |
| spl   |   application/x-futuresplash,   |
| gtar   |   application/x-gtar,   |
| hdf   |   application/x-hdf,   |
| js   |   application/x-javascript,   |
| skp   |   application/x-koan,   |
| skd   |   application/x-koan,   |
| skt   |   application/x-koan,   |
| skm   |   application/x-koan,   |
| latex   |   application/x-latex,   |
| nc   |   application/x-netcdf,   |
| cdf   |   application/x-netcdf,   |
| sh   |   application/x-sh,   |
| shar   |   application/x-shar,   |
| swf   |   application/x-shockwave-flash ,  |
| sit   |   application/x-stuffit,   |
| sv4cpio   |   application/x-sv4cpio,   |
| sv4crc   |   application/x-sv4crc,   |
| tar   |   application/x-tar,   |
| tcl   |   application/x-tcl,   |
| tex   |   application/x-tex,   |
| texinfo   |   application/x-texinfo,   |
| texi   |   application/x-texinfo,   |
| t   |   application/x-troff,   |
| tr   |   application/x-troff,   |
| roff   |   application/x-troff,   |
| man   |   application/x-troff-man,   |
| me   |   application/x-troff-me,   |
| ms   |   application/x-troff-ms,   |
| ustar   |   application/x-ustar,   |
| src   |   application/x-wais-source,   |
| xhtml   |   application/xhtml+xml,   |
| xht   |   application/xhtml+xml,   |
| zip   |   application/zip,   |
| au   |   audio/basic,   |
| snd   |   audio/basic,   |
| mid   |   audio/midi,   |
| midi   |   audio/midi,   |
| kar   |   audio/midi,   |
| mpga   |   audio/mpeg,   |
| mp2   |   audio/mpeg,   |
| mp3   |   audio/mpeg,   |
| aif   |   audio/x-aiff,   |
| aiff   |   audio/x-aiff,   |
| aifc   |   audio/x-aiff,   |
| m3u   |   audio/x-mpegurl,   |
| ram   |   audio/x-pn-realaudio,   |
| rm   |   audio/x-pn-realaudio,   |
| rpm   |   audio/x-pn-realaudio-plugin,   |
| ra   |   audio/x-realaudio,   |
| wav   |   audio/x-wav,   |
| pdb   |   chemical/x-pdb,   |
| xyz   |   chemical/x-xyz,   |
| bmp   |   image/bmp,   |
| gif   |   image/gif,   |
| ief   |   image/ief,   |
| jpeg   |   image/jpeg,   |
| jpg   |   image/jpeg,   |
| jpe   |   image/jpeg,   |
| png   |   image/png,   |
| tiff   |   image/tiff,   |
| tif   |   image/tiff,   |
| djvu   |   image/vnd.djvu,   |
| djv   |   image/vnd.djvu,   |
| wbmp   |   image/vnd.wap.wbmp,   |
| ras   |   image/x-cmu-raster,   |
| pnm   |   image/x-portable-anymap,   |
| pbm   |   image/x-portable-bitmap,   |
| pgm   |   image/x-portable-graymap,   |
| ppm   |   image/x-portable-pixmap,   |
| rgb   |   image/x-rgb,   |
| xbm   |   image/x-xbitmap,   |
| xpm   |   image/x-xpixmap,   |
| xwd   |   image/x-xwindowdump,   |
| igs   |   model/iges,   |
| iges   |   model/iges,   |
| msh   |   model/mesh,   |
| mesh   |   model/mesh,   |
| silo   |   model/mesh,   |
| wrl   |   model/vrml,   |
| vrml   |   model/vrml,   |
| css   |   text/css,   |
| html   |   text/html,   |
| htm   |   text/html,   |
| asc   |   text/plain,   |
| txt   |   text/plain,   |
| rtx   |   text/richtext,   |
| rtf   |   text/rtf,   |
| sgml   |   text/sgml,   |
| sgm   |   text/sgml,   |
| tsv   |   text/tab-separated-values,   |
| wml   |   text/vnd.wap.wml,   |
| wmls   |   text/vnd.wap.wmlscript,   |
| etx   |   text/x-setext,   |
| xsl   |   text/xml,   |
| xml   |   text/xml,   |
| mpeg   |   video/mpeg,   |
| mpg   |   video/mpeg,   |
| mpe   |   video/mpeg,   |
| qt   |   video/quicktime,   |
| mov   |   video/quicktime,   |
| mxu   |   video/vnd.mpegurl,   |
| avi   |   video/x-msvideo,   |
| movie   |   video/x-sgi-movie,   |
| ice   |   x-conference/x-cooltalk   |

设置方法： 
```js
// 设置字符集
res.setHeader('Context-Type',"text/html;charset=UTF8");
//设置png图片
res.setHeader("Context-Type","image/png");
```
##  模块

- `html`的多文件引用
    创建`module/01.js`
    创建`module/02.js`
    创建`module/001.html`,引入`js`文件，是可以跨文件输出的；
    **`HTML`的宿主环境，多个`js`文件公用一个`html`宿主，此时他们的作用域是公用的；**

- `nodejs`多文件引用
`require()`引用文件在引用的同时也在执行
**`nodejs`文件作用域天生隔离，因为`nodejs`没有`window`对象**

文件之间相互通信，文件需要让自己暴露
a.js
```js
var a = 100;
export a
```
app.js
```js
var a = require('./a.js');console.log(a.num)
```
|     | html  |  nodejs |
| :----- | :-----  |  :-----  |
|  a   |      |  `var a = 100;export.num = num;`  |
|  app.js   |      |  `var a = require('./a.js');console.log(a.num)`  |


`module.exports`命令
当一个`js`文件仅仅希望暴露一个参数，通常是构造函数，此时我们可以使用`module.export`.**如果文件中要暴露多个参数，此时需要命名空间使用 export.**
**如果只有一个参数并且是构造函数使用 module.exports.**

**为什么`require('./')` 必须加`./`呢 ?**
答：不加./会自动去寻找`node_modules`文件夹

`nodemon` 是一种工具，可在检测到目录中的文件更改时通过自动重新启动节点应用程序来帮助开发基于`node.js`的应用程序。
`npm install -g nodemon`




