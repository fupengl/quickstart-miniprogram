const path = require('path')
const cleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const glob = require("glob")
const wxAppWebpackPlugin = require("bx-wxapp-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const utils = require("./utils")
const wxappNpmPlugin = require("bx-wxapp-npm-plugin")


function resolve(dir) {
    return path.join(__dirname, "../", dir)
}

function getEntry(rootSrc, pattern) {
    const files = glob.sync(path.resolve(rootSrc, pattern))
    return files.reduce((res, file) => {
        const info = path.parse(file)
        const key = "/" + info.dir.slice(rootSrc.length + 1) + '/' + info.name
        res[key] = path.resolve(file)
        return res
    }, {})
}

//应用入口
const appEntry = {app: './src/app.js'}
//页面入口
const pagesEntry = getEntry(resolve('./src'), 'pages/**/index.js')
//组件入口
const componentsEntry = getEntry(resolve('./src'), 'components/**/index.js')
//分包页面
const subpackages = getEntry(resolve('./src'), 'subpackages/**/index.js')

const entry = Object.assign({}, appEntry, pagesEntry, componentsEntry, subpackages)
module.exports = {
    entry: entry,
    output: {
        filename: "[name].js",
        path: resolve("dist"),
        globalObject: "global",
    },
    //must not be eval
    devtool: "none",
    optimization: {
        splitChunks: {
            cacheGroups: {
                //node_modules
                vendor: {
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minChunks:2
                },
                //其他公用代码
                common: {
                    chunks: 'all',
                    test: /[\\/]src[\\/]/,
                    minChunks: 2,
                    name:"commons",
                    minSize:0
                },
            }
        },
        runtimeChunk: 'single'
    },
    resolve: {
        extensions: ['.js', '.json', '.ts',],
        alias: {
            '@': resolve('src'),
        },
        symlinks: false
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                loader:"babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c|le)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|png|gif|jpeg|jpg)\??.*$/,
                loader: 'url-loader',
                query: {
                    //低于5000会被转化为base64
                    limit: 50000,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            }
        ]
    },

    plugins: [
        new cleanWebpackPlugin([resolve("./dist")], {root: resolve("./")}),
        new CopyWebpackPlugin(
            [{from: "./", to: "./"}],
            {
                ignore: ['*.js', '*.css', '*.ts', '*.scss', "*.less", "*.sass"],
                context: resolve('src'),
            }
        ),
        new MiniCssExtractPlugin({
            filename: "[name].wxss"
        }),
        new LodashModuleReplacementPlugin(),
        new wxAppWebpackPlugin(),
        new wxappNpmPlugin()
    ]
}
