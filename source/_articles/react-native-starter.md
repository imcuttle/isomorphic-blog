---
title: React Native 意识流
date: 2016-12-20 10:41:57
categories:
tags: [react, react native]
cover: http://www.appcoda.com.tw/wp-content/uploads/2015/04/react-native-1024x631.png
---

**注：本文暂无逻辑**

## 移动端App分类

<img src="http://img.blog.csdn.net/20160326162834667" alt="" width="700" height="368" />

- Web(正在用的): 
    - 优：开发效率高，成本低，纯前端就能搞定，跨平台
    - 劣：基于Web Dom渲染，运行效率底，用户体验不佳, 本地接口局限

- Native:
    - 优：用户体验佳，充分使用本地接口
    - 劣：开发效率低(需编译)，成本高，纯前端就能搞定
    
- Hybrid
    - 优：js作为native, webview的桥梁，各尽其职
    - 劣：前端与端上开发人员耦合严重，成本高，开发效率低
    

## 基础

1. React  [中文](http://reactjs.cn/react/docs/getting-started-zh-CN.html)  [英文](https://facebook.github.io/react/docs/hello-world.html)
2. [React入门](http://www.ruanyifeng.com/blog/2015/03/react.html)
3. Redux*(React数据管理)

## 文档

1. [中文](https://reactnative.cn/docs/0.39/getting-started.html)
2. [英文](https://facebook.github.io/react-native/docs/getting-started.html)

## 工具

以mac开发Android为例

1. [Android Studio](https://developer.android.com/studio/install.html)
2. [react-native-cli](https://www.npmjs.com/package/react-native-cli)
3. [Homebrew设置代理](https://www.zhihu.com/question/31360766)
4. [jdk](https://gist.github.com/tomysmile/a9a7aee85ff73454bd57e198ad90e614)
5. ...

## 使用中
1. `React Native`将babel内置，无需关心语法兼容问题，随意使用`es6/7`
2. 采用flexbox布局
    - [教程一](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
    - [教程二](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

3. App相当于SPA, [Navigator](https://reactnative.cn/docs/0.39/navigator.html#content)控制路由
4. [iNjnu App](https://github.com/moyuyc/injnu-app)  
    [服务端：node + json web tokens](https://github.com/moyuyc/injnu-server)
    - 真机运行截图
    ![](/upload/1480242049359.png)
    ![](/upload/1480242118446.png)
    ![](/upload/1480242036910.png)
    ![](/upload/1480242123677.png)
5. 利用git，部署技巧  
    每次在本机修改完后端代码，push到github后，如何快速部署?(无需登录服务器)  
    后端入口(`nodejs`)
    ```javascript
    var cp = require('child_process')
    var p = require('path')
    var fs = require('fs')
    
    fs.watch(__dirname, (type, filename) => {
        // 监控js文件修改，修改后重启node服务
        if(!filename.endsWith(".js")) {
            return;
        }
        serverProcess.kill('SIGINT')
        serverProcess = runServer()
    })
    
    var serverProcess = runServer()
    
    function runServer() {
        // index.js 是真正的服务端代码入口
        return cp.fork('./index.js', process.argv, {stdio: [0, 1, 2, 'ipc']})
    }
    ```
    
    `index.js`中有下面片段代码
    ```
    app.all('/pull', (req, res) => {
    	res.writeHead(200, {
    		'Content-Type': 'text/event-stream',
    		'Cache-Control': 'no-cache',
    		'Connection': 'keep-alive'
    	});
    	var ls = require('child_process').spawn('git', ['pull', 'origin', 'master'])
    	ls.stdout.on('data', (data) => {
    		data = data.toString()
    		console.log(data)
    		res.write(`${data}`);
    	});
    
    	ls.stderr.on('data', (data) => {
    		data = data.toString()
    		console.log(data)
    		res.write(`${data}`);
    	});
    	ls.on('close', (code) => {
    		console.log(`child process exited with code ${code}`)
    		res.end(`child process exited with code ${code}`);
    	});
    })
    ```
    
    `push.sh`脚本
    ```bash
    #!/usr/bin/env bash

    msg="from bash"
    if [ -n "$1" ]; then
        msg=$1
    fi
    
    git add .
    git commit -m "$msg"
    git push origin master
    
    # 服务器执行 `git pull origin master`
    # 从而更新js代码，继而重启服务器
    curl http://202.119.104.195/pull
    ```
    
## 总结

传统的`react native`使得前端开发高性能移动端App成为可能。
但距离自由地开发App(需要掌握原生App开发)还有很远，目前本人只停留在[jscoach](https://js.coach/)中寻找组件进行开发。
而且！`react native`的代码检错与报错不太友好。

## 更多

- [移动端App介绍](http://blog.csdn.net/zlts000/article/details/50987265)
- [iReading App: react-native+redux, android+ios](https://github.com/attentiveness/reading)
- [react native的几种常见报错](http://www.jianshu.com/p/7f32660359ef)