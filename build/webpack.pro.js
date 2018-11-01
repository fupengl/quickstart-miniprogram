const merge = require("webpack-merge")
const common = require("./webpack.base")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const config = require('../config')
const webpack = require('webpack')

module.exports = merge(common,
    {
        mode: "production",
        "devtool": "source-map",
        plugins: [
            new webpack.DefinePlugin({
                'process.env': config.build.env
            }),
            new UglifyJsPlugin({
                sourceMap: true
            }),
        ]
    }
)
