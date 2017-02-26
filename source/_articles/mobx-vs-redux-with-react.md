---
title: Mobx VS Redux（React状态控制）
date: 2017-02-26 16:45:45
categories: 
tags: [mobx,redux,react]
cover: https://i.ytimg.com/vi/_q50BXqkAfI/maxresdefault.jpg
keywords: [mobx,redux,react]
---


> 我人就是闲不下来 - -  
> 辛辛苦苦上了一周班，周末又捣鼓起 React+Mobx 一套了

> 下周要开始疯狂踩 React Native 的坑了，公司要我着手开发 app 了，心塞（mmp，拿着农民工的钱，干着“打天下”的事，本人还不是专业的 - -）

> 还有，最近有童鞋反映我的文章看不懂，不照顾基础不好的童鞋，希望我想阮一峰大神一样循循善诱、由浅入深。（这可苦了我一个理科生了，阮大师好歹是位文科生）

不扯淡了。

### React

React 是由 Facebook 提出的 View 层框架。之所以不在之前加上“前端”修饰，是因为 React  在提出时，目标就不仅仅是前端，Virtual Dom 的提出，使得 React 能运行在服务端(ssr)、移动端(react-native)、web端。所以是 **Learn once, write anywhere**

<img src="https://ooo.0o0.ooo/2017/01/23/5884d71e7ed1d.jpg" alt="ClipboardImage" width="623" height="396">

React 希望通过状态改变来更新视图（diff算法，找到最佳的渲染），还可以通过一些组件内的生命周期方法，来改变视图，达到想要的交互效果。

React 入门看这就够了，[React 简单入门教程，阮大牛](http://www.ruanyifeng.com/blog/2015/03/react.html)

### Redux

由于 React 只是一层 View，对于其数据需要自己管理，对于复杂的应用，如果缺少可维护的状态管理，这对于后面的开发工作是灾难性的。

Redux 便是一套可维护的状态管理工具，

其主张应用只有一个 store 存储数据，将该 store 层层分离、传入子组件。因此组件（纯渲染）只需要关注自己的需要的数据即可，具有很强的复用性！

搭配一系列的 actions，通过 action ID 找到对应的 reducer 处理流程，更新 store，相应的，视图也更新了。

所以在组件中的生命周期函数，用户触发的事件函数中，调用 action 即可。

<img src="https://ooo.0o0.ooo/2017/01/22/58845a7e4a302.jpg" alt="" width="800" height="600">

可以看出 redux 十分对大型应用的口味，而且很配合 react 的理念，**组件化**。

*但是*，Redux 比较难上手，太多的新概念提出（action、reducer、store），这对于没有体会到 react 开发痛点的新同学来说，是晦涩的。

> 当初在百度实习，我也是死磕了几天文档才懵懵懂懂的明白了一点，写了个简单的 demo，之后在看项目代码，写项目代码的时候才慢慢会用。

> 但又过了这么久之后，自己独立从零开发，使用 react react-router redux 一套之后，才发现以前关于 redux 的疑问都迎刃而解了。之前写的都是个 xx 啊，真是苦了后面维护我代码的兄弟...

所以，Mobx 出现了。

### Mobx

正如官方所说 
> *Simple, scalable state management*

mobx 是一个简单，可扩展的状态管理器。

Mobx 希望所有需要管理的状态, 都应该被提取出来， 并自动化，不需要书写代码判断是否需要更新视图。

Mobx 搭配 ES6 的[修饰器](http://es6.ruanyifeng.com/#docs/decorator)使用，代码更简单优雅。

Babel 需要 babel-plugin-transform-decorators-legacy 才能使用修饰器

Mobx 希望一个 View 对应一个 Model，这对于熟悉面向对象编程的同学十分友好。

更新 Model 后，View 也自动更新，十分直接（从 Store => View => Update）

Redux 需要关注 Store => View => Action => Reducer 一套闭环

以下为 ES6 的一个[评论列表demo](https://github.com/moyuyc/react-mobx-starter)

```javascript
import React from 'react';
import {render} from 'react-dom';
import {observable, computed, action, useStrict, toJS} from 'mobx';
import {Provider, inject, observer} from 'mobx-react';

// View
// 视为观察者，其视图更新交给 mobx 管理
@observer
class Comment extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {author, date, content, text} = this.props.store;
        const {onDelete} = this.props;

        return (
            <div>
                <div>{content}</div>
                <p>{text}</p>
                <span>{author}<time>{date}</time></span>
                <button onClick={onDelete}>Delete</button>
            </div>
        )
    }
}
// 注入 context 中 comments 属性  并且视为观察者
@inject('comments') @observer
class CommentList extends React.Component {
    shouldComponentUpdate() {
        // 这里的代码不会起作用
        alert(1);
        return false;
    }

    render() {
        const {comments} = this.props;
        return (
            <ul>
                {comments && comments.get().map((comment, index) =>
                    <Comment key={index} store={comment} onDelete={() => {comments.del(index)} }/>
                )}
            </ul>
        )
    }
}

// Model
// 严格模式下，只能在 @action 修饰的方法才能修改被观察的数据
useStrict(true);

class CommentState {
    // 被观察者，观察者将检查到其的改变，从而更新视图
    @observable author = "";

    @observable date = "";

    @observable content = "";

    // 计算属性
    @computed get text () {
        return `${this.author} at ${this.date}: ${this.content}`;
    }

    constructor({author, date, content}) {
        this.author = author;
        this.date = date;
        this.content = content;
    }
}

class CommentListState {
    @observable comments = [new CommentState({author: 'auth', date: 'date', content: 'content'})];

    toJSON() {
        return toJS(this.comments);
    }
    constructor(comments) {
        if (comments) {
            this.set(comments);
        }
    }

    get() {
        return this.comments;
    }

    @action del(index) {
        this.comments.splice(index, 1);
    }

    @action set(list) {
        this.comments = list.map(x => new CommentState(x))
    }

    @action fetch() {
        setTimeout(() => {
            this.push([{author: 'John', date: '123', content: 'hahahaha'}]);
        }, 1000);
        return this;
    }

    @action push(list) {
        this.comments.push(...new CommentListState(list).comments);
    }

}


var store = {
    comments: new CommentListState().fetch()
}
// Provider : 将 props 写入 Context, 使得其子代（非直系亦可）共享数据。
render(
    <Provider {...store} >
        <CommentList />
    </Provider>,
    document.getElementById('root')
);

```


综上，Redux、MobX 各有千秋，MobX 虽然简单直接；但破坏了纯渲染组件结构，必须需要对应的 Model 才能正确使用；且其文档与生态环境没有 Redux 良好。
喜欢简洁，爱尝试的同学可以试一下。





