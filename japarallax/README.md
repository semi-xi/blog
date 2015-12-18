## jparallax 笔记
### 写在前面
之前用的这个插件的时候就发现有坑的了，不过那个时候不知道怎么的就解决了，现在要用这个插件的时候就真的是坑了下自己所以过来总结一下

插件地址[jparallax](https://github.com/stephband/jparallax)

### 坑的方式
###  1.element必须有高度
这个elemnt指的是传参的那个element，如果没有高度的话会导致计算出来的需要视差的元素高度为0

### 2.子元素必须带layer
这个是api里面没有提到的，看过插件的代码就知道，他是去检索子元素是否包含layer来决定动的元素的。
```javascript
<div id="scene">
    <div class=" layer" data-depth="0.4"></div> //必须带layer，要不然会跪
    <div class=" layer" data-depth="0.6"></div>
    <div class=" layer" data-depth="0.8"></div>
    <div class=" layer" data-depth="0.7"></div>
    <div class=" layer" data-depth="0.3"></div>
    <div class=" layer" data-depth="0.4"></div>
</div>

```

### 3. 子元素默认的top，left为0
当元素生成之后，在高版本浏览器当中他是通过对translate的值不同改变偏移值的，是以自己本身的位置为起始点  
但是插件本身的默认设置是left=0，top=0，对于子元素本身不是宽高为100%的情况就会出现一个比较大的问题是  
他会一直都在左上角偏移，而不是自己之前定义好的位置。解决办法有可以先的这些

1. 子元素宽高100%，需要活动的元素写在这个子元素里面定位好,类似于

    ``` javasctipt
        <div id="scene">
            <div class=" layer" data-depth="0.4"><img src="" alt=""></div> //必须带layer，要不然会跪
            <div class=" layer" data-depth="0.6"><img src="" alt=""></div>
            <div class=" layer" data-depth="0.8"><img src="" alt=""></div>
            <div class=" layer" data-depth="0.7"><img src="" alt=""></div>
            <div class=" layer" data-depth="0.3"><img src="" alt=""></div>
            <div class=" layer" data-depth="0.4"><img src="" alt=""></div>
        </div>
    ```
2. 去改插件，这个也是去快捷的办法在jq版本的插件中，有下面这样的代码

``` javascript
        this.$layers.css({
            position:'absolute',
            display:'block',
            left: 0,
            top: 0
        });
```

改成这样的就可以  
 
```
    this.$layers.each(function(index, el) {
        $(el).css({
            position: "absolute",
            display: "block",
            left: $(el).position().left,
            top: $(el).position().top
        })
    })
```

这样是为了让他们能够自己读取自己的正确的绝对位置去偏移，而不是按照0,0的位置
    
如果是原生版本里面的话有
    
```
    layer.style.left = 0;
      layer.style.top = 0;
```

只需要自己写一个方法找到自己距离上一个定位元素的位置，这里不再叙述了。
    
### 写在后话
暂时的坑就3个，后面有的话会补充
