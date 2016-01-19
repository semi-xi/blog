# 复制网址的那些事

一般来说现在网站已经很少的用到了复制网址以及类似的功能，但是在一些游戏网站还会有一些什么激活码之类的，等等需要去复制  
目前的话找到的是2种办法

1. clipboardData 

    目前只兼容ie，使用的方法是window.clipboardData.setData('text',string);  
    这里的话需要做一个兼容，方法可以是这样
    ``` javascript
     if(window.clipboardData){
         window.clipboardData.setData('text',xxxx);
     }else{
        alert('只支持ie浏览器')
     }
    ```

    完整的demo文件可以在demo文件夹可以找到

1. ZeroClipboard 
    这个的话可以参考这里[ZeroClipboard介绍](http://www.365mini.com/page/zeroclipboard-2_x-quick-start.htm ZeroClipboard)  
    这里是利用了falsh去做的一个复制，里面有很多细节考究的，可以去细看


其实我一直在想，要做到兼容，需要引入falsh，要不然就没法兼容。如果非得实现的话，我们能不能退而求其次，实现一个类似的功能  
就是弹出一个框全选给浏览者去复制，感觉也不会太糟糕吧。  
恰好今天看到了了一个方法，感觉可以拿来用下的。`prompt()`
具体的话可以参考w3cschool中文上的介绍[prompt](http://www.w3school.com.cn/jsref/met_win_prompt.asp prompt介绍)。
我测试的结果是ie7以上都可以用，wekit那些也可以，demo效果的话可以看demo文件夹的例子

## prompt(text,defaultText)
| 参数 | 描述 | 
| :---: | :---:|
| text | 可选。要在对话框中显示的纯文本（而不是 HTML 格式的文本）|
| defaultText | 可选。默认的输入文本。|

他会返回一个数值是你输入的文本，可以直接进行console进行尝试！