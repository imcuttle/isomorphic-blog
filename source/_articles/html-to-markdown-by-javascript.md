---
title: HTML -> Markdown
date: 2017-02-07 10:42:55
categories:
tags: [javascript, markdown, isomorphic]
cover: http://imglf1.nosdn.127.net/img/N2RLRDhXOHRWSkVXbFJrUTZ6R1NRR3Q2TlRIY3BackFLaTJDSmlyenJrM0gvbEpZSnJrNFZRPT0.jpg?imageView&thumbnail=1080x0&quality=96&stripmeta=0&type=jpg
---

## 情景重现

有时候，我们看到网上比较好的文章，我们油然会想去转载，但是呈现在浏览器上文章的格式为 HTML，我们书写文章的格式又为 Markdown，所以我便想实现 HTML 到 Markdown 的转换。

**注：对于一些文章排版较为复杂的 HTML 标签（如 table），暂时直接输出 HTML**

## 使用

还是从 npm 开始，支持三种方式（URL/file/命令参数）的调用。

```
npm i -g html-markdown
html2md -h
html2md https://www.npmjs.com/package/html-markdown -s "#readme" > html-markdown-readme.md
html2md path/to/html/file -s "#markdown"
html2md path/to/html/file
html2md --eval "<h1>Hello!</h1>"
html2md - # get string from stdin
html2md   # get string from stdin, better REPL
{
    echo "<h1>HEAD1</h1>";
    echo "<h2>HEAD2</h2>";
} | html2md -
```

URL 只支持 HTTP/HTTPs 协议，`-s --selector` 选项表示 HTML 文档中的 DOM 选择器，如 jQuery 选择器。

以上为命令行的方式，同时还提供第三方包的形式

```
npm i --save html-markdown
```

```javascript
var html2md = require('html-markdown');

// can use in browser and node.
var md1 = html2md.html2mdFromString("<h1>Hello!</h1>");

// https or http, not isomorphic
html2md.html2mdFromURL("https://www.npmjs.com/package/song-robot", "#readme").then(console.log).catch(console.error);

// not isomorphic
html2md.html2mdFromPath("path/to/html/file", "#markdown").then(console.log).catch(console.error);
```

## 实现

一共实现了 2 个版本，分别用 Cheerio、jsDom 实现。

Cheerio 更侧重于 node 端，jsDom 则将 HTML 标准在 node 上实现了，所以在浏览器端不需要导入 jsDom，因为浏览器已经实现了 HTML 标准。故 **jsDom 版本加上环境的判断，可以在浏览器和服务器端使用同一套代码**

![](https://ooo.0o0.ooo/2017/02/07/589954c09cc12.jpg)

具体的转化思路大致是，递归遍历 dom 树。对于单个 node ，判断其 tagName 进行映射。

```javascript
if (/^h([\d]+)$/i.test(tagName)) {
    mapStr = `${'#'.repeat(+RegExp.$1)} ${childrenRender()}`;
} else if ('ul' === tagName || 'ol' === tagName) {
    mapStr = `${childrenRender(level+(parentTagName === 'li'? 1 : 0))}`
} else if ('li' === tagName) {
    mapStr = `${'   '.repeat(level)}${parentTagName === 'ul' ? '-' : 1+index+'.'} ${childrenRender()}`
} else if ('img' === tagName) {
    mapStr = `![${dom.getAttribute('alt') || ''}](${dom.getAttribute('src')})`
} else if ('p' === tagName) {
    mapStr = `${childrenRender()}  `
} else if ('code' === tagName) {
    mapStr = "`" + childrenRender() + "`"
} else if ('pre' === tagName) {
    mapStr = "\n```\n"+ `${jsdomText(dom).replace(/^\r?\n/, '').replace(/\r?\n$/, '')}\n` +"```\n"
} else if ('a' === tagName) {
    mapStr = `[${childrenRender()}](${dom.getAttribute('href')})`;
} else if ('div' === tagName) {
    mapStr = `${childrenRender()}`
} else if ('strong' === tagName) {
    mapStr = `**${childrenRender()}**`
} else if ('em' === tagName) {
    mapStr = `*${childrenRender()}*`
} else if ('hr' === tagName) {
    mapStr = `------`
} else if ('del' === tagName) {
    mapStr = `~~${childrenRender()}~~`
} else if ('html' === tagName || 'body' === tagName) {
    mapStr = childrenRender()
} else if ('head' === tagName) {
    mapStr = '';
} else {
    mapStr = dom.outerHTML;
}
```

同时还需要注意！对于代码块

![ClipboardImage](https://ooo.0o0.ooo/2017/02/07/58995661014f5.jpg)

其换行是被样式控制的，如下图 `<div>`

![ClipboardImage](https://ooo.0o0.ooo/2017/02/07/589956804fb84.jpg)

而且 Dom 中的属性 `innerText` 不属于 HTML 标准，是浏览器各自实现的。如下图，`innerText` 是带换行的，而 `textContent` 则不带（jQuery 中 text() 也是不带的）

![ClipboardImage](https://ooo.0o0.ooo/2017/02/07/589956d5916fe.jpg)

所以就需要我们自己判断是否需要换行，即自己实现 innerText

```
var jsdomText = function (dom) {
    var html = dom.innerHTML;
    if(!html) {
        return dom.textContent;
    }
    var myhtml = html.replace(/<p.*?>(.*?)<\/p>/gmi, '$1\n')
        .replace(/<div.*?>(.*?)<\/div>/gmi, '$1\n')
        .replace(/<br.*?>/gmi, '\n')
        .replace(/<(?:.)*?>/gm, '') // remove all html tags
        
    var he = require('he'); // he for decoding html entities
    var mytext = he.decode(myhtml);
    return mytext;
}
```

欢迎使用，并给我提 [Issue](https://github.com/moyuyc/html-markdown/issues)，我将会不断进行优化改善。





