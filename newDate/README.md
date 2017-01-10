# new Date() 在ie 中Invalid Date 的bug

需求是做cache的时候需要拿到一个日期的对象保存，是通过直接new Date(str)的方式拿到的  
但是却发现在ie9（目前只测到了最高）以及以下的都不能兼容这个写法。并且提示`Invalid Date`的异常报错，除了ie，还有人说Firefox也会出现，但是我自己测试的时候Firefox是没有问题的。但是统一按照ie的解决方案的话是没有问题的。

## Date() 对象
默认的new Date() 会返回当前的一个时间给你，你可以通过它内置的方法可以获取各式各样的内容。  

但是 new Date () 也是支持直接设置日期的，如果你需要直接设置年月日时分秒这样的,我自己测试的话只有这两个是成功的

1. `new Date("yyyy-mth-ddThh:mm:ss")`; ex:`2016-09-01T10:20:30`，T不能漏
1. `new Date("yyyy,mth,dd,hh,mm,ss")`; ex:`2016, 08, 01, 10, 20, 30`


**但是能用不代表出来的时间一定是正确的 这个一定要切记**

```js
<script type="text/javascript">
    var oBody = document.getElementById('body');
        var time = new Date(2016, 08, 01, 10, 20, 30);
        var time2 = new Date('09 01, 2016 10:20');
        var time3 = new Date(time.getTime())
        var time4 = new Date('2016-09-01T10:20:30');
        var time5 = new Date('2016-09-01 10:20:30');

        console.log(time);
        console.log(time2);
        console.log(time3);
        console.log(time4);
        console.log(time4.toUTCString());
        console.log(time5);
        oBody.innerHTML = time + '<br>' + time2 + '<br>' + time3 + '<br>' + time4 + '<br>' + time4.toUTCString() + '<br>' + time5;
</script>
```
但是出来的结果是这样的  
IE 9  
![](https://github.com/semi-xi/blog/raw/master/newDate/src/img/ie.png)  
  
FF 48  
  
![](https://github.com/semi-xi/blog/raw/master/newDate/src/img/ie.png)    
  
Chrome  

![](https://github.com/semi-xi/blog/raw/master/newDate/src/img/ie.png)  

**两个设置方法出来的值不一样**

是不是很吃惊。。
`new Date("yyyy-mth-ddThh:mm:ss")`跟`new Date("yyyy,mth,dd,hh,mm,ss")`创建出来的东西在FF跟ie/chrom表现是不一样的，而且从时间上来说，`new Date("yyyy-mth-ddThh:mm:ss")`会跟`toUTCString()`之后的时间不一样，唯一相同的都是8小时。

在这里之中，我感觉上FF上是没错的，反而是IE跟Chrome是错误的。判断的逻辑是，如果我这里是正确时间，那么我toUTC之后的应该会减8个小时(因为我们这里是东八区，世界时间在0时区)，就这样子算差值的话就得出是了。  
当然了，这只是我的判断，应该是跟参数的`T`有关系

**回到主题 ie跟FF/Chrome 的差异**

之前在查阅资料的时候，有些人给出的定义时间是这样`new Date('09 01, 2016 10:20')` 但是从结果来看，这个在ie里面是直接跪了的  
对于大部分的习惯定义时间 `new Date('09 01, 2016 10:20')` 这样的定义方法在ie来说也是不行的。
当然这里指的是一次性定义年月日时分秒的问题。
那么如果仅仅是定义年月日 或者时分秒呢

```js

var oBody = document.getElementById('body');
    var time = new Date(2016, 08, 01);
    var time2 = new Date('09 01, 2016');
    var time3 = new Date('10:20:30');
    var time4 = new Date('2016-09-01');

    console.log(time);
    console.log(time2);
    console.log(time3);
    console.log(time4);
    oBody.innerHTML = time + '<br>' + time2 + '<br>' + time3 + '<br>' + time4 + '<br>' ;

```

在这里直接说结论了，不贴图了
`time`跟`time4`在3个浏览器都能被正确的获取值， `time2`跟`time3` 在ie是直接跪的，`time3`在chrome跟FF都是直接跪的

因为我们定义时间的时候，尽量选择安全的方式去做，`new Date(yyyy,mth,dd)`跟`new Date('yyyy-mth-day')`这样的安全方法，对于直接定义时分秒的话还是老老实实的直接按照`setXXX()`的办法来做吧


## 结论

定义时间 首选`new Date('yyyy-mth-day')`,`new Date(yyyy,mth,dd)`如果不是的话，就自己用正则去搞定吧，也很简单。这里就不写出那些正则的方法了。
