module.exports = {
	entry: './src/app.ts',
	build: {
		env: require('./prod.env'),
		assetsSubDirectory: 'static',
	},
	dev: {
		env: require('./dev.env'),
		assetsSubDirectory: 'static',
	}
};
