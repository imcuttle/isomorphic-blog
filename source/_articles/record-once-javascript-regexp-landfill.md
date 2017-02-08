---
title: JavaScript正则填坑记😆
date: 2017-01-12 18:43:02
categories:
tags: [js, 正则]
cover: http://imglf0.nosdn.127.net/img/SGJtbm5ReUxoLytKVlhlTWVWM2VhaG91cFJsYmVVdGZCcE9abThuUUJLckx4UHpySW9ZdVhBPT0.jpg?imageView&thumbnail=1680x0&quality=96&stripmeta=0&type=jpg
---


## 问题重现

不知道各位旁友在`webpack`的使用中，有没有碰到下面的问题情景：
1. 在使用了`css Module`的情况下，同时又希望用一些`global`的布局，其实在`css Module`中直接用
```
:global(.title) {
    color: green;
}
```
也是可以实现的，但是如果需要引入第三方css，如`Animate.css`，如果对每一个`classname`都进行手动的全局定义，工作量可不小。

2. 关于`css`的打包问题，对于一些组件的样式，可以将`css`打包在`js`文件中，但是一些全局的`css`，或者一些需要第一时间加载的`css` (如`pace.css`，在页面加载过程中就需要第一时间解析出样式)，就需要使用`ExtractTextPlugin`打包成为单独的`css`文件了。

以上都是需要对于同一类型文件的不同处理。在`webpack`中就体现成用正则表达式进行文件名匹配。

为了更优雅的命名，第一种情景来举例，我将全局的样式文件命名成`foo.global.less`，其他需要进行`css module`处理的则正常命名，如`bar.less`。

## 思路

在进入主题之前，我先分享一个实用的在线正则网站[refiddle](http://refiddle.com/)，包含了不仅仅`Javascript`的正则

下面的重头戏便是  
**如何正则匹配`*.global.less`和`*.less`(不包括`*.global.less`)？**

众所周知，`webpack`中是不存在多次正则匹配的，所以需要分别使用2个正则表达式来解决上面两种字符串的匹配。

`*.global.less`字符串匹配？恩, so easy，`/\.global\.less$/`, 那么`*.less`(不包括`*.global.less`)呢？

显然，这就需要用到正则的位置匹配了(`(^\.global)`和`[^\.global]`都是不正确的)，匹配前面不是`.global`的的位置。

| 分类|语法| 说明|
|---|---|---|
| 捕获|`(exp)`|匹配exp,并捕获文本到自动命名的组里|
| 捕获|`(?<name>exp)`|匹配exp,并捕获文本到名称为name的组里，也可以写成(?'name'exp)|
| 捕获|`(?:exp)`| 匹配exp,不捕获匹配的文本，也不给此分组分配组号|
| 位置匹配|`(?=exp)`|匹配exp前面的位置|
| 位置匹配|`(?<=exp)`|匹配exp后面的位置|
| 位置匹配|`(?!exp)`|	匹配后面跟的不是exp的位置|
| 位置匹配|`(?<!exp)`|匹配前面不是exp的位置|
| 注释	|`(?#comment)`|这种类型的分组不对正则表达式的处理产生任何影响，用于提供注释让人阅读|

如上表，很显然需要使用`(?<!exp)`，所以正则表达式是`/(?<!global)\.less$/`，完结撒花！

但是！真的就这样可以了吗？？很不幸的是在js中并没有实现`(?<=exp)`和`(?<!exp)`的位置匹配。（可能是大家伙都没想到Js能走到今天这个地步，以为只是在浏览器上耍耍，数据验证没必要太复杂吧, 😆 ）  
参看[RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

经过一番查找和头脑风暴，最终得到了Js中不包含某子串的正则匹配  
**`/^(.(?!\.global))+\.less$/`**

`(?!\.global)`匹配的是后面不是`.global`的位置  
`(.(?!\.global))+`匹配的就是若干个后面跟着不是`.global`的字符  
`^`字符串首位置不能丢！，如果丢了，`/(.(?!\.global))+\.less$/`也能够匹配`foo.global.less`，因为从`foo`后面的`.`开始，后面跟着的就不是`.global`了。

但是对于`.global.less`字符串，该正则也无能为力了。

## 参考

1. [正则表达式30分钟入门教程](http://deerchao.net/tutorials/regex/regex.htm)
2. [JavaScript RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
3. [正则表达式匹配“不包含某个字符串” (通俗易懂还有图！)](http://www.cnblogs.com/bvbook/archive/2010/11/03/1867775.html)






