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

function getAppEntry() {
	const info = path.parse(config.entry);
	const { pages = [],
		subpackages = [] } = require(`${utils.resolve(info.dir)}/app.json`);
	subpackages.forEach(sp => {
		if (sp.pages.length) {
			sp.pages.forEach(page => {
				pages.push(path.join(sp.root, page));
			});
		}
	});
	console.log(pages);
	let files = [];
	pages.forEach(page => {
		files.push(path.join(utils.resolve(info.dir), page + '.js'),
			path.join(utils.resolve(info.dir), page + '.ts'));
	});
	return files.filter(file => {
		if (fs.existsSync(file)) return file;
	}).reduce((res, file) => {
		const fileInfo = path.parse(file);
		const key = '/' + fileInfo.dir.slice(utils.resolve(info.dir).length + 1) + '/' + fileInfo.name;
		res[key] = path.resolve(file);
		return res;
	}, {});
}

const appEntry = { app: utils.resolve(config.entry) };

const entry = Object.assign({}, appEntry, getAppEntry());
module.exports = {
	entry: entry,
	output: {
		filename: '[name].js',
		path: utils.resolve('dist'),
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
		extensions: ['.js', '.json', '.ts'],
		alias: Object.assign({}, config.alias, {
			'@': utils.resolve('src'),
		}),
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
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|png|gif|jpeg|jpg)\??.*$/,
				loader: 'url-loader',
				query: {
					limit: 50000,
					name: utils.assetsPath('image/[name].[ext]')
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin([utils.resolve('./dist')], {
			root: utils.resolve('./')
		}),
		new CopyWebpackPlugin(
			[{
				from: './',
				to: './'
			}], {
				ignore: ['*.js', '*.css', '*.ts', '*.scss', '*.less', '*.sass', '*.wxss'],
				context: utils.resolve('src'),
			}
		),
		new StylelintWebpackPlugin(),
		new WxAppWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].wxss'
		}),
		new LodashModuleReplacementPlugin(),
		new WxappNpmPlugin()
	]
};
