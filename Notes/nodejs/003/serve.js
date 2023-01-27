// 导入http模块
const http = require('http');

// 导入fs模块
const fs = require('fs');

// 创建服务器
const server = http.createServer((req,res)=>{

    // 设置字符集
    res.setHeader('Context-Type',"text/html;charset=UTF8");

    if(req.url === "/star/zhoujielun"){
        fs.readFile('./003.html',(err,data)=>{
            res.end(data)
        })
    }else if(req.url === "/star/images/zhoujielun.png"){

        res.setHeader("Context-Type","image/png");

        fs.readFile('./images/zhoujielun.png',(err,data)=>{
            res.end(data)
        })

    }else if(req.url === "/star/css/zhoujielun.css"){

        res.setHeader("Context-Type","text/plain");

        fs.readFile('./css/zhoujielun.css',(err,data)=>{
            res.end(data)
        })

    } else{
        res.end('页面错误')
    }   
})

// 监听端口
server.listen(3000)