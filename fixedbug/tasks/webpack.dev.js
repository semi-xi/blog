
                var webpack = require('webpack');
                var path    = require('path');
                var ExtractTextPlugin = require('extract-text-webpack-plugin');

                module.exports = {
                    devtool: 'source-map',
                    entry: {"index":"/Users/jim/Desktop/fiexedbug/src/entry/index.js"},
                    output: {
                        filename: 'js/[name].js',
                        publicPath: '',
                        path: './src/js',
                    },
                    module: {
                        loaders: [
                            
                        {
                            test: /.js$/,
                            exclude: /(node_modules|bower_components)/,
                            include: path.join(__dirname, '../src/entry/'),
                            loader: 'babel',
                            query: {
                                presets: ['es2015', 'stage-0'],
                                // plugins: ['transform-runtime'],
                            }
                        },
            
                            {
                                test: /.html$/,
                                loader: 'html'
                            },
                            {
                                test: /.scss$/,
                                loader: ExtractTextPlugin.extract('style','css!autoprefixer?safe=true!sass'),
                            },
                            {
                                test: /.(png|jpg|gif|svg)$/,
                                loader: 'url?limit=10240&name=/img/[name].[ext]?[hash]'
                            },
                            {
                                test: /.tpl$/,
                                exclude: /(node_modules|bower_components)/,
                                include: path.join(__dirname, '../src/entry/tpl/'),
                                loader: 'tmodjs',
                            },
                        ]
                    },
                    resolve: {
                        alias: {"zepto":"/Users/jim/Desktop/fiexedbug/src/entry/lego-lib/zepto/zepto.min.js"},
                        extensions:['','.js','.json'],
                    },
                    plugins: [
                        new webpack.ProvidePlugin({"zepto":"zepto","$":"zepto"}),
                        new webpack.optimize.UglifyJsPlugin({
                            compress: {
                                warnings: false
                            }
                        }),
                        new ExtractTextPlugin('css/[name].css'),
                    ]
                };
            