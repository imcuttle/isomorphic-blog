---
title: Hello Moka Desktop
date: 2016-10-29 00:01:57
categories:
tags: [moka, electron]
cover: http://obu9je6ng.bkt.clouddn.com/FnO_h1FTHMT8REA-0aSyXvHW4bIp?imageslim
---

## What Is Moka Desktop

`Moka Desktop` 是为[Moka](https://github.com/moyuyc/moka)而生的桌面端应用，专门为不喜欢命令行的童鞋设计的。  
将Moka融入至应用程序中，下载可以在[发布页](https://github.com/moyuyc/moka-desktop/releases) 或者直接联系我本人  

`Moka Desktop`将Moka命令与[编辑器](https://github.com/moyuyc/markdown-editor) (具有实时高亮同步与粘贴图片功能,极大程度优化用户书写博文体验) 融合起来，十分方便用户书写文章，管理博客。

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/Fi566IB2hQppOk8s3KCA0Xrk4DU5?imageslim)

## Have A Look

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/FhB8E45ALXw-hYBVnEfSsPgijXr8?imageslim)

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/Fo0ujWSbz2Qq5AYDh2CBfuNxfLG7?imageslim)


## Usage

1. 下载完毕，打开后，首先需要选中一个空的文件夹作为博客工作目录
2. 然后执行`Init`，初始化工作目录。可以打开右侧日志，查看运行状态。
3. 之后`Generate`生成初始静态博客
4. 完毕后，你可以`StaticServer`查看效果
5. `Server`与`StaticServer`区别: 后者依赖于`Generate`(`static`目录)，前者不需要在`Generate`之后运行, 而且会动态更新资源。比如你修改`source/_articles`中的文章后，`Server`中的资源会同步更新！
6. `Deploy`和`Bak`则是根据文件`moka.config.json`中的`deploy`,`bak`配置repo Url. 需要用户自己创建对应repo和github pages以及[产生ssh key至本地](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)。
7. `一键发布`则是做了`Generate`->`Deploy&Bak`的工作

## Why Use It

1. 与`Moka`完全融入
2. 舒适的书写博客体验，以下快捷键均只能在编辑区对焦后生效
    1. `ctrl/cmd + U`  自动保存(编辑区失去焦点保存)开关
    2. `ctrl/cmd + B/M` 放大缩小字号
    3. `ctrl/cmd + S` 保存修改
    4. 支持图片粘贴嵌入
    5. 具有同步预览，右键预览区可控制开关

![ClipboardImage](http://obu9je6ng.bkt.clouddn.com/FnO_h1FTHMT8REA-0aSyXvHW4bIp?imageslim)