---
title: 毕业设计论文
date: 2017-05-21 20:49:28
categories:
tags:
cover:
keywords:
---

# 论文

<iframe src='https://onedrive.live.com/embed?cid=504C09FB756BF590&resid=504C09FB756BF590%21117&authkey=ALJ9960n5jOLYV4&em=2&wdStartOn=1' width='100%' height='528px' frameborder='0'>这是嵌入 <a target='_blank' href='https://office.com'>Microsoft Office</a> 文档，由 <a target='_blank' href='https://office.com/webapps'>Office Online</a> 支持。</iframe>

# 答辩PPT

<iframe src='https://onedrive.live.com/embed?cid=504C09FB756BF590&resid=504C09FB756BF590%21122&authkey=AFPmBCyYhTGkmqw&em=2&wdAr=1.7777777777777777' width='100%' height='565px' frameborder='0'>这是嵌入 <a target='_blank' href='https://office.com'>Microsoft Office</a> 演示文稿，由 <a target='_blank' href='https://office.com/webapps'>Office Online</a> 支持。</iframe>

# 预测提问内容

1. 为什么要使用nodejs技术实现？  
Node.js 具有异步事件循环、非阻塞IO等特性，适合搭建高并发 Web 服务器。而且 Node.js 宿主语言为 JavaScript。只要前端JavaScript使用了 Node.js 中的标准，可以实现代码的同构，即前端代码也能运行在后端环境。为同构渲染技术提出打下基础。

2. 为什么不将学生数据入库？  
学生信息太多，而且入库后难以保持与教务系统的同步，必然有误差。

3. 人脸定位检测的参数标准？
经过尝试对比后，在 haar、LBP 特性中选择了 LBP，窗口大小使用1.8-1.9左右效果最佳 

4. 识别的阈值？  
多次尝试后，特征脸的算法阈值为4000，LBP 阈值为80

5. 为什么用那么多主流框架 ，分别有什么用？ 
Webpack，一个模块加载、打包工具。使用它可以完成前端代码环境统一为后端标准，也就是 CommonJs 标准。还可以将前端资源打包压缩混淆进行发布。
React，一个 视图 库。完成了对浏览器 DOM 操作的抽象，使用该框架可以有效的进行视图、数据的分离。也为同构渲染打下基础。
Redux，搭配 React 使用，有效地管理 React 中的数据。
Router，实现路由与视图的同步。

6. 准确率如何？
本人和几位好友的测试中，在正常光照条件下，基本能正确识别。但在实际应用下的各种各样的情景，还未进行系统的测试。距离投入使用还有一段距离。

7. 为什么用https？   
安全，在 Chrome 浏览器中，需要在 HTTPs 站点下才能调用摄像头。

