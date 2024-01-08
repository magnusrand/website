const config = {
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // disable merging paths in svg
                    mergePaths: false,
                    cleanupIDs: false,
                },
            },
        },
    ],
}

module.exports = config
