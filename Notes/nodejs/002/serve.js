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