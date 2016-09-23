
                var webpack = require('webpack');
                var path    = require('path');

                module.exports = {
                    devtool: 'source-map',
                    entry: {"index":"/Users/jim/blog/newDate/src/entry/index.js"},
                    output: {
                        filename: '[name].js',
                        publicPath: 'js/',
                        path: './src/js',
                    },
                    module: {
                        loaders: [
                            
                            {
                                test: /.html$/,
                                loader: 'html'
                            },
                            {
                                test: /.scss$/,
                                include: path.join(__dirname, '../src/entry/'),
                                loaders: ['css', 'autoprefixer', 'sass'],
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
                        alias: {"jquery":"/Users/jim/blog/newDate/src/entry/lego-lib/jquery/1.12.2/jquery.min.js"},
                        extensions:['','.js','.json'],
                    },
                    plugins: [
                        new webpack.ProvidePlugin({"jquery":"jquery","jQuery":"jquery","$":"jquery"}),
                        new webpack.optimize.UglifyJsPlugin({
                            compress: {
                                warnings: false
                            }
                        }),
                    ]
                };
            