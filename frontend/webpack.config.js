
var path = require('path');
var WebpackMd5Hash = require('webpack-md5-hash');
var webpack = require('webpack');
var node_module_dir = path.resolve(__dirname, 'node_module');
var minimize = process.argv.indexOf('--mini') !== -1;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
var spaceConfig = require('../source/config');


var config = {
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/public': {
                changeOrigin: true,
                target: 'http://localhost:6999',
                secure: false
            },
            '/api': {
                changeOrigin: true,
                target: 'http://localhost:6999',
                secure: false
            }
        }
    },
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/main.js'),
            // 'webpack/hot/only-dev-server'
        ],
        libs: [
            'react', 'react-router', 'react-dom',
            'immutable', 'redux', 'react-redux', 'react-router-redux',
            'isomorphic-fetch', 'classname'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].min.js?v=[chunkhash]',
        publicPath: '/',
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin('libs', 'libs.min.js?v='+(minimize?"[chunkhash]":"[hash]")),
        new ExtractTextPlugin("styles.min.css?v=[contenthash]", {allChunks: true}),
        new WebpackMd5Hash(),
        new HtmlWebpackPlugin({
            title: 'Toy',
            filename: 'index.html',
            key: Date.now(),
            // minify: true,
            template: 'src/index.tpl.html',
            info: spaceConfig.info || {}
        })
    ],
    module: {
        loaders: [
            { 
                test: /\.text\.less$/, 
                loader: ExtractTextPlugin.extract(['css-loader', 'postcss', 'less'])
            },
            {
                loaders: [
                    // "react-hot/webpack",
                    "babel?presets[]=react,presets[]=es2015,presets[]=stage-0"
                ],   //加载babel模块
                include:[
                    path.resolve(__dirname, 'src'),
                ],
                exclude:[
                    /(node_modules|bower_components)/,
                ],
                test:/\.jsx?$/
            },
		    {
			    test: /^(.(?!\.text))*\.less$/,
		    	loader: 'style-loader!css-loader' +
                '!postcss!less-loader'
		    },
		    {
		        test: /\.css$/,
		        loader: 'style-loader!css-loader'
		    },
		    {
		        test: /\.(png|jpg|jpeg)$/,
		        loader: 'url-loader?limit=8192&name=toy_res/[name].[ext]?[hash]'
		    },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=toy_res/[name].[ext]?[hash]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=toy_res/[name].[ext]?[hash]" }
        ]
    },
    postcss: function () {
        return [require('autoprefixer'), require('precss')];
    }
}
if(minimize) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),
        //允许错误不打断程序
        new webpack.NoErrorsPlugin()
    );
    config.plugins.unshift(new Webpack_isomorphic_tools_plugin(require('../webpack-isomorphic-conf')));
} else {
    config.devtool = 'source-map';
    config.plugins.push (
        new webpack.HotModuleReplacementPlugin()  //fix Maximum call stack
    )
}

module.exports = config;