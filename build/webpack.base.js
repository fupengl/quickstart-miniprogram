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

function entryFileType(point) {
	return ['.js', '.ts', '.scss', '.less', 'wxss'].map(v => point + v);
}

function getComponents(components, page) {
	const jsonFile = `${page}.json`;
	if (fs.existsSync(jsonFile)) {
		const {
			usingComponents = {}
		} = require(jsonFile);
		for (const component of Object.values(usingComponents)) {
			const comFile = component[0] === '/' ?
				path.join(utils.resolve(info.dir), component) :
				path.resolve(page, '..', component)
			if (~components.has(comFile)) {
				components.add(comFile);
				getComponents(components, comFile)
			}
		}
	}
}

function getAppEntry() {
	const info = path.parse(config.entry);
	const entryFile = [];
	const {
		pages = [],
			subpackages = []
	} = require(`${utils.resolve(info.dir)}/app.json`);
	entryFile.push(...pages.map(page => path.resolve(utils.resolve(info.dir), page)));
	subpackages.forEach(({
		root,
		pages = []
	}) => {
		pages.forEach(page => {
			entryFile.push(path.resolve(
				utils.resolve(info.dir),
				path.join(root, page)));
		});
	});
	const components = new Set();
	entryFile.forEach(item => {
		getComponents(components, item)
	})
	entryFile.push(...Array.from(components))
	let files = [];
	entryFile.forEach(page => {
		files.push(...entryFileType(page));
	});
	return files.filter(file => {
		if (fs.existsSync(file)) return file;
	}).reduce((res, file) => {
		const fileInfo = path.parse(file);
		const key = '/' + fileInfo.dir.slice(utils.resolve(info.dir).length + 1) + '/' + fileInfo.name;
		const points = res[key] || [];
		points.push(path.resolve(file));
		res[key] = points;
		return res;
	}, {});
}

function resolveApp() {
	const app = utils.resolve(config.entry);
	return entryFileType(app.slice(0, app.lastIndexOf('.'))).filter(file => {
		if (fs.existsSync(file)) return file;
	});
}

const appEntry = { app: resolveApp() };

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
