## 响应式图片
以前，提起响应式图片的时候，很多时候后会想到用js或者css去处理，这里需要人去写大量的判断逻辑，把工作量交给了人，这样会感觉比较的麻烦。最近看到一个关于img-strset的问题，可以说是一个比较新潮的办法解决图片相应问题他是把判断逻辑交给了浏览器去做。

方法有可以下面的几个
1. css 样式 image-set
2. picture 标签
3. img 标签的 srcset


### css样式 image-set
#### 兼容性
![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/image-set.png)

从图可以看到，兼容想当的糟糕，ie全部都不兼容，火狐也不兼容，谷歌的话需要带前缀 ` -webkit- `

#### 使用方法

```css
    cssName{
        background-image:url(xxxx/105-160.png);/* 1x */
        background-image: -webkit-image-set(
        url(xxx/-105-160.png) 1x,
        urlxxx/210-320.png) 2x);/* Retina */
    }
   
```

![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/demo-128.jpg)
![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/demo-256.jpg)
![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/demo-512.jpg)
#### 笔记

图片里面的这个1x跟2x代表的是图片的尺寸，同时也是像素比的意思，浏览器会根据不同的像素比选择不同的图片，同时会选择当前像素比最高的质量的图片来加载。例如，如果像素比是1.5的话，像上面代码这样的话就会选择2x来加载，因为选择用1x的话会出现图片的失真问题。
第1行样式代表的是一个默认的样式，也表示如果浏览器不支持image-set的时候的一个解决方案，后面的样式是利用浏览器的对样式支持实现的一个响应式图片兼容。

这里主要解决的是样式上的背景图片上的兼容
demo的话直接看responsive-img/example.html

### picture 标签
#### 兼容性
![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/picture.png)

从图可以看到，兼容也是非常的不理想，在移动端也没法做到很好的兼容

#### 使用方法
``` html
    <picture width="500" height="500">
        <source media="(min-width: 256px)" srcset="large-512.jpg ">
        <source media="(min-width:128px)" srcset="mid-256.jpg ">
        <img src="sml-128.jpg" alt="" width="128" height="80">
    </picture>
    
    <picture width="500" height="500">
        <source media="(min-width: 45em)" srcset="large-1.jpg 1x, large-2.jpg 2x">
        <source media="(min-width: 18em)" srcset="med-1.jpg 1x, med-2.jpg 2x">
        <source srcset="small-1.jpg 1x, small-2.jpg 2x">
        <img src="small-1.jpg" alt="">
        <p>Accessible text</p>
    </picture>
```
#### 笔记
兼容性糟糕，但是在chrome上测试会很直观的显示出来
他还可以增加 像素比之类的概念
在某一相同尺寸下不同像素比的解决方案也有，算是一个比较先进的地方

在仓库blog的responsive-img example-2有相应的例子。

#### img标签的srcset
#### 兼容性
![](https://github.com/semi-xi/blog/raw/master/responsive-img/image/srcset.png)
依然不是特别的理想

```html
    <img src="sml-128.jpg"  srcset="sml-128.jpg 128w,mid-256.jpg 256w,large-512.jpg  512w" alt="" 
        sizes="(max-width:256px) 128px,
        (max-width:512px) 256px,
        512px "
    > 
    <img src="sml-128.jpg"  srcset="sml-128.jpg 128w,mid-256.jpg 256w,large-512.jpg  512w" alt="" 
        sizes="100vw "
    > 
    <img src="sml-128.jpg" srcset="sml-128.jpg 1x,,mid-256.jpg 2x,large-512.jpg  3x">
    
```

一个很严重的问题，在chrome上测试的时候会发现缓存相当严重，但是通过看network发现他其实是有加载到的，关闭再打开文件的话会显示正常。
w代表的是图片的尺寸
size改变的是图片的尺寸，从而可以直接得到不同的图片
假如浏览器宽度是360px，这样的话图片才尺寸是256px，他救会读取mid-256.jpg这个图片
在仓库blog的responsive-img example-3有相应的例子。
下面的这些也可以参考一下  
张鑫旭的博客[响应式图片srcset全新释义sizes属性w描述符](http://www.zhangxinxu.com/wordpress/2014/10/responsive-images-srcset-size-w-descriptor/ "img srcset")  
webkit最新特性srcset简介[WebKit最新特性srcset简介](http://developer.51cto.com/art/201309/410720.htm)  
responsive-images [responsive-images](https://jakearchibald.com/2015/anatomy-of-responsive-images/)  
CSS 与 HTML5 响应式图片 [CSS 与 HTML5 响应式图片](http://ued.taobao.org/blog/2013/01/css-and-html5-adaptive-images/)


#### 总结一下
这3种响应式图片的方法，用浏览器去解决响应的问题，减少了我们开发的成本，  
抛开兼容性不说，功能是真心的强大，能解决响应式的问题，也能解决屏幕手机的高清屏问题  

css样式跟picture的写法在chrome上都能够很直观的提现出来，反而img的src-set属性的话在测试的时候会比较的头疼

css样式的这种方法在一些大公司已经得到了使用，希望这些方法都能够普及出来吧，这样的话我们的工作量也可以减少一点了~服务器的加载问题也没那么头疼了！