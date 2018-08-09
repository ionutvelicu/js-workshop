const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin')

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
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader", "eslint-loader"]
            }
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },

    plugins: [ new VueLoaderPlugin() ],

    devtool: 'source-map'
};