const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VersionFilePlugin = require('webpack-version-file-plugin');
const CrxPlugin = require('crx-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('./config.js');
const pkg = require('../package.json');

const appName = `${pkg.name}-${pkg.version}`;

module.exports = _.merge({}, config, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../build/prod'),
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true,
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                },
            }),
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './src' }
        ], {
            ignore: ['js/**/*', 'manifest.json'],
            copyUnmodified: true
        }),
        new VersionFilePlugin({
            packageFile: path.resolve(__dirname, '../package.json'),
            template: path.resolve(__dirname, '../src/manifest.json'),
            outputFile: path.resolve(__dirname, '../build/prod/manifest.json'),
        }),
        new CrxPlugin({
            keyFile: '../mykey.pem',
            contentPath: '../build/prod',
            outputPath: '../build',
            name: appName
        }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    ]
});
