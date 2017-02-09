---
title: Moka Desktop编程记录
date: 2016-10-29 11:36:51
categories:
tags: [electron, moka]
cover: https://avatars3.githubusercontent.com/u/13409222?v=3&s=400
---

上一篇文件简单介绍了下`Moka Desktop`, 那么对于我这位`Web前端开发工程师`是怎么能够开发一个`Pc App`的呢？  
这就不得不说到 [`electron`](http://electron.atom.io/).
<img src="https://avatars3.githubusercontent.com/u/13409222?v=3&s=400" alt="electron" width="400" height="400" />

`Electron` 将`chrome`内核与`nodejs`融合在一起，分为`Main Process` 和 `Renderer Process`, `Main Process`主要负责app通用的全局设置，如窗口大小等等，`Renderer Process`则主要在`Chrome`中，在两个`Process`中可以使用所有的`node packages`

## 所用第三方

1. react
2. babel: 由于react使用的是`es6`语法，所以需要`babel`翻译
3. ace.js: 编辑器
4. marked.js
5. moka-cli
6. 未使用webpack，因为在react中会包含文件系统操作，webpack只是充当打包的角色，`fs`是不能打包成功的


## 坑点

1. `iframe`与`webview`  
    由于编辑器是我之前用原生js完成的，所以便想用`iframe`直接引入。
    但如果直接使用`iframe`，`electron`可不认，在`iframe`不能使用`node api`与`electron api`，但是可以在父窗口利用`contentWindow`传入引用，然后在`iframe`中就可以用api了。
其实在官方文档中，是可以直接用`webview`标签解决上诉问题

2. mac中使用`spawn`与`fork`运行`moka-cli`
    在官方api [`child_process`](https://nodejs.org/api/child_process.html)中  
`child_process.spawn(command[, args][, options])` 传入参数是`command`，也就是shell中的指令
需要依赖于`PATH`中的`moka`
`child_process.fork(modulePath[, args][, options])`传入参数是`modulePath`，也就是`javascript`文件路径  
**注意： `modulePath`不需要`exports`，因为fork只是找到文件，开个进程跑一遍该文件**
所以我在`npm i --save moka-cli`后, 直接在文件中写下面代码即可
```js
var moka = require('moka-cli/bin') // bin/index.js中放的便是命令行入口
```
同时需要传入`options`
```js
{
    cwd: cwd, // 设置的工作目录(current work directory)
    stdio: [
      0, // (stdin) Use parents stdin for child
      'pipe', // (stdout) Pipe child's stdout to parent
      'pipe', // (stderr) Pipe child's stderr to parent
      'ipc' // fork 需要`ipc`进行进程通信
    ]
}
```
传入以上`options`后才能在`fork`返回的`ChildProcess`对象中使用`stdout/stderr`  
关于具体的进程通信与管道与信号机制，请看[Linux C 一站式教程](http://akaedu.github.io/book/)中的相关章节。 

3. 打包过程  
    可以使用[`electron-packager`](https://github.com/electron-userland/electron-packager)或者[`electron-builder`](https://www.npmjs.com/package/electron-builder)进行打包
    安装`electron`时，可以设置`export ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/`
    使用国内代理加快下载速度。
    我在使用`packager`时，只能打包成`unpacked`，`builder`可以打包成`packed`,也就是安装器，但是`builder`产生的安装器的图标不对。所以最后还是使用的`packager`