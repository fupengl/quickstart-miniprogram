module.exports = {
	entry: 'src/app.ts',
	alias: {
		'style': 'src/styles/index.scss',
		'@S': 'src/services',
		'@T': 'src/utils',
		'@C': 'src/config'
	},
	build: {
		env: require('./prod.env')
	},
	dev: {
		env: require('./dev.env')
	}
};
