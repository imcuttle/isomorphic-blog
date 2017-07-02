---
title: 和手动刷新说拜拜
date: 2017-04-03 21:52:06
categories:
tags: [nodejs, websocket]
cover: http://imglf0.nosdn.127.net/img/aUxKQVFScDVaU09ocnpLaW14T2FvN0xtN0lSN0hzeGxob0pyeDhKUGRERjVwTi9vOVZhZy9RPT0.jpg?imageView&thumbnail=1200y659&type=jpg&quality=96&stripmeta=0&type=jpg
keywords: [hot,reload,server,nodejs]
---

## 情景重现

前几天接了个私活，主要是修改一些前端页面样式和优化 html 结构等。

其中 css/js 引入方式为 umd（Universal Module Definition） ，也就是直接用`script/link`引入。而不是`requirejs/seajs/webpack` 对应的 `amd/cmd/commonjs` 加载 javascript 或样式。

在不断地 修改样式 -> 刷新页面的循环中，时间浪费了许多！

于是萌生出：“造一个热更新服务的轮子”。

注意：*该工具只支持热更新 umd 引入的依赖*

## 原理

<img src="https://ooo.0o0.ooo/2017/04/03/58e25ac7f17eb.jpg" width="576" height="338"/>

如图，首先需要建立一个 http(s) 服务，通过该服务获取前端静态资源，对于 HTML 文件的请求，服务器需要额外插入一段客户端脚本。脚本的工作主要是用来建立 websocket 长连接。同时需要开启文件监听，异步监听到文件的变化，并广播 reload 消息至依赖该文件的客户端，客户端收到该消息后，便 `location.reload()` **自动刷新页面**

## 特性

- **热更新**
![](https://ooo.0o0.ooo/2017/03/31/58de5c97bfa0b.jpg)

- **远程调试**（适合局域网中移动端调试）
![](https://ooo.0o0.ooo/2017/03/31/58de5c83f0eac.jpg)

- **文件视图**  
访问：`http://localhost:8082/__hrs__/file`
![](https://ooo.0o0.ooo/2017/04/01/58df9961dd9b2.jpg)

- **依赖关系查看**

    1. 单个文件  
        访问：`http://localhost:8082/index.html.hrs.map`
        ```json
        {
            "/Users/moyu/my-code/JavaCode/dike/js/jquery-1.9.1.js": "../../js/jquery-1.9.1.js",
            "/Users/moyu/my-code/JavaCode/dike/js/bootstrap.js": "../../js/bootstrap.js",
            "/Users/moyu/my-code/JavaCode/dike/js/navbar.js": "../../js/navbar.js",
            "/Users/moyu/my-code/JavaCode/dike/css/font-awesome.min.css": "../../css/font-awesome.min.css",
            "/Users/moyu/my-code/JavaCode/dike/css/navbar.css": "../../css/navbar.css",
            "/Users/moyu/my-code/JavaCode/dike/css/conceptModel.css": "../../css/conceptModel.css",
            "/Users/moyu/my-code/JavaCode/dike/css/dropzone/dropzone.css": "../../css/dropzone/dropzone.css"
        }
        ```
    2. 全局  
        访问：`http://localhost:8082/__hrs__/map`

- 转发请求（可避免跨域）  
访问：`http://localhost:8082/__hrs__/forward?url=http://maxyu.top/head.jpg`

- 配置文件  
默认认为配置文件为：`hrs.config.js`  
比如：
```js
module.exports = {
    proxy: {
        "/api": {
            target: "http://www.huya.com/longdd",
        },
        "/php": {
            redirect: true, // default: true
            target: "http://localhost:63343/start/static",//"http://localhost:6999",
            changeHost: true,  // default: true

            hot: true, // hot reload enable? default: false
            // Function/RegExp: will be set root config hotRule if it is null
            hotRule: function (filename, request) {
                // console.log(request.url);
                return /\.(php)$/.test(filename);
            },
            // Function: return local file path
            mapLocal: function (request) {
                // request: Express Request Object
                // console.log('mapLocal', request.originalUrl, request.baseUrl, request.url);
                const url = request.url.replace(/\?[\s\S]*/, '')
                return "/Users/moyu/my-code/phpCode/start/static" + url;
            },
            // Function/String: return detected directory path
            mapRoot: function (request) {
                // request: Express Request Object
                return "/Users/moyu/my-code/phpCode/start/static";
            }
        },
    },

    // RegExp or function (filename) {...}
    hotRule: /\.(html|htm)$/, // default: /\.(html|htm)$/

    setUp: function (app) {
        /* app is an express server object. */

        // http://localhost:8082/test
        app.get('/test', function (req, res) {
            res.end("TEST!");
        });
    }
};
```

- 支持跨域  
建立起 hot reload server (端口 8082) 服务后，在你需要开启热更新的 html 中手动插入
```html
<script
    src="http://localhost:8082/__hrs__/client-script.js?reload=false&debug=true"
    hrs-local="/Users/moyu/fe-code/a/b/jsonp.html"
    hrs-root="/Users/moyu/fe-code"
>
</script>
```
    - `hrs-local` 该文件的绝对路径
    - `hrs-root` 需要监听的文件夹的路径（默认为`hrs-local`的文件夹路径，例中为：`/Users/moyu/fe-code/a/b`）

## 安装使用

使用 nodejs 实现，需要 node 环境。

```bash
npm install -g simple-hot-reload-server
```

```text
Usage: hrs [-p port] path

Options:

  -v --version                get current version.
  -p --port                   set port of server. (default: 8082)
  -c --config                 config path. (default hrs.config.js)
  -h --help                   how to use it.
```

最后，欢迎各位 [star](https://github.com/moyuyc/simple-hot-reload-server)！

