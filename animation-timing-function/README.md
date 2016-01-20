# 关于animation-timing-function 中steps的学习笔记

## animation 动画的基本概述
动画一共有下面这些属性

1. animation-name 
1. animation-duration 
1. animation-delay
1. animation-iteration-count
1. animation-direction
1. animation-play-state
1. animation-fill-mode
1. animation-timing-function

他们分别代表什么意思，这里不做特别的介绍

具体要说的是animation-timing-function

准确的说应该是 timing-function，因为在transtion中也有这样子的一个属性transition-timing-function

在填属性的时候，我们一般会选择`liner`、`ease`、`ease-in`、`ease-out`、`ease-in-out`以及贝塞尔曲线`cubic-bezier(n,n,n,n)`
具体可以在w3cschool可以找到[animation-timing-function](http://www.w3school.com.cn/cssref/pr_animation-timing-function.asp animation-timing-function属性)

但是之前的在一些网站学习相关资料的时候发现还应该会存在一个steps的函数才对的，这里竟然没有！

按照我的理解的话是 animation动画应该是分成2种的，一种是线性动画，一种是帧动画

### 线性动画
什么是线性动画。
线性动画在我理解就是它在不同值之间的过渡是连续的。
可以看下demo-linear看下里面的一些线性动画。  
这里只需要在timing-function选择非steps的时候，我们就可以理解为它是一个线性动画
```
selector{
    animation-timing-function:liner|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)
}
```
![](https://github.com/semi-xi/blog/raw/master/animation-timing-function/image/linear-color.png)

可以看出它的值与值之前线性过渡的过程，因为我是从黑色→红→黄，所以可以很明显的看得出这个变化的效果

### 帧动画
什么是帧动画呢
帧动画在我的理解就类似幻灯片，一帧一帧的往下走，中间不会有任何的动画效果，直接过渡到下一个值

网上一个专业一点的叫法就是steps函数是指定了一个阶跃函数

具体的效果可以看demo-steps

### 帧动画steps详解

#### steps(number[,end|start]) 或step-start|step-end
steps 有两个参数，
第1个参数的必须是正整数，他的意思是一个关键帧之间需要用多少步去完成
第2个参数可选`start`或者`end`，默认是end
当它只有一个参数的时候仅可以选择step-start|step-end 代表的是step-start→steps(1,start)，step-end→steps(1,end)

这里详细讲下这两个参数的情况
 
#### number 参数
这个表示的是每两个关键帧之间的间隔数，简单点的理解就是这两个关键帧时间需要多少步才可以走完
举个具体的例子去看下
```css
.color{
    width: 200px;
    height: 200px;
    animation-name:changeColor;
    animation-duration: 3s;
    animation-fill-mode: forwards;
    animation-timing-function: steps(3,start);
    background-color: black;
}
 @-webkit-keyframes changeColor{
    0%{
        background-color:black;
    }
   50%{
        background-color: red;
    }
    100%{
        background-color: yellow;
    }
}
```

在这里我写的属性是`steps(3,start)`
这里就代表着两个关键帧之间需要走3步走完
直接看样式的话是
```css
0%{
    background-color:black;
}
50%{
    background-color: red;
}
```

一个步骤0%/50%我们称为1个关键帧，这样就相当于系统帮我们补充了0-50%之间的13%，26%
```css
0%{
    background-color:black;
}
13%{
    background-color:xxx
}
26%{
    background-color:xxx
}
50%{
    background-color: red;
}
```
这里是我们写steps第1个参数为3的情况，如果写成1的话就直接是从0%直接到50%了，中间没有任何的变化。
需要的话可以看demo-steps，那里会有一个很直观的表现。


### step-start|step-end
在动画的时候，都会有一个填充的效果，就是当前的时间点需要显示什么样的样式
start|end这两个参数简单的理解就是选择不同的填充方式
step-start 是以下一帧的显示效果来填充当前的间隔
steps-end是以上一帧的效果来填充当前间隔
这里直接拿w3c的一个讲解图来进行一个说明
![](https://github.com/semi-xi/blog/raw/master/animation-timing-function/image/steps.png)

x轴代表的是两个关键帧之间的间隔次数，
y轴代表的是关键帧之间的属性变化

当为start的时候，系统会选择用下一帧的时候来填充，如果是只有3步的话就用第1步的来作为一个起点
当为start的时候，系统会选择用上一帧的时候来填充，如果是只有3步的话就用第0步的来作为一个起点

如果需要一个更明显的例子可以去看这里
歪果仁夕的一篇[关于怎么使用steps的文章](http://designmodo.com/steps-css-animations/ "如何正确的使用steps")

按照我自己的使用的话，我一把都是选择默认的end~具体的话还是看个人习惯。


有些人会问这个steps有什么用。
可以看下

1. [HTML游戏前端开发秘籍](http://isux.tencent.com/html5-game-development-cheats.html 开发秘籍)----腾讯ISUX
1. [利用animation实现点点点动画](http://www.zhangxinxu.com/wordpress/2014/12/css3-animation-dotting-loading/)----张鑫旭

## 参考资料

1. [深入理解CSS3 Animation 帧动画](http://www.cnblogs.com/aaronjs/p/4642015.html 深入理解CSS3Animation帧动画)
1. [How to Use steps() in CSS Animations](http://designmodo.com/steps-css-animations/ '')
1. [w3c transition-timing-function](https://www.w3.org/TR/2012/WD-css3-transitions-20120403/#transition-timing-function-property '')