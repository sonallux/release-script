const path = require('path');

module.exports = {
    entry: {
        'release-script-cli': './lib/cli.js',
    },
    target: 'node',
    node: false,
    resolve: {
        extensions: ['.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bin'),
    },
};
