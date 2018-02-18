
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
module.exports = merge(common,{
    devServer: {
        contentBase: path.join(__dirname, "public")
    },
    devtool: "eval-source-map"
});