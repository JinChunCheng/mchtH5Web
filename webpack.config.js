const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = (options = {}) => ({
	entry: {
		index: './src/main.js',
		// vendor: ['vue', 'vuex', 'vue-router', 'mint-ui', 'echarts', 'reqwest']
		vendor: ['vue','vue-router', 'mint-ui']
	},
	output: {
		publicPath: '/mchtH5Web/',
		path: path.resolve(__dirname, 'mchtH5Web'),
		filename: 'js/[name].js?v=[hash:6]',
		chunkFilename: 'js/[id].js?v=[chunkhash:6]'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			use: 'vue-loader'
		}, {
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.html$/,
			use: [{
				loader: 'html-loader',
				options: {
					root: path.resolve(__dirname, 'src'),
					attrs: ['img:src', 'link:href']
				}
			}]
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader'})
		}, {
			test: /\.less$/,
			use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!less-loader!postcss-loader'}),
		}, {
			test: /\.(jpg|png|gif)(\?.+)?$/,
			use: 'file-loader?name=img/[name].[ext]?v=[hash:6]'
		}, {
			test: /\.(eot|woff2|woff|ttf|svg)(\?.+)?$/,
			use: 'file-loader?name=fonts/[name].[ext]?v=[hash:6]'
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({template: 'index.html'}),
		new ExtractTextPlugin('css/[name].css?v=[contenthash:6]'),
		new CommonsChunkPlugin({names: ['vendor', 'manifest']})
	],
	resolve: {alias: {vue: 'vue/dist/vue.js'}},
	// host设置为0.0.0.0,可以用localhost, 127.0.0.1, 本机ip访问
	devServer: {
		host: '0.0.0.0',
		port: 8010,
		historyApiFallback: true,
        // 代理请求，解决跨域
        proxy: {
            '/mchtH5Server': {
            	// 本地测试地址
                target: 'http://172.30.61.148:8085',
                changeOrigin: true
            }
        }
	},
	devtool: options.dev ? '#eval-source-map' : '#source-map'
});
