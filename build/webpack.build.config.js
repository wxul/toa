var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseconfig = require('./webpack.base.config.js');

var APP_PATH = path.resolve(__dirname, '../dist/release');
var PRO_PATH = path.resolve(__dirname, '../');

var config = Object.assign({}, baseconfig, {
    output: {
        path: APP_PATH,
        publicPath: './',
        filename: '[name].js',
        chunkFilename: '[name],[chunkhash].min.js'
    }
});

config.plugins = (baseconfig.plugins || []).concat([
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'render/index.html',
        inject: true,
        env: process.env.NODE_ENV,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: false
        }
    }),
    new CopyWebpackPlugin([
        { from: path.resolve(PRO_PATH, 'package.json'), to: './package.json' },
        { from: path.resolve(PRO_PATH, 'readme.md'), to: './readme.md' },
        { from: path.resolve(PRO_PATH, 'process'), to: './process' }
    ])
]);

module.exports = config;