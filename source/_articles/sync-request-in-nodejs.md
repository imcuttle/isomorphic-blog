---
title: node.js 同步请求
date: 2017-02-17 21:07:34
categories:
tags: [nodejs]
cover: http://obu9je6ng.bkt.clouddn.com/Fj5uQumcJ7hDqA2uZWW6ZC55fonq?imageslim
keywords: [synchronous,nodejs,request]
---


node.js 以异步方式、事件队列为标准，基本每一套与网络、IO 相关的 API 都会设计成异步的。

如，一段很平常的请求代码，用 node.js 只能用异步方式。

```javascript
const https = require('https');

https.get("https://nodejs.org/api/https.html", res => res.pipe(process.stdout))
```

异步方式不会阻塞进程，充分利用 CPU。

但是，对于一些一次性的脚本、批处理，我们希望使用同步的方式。因为以上情形，对于效率要求不是十分迫切，更多的是需要清晰的代码结构，简明的代码逻辑。

本人在之前的 [markdown-image-size](https://github.com/moyuyc/node-markdown-image-size) 中，有这么个需求：

> 浏览器在未加载完图片数据的时候，浏览器是不知道其大小的
所以，默认大小都是 0，除非通过 style 设置了大小
之后的某个时候，图片加载完成，浏览器得到图片大小，文章就会有跳动的感觉，阅读体验不佳

> 解决该问题，将 markdown 文本中的 `![](src)` 和 `<img src="src" />` 中的 `src` 匹配出来，如果是本地文件则读文件，得到图片大小；或者发送请求，得到图片数据进而得到图片大小，最后进行字符串 替换/插入，成为如下的 HTML 格式文本。

>`<img width="100" height="100" src="url" />`


在这种情况下，同步的网络请求比异步的请求会更加合适，代码更加清晰，逻辑更简单，而且对代码效率要求不高。如下，便是简化后的同步请求，文本替换的代码。

```javascript
content.replace(/!\[(.*)\]\((.*?[^\\])\)/g, (matched, alt, src) => {
    // get image data from src synchronously
    const data = getData(src);
    const size = sizeOf(data);
    return `<img alt=${alt} src=${src} width=${size.width} height=${size.height} />`
})
```

如果使用的是异步，则不能在第二个参数中直接 return 替换后的文本了，就需要更加复杂的代码逻辑（如标记文本的位置和长度，待请求结束后，进行替换）。

那么具体应该如何实现 node.js 的同步请求呢？
<!--more-->

谷歌 "sync request in nodejs" 

搜索结果中出来一个 [sync-request](https://www.npmjs.com/package/sync-request)，` npm install` 后果然能够同步网络请求，这顿时勾起了我的兴趣：在一个官方没有提供同步请求 api 的情况下，该第三方包是怎么实现请求的同步的呢？

阅读源码之后才发现作者十分巧妙的将异步问题转化成了同步问题，分析如下。

## `sync-request`

在 [readme](https://github.com/ForbesLindesay/sync-request#how-is-this-possible) 中，作者有这样一段话：

> ### How is this possible?

> Internally, this uses a separate worker process that is run using childProcess.spawnSync.

> The worker then makes the actual request using then-request so this has almost exactly the same API as that.

> This can also be used in a web browser via browserify because xhr has built in support for synchronous execution. Note that this is not recommended as it will be blocking.

简言之作者实际上发送请求是用的 [`then-request`](https://github.com/then/then-request)，对官方的异步 API 用 Promise 进行封装，所以其是异步请求方式。

异步转化同步方式，主要是借助了 `childProcess.spawnSync` 方法，创建**同步进程**。

阅读源码之后，基本的流程如下：

<img src="http://obu9je6ng.bkt.clouddn.com/FqF0tsO2D-38ngCbsbAbtprHwDH8?imageslim" width="748" height="453"/>


首先需要 `nc` 指令的作用，以及标准输入输出如何传递字节数组。

man page 中对 `nc` 的介绍为：
>  nc -- arbitrary TCP and UDP connections and listens  
> usage: nc <options> [hostname] [port[s]]

就是一个底层的系统调用，用于建立 TCP/UDP 连接或者监听某端口的，由于是系统调用，所以速度更快，效率更高。

标准输入输出如何传递字节数组，就需要将字节数组转化成字符串，然后在处理之前转化成字节数组，默认 nodejs 实现是将 Buffer 序列化为 `{"type":"Buffer","data":[1,2,3,4,5]}`，分成2个字段表示，但是这样是不能够反序列化回来的。

则需要重写 JSON 序列化的方法，主要是对 Buffer 的处理。

```javascript
function stringify (o) {
    if(o && Buffer.isBuffer(o)) // hex, ascii 都是可以的
        return JSON.stringify(':base64:' + o.toString('base64'));
    if ('string' === typeof o) {
        // 避免将 buffer 误认为 string
        return JSON.stringify(/^:/.test(o) ? ':' + o : o)
    }
    // 其他维持原样
}

function parse (o) {
    return JSON.parse(s, function (key, value) {
        if('string' === typeof value) {
          if(/^:base64:/.test(value))
            return new Buffer(value.substring(8), 'base64')
          else // string
            return /^:/.test(value) ? value.substring(1) : value
        }
        return value
    })
}
```

理解了以上之后，再来具体看看代码

- find-port.js  
得到一个空闲的端口返回，基本原理如下（仅为部分代码）

```javascript
module.exports = function () {
	return new Promise(function (resolve, reject) {
		var server = net.createServer();

		server.unref();
		server.on('error', reject);
        // port = 0, 绑定可用的端口
		server.listen(0, function () {
			var port = server.address().port;

			server.close(function () {
				resolve(port);
			});
		});
	});
};
```
- legacy-work.js  
使用标准输入输出作为参数的来源和返回的出口，处理网络请求 (then-request) 

```javascript
const concat = require('concat-stream');
const request = require('then-request');
const JSON = require('./json-buffer');

function respond(data) {
  process.stdout.write(JSON.stringify(data), function() {
    process.exit(0);
  });
}

process.stdin.pipe(concat(function (stdin) {
  var req = JSON.parse(stdin.toString());
  request(req.method, req.url, req.options).done(function (response) {
    respond({success: true, response: response});
  }, function (err) {
    respond({success: false, error: { message: err.message }});
  });
}));
```

- nc-server.js  
启动一个 TCP 服务端，为 nc 指令通信  

```javascript
const net = require('net');
const concat = require('concat-stream');
const request = require('then-request');
const JSON = require('./json-buffer');

const server = net.createServer({allowHalfOpen: true}, c => {
  function respond(data) {
    c.end(JSON.stringify(data));
  }

  c.pipe(concat(function (stdin) {
    try {
      const req = JSON.parse(stdin.toString());
      request(req.method, req.url, req.options).done(function (response) {
        respond({success: true, response: response});
      }, function (err) {
        respond({success: false, error: { message: err.message }});
      });
    } catch (ex) {
      respond({success: false, error: { message: ex.message }});
    }
  }));
});

server.listen(+process.argv[2]);
```

其中 `{ allowHalfOpen: true }` 不可少，因为在执行 `spawnSync('nc', ["127.0.0.1", nPort], {input: request})` 时，input 是 JSON 序列话后的字符串，输入后就到 EOF 了，相当于在 Shell 中 Ctrl+D 控制键，nc 客户端套接字就关闭了，只有允许半开套接字，客户端才能收到服务器的数据。如下图：对应为客户端的 FIN_WAIT_2 ~ TIME_WAIT 周期之间，服务器依旧可以发送数据。

<img src="http://obu9je6ng.bkt.clouddn.com/FnixeQVF2AFq-_T53WvL6Ubvk9WV?imageslim" width="600" height="509"/>

以上，便是对部分源码的解析

所以，最终的请求还是通过 `then-request` 来实现的，但是对于 `then-request` 并不支持 `multipart/formdata`，因此 `sync-request` 也是不支持的。 于是本人在 fork 之后，配合 [`form-data`](https://www.npmjs.com/package/form-data#alternative-submission-methods) 提了 [pr](https://github.com/then/then-request/pull/28)，希望作者能够早日 merge 吧。

最后想说：*原来还可以这样实现同步！*
