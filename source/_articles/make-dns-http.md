---
title: 「思科模拟器」建立DNS+HTTP服务
date: 2016-06-06 19:23:10
categories: [计算机网络]
tags: [思科,dns,http]
cover: http://obu9je6ng.bkt.clouddn.com/FsaV6jseX-B4HeJkauxXcB7S-r8p?imageslim
---
# 引言
之前，我介绍了使用思科构建VLAN服务，下面我将介绍利用思科建立DNS/HTTP服务。
<!--more-->
# 操作流程

## DNS服务搭建

### 网络布局
<img src="http://obu9je6ng.bkt.clouddn.com/FsaV6jseX-B4HeJkauxXcB7S-r8p?imageslim" alt="ClipboardImage" width="646" height="372" />
如图，构建网络

### IP设置
其中各结点ip如下表所示

| # |IP|默认网关|DNS服务器|
|---|----|----|----|
|Client|10.0.0.2|10.0.0.1|10.0.0.3|
|Local DNS Server|10.0.0.3|10.0.0.1|-|
|Company Router Left|10.0.0.1|-|-|
|Company Router Right|10.1.0.1|-|-|
|Internet Router Left|10.1.0.2|-|-|
|Internet Router Right|10.3.0.1|-|-|
|Internet Router Down|10.2.0.1|-|-|
|Root DNS Server|10.2.0.2|10.2.0.1|-|
|Example Router Left|10.3.0.2|-|-|
|Example Router Right|10.4.0.1|-|-|
|Other Server|10.4.0.2|10.4.0.1|-|
|Yucong DNS Server|10.4.0.3|10.4.0.1|-|

### DNS解析表填写

Local DNS Server
<img src="http://obu9je6ng.bkt.clouddn.com/Fkt-jQADVkr4MA-lEivvCRYSwvn0?imageslim" alt="ClipboardImage" width="653" height="576" />

Root DNS Server
<img src="http://obu9je6ng.bkt.clouddn.com/Fj0mOj4rXLbkGuhdW7ZJfc13beK3?imageslim" alt="ClipboardImage" width="653" height="576" />

Yucong DNS Server
<img src="http://obu9je6ng.bkt.clouddn.com/FpaM9412EqeSpp6_ew83Jr2ryyus?imageslim" alt="ClipboardImage" width="653" height="576" />

### 域名解析测试

对Client进行Ping指令测试，结果如下图
<img src="http://obu9je6ng.bkt.clouddn.com/FhHlF8CHB9qwi3Wl3sL8GnuIkVHr?imageslim" alt="ClipboardImage" width="653" height="576" />
说明成功搭建DNS服务！

### DNS Cache查看

<img src="http://obu9je6ng.bkt.clouddn.com/Fjf4BFssoqrsGnpjBbiR3Lnw5JJO?imageslim" alt="ClipboardImage" width="653" height="576" />
<img src="http://obu9je6ng.bkt.clouddn.com/FpEuzGbDG-N99Ef9fd5QeKPSDCRh?imageslim" alt="ClipboardImage" width="653" height="576" />
如上图，为Local DNS Server的DNS缓存，下次访问相同域名时，直接取出即可。

## HTTP服务搭建

在上面的基础上，完成HTTP服务器搭建

### 开启服务 
若我想以Other Server作为HTTP服务器，进行如下设置即可
<img src="http://obu9je6ng.bkt.clouddn.com/Fo44xaj3oT0z4aZWUsH4PgXumHyS?imageslim" alt="ClipboardImage" width="653" height="576" />
<img src="http://obu9je6ng.bkt.clouddn.com/FgjhfKiup0GXYNu2yigRg-adpg8D?imageslim" alt="ClipboardImage" width="653" height="576" />

### 网页测试
对Client打开Web Browser，输入`other.yucong.com`
<img src="http://obu9je6ng.bkt.clouddn.com/Fm1K6NQGtDXHe6fiHdP3qmxOsXSd?imageslim" alt="ClipboardImage" width="653" height="576" />
如图，正常访问！
