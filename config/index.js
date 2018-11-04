module.exports = {
    entry: './src/app.js',
    build: {
        env: require('./prod.env'),
        assetsSubDirectory: 'static',
    },
    dev: {
        env: require('./dev.env'),
        assetsSubDirectory: 'static',
    }
}
