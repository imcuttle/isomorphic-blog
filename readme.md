# Isomorphic Blog (For SEO)

http://blog.moyuyc.xyz

学生时代最后一个学期的前夕（明天就回学校了）。完成了[个人博客](http://blog.moyuyc.xyz)的“换血”，页面风格没什么大的改版，**重点是在后端数据接口的开发设计，和前端代码的重构，加上了 react 动态加载多说评论系统（使用 redux 分离数据逻辑处理代码），也加上了服务器渲染，都是为了 SEO 和首屏渲染！**

**地址: [http://blog.moyuyc.xyz](http://blog.moyuyc.xyz)**

**仓库地址: [isomorphic-blog](https://github.com/moyuyc/isomorphic-blog)**

感谢陈老板的服务器！

总结下开发过程中学习到的东西或者坑！

## 学习的总结

### node模块寻找

对于该项目，前后端都需要 node package，所以对于项目包的管理是否重要！

如下文件结构
```
blog/
├── backend/
│   ├── a.js
│   └── node_modules/ # module => express
├── frontend/
│   ├── b.js
│   └── node_modules/ # module => react
├── outter.js
└── node_modules/  # module => jquery
```

- outter.js
```javascript
require('express');
// Error: Cannot find module
require('react');
// Error: Cannot find module
require('jquery');
```

- backend/a.js
```javascript
require('express');
require('react');
// Error: Cannot find module
require('jquery');
```

- frontend/b.js
```javascript
require('express');
// Error: Cannot find module
require('react');
require('jquery');
```

如上各文件的引入包的情况，可知 node 加载非绝对路径或者相对路径的包，是首先加载该文件同级目录 `node_modules/` 寻找，然后依次向父级目录延伸，直到 `/` 根目录。

*其他文件 `.babelrc/.gitignore/.npmignore` 加载方式都是一样的！*

所以我们只需要在项目最外层 install package，书写 .babelrc ...

同时一些 `npm script` 只需要写在项目最外层即可。
只需要在最外层 `npm i cross-env --save`

```
"start": "cross-env NODE_ENV=production node backend/index.js"
"dev": "cross-env NODE_ENV=development node backend/index.js"
"dev:front": "cross-env NODE_ENV=development node frontend/index.js"
```

### node模块缓存清除

由于文章是用 markdown 文件形式存储的，如果每次请求文章内容都需要读取文件的话，简直日狗，电脑硬盘也吃不消。

所以我在服务器启动之前，就进行 markdown 文件遍历解析，保存至内存中，同时监听 markdown 文件夹变化，发生变化就动态更新内存数据。

*插一句！TODO: 感觉可以起个进程单独处理文件遍历解析的工作，用 IPC 进行 JSON 数据（不带 function）传输即可，充分利用多核！*

这样每次请求只需要读取内存就 OK，速度也比较快。

同时还监听了配置文件的变化，变化则需要重新加载，那么就需要清除之前的缓存了。

```
const clearCache = (modulepath) => delete require.cache[require.resolve(modulepath)]
```

如上代码，`require.resolve` 和 `path.resolve` 方法基本一致，都是基于 `process.cwd()` 当前环境路径，解析 `..` `.` 得到绝对路径。

*再插一句！`require("../path")` 中的路径，不是基于 `process.cwd()` 的，而是 `__dirname`*


### 配置文件 json => yaml

配置文件升级成 yaml 格式，yaml 真是方便！json 格式太僵硬了！

<img src="http://obu9je6ng.bkt.clouddn.com/FgyP1Ozhv0F8pA14FosHGobvpP_v?imageslim" width="1003" height="402"/>

### 一些轮子

1. 根据 react-router 自动生成 sitemap ，一切为了 搜！索！
[react-router-sitemap-builder](https://github.com/moyuyc/react-router-sitemap-builder)

2. 更好的阅读体验！解析 markdown & HTML 图像文本，读取 URL 图片数据得到大小，替换文本！
```
![](http://obu9je6ng.bkt.clouddn.com/FgyP1Ozhv0F8pA14FosHGobvpP_v?imageslim)
=> => =>
<img src="http://obu9je6ng.bkt.clouddn.com/FgyP1Ozhv0F8pA14FosHGobvpP_v?imageslim" width="1003" height="402"/>
```
[markdown-image-size](https://github.com/moyuyc/node-markdown-image-size)

3. react+多说踩坑！

<img src="http://obu9je6ng.bkt.clouddn.com/FmY9Gu9I9nPbZE-40BgH8NRMd8tu?imageslim" width="842" height="577"/>

...不知怎么说，总之就是设置各种参数判断是不是脚本加载完成...

具体看代码吧 [react-duoshuo-comment](https://github.com/moyuyc/isomorphic-blog/blob/master/frontend/src/components/DuoshuoComment/index.js)

又水了一篇...

## 其他的一些

- 发布流程
在本地书写完 markdown 后 => git push 至 github => curl url => 服务器触发 git pull 更新文章 => 文件监听变化 => 更新数据 => 发布成功！

- SEO
谷歌真是技术杠杠的，没几天就可以搜到我的站点了，百度还是没有（都已提交网站和 sitemap.txt/robots.txt）
<img src="http://obu9je6ng.bkt.clouddn.com/FocOlJ-S5EvxL2Qrc00zWNif6kyy?imageslim" width="580" height="628"/>
