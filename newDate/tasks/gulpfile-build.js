'use strict';

module.exports = (gulp, plugins) => {

    let argv           = require('yargs').argv,
        del            = require('del'),
        moment         = require('moment'),
        cssImport      = require('gulp-cssimport'),
        multiSprite    = require('multi-sprite'),
        browserSync    = require('browser-sync'),
        log            = console.log,
        webpack        = require('gulp-webpack'),
        port           = +argv.p || 3000,
        isBeautifyHTML = argv.b || false,
        pkg            = require('../package.json'),
        commonJS       = require('./gulp.commonJS.js');

let banner =`/*!
 * @Project: ${ pkg.name }
 * @Version: ${ pkg.version }
 * @Author: ${ pkg.author }
 * @Update: ${ moment().format('YYYY-MM-DD h:mm:ss a') }
 */
 `;

    let _    = require('lodash'),
        path = require('path');

    // 编译sass任务
    gulp.task('build_sass', () => {
        let sassCompile4nix = () => {
            let handler = () => {
                return plugins.notify.onError({
                    title:'sass编译错误',
                    message:'<%=error.message%>'
                })
            }
            return plugins.sass().on('error', handler())
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompile4nix())
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer( {browsers: ['> 0%']} ))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(cssImport())
            .pipe(gulp.dest('src/css'));
    })

    gulp.task('build_css', ['build_sass'], () => {
        return gulp.src('src/css/**/*.css')
            .pipe(plugins.minifyCss({"compatibility":"ie7", "shorthandCompacting": false}))
            .pipe(plugins.header(banner, { pkg : pkg } ))
            .pipe(gulp.dest('dest/css'));
    })

    gulp.task('build_slice', () => {
        return gulp.src('src/img/slice/**')
            .pipe(gulp.dest('dest/img/slice'));
    })

    // 雪碧图任务
    gulp.task('build_sprite', ['build_slice', 'build_css'], () => {
        return multiSprite({
            rootFontSize: argv.w? +argv.w/16 : 750/16,
            srcCss      : 'dest/css',
            srcImg      : 'dest/img/slice',
            destCss     : 'dest/css',
            destImg     : 'dest/img/sprite',
            'algorithm' : 'binary-tree',
            'padding'   : 4,
            'exportOpts': {
                'format': 'png',
                'quality': 90
            },
            successCB: () => {
                del(['dest/img/slice/**'])

                // 给css文件的图片请求加上时间戳
                let timestamp = +new Date
                gulp.src(['dest/css/**'])
                    .pipe(plugins.replace(/(\/[\w-]*\.(jpg|jpeg|gif|png|bmp|tiff|otf|ttf|woff|svg|webp|swf|htc))/ig, '$1?'+timestamp))
                    .pipe(gulp.dest('dest/css'));
            }
        })
    })

    // webpack 任务
    //
    // 获取自定义配置
    let config = require('../config.js').default;

    gulp.task('webpack_js', () => {

        if(config.other){
            let other = config.other;

            _.forEach(other, function(v){
                let _config = require(require('path').join(__dirname, '../') + v);
                if( _config.default &&  _config.default.alias){
                    config.alias = _.assign( config.alias, _config.default.alias );
                }
            });

        }

        // 生成entrys
        require('./webpack.entrys.js').init((entrys) => {

            // ES6 loader
            let ES6Loader = `
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    include: path.join(__dirname, '../src/entry/'),
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'stage-0'],
                        // plugins: ['transform-runtime'],
                    }
                },
            `;

            // 是否打包出公共模块
            let packCommonJS = `
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'common',
                    minChunks: 2
                })
            `;

            // webpack Dev temp
            let webpackTpl = `
                var webpack = require('webpack');
                var path    = require('path');

                module.exports = {
                	entry: ${ JSON.stringify(entrys) },
                	output: {
                		filename: '[name].js',
                	},
                	module: {
                        loaders: [
                            ${ config.isES6 ?  ES6Loader : '' }
                            {
                                test: /\.html$/,
                                loader: 'html'
                            },
                            {
                                test: /\.scss$/,
                                include: path.join(__dirname, '../src/entry/'),
                                loaders: ['css', 'autoprefixer', 'sass'],
                            },
                            {
                                test: /\.(png|jpg|gif|svg)$/,
                                loader: 'url?limit=10240&name=/img/[name].[ext]?[hash]'
                            },
                            {
                                test: /\.tpl$/,
                                exclude: /(node_modules|bower_components)/,
                                include: path.join(__dirname, '../src/entry/tpl/'),
                                loader: 'tmodjs',
                            },
                        ]
                	},
                    resolve: {
                        alias: ${ JSON.stringify(config.alias) },
                        extensions:['','.js','.json'],
                    },
                	plugins: [
                        new webpack.ProvidePlugin(${ JSON.stringify(config.global) }),
                        new webpack.optimize.UglifyJsPlugin({
                            compress: {
                                warnings: false
                            }
                        }),
                        ${ config.isPackCommonJS ?  packCommonJS : '' }
                    ]
                };
            `;
            // console.log(webpackTpl);

            // 写入webpack build 配置文件
            require('fs').writeFile('./tasks/webpack.build.js', webpackTpl, (err) => {
                if(err) throw err;
                return gulp.src('src/entry/**/*.js')
                    .pipe(webpack(require('./webpack.build.js')))
                    .pipe(plugins.header(banner, { pkg : pkg } ))
                    .pipe(gulp.dest('dest/js'))

            });
        });
    })

    // JS 任务
    gulp.task('build_js', ['webpack_js'], () => {
        return gulp.src('src/js/**/*.js')
            .pipe(plugins.uglify())
            .pipe(gulp.dest('dest/js'))
    })

    // img 任务
    gulp.task('build_img', () => {
        let pngquant = require('imagemin-pngquant');
        return gulp.src(['src/img/**', '!src/img/**/*.psd', '!src/img/slice/**', '!src/img/slice/'])
            .pipe(plugins.imagemin({
                progressive: true,
                use: [pngquant()]
            }))
            .pipe(gulp.dest('dest/img'))
    })

    // html任务
    gulp.task('build_html', () => {
        if (isBeautifyHTML) {
            return gulp.src(['src/*.html'])
                .pipe(plugins.jsbeautifier({indentSize: 4}))
                .pipe(plugins.inlineSource().on('error', console.log))
                .pipe(commonJS())
                .pipe(gulp.dest('dest'))
        }
        return gulp.src(['src/*.html'])
            .pipe(plugins.inlineSource().on('error', console.log))
            .pipe(commonJS())
            .pipe(gulp.dest('dest'))
    })

    // clean 以往dest文件夹
    gulp.task('build_clean', () => {
        del.sync(['dest/**']);
    })

    // 复制文件
    gulp.task('build_copyrest', () => {
        return gulp.src(['src/**', '!src/*.html'].concat(getIgnoreFolder()))
            .pipe(gulp.dest('dest/'))
        function getIgnoreFolder () {
            let paths = [];
            ['css', 'img', 'js', 'sass', 'tpl', 'svg', 'entry', 'mp4', 'mp3', 'swf'].forEach((item) => {
                paths.push('!src/' + item);
                paths.push('!src/'+ item + '/**');
            })
            return paths;
        }
    })

    // 少量代码的文件可以合并到页面上（不适用于包含背景图的css文件）
    gulp.task('build_inline', ['build_html', 'build_sprite', 'build_js'], () => {
        // 不压缩
        var options = { compress : !1 };
        // 去掉注释
        options.handlers = (source, context, next) => {
            source.fileContent = source.fileContent.replace(new RegExp('(/\\\*([^*]|[\\\r\\\n]|(\\\*+([^*/]|[\\\r\\\n])))*\\\*+/)|(//.*)'),'');
            if (source.type == 'css') {
                source.fileContent = source.fileContent.slice(0,-1) + ';' + source.fileContent.slice(-1);
            }
            if (source.type == 'js') {
                if (source.fileContent.charAt(0).match(/\s/)) {
                    source.fileContent = source.fileContent.substring(1);
                }
            }
            if (next) {
                next();
            }
        };
        return gulp.src(['dest/*.html'])
            .pipe(plugins.inlineSource(options).on('error', console.log))
            .pipe(gulp.dest('dest'))
    })

    // build 任务
    gulp.task('build', ['build_clean', 'build_inline', 'build_img', 'build_copyrest'], () => {
        browserSync({
            ui: false,
            server: {
                baseDir  : 'dest',
                directory: true,
            },
            notify   : false,
            ghostMode:false,
            codeSync : false,
            port     : port,
            open     : 'external',
            browser  : '/Applications/Google\ Chrome.app/'
        }, (err, arg) => {
            if (argv.q) {
                let url = arg.options.get('urls').get('external')
                let qrcode = require('qrcode-terminal')
                qrcode.generate(url)
            }
        })
    })

}
