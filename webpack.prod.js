const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require("./webpack.common.js");
module.exports = merge(common,{
    plugins: [
             new UglifyJSPlugin()
           ],
    devtool: "source-map"
});