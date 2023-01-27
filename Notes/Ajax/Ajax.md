[toc]

## 原生 `AJax` 基本步骤

### `get` 请求
- 第一步：创建异步请求对象
- 第二步：打开连接,发送请求
- 第三步：监听改变状态
- 第四步：响应得到 `JSON`

```js

var xhr = new XMLHttpRequest();

xhr.open("GET", "http://127.0.0.1:5500/day05/11.json", true);
xhr.send();

xhr.onreadystatechange = function () {

    //ajax 状态   4成功       http 状态 200 成功
    if (xhr.readyState == 4 && xhr.status == 200) {
        
        var obj = JSON.parse(xhr.responseText);
    }
}


```
### `post` 请求
- 第一步：创建异步请求对象
- 第二步：打开连接,发送请求
- 第三步：监听改变状态
- 第四步：响应得到 `JSON`
```js
var xhr = new XMLHttpRequest();
xhr.open("POST", "http://127.0.0.1:5500/day05/11.json", true);
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhr.send(`user=${user}&age=${age}`);
xhr.onreadystatechange = function () {

    //ajax 状态   4成功       http 状态 200 成功
    if (xhr.readyState == 4 && xhr.status == 200) {

        var obj = JSON.parse(xhr.responseText);
    }
}
```

## `Query` 封装的 `ajax`
### `$.ajax`常见配置项
- type
- data
- url
- headers
- timeout
- dataType
- async
- cache
- beforeSend
- success(function(){})
- error(function(){})
- complete 
```js
$.ajax({
  url: "test.html",
  cache: false,
  success: function(html){
    $("#results").append(html);
  }
});
```

### $.get 
- 带参数
```js
$.get('http://www.liulongbin.top:3006/api/getbooks', { id: 1 }, function(res) {
    console.log(res)
})
```
- 不带参数
```js
$.get('http://www.liulongbin.top:3006/api/getbooks', function(res) {
    console.log(res) // 这里的 res 是服务器返回的数据
})
```

### $.post 带参数
```js
$.post(
   'http://www.liulongbin.top:3006/api/addbook', // 请求的URL地址
   { bookname: '水浒传', author: '施耐庵', publisher: '上海图书出版社' }, // 提交的数据
   function(res) { // 回调函数
      console.log(res)
   }
)
```
## `HTTP` 
### `HTTP` 定义： 
超文本传送协议 (`HyperText Transfer Protocol`) ，它规定了客户端与服务器之间进行网页内容传输时，所必须遵守的传输格式。

### HTTP请求消息
组成部分：**请求行**（`request line`）；**请求头部**（ `header` ）；**空行**；**请求体**
请求方式、`URL` 和 `HTTP` 协议版本 3 个部分组成，他们之间使用空格隔开
### 常见请求头部字段
- `Host`  请求的服务器域名
- `Connection`  客户端与服务器的连接方式(`close` 或 `keepalive` )
- `Content-Length`  用来描述请求体的大小
- `Accept` 客户端可识别的响应内容类型列表
- `User-Agent` 产生请求的浏览器类型
- `Accept-Encoding` 客户端可接收的内容压缩编码形式
- `Accept-Language` 用户期望获得的自然语言的优先顺序
- `Content-Type`  告诉服务器实际发送的数据类型
    - `application/xhtml+xml` ：`XHTML` 格式
    - `application/xml`     ： `XML` 数据格式
    - `application/atom+xml`  ：`Atom XML` 聚合格式    
    - `application/json `   ： `JSON` 数据格式
    - `application/pdf`       `：pdf` 格式  
    - `application/msword`  ： `Word` 文档格式
    - `application/octet-stream` ： 二进制流数据（如常见的文件下载）
    - `application/x-www-form-urlencoded` ： `<form ContentType=''>`中默认的 `ContentType`，`form`表单数据被编码为`key/value`格式发送到服务器（表单默认的提交数据的格式）
    - `multipart/form-data` ： 需要在表单中进行文件上传时，就需要使用该格式. 以上就是我们在日常的开发中，经常会用到的若干`content-type` 的内容格式。
    - `text/html` ：` HTML` 格式
    - `text/plain` ：纯文本格式      
    - `text/xml` ：  `XML` 格式
    - `image/gif` ：`gif` 图片格式    
    - `image/jpeg` ：`jpg` 图片格式 
    - `image/png`：`png` 图片格式
### 请求方法

| 请求方法 | 用于 |
| :---- | :---- |
| <font color='red'>`GET`</font> | (查询)发送请求来获得服务器上的资源，请求体中不会包含请求数据，请求数据放在协议头中。 |
| <font color='red'>`POST`</font> | (新增)向服务器提交资源（例如提交表单或上传文件）。数据被包含在请求体中提交给服务器。 |
| <font color='red'>`PUT`</font> | (修改)向服务器提交资源，并使用提交的新资源，替换掉服务器对应的旧资源。 |
| <font color='red'>`DELETE`</font> | (删除)请求服务器删除指定的资源。 |
| <font color='red'>`HEAD`</font> | `HEAD` 方法请求一个与 `GET` 请求的响应相同的响应，但没有响应体。 |
| <font color='red'>`OPTIONS`</font> | 获取 `http` 服务器支持的 `http` 请求方法，允许客户端查看服务器的性能，比如 `ajax` 跨域时的预检等。 |
| <font color='red'>`CONNECT`</font> | 建立一个到由目标资源标识的服务器的隧道。 |
| <font color='red'>`TRACE`</font> | 沿着到目标资源的路径执行一个消息环回测试，主要用于测试或诊断。 |
| <font color='red'>`PATCH`</font> | 是对 `PUT` 方法的补充，用来对已知资源进行局部更新 。 |

### `status` 状态码
- 定义 
（`HTTP Status Code`），也属于 `HTTP` 协议的一部分，用来标识响应的状态
- 分类
    - <font color='red'>`1xx`</font> ： 指示信息--表示请求已接收，继续处理
    - <font color='red'>`2xx`</font> ： 成功--表示请求已被成功接收、理解、接受
    - <font color='red'>`3xx`</font> ： 重定向--要完成请求必须进行更进一步的操作
    - <font color='red'>`4xx`</font> ： 客户端错误--请求有语法错误或请求无法实现
    - <font color='red'>`5xx`</font> ： 服务器端错误--服务器未能实现合法的请求
### `readyState`
- 存有 `XMLHttpRequest` 的状态。从 0 到 4 发生变化。
    - <font color='red'>`0`</font> :  请求未初始化
    - <font color='red'>`1`</font> :  服务器连接已建立
    - <font color='red'>`2`</font> :  请求已接收
    - <font color='red'>`3`</font> :  请求处理中
    - <font color='red'>`4`</font> :  请求已完成，且响应已就绪