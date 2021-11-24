// const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')

const config = (env, args) => ({
    mode: args.mode === 'production' ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
        path: OUTPUT_PATH,
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: ({ htmlWebpackPlugin }) =>
                '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' +
                htmlWebpackPlugin.options.title +
                '</title></head><body><div id="app"></div></body></html>',
            filename: 'index.html',
        }),
        new StylelintPlugin(options),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx'],
    },
})

module.exports = config
