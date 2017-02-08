---
title: componentWillReceiveProps Vs componentWillUpdate
date: 2016-10-23 18:05:04
categories:
tags: [react]
cover: http://blog.zingchart.com/content/images/2016/06/react.png
---

最近在写博客主题的时候，遇到一个react的坑，遂总结一番。

`componentWillReceiveProps` Vs `componentWillUpdate`

两个方法，根据语义去理解，可以读出这样的信息：

`componentWillReceiveProps`会在`componentWillUpdate`之前调用，而且调用`componentWillUpdate`的条件为`shouldComponentUpdate` return true

那么，我便想当然的，在`componentWillUpdate`方法中调用了`setState`方法，然后便觉得在`render`中的`state`就是更新后的值了.

```js
componentWillUpdate(nextProps) {
	if(this.props.a !== nextProps.a) {
		this.setState({...});
	}
}
```

然而，事实并非如此，调用`this.setState()`后，在`render()`中并没有改变`state`。

[官方文档](https://facebook.github.io/react/docs/react-component.html)有下面一段话:

> componentWillUpdate() is invoked immediately before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

> Note that you cannot call this.setState() here. If you need to update state in response to a prop change, use componentWillReceiveProps() instead.

这段话说的很清楚了！`componentWillUpdate`会在`render`之前时刻调用，在第一次`render`的时候不会调用。  
**你不能在该方法中调用`this.setState()`，请用`componentWillReceiveProps()`代替**

那么为什么会这样呢？

其实，[`this.setState()`](https://facebook.github.io/react/docs/react-component.html#setstate)不是同步方法  
`setState(nextState, callback)`后面会带有回调函数，如果你将上诉代码做些修改：  
```js
componentWillUpdate(nextProps) {
	if(this.props.a !== nextProps.a) {
		this.setState({...}, function() {
			alert('state Updated');
		});
	}
}
```
你就会发现，在`render()`结束后，才会`alert()`

那么，为什么`react`将`this.setState()`设计为非同步方法呢？  
[网上的解释](http://stackoverflow.com/questions/36085726/setstate-in-reactjs-is-async-or-sync)为:

> setState() does not immediately mutate this.state but creates a pending state transition. Accessing this.state after calling this method can potentially return the existing value. There is no guarantee of synchronous operation of calls to setState and calls may be batched for performance gains.

> This is because setState alters the state and causes rerendering. This can be an expensive operation and making it synchronous might leave the browser unresponsive. 
Thus the setState calls are asynchronous as well as batched for better UI experience and performance.

完.


