const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const OUTPUT_PATH = path.resolve(__dirname, 'dist')

const config = (env, args) => ({
    mode: args.mode === 'production' ? 'production' : 'development',
    entry: './src/index.tsx',
    devtool: args.mode === 'production' ? false : 'inline-source-map',
    output: {
        path: OUTPUT_PATH,
        filename: 'bundle.js',
        publicPath: '/',
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
            {
                test: /\.(png|woff2?)$/,
                type: 'asset',
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]',
                },
            },
            {
                test: /\.svg/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            favicon: 'src/assets/images/favicon.png',
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx'],
    },
})

module.exports = config
