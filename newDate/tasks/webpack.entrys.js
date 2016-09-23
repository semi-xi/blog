/**
 * 根据 src/entry/ 目录下的直属JS脚本文件生成entry入口
 *
 * @author: lijialiang
 * @use: require().init((entrys) => {})
 * @param {Function} cb 回调函数
 */


'use strict';

exports.init = (cb) => {
    // 自动生成入口文件
    const srcPath = '../src/entry/',
          fs      = require('fs'),
          srcDir  = require('path').join(__dirname, srcPath);

    fs.readdir(srcDir, (err,files) => {
        if(err){
            // 报错
            console.error(err);
        }
        // 去除多余项
        let entrys = {};

        // 迭代直属JS脚本文件
        files.forEach(function (item) {
            // JS后缀名
            let _suffix = '.js';
            if(item.indexOf(_suffix) > 0){
                entrys[item.split(_suffix)[0]] = srcDir + item;
            }
        });

        // 回调
        // console.log(entrys);
        cb(entrys);
    });
}
