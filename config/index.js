const path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        proxyTable: {},
        cssSourceMap: false
    }
}
