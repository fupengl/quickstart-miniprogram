module.exports = {
	entry: 'src/app.ts',
	alias: {
		'style': 'src/styles/index.scss'
	},
	build: {
		env: require('./prod.env')
	},
	dev: {
		env: require('./dev.env')
	}
};
