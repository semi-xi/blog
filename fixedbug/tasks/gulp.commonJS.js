/**
 * 自定义gulp插件 根据配置是否打包common.js，自动注入到html
 *
 * @author: lijialiang
 * @use: gulp.src(['src/*.html']).pipe(commonJS())
 */

'use strict';

// through2 is a thin wrapper around node transform streams
let through     = require('through2'),
    gutil       = require('gulp-util'),
    PluginError = gutil.PluginError,
    flag        = require('../config.js').default.isPackCommonJS;

// Consts
const PLUGIN_NAME = 'gulp-commonJS';

let setter = (html) => {
    return html.replace(/<script src/, '<script src="js/common.js" charset="utf-8"><\/script>\n<script src');
}

// Plugin level function(dealing with files)
function gulpPrefixer () {

    // Creating a stream through which each file will pass
    return through.obj((file, enc, cb) => {

        if (file.isBuffer() && flag) {
            let html = setter(file.contents.toString());
            // console.log(html);
            file.contents = new Buffer(html || '');
        }

        cb(null, file);

    });

};

// Exporting the plugin main function
module.exports = gulpPrefixer;
