# 微信页面多fixedDOM出现的bug以及解决方案

微信的浏览器  
![](https://github.com/semi-xi/blog/raw/master/fixedbug/src/img/wrong.png)  

正常浏览器的  
![](https://github.com/semi-xi/blog/raw/master/fixedbug/src/img/right.png)  
在微信中，如果页面中出现2个以上的fixed元素，则会导致一个bug

bug表现在 这个fixed层必定是最高层或者最底层  详细可以看下src里面的demo1

如果需要跑环境的话就`npm install`

首先我的需求是这样的  
2个普通文档流 3个fixed文档流。  
普通文档流需要夹在其中2个fixe文档流之间  
但是这样的话在微信是可定不行的  


解决办法就是 给出现文档流错误的DOM加上包含`transform`属性就可以，无论是直接加`transform`或者是利用`animate`做transform动画都可以。  可以看demo2

出现的原因不解，之前网上有2篇文章是讲动画方面出现层级问题的，但是我认为他们的解释不太合理，但是你们可以去看下

而且这里需要特别说明一些，这个问题只会出现在微信，其他原生浏览器以及内嵌客户端暂时没有发现这个情况

PS：
又又又出现了一个新的状况，如果你看了我的demo就知道`div4`比`div3`的DOM的层级高的，当在结构上`div4`在`div3`的前面会出现问题，但是，如果`div3`比`div4`前面，就是层级高的先写，那样神奇的事情来了：

![](https://github.com/semi-xi/blog/raw/master/fixedbug/src/img/other.png)

我再也无法直视微信的fixed


1. [animate 影响z-index](http://hedgehogking.com/?p=617  z-index)
1. [transform 层级问题](https://aotu.io/notes/2015/10/21/z-index-and-translate3d/ z-index)
