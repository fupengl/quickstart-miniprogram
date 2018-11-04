const config = require('../config');

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev');

const compiler = webpack(webpackConfig);
const chalk = require('chalk');

console.log(chalk.green('> Starting dev compiler...'));

require('webpack-dev-middleware-hard-disk')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true
});
