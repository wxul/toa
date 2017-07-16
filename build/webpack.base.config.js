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
    devtool: 'source-map',
    entry: {
        app: path.resolve(__dirname, '../render/src/index.js'),
        vendor: ['vue', 'vuex', 'vue-router']
    },
    module: {
        rules: [
            // {
            //     test: require.resolve("../render/utils/llqrcode.js"),
            //     loader: "exports?qrcode"
            // }, {
            //     test: require.resolve("../render/utils/qrcanvas.js"),
            //     loader: "exports?createQRImage"
            // }, {
            //     test: require.resolve("../render/utils/qrcode.js"),
            //     loader: "exports?QRCode&QRErrorCorrectLevel"
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: include
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: include
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
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
            'vue': 'vue/dist/vue.common.js',
            '@render': path.resolve(__dirname, '../render'),
            '@src': path.resolve(__dirname, '../render/src'),
            '@assets': path.resolve(__dirname, '../render/assets'),
            '@utils': path.resolve(__dirname, '../render/utils'),
            '@components': path.resolve(__dirname, '../render/src/components'),
            '@store': path.resolve(__dirname, '../render/src/store'),
            '@page': path.resolve(__dirname, '../render/src/pages')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify(process.env.NODE_ENV),
            DEBUG: JSON.stringify((process.env.NODE_ENV == 'development')),
        })
    ]
};