---
title: 利用Hook解决moka邮件通知
date: 2017-01-07 21:48:09
categories:
tags: [moka]
cover: 
---

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=202373&auto=1&height=66"></iframe>

 就在昨天，有位可爱的学妹说想订阅我的Blog，于是我放弃一天复习tcp的时间，捣鼓出文章更新，发送邮件通知的解决方案。

借用了部分Git Hook(钩子)的约定，如：采用脚本文件的形式(用户可以选择自己的脚本语言，`python/nodejs/ruby/bash...`)，`pre-action/post-action`的命名方式

`moka` ≧1.2.3 支持hook，`moka init`后产生的文件夹目录如下
```sh
moka-blog/
├── moka.config.json # moka配置，包括全局配置，如deploy，bak信息，主题选择
├── package.json     # 可以无视
├── source/          # moka g 会将该目录下非`_articles`文件夹放入static
│   ├── _articles/   # moka g 将`_articles`下的markdown文件解析到static中
│   └── ...
├── static/          # moka g 产生的最终发布的目录，deploy便是发布该目录
│   └── ...   
├── template/
│   └── article.md   # moka n 命令产生新文章的模板
├── hooks/           # 钩子, 注意各个钩子的cwd还是`moka-blog`, 如果pre钩子exit code!=0，将会终止process
│   ├── pre-generate.sample
│   ├── post-generate.sample
│   ├── pre-bak.sample
│   ├── post-bak.sample
│   ├── pre-deploy.sample   # deploy之前调用，必须executable，去除`.sample`后缀
│   └── post-deploy.sample  # deploy之后调用
└── themes/          # moka g 将配置中选中对应的主题 `themeBuild`目录 拷贝到static
     └── moka/       # 主题文件夹，其中包含theme.config.json, 根据主题要求自行配置

``` 

**注意！ 必须去掉样例脚本的.smaple，并且保证脚本是可执行的文件，才能生效。 **

**所有的pre Hook必须保证进程结束的`exit code==0`，也就是正常退出，不然后续的操作将会因此终断。**

## 文章更新，发送邮件的实现

文章更新，发送邮件一共涉及到3个hook，分别是`pre-generate->post-generate->post-deploy`

顾名思义，`pre-generate`是在产生`static/`文件夹，静态资源之前被调用；`post-generate`则是在产生完成之后被调用；`post-deploy` 在部署到远程服务器（一般为github）之后触发。

那么，分别在这三个时刻做什么工作才能完成文章更新发送邮件的功能呢？

1. `pre-generate`: 将这时所有文章目录保存在一个临时文件`tmp_pre_generate`中
2. `generate`: `static/`文件夹更新
3. `post-generate`: 将这时所有文章目录读取，与文件`tmp_pre_generate`对比，得到新添加的文章，并保存在临时文件`tmp_post_generate`中
4. `deploy`: 部署`static/`文件夹内容至远端服务器
5. `post-deploy`: 判断是否存在`tmp_post_generate`，读取`tmp_post_generate`，并利用[`smtp`](https://github.com/moyuyc/ftp-smtp/)协议发送邮件（利用递归，同步发送邮件操作）, 并且将最新的文章时间与title保存至`tmp_post_deploy`，下次读取`tmp_post_deploy`，确保时间晚于上次最新的文章。
```javascript
function sync(callables) {
    if(callables.length==0) {
        return Promise.resolve();
    }
    return callables.shift()()
        .then(function(x) {
            return sync(callables);
        })
}
```

## 小结

1. 在`osx shell`环境中，`#!/usr/bin/env node`该脚本头可以正常运行，但在`osx moka-desktop`中不能生效，改成`#!/usr/local/bin/node`即可
2. 配合hooks，同学们还可以完成更多有趣的功能。



