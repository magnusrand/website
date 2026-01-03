module.exports = {
    plugins: [
        require('postcss-nested'),
        [
            'postcss-preset-env',
            {
                features: {
                    'cascade-layers': false,
                },
            },
        ],
        require('autoprefixer'),
    ],
}
