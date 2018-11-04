const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const WxAppWebpackPlugin = require('./minProgramPlugin');
const WxappNpmPlugin = require('bx-wxapp-npm-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const utils = require('./utils');
const config = require('../config');

function resolve(dir) {
	return path.join(__dirname, '../', dir);
}

function getAppEntry() {
	const info = path.parse(config.entry);
	const { pages = [], subpackages = [] } = require(`${resolve(info.dir)}/app.json`);
	subpackages.forEach(sp => {
		if (sp.pages.length) {
			sp.pages.forEach(page => {
				pages.push(path.join(sp.root, page));
			});
		}
	});
	let files = [];
	pages.forEach(page => {
		files.push(path.join(resolve(info.dir), page + '.js'),
			path.join(resolve(info.dir), page + '.ts'));
	});
	return files.filter(file => {
		if (fs.existsSync(file)) return file;
	}).reduce((res, file) => {
		const fileInfo = path.parse(file);
		const key = '/' + fileInfo.dir.slice(resolve(info.dir).length + 1) + '/' + fileInfo.name;
		res[key] = path.resolve(file);
		return res;
	}, {});
}

const appEntry = { app: resolve(config.entry) };

const entry = Object.assign({}, appEntry, getAppEntry());
module.exports = {
	entry: entry,
	output: {
		filename: '[name].js',
		path: resolve('dist'),
		globalObject: 'global',
	},
	//must not be eval
	devtool: 'none',
	optimization: {
		splitChunks: {
			cacheGroups: {
				default: false,
				//node_modules
				vendor: {
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					minChunks: 2
				},
				//其他公用代码
				common: {
					chunks: 'all',
					test: /[\\/]src[\\/]/,
					minChunks: 2,
					name: 'commons',
					minSize: 0
				}
			}
		},
		runtimeChunk: 'single'
	},
	resolve: {
		extensions: ['.js', '.json', '.ts', ],
		alias: {
			'@': resolve('src'),
		},
		symlinks: false
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'eslint-loader'
					}
				]
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
					},
					{
						loader: 'tslint-loader'
					}
				]
			},
			{
				test: /\.(sa|sc|c|le)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|png|gif|jpeg|jpg|wxs)\??.*$/,
				loader: 'url-loader',
				query: {
					//低于5000会被转化为base64
					limit: 50000,
					name: utils.assetsPath('img/[name].[ext]')
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin([resolve('./dist')], {
			root: resolve('./')
		}),
		new CopyWebpackPlugin(
			[{
				from: './',
				to: './'
			}], {
				ignore: ['*.js', '*.css', '*.ts', '*.scss', '*.less', '*.sass'],
				context: resolve('src'),
			}
		),
		new StylelintWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].wxss'
		}),
		new LodashModuleReplacementPlugin(),
		new WxAppWebpackPlugin(),
		new WxappNpmPlugin()
	]
};
