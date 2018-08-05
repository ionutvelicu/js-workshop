var path = require('path');

module.exports = {
    mode: 'development',

    entry: {
        app:      './src/main/js/app.js',
    },
    output: {
        path: path.resolve(__dirname, './src/main/resources/static/js/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },

    devtool: 'source-map'
};