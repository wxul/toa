var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var include = [
    path.resolve(__dirname, '../render/')
];

module.exports = {
    cache: true,
    target: 'electron',
    entry: {
        app: path.resolve(__dirname, '../render/src/index.js'),
        vendor: ['vue', 'vuex', 'vue-router']
    },
    module: {
        rules: [
            {
                test: require.resolve("../render/utils/llqrcode.js"),
                loader: "exports?qrcode"
            }, {
                test: require.resolve("../render/utils/qrcanvas.js"),
                loader: "exports?createQRImage"
            }, {
                test: require.resolve("../render/utils/qrcode.js"),
                loader: "exports?QRCode&QRErrorCorrectLevel"
            },
            {
                test: /\.vue$/, loader: 'vue-loader', include: include
            },
            {
                test: /\.js$/, loader: 'babel-loader', include: include
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'autoprefixer-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|md)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.js',
            '@render': path.resolve(__dirname, '../render'),
            '@src': path.resolve(__dirname, '../render/src')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(process.env.NODE_ENV)
        })
    ]
};