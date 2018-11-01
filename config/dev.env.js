const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
	ENV: '"development"',
	BASE_API: "'http://localhost:8081'"
});
