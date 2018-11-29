const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniProgramWebpackPlugin = require('miniprogram-webpack-plugin');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');

module.exports = {
	entry: {
		app: utils.resolve(config.entry)
	},
	output: {
		filename: '[name].js',
		path: utils.resolve('dist')
	},
	//must not be eval
	devtool: 'none',
	resolve: {
		extensions: ['.js', '.ts'],
		modules: [utils.resolve('src'), 'node_modules'],
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
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
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
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					}
				],
			},
			{
				test: /\.(wxss|wxs|wxml|json)\??.*$/,
				type: 'javascript/auto',
				loader: 'url-loader'
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
		new MiniCssExtractPlugin({
			filename: '[name].wxss'
		}),
		new MiniProgramWebpackPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new StylelintWebpackPlugin()
	]
};
