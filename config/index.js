const path = require('path');

module.exports = {
	entry: './src/app.ts',
	alias: {
		'style': resolve('src/styles/index.scss')
	},
	build: {
		env: require('./prod.env'),
		assetsSubDirectory: 'static',
	},
	dev: {
		env: require('./dev.env'),
		assetsSubDirectory: 'static',
	}
};

function resolve(dir) {
	return path.join(__dirname, '../', dir);
};
