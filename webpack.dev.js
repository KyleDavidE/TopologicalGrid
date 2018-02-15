
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge({
    devServer: {
        contentBase: path.join(__dirname, "public")
    },
    devtool: "eval-source-map"
});