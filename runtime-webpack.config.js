const path = require('path');
const WorkerPlugin = require('worker-plugin');
const webpack = require('webpack');
module.exports = {
    entry: {
        sandbox: './sandboxruntime.js'
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        publicPath: 'http://http://localhost:3000/',
        path: path.resolve(process.cwd(), 'static')
    },

    plugins: [new WorkerPlugin()],
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    node: {
        fs: 'empty'
    }
};
