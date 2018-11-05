const merge = require('webpack-merge');
const common = require('./webpack.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('../config');
const webpack = require('webpack');

module.exports = merge(common,
	{
		mode: 'production',
		devtool: 'source-map',
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({
					assetNameRegExp: /\.wxss\.*(?!.*map)/g,
					cssProcessorOptions: {
						discardComments: { removeAll: true },
						safe: true,
						autoprefixer: true
					},
				})
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': config.build.env
			})
		]
	}
);
