'use strict';

module.exports = (gulp, plugins) => {

    let argv        = require('yargs').argv,
        chalk       = require('chalk'),
        moment      = require('moment'),
        cssImport   = require('gulp-cssimport'),
        browserSync = require('browser-sync'),
        reload      = browserSync.reload,
        log         = console.log,
        win32       = process.platform === 'win32',
        port        = +argv.p || 3000,
        pkg         = require('../package.json'),
        banner      = '/*!' + '\n * @project : ' + pkg.name + '\n * @version : ' + pkg.version + '\n * @author : ' + pkg.author + '\n * @update : ' + moment().format('YYYY-MM-DD h:mm:ss a') + '\n */\r',
        IPv4        = '0.0.0.0';

    let network = require('network');

    network.get_private_ip((err, ip) => {
    	if(err) throw err;
        IPv4 = ip;
    })

    let _    = require('lodash'),
        path = require('path');

    // 打印格式
    let labelForm = (isStart, info) => {

        // 获取当前时间
        let d = new Date(),
            h = zeroPrefix(d.getHours()),
            m = zeroPrefix(d.getMinutes()),
            s = zeroPrefix(d.getSeconds()),
            // 拼接时间格式
            timeLabel = '[' + chalk.gray(h + ':' + m + ':' + s) + ']',
            // 拼接输出格式
            infoLabel = chalk.cyan(info);

        // 是否完成
        if(isStart){
            console.log(timeLabel + " Starting '" + infoLabel + "'..." );
        }else{
            console.log(timeLabel + " Finished '" + infoLabel + "'" );
        }
    }

    // 补零
    let zeroPrefix = (num) => {
        if(num < 10){
            return '0' + num;
        }
        return num;
    }

    // webpack-dev-server配置
    //
    // 获取自定义配置
    let config = require('../config.js').default;

    // 端口号
    let wpPort = config.port;

    gulp.task('dev_conn',() => {

        // 开始服务打印
        labelForm(true, 'webpack-dev-server');

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

            // webpack Dev temp
            let webpackTpl = `
                var webpack = require('webpack');
                var path    = require('path');

                module.exports = {
                    devtool: 'source-map',
                    entry: ${ JSON.stringify(entrys) },
                    output: {
                        filename: '[name].js',
                        publicPath: 'js/',
                        path: './src/js',
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
                    ]
                };
            `;
            // console.log(webpackTpl);

            // 写入webpack dev 文件
            require('fs').writeFile('./tasks/webpack.dev.js', webpackTpl, (err) => {
                if(err) throw err;

                // 执行webpack-dev-server
                let cp = require('child_process');
                cp.exec('webpack-dev-server --inline --quiet --devtool eval --content-base ./src/ --config ./tasks/webpack.dev.js --host '+ IPv4 +' --port ' + wpPort, function(error, stdout, stderr){
                    if(error){
                        throw error;
                    }
                });

                // 迭代判断服务是否启动成功
                webpackTimer();
            });
        });
    })

    // 判断webpack-dev-server是否启动成功计时器
    let webpackTimer = () => {
        let request = require('request');
        // 请求服务
        request.get('http://'+ IPv4 +':' + wpPort, (error, response, body) => {
            // 是否请求成功
            if (!error && response.statusCode === 200 && typeof(body) !== '') {
                // webpack-dev-server服务初始化成功打印
                labelForm(false, 'webpack-dev-server');
                browserOpen();
            }else{
                setTimeout(webpackTimer, 2000);
            }
        })
    }

    // 配置自动刷新页面组件
    let browserOpen = () => {
        browserSync({
            ui       : false,
            notify   : false,
            ghostMode: false,
            port     : port,
            open     : 'external',
            proxy    : IPv4 + ':' + wpPort,
            browser  : '/Applications/Google\ Chrome.app/'
        }, (err, arg) => {
            if(!err){
                console.log(' ' + chalk.bgGreen('---------现在可以开始Coding---------'));
            }
            if (argv.q) {
                var url = arg.options.get('urls').get('external')
                var qrcode = require('qrcode-terminal')
                qrcode.generate(url);
            }
        })
    }

    // sass任务
    gulp.task('dev_sass', () => {
        let sassCompile = () => {
            let handler = () => {
                return plugins.notify.onError({
                    title:'sass编译错误',
                    message:'<%=error.message%>'
                })
            }
            return plugins.sass().on('error', handler());
        }
        return gulp.src('src/sass/*.scss')
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompile())
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(plugins.sourcemaps.init({loadMaps: true}))
            .pipe(plugins.autoprefixer( {browsers: ['> 0%']} ))
            .pipe(plugins.sourcemaps.write({includeContent: false, sourceRoot: '../sass/'}))
            .pipe(cssImport())
            .pipe(gulp.dest('src/css'))
            .pipe(reload({stream:true}));
    })

    // 检测 src/img/slice 文件夹，读取图片信息来生成css切片样式
    gulp.task('dev_slice2css', () => {
        let fs        = require('fs'),
            path      = require('path'),
            async     = require('gulp-uglify/node_modules/uglify-js/node_modules/async'),
            getPixels = require('multi-sprite/node_modules/spritesmith/node_modules/pixelsmith/node_modules/get-pixels'),
            ejs       = require('gulp-ejs/node_modules/ejs');

        let classnameRule = (fileName, p) => {

            let relPath = path.relative('src/img/slice', path.dirname(p)),
                name = win32? path.join(relPath, fileName).replace(/\\/g, '-'):path.join(relPath, fileName).replace(/\//g, '-');

            return name;
        }

        let pageWidth = argv.w, isProcessREM = !!argv.w, data = {}, files;

        async.series([

            // 1. 文件过滤
            function (next) {
                var glob = require('glob');
                files = glob.sync('src/img/slice/**', { nodir: true});
                files = files.filter(function(f){
                    return !~(path.basename(f).indexOf('@'));
                })
                next(null);
            },

            // 2. 生成切片数据
            function (next) {
                var arr = data.slice = [];
                async.eachSeries(files, iterator, callback);
                function iterator(f, _next){
                    getPixels(f, function (err, pixels) {
                        if(err){return}
                        arr.push({
                            filepath : f,
                            imageurl : path.relative('src/sass', f).split(path.sep).join('/'),
                            classname: classnameRule.call({}, path.basename(f, path.extname(f)), f),
                            width    : formatPX(pixels.shape[0]),
                            height   : formatPX(pixels.shape[1]),
                            cover    : isProcessREM?'background-size:cover;':''
                        })
                        _next(null)

                        function formatPX (pxValue) {
                            if (!pageWidth) { return pxValue + 'px' }
                            if (+pageWidth === 1) { return pxValue * 16 / 720+'rem' }
                            return (pxValue * 16 / + pageWidth) + 'rem';
                        }
                    })
                }
                function callback (err, result) {
                    next(null)
                }
            },

            // 3. 生成css文件
            function (next) {
                let tpl = (() => {/*
// CSS Sprites切片样式
<% slice.forEach(function(e){ %>
%<%= e.classname%> {
    width: <%= e.width%>;
    height: <%= e.height %>;
    background-image: url(<%= e.imageurl%>);
    background-repeat: no-repeat;
    <%= e.cover%>
}
<% }) %>
                    */}).toString().split('\n').slice(1, -1).join('\n');
                let css = ejs.render(tpl, data).replace(/^\n/mg, '');
                fs.writeFileSync('src/sass/_slice.scss', css);
            }
        ])
    })

    // 默认任务
    gulp.task('default', ['dev_conn'], () => {
        gulp.watch('src/img/slice/**', ['dev_slice2css']);
        gulp.watch('src/sass/**', ['dev_sass']);
        gulp.watch('src/img/**', reload);
        gulp.watch('src/*.html', reload);
        gulp.watch('src/js/**.js', reload);
    })

}
