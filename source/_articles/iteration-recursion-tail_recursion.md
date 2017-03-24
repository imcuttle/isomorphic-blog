---
title: 迭代=>递归=>尾递归
date: 2017-03-18 15:31:21
categories:
tags: [算法, javascript]
cover:
keywords: [算法, 递归, 迭代]
---

> 几周没有更新文章了，因为在忙着其他事，最近又是春招时期，又到了笔试面试刷题的时候，我就来讲讲常用算法中的 迭代与递归，甚至于延伸至尾递归。

## 问题提出

 > 用 JavaScript 实现一个类 Math.min 的方法。

>    min(1, 2, -3, 100, 7)  
>    => -3

## 方法一：迭代

```javascript
function min_0 () {
    var min = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        min = min > arguments[i] ? arguments[i] : min;
    }
    return min;
}
```

当然有些同学喜欢用些“高级”的 api，于是出现下面的方法：

```javascript
function min_1 () {
    var numbers = [].slice.call(arguments)
    return numbers.slice(1).reduce((p, n) => {
        return p > n ? n : p;
    }, numbers[0]);
}
```

这种方法很直观地就可以想到，面试官肯定是不会善罢甘休的，继续延伸下去问  
“用递归方式怎么实现呢？”

## 方法二：递归

 诚然，递归往往会占用更多的系统资源，还可能会导致栈溢出等问题，但递归也是很能考察一个程序员，良好逻辑思维能力的知识点。


```
function min_2 () {
    var numbers = [].slice.call(arguments);
    if (numbers.length === 1) {
        return numbers[0];
    } else {
        var min = min_2.apply(null, numbers.slice(1));
        return min > numbers[0] ? numbers[0] : min;
    }
}
```

此题也不难写成递归算法，但是面试官可能还是会深究下去，可能会比较其中不同方式的差异。

## *延伸问题*

1. `min0()`方法与 `min1()`方法比较，哪个效率会更高些（时间复杂度更低）呢？
    
    很显然，min0 效率更高，其不仅多了一步 `slice`，而且还额外用 `reduce` 方法创建了一个闭包，显然底层调用会更多
    
2. 如果把 `arguments` 转化成普通数组的 `slice` 方法用 `Array.from` 替换，哪个效率更高呢？
    
    关于该问题，则需要用事实来说话了：  
    ```javascript
    function slice_time () {
        console.time('slice');
        [].slice.call(arguments);
        console.timeEnd('slice');
    }
    
    function from_time () {
        console.time('from');
        Array.from(arguments);
        console.timeEnd('from');
    }
    
    var arr = new Array(10000).fill(1);
    slice_time.apply(null, arr);
    from_time.apply(null, arr);
    
    // slice: 0.267ms
    // from: 5.787ms
    ```
        
    结果很明显，所以我们应该尽量不用`Array.from`

3. `min(1, 3, 4, 5)` 和 `min([1, 3, 4, 5])`的两种传参方式，各有什么优劣？
    
    借用问题2的代码，如果数组大小设置的足够大，很有可能会看到 `Maximum call stack size exceeded` 错误，也就是栈溢出。但是方法中并没有递归调用啊，为什么会存在栈溢出呢？  
    回答该问题，就需要对编译原理的知识有所了解了，函数中的参数也是会压入栈中的，一般是参数从右往左开始，依次压入（还分为值传递和引用传递等），所以如果参数列表过长，也是会导致栈溢出的。
    
    那第一种传参方式有什么好的呢？本人觉得除了书写更方便以外，还会把本来是（数组）引用传递的，更改为值传递（该例中是数字）

4. 如何改造递归方法中的 `min_2` 方法，使其成为尾递归，有效避免栈溢出的问题？
    
    首先我们知道递归最大的问题就是容易导致栈溢出，因为每次调用，内存中都需要保存调用记录。
    那么尾递归则是递归的一种特殊形式，可以通过尾递归，来覆盖当前的调用环境(主要是参数)，成为自己的调用环境。
    具体如下代码：
    ```javascript
    function min_3 () {
        var numbers = [].slice.call(arguments);
        function inner (arr, min_pos, pos) {
            'use strict';
            var min = arr[min_pos], val = arr[pos];
            if (pos === arr.length-1) {
                return min;
            } else {
                if (val < min) {
                    min_pos = pos;
                }
                return inner(arr, min_pos, pos+1);
            }
        }
        return inner(numbers, 0, 1);
    }
    ```
     
    可以看到，在 inner 递归方法中，在最后 **`return inner(...)`**，没有其他的参数，所以调用该方法是可以覆盖掉当前调用环境的，所以并没有爆栈。  
    chrome中默认未开启尾递归优化，需要在函数中加上`'use strict';`
    同时需要在 `chrome://flags/#enable-javascript-harmony` 中开启

## 其他资料

[尾调用优化](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)