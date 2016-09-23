// src开发目录路径
var srcDir = require('path').join(__dirname, './src');

exports.default = {
    // 文件别名配置
    alias: {
        jquery: srcDir + '/entry/lego-lib/jquery/1.12.2/jquery.min.js'
    },

    // 全局引入模块配置
    global: {
        jquery: 'jquery',
        jQuery: 'jquery',
        $     : 'jquery'
    },

    // 是否打包出公共pack
    isPackCommonJS: false,

    // 是否支持 es6 编译为 es5
    isES6: false,

    // 端口号
    port: 8888,

    // 其他配置 config 路径
    other: [],

}
