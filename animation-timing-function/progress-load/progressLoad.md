# CSS3 实现圆形加载，前后坑

仅供学习交流之用！回顾自己写圆形加载的学习历程

## 效果图

![](https://github.com/semi-xi/blog/raw/master/animation-timing-function/image/progress.png)

图片源自[ Dolphin Wood](https://idiotwu.me/css3-progress-ring/) 的[demo](https://idiotwu.me/study/progress-ring/)


## 初接触圆形加载(土方法)

第1次接触圆形加载，那个时候很蠢，刚学前端，什么都不懂。没什么头绪。然后我就想起了圆的周长求法是极限法，就是把他分成很小很小的一个矩形，然后这些矩形的的长加起来就是一个圆的周长了。
所以那个时候就用的笨办法，创建若干个span，设置好`width`,`height`,`transform-origin`,`transform`，就这样勉强算是完成了。当然了缺陷肯定是很多的。例如当这个加载的`box`宽高很大的时候，`span`之间的间隙就会被看出来。

![](https://github.com/semi-xi/blog/raw/master/animation-timing-function/image/first.png)

这就是我的第1个圆形加载了。

## 再识圆形加载

再用的时候，应该是在公司旅行箱的这个专题了，详细页面在[这里](http://d.yy.com/s/luggage/pc.html)

![](https://github.com/semi-xi/blog/raw/master/animation-timing-function/image/dasharray.png)

如果你查看源代码的话，你会发现。没错，用的是svg的circle然后利用了`stroke-dasharray`属性去写，对于了解过svg的人来说，这个属性应该是不陌生的，具体的话可以参考

下面有一些文章可以供大家去了解一下

1. [小tip: 使用SVG寥寥数行实现圆环loading进度效果------张鑫旭](http://www.zhangxinxu.com/wordpress/2015/07/svg-circle-loading/)
1. [纯CSS实现帅气的SVG路径描边动画效果------张鑫旭](http://www.zhangxinxu.com/wordpress/2014/04/animateion-line-drawing-svg-path-%E5%8A%A8%E7%94%BB-%E8%B7%AF%E5%BE%84/)

这种比较适合于可以动态修改进度，可以加速可以减速实现进度加载

## 最后识圆形加载

因为这类加载的东西平时都会用得比较的少，所以很少继续研究，直到我去查阅一个叫`timing-function`的属性，发现可以用纯css3去实现这个效果。

[CSS3 环形进度条](https://idiotwu.me/css3-progress-ring/)------[Dolphin Wood](https://github.com/idiotWu)

这里需要用到的知识是:

1. [timing-function](https://idiotwu.me/understanding-css3-timing-function-steps/)
1. [clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip)

对于`timing-function`,其中有两点是非常重要的

> step-start：动画一开始就跳到 100% 直到周期结束
>step-end：保持 0% 的样式直到周期结束

[直观图](https://idiotwu.me/study/timing-function/)

上面的内容以及原理已经是非常详细的了，有什么不懂的话也可以直接回复。

但是事情并没有那么简单，特别是当你按照作者的代码去做了之后。你会发现在载入的时候会出现抖动一下，这显然不是我们想要的结果。

猜想：
经过仔细的观察，我们发现问题出现在`progress-cover`DOM上，它会先`opacity:0`然后再`opacity：1`接着再`opacity:0(如果你的progress>50)`。

这个时候我在想，会不会是因为`step-start`的问题。`step-start`是一开始就跳到100%，他的初始是`opacity:0`，结束值是`opacity:1`，周期结束值是`opacity:0`。

如果是这样子的话，我能不能换个思路。既然`step-start`有这个缺陷的话，如果我改成了`steps-end`怎么样，不多说，试下好了。

首先要考虑的东西是，如果要改成`steps-end`要怎么改，理一下原来的思路：

1. 开始的时候，`progress-cover`必须是要显示的，这样才能遮住`progress-left`；
1. 当且仅当超过50%的时候，`progress-cover`隐藏，这样的话`progress-left`才能被看到

对于第1点，而且要用到`step-end`，那样`keyframes`可以这样写

```css
@keyframes toggle2 {
    0%{
        opacity: 1
    }
    100%{
        opacity: 0
    }
}
.progress-cover{
    animation: toggle ($duration * 50 / $precent) step-end;
}
```

但是这里又有一个问题了，如果是这样设置的话，那么当它超过了50%之后，它还是以`opacity:1`去设置的(因为`step-end`会以第1个关键帧一直到周期结束)。怎么办呢？

神奇的事情来了，对于`animation`来说，还有这样的一个属性`animation-fill-mode`。它是设置动画结束之后以那种方式来显示，默认取`none`，表示`animation`走完之后，它自己的默认样式是怎么样就怎么样的。这样的话就简单得多了。

我们直接设置`animation-fill-mode:forwards`，这样的话在这个动画结束之后，保持最后一个属性值。

```css
@keyframes toggle2 {
    0%{
        opacity: 1
    }
    100%{
        opacity: 0
    }
}
.progress-cover{
    animation: toggle ($duration * 50 / $precent) step-end;
    animation-fill-mode: forwards;
}
```

这么改完之后，你就会发现非常的完美了，既没有开头的闪一下，加载的也能很完美执行

完整代码：

```css
@keyframes toggle {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes toggle2 {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
.progress-right {
    animation: toggle ($duration * 50 / $precent) step-end;
    animation-fill-mode: forwards;
}

.progress-cover {
    animation: toggle2 ($duration * 50 / $precent) step-end;
    animation-fill-mode: forwards;
}
```

代码我放在了[这里](https://github.com/semi-xi/blog/tree/master/animation-timing-function/progress-load)，有兴趣的话可以自己去查阅

### 使用说明

不要以为拿到就可以直接用了。因为当你需要操作`progress-cover`跟`progress-right`的时候，必然是他们的progress大于50%的时候，如果是静态的话可以自己通过`@include`去设置一个相应的属性，动态的话就需要自己用js去解决了。

### 完美？

做到这里，难道就是完美的吗？
如果你仔细观察，就会发现，当这个圆形大于50%的时候，在`0%`的地方会出现很轻微的抖动。这可能是一个时间差造成的。因为当到`50%`的时候，`progress-left`刚好过了中间占满右边，同时`progress-cover`需要隐藏。当`progress-cover`先消失时，就会出现这样的情况。我们大概理解为浏览器处理动画`timing`绘制时间差好了。如果你有什么更好的解决办法可以直接留言。

除了这个之外，还有一个缺陷的，就是这个`progress-left`只能做一个`linear的`时间曲线函数，因为`progress-right`跟`progress-cover`可是一个分段等长的时间段啊。！

## 后话

技术在进步，后面还有很多坑在等着我们呢
