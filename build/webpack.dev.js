const merge = require("webpack-merge")
const common = require("./webpack.base")
const webpack = require('webpack')
const FriendlyErrorsPlugin=require("friendly-errors-webpack-plugin")
const config = require('../config')

module.exports = merge(common,
    {
        mode: "development",
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DefinePlugin({
                'process.env': config.dev.env
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin()
        ]
    }
)
