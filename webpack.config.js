const path = require('path');

module.exports = {
    entry: './test/test-attrs.js',
    output: {
        path: path.resolve(__dirname, 'test'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, "test"),
        compress: false,
        port: 3000
    }
};
