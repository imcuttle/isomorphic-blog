---
title: Moka (SPA Blog For Everyone)
date: 2016-10-16 22:37:29
categories:
tags: [moka, spa]
---


如今,单页应用"横行霸道", 而且新时代知识信息海量,我们更需要自己的Blog来沉淀知识。
综上,`Moka`走入了我们的实现。

<!--more-->

## Usage

<img src="https://segmentfault.com/img/bVEjtX" alt="" width="800" height="432" />

为了第一眼能看到效果, 我先把如何安装使用说一下。
1. 一切从`npm`开始

        $ npm i -g moka-cli
2. 安装完成后


    ```sh    
    $ moka -h # 帮助
    $ moka -V # 版本

    $ mkdir myBlog
    $ cd myBlog
    $ moka i  # 开启自己的spa Blog
    $ moka g  # generate static pages
    $ moka s  # 开启本地服务，动态更新_articles
    $ moka ss  # 开启本地静态服务，需要先generate
    $ moka n abc # 新建一个article

    $ moka d  # 根据 moka.config.json deploy 发布 需要设置sshkey 
    $ moka b  # 根据 moka.config.json bak 发布 需要设置sshkey 
    ``` 

3. 线上效果

    [moyuyc.github.io](https://moyuyc.github.io/)

4. 详细解释

    在当前目录下产生一套文件目录结构。如下：

    ```
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
    └── themes/          # moka g 将配置中选中对应的主题 `themeBuild`目录 拷贝到static
         └── moka/        # 主题文件夹，其中包含theme.config.json, 根据主题要求自行配置

    ```

    关于`moka deploy & moka bak`需要设置`github key`，这里给出[Windows平台的设置教程](http://jingyan.baidu.com/article/a65957f4e91ccf24e77f9b11.html)，其他平台大同小异  
    设置ssh key完成后，修改`moka.config.json` deploy与bak url字段即可，改成对应repo的url.
    

## Document

`Moka`, 认为前端UI与数据应该完全分离开来, 而不是像`hexo`那样传统的blog。
这样做的好处不言而喻, 可能第一次加载数据较多, 但是后续操作更加畅快, 网站体验更加优化了。

既然如此, 那么`Moka`产生的数据是什么样子的呢?
### 数据格式

`Moka` 采用主流的`json`字符串

`$ moka generate` 后产生的json如下

```json
{
    "main": {
        "filename": {
            "content": "...",
            "head": {
                "date": "",
                "title": "",
                "tags": [tagnames...] or "tagname"
            }
        }
    },
    "index": {
        "sorted": [filenames...],
        "tagMap": {
            "tagname": [filenames...]
        }
    }
}
```

说明

- `"content"`可以通过配置控制, 返回`markdown`或者`html`(请看下文配置`returnRaw`说明)
- `"head"`表示在文章中头部`---...---`中解析出来的数据, tags 可以是Array(多个)或String(单个)
- `"sorted"`为按照时间倒序的filenames数组
- `"tagMap"`为所有tag的映射, 即哪些文章包含`"tagname"`

### 配置说明

主要包含 `default config`, `moka.config.json`, `theme.config.json`, `theme.config.js`

- `default config` 为`Moka`初始配置, 不推荐修改

    ```js
    {
     theme: "moka", // 当前主题
     apiRoot: "moka_api", // moka generate 数据和配置 所存放的文件夹
     
     skipRegExp: "/[^\.(md|markdown)]$/", // 在 _articles 中渲染忽略的文件名正则表达式
     
     timeFormat: "YYYY/MM/DD HH:mm:ss", // 默认产生的时间格式 (参看moment.js)
    
     // marked 配置参看(marked.js: https://github.com/chjj/marked)
     marked: {
         options: {
             gfm: true,
             tables: true,
             breaks: false,
             pedantic: false,
             sanitize: false,
             smartLists: true,
             smartypants: false,
             highlight: function (code) {
                 return require('highlight.js').highlightAuto(code).value;
             }
         },
         setup: function (renderer) {
             renderer.heading = function (text, level) {
                 var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    
                 return '<h' + level + '><a name="' +
                     escapedText +
                     '" class="anchor" href="#' +
                     escapedText +
                     '"><span class="header-link"></span></a>' +
                     text + '</h' + level + '>';
             }
         }
     },
    
     returnRaw: false,  // * 是否返回markdown字符串, 那么需要主题自己转换markdown
     title: 'Blog',
     favicon: "favicon.ico", // 网站图标
     injectScript: true,  // 是否注入`moka.inject.js`
     themeBuild: "build" // 将会取 themes/moka/build 中文件放到 static 中, 认为build为生产环境代码
    }
    ```
 
- `moka.config.json` 为全局站点配置, 在`apiRoot`中可以得到
    
    ```js
    {
        "theme": "moka",
        "title": "Moyu Blog",
        "favicon": "favicon.ico",
        "author": "moyu",
        "description": "moyu Blog",
        "siteName": "site",
        
        // moka generate 配置
        "deploy": {
            "type": "git",
            "url": "https://github.com/moyuyc/moyuyc.github.io.git",
            "branch": "master"
        }
    }
    ```

- `theme.config.json` 为主题配置, 在`apiRoot`中可以得到, 完全为主题开发者自定义

    关于默认主题配置说明, 请看[theme readme](THEME_README.md)

- `theme.config.js` 为了主题开放者也能够控制`Moka`产生数据, 可以修改该文件, 从而覆盖默认配置

    ```
    module.exports = {
        apiRoot: "moka_api",
        skipRegExp: "/[^\.(md|markdown)]$/",
        //http://momentjs.com/
        timeFormat: 'YYYY-MM-DD HH:mm', // 返回的时间格式
    
        marked: {
            options: {
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false
            },
            setup: function (renderer) {
                // 在这里控制renderer规则, 详细请看 marked
            }
        },
        
        returnRaw: false,
        themeBuild: "build",
    }
    ```
 

### 闲话

开发者可以通过`ajax/fetch/...`异步获取 `apiRoot`配置下的`db.json/moka.config.json/theme.config.json`

然后尽情用`react/vue/webpack/...`开发自己喜欢的主题吧。

还有默认主题是用`react/webpack`开发的, 
但...不幸的是, 本人误操作把源码都删了..., 但万幸的是...留下了build, 生产环境的代码...

[star](https://github.com/moyuyc/moka)

## Moka主题配置

默认主题是用`react/webpack`开发的, 
但...不幸的是, 本人误操作把源码都删了..., 但万幸的是...留下了build, 生产环境的代码...

```js
{
  "avatar": "/head.jpg", // 头像
  "title": " Moyu Dev Blog ", // 网站title
  "description": " Web, Node C/C++ Dev ",

  "mainInfoColor": "", // 首页信息的文字颜色, 默认白色
  "canvasColor": "",   // 首页飘散的雪花颜色

  "leftPercentage": 50,// 左侧百分比, 右侧将会自动为100-leftPercentage, <=0 将会在非首页页面隐藏left

  "pageSize": 6, // 每页文章数目, <=0 一页展示所有
  "summaryNum": 50, // 摘要的文字截断字数

  "postTarget": "_blank", // 文章中link的跳转方式
  "iconTarget": "_blank", // 左侧icon的link的跳转方式
  "projectTarget": "_blank", // project中link的跳转方式

  "home": { // 首页中右侧文字内容
    "title": "About Me",
    "contentHtml": "<p>I’m a Javascript enthusiast. I organise Baidu BEFE Meetup and try my best to help out with the team. I’m also a member of the core dev team.</p><p><img class='emoji' src='http://emojipedia-us.s3.amazonaws.com/cache/08/84/088419f4d97c19762c29008c4a89bbf4.png'/></p>"
  },
  // projects
  "projects": [
    {
      "title": "Moyu Theme",
      "state": "Doing", //可无
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
      "link": "" // 点击跳转地址
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    },
    {
      "title": "Moyu Theme",
      "state": "Doing",
      "image": "https://raw.githubusercontent.com/TaylanTatli/Ramme/master/assets/img/screenshot-post.png"
    }
  ],

  "icon": [ // 左侧icons key命名参看font-awesome.css
    {
      "github": "https://github.com/moyuyc"
    }
  ],

  "coverImage": { // 左侧封面
    "images": {
      "tags": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "home": "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
      "article": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "serach": "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
      "notExist": "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg",
      "posts": [ // posts可为数组(对于每一页), 可为字符串
        "http://taylantatli.me/Halve/images/unsplash-image-10.jpg",
        "http://taylantatli.me/Halve/images/home.png",
        "http://taylantatli.me/Halve/images/unsplash-gallery-image-3.jpg"
      ]
    },
    
    "articleCover": true   // 是否开启文章封面, 在文章头部配置 `cover: ...` 效果请看默认文章`Linux C学习一周`
  }
}
```
 

