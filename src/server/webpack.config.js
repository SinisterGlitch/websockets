var webpack = require("webpack");

module.exports = {
    entry: "app.js",
    output: {
        path: '../../',
        filename: "server.js"
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        modulesDirectories: ['node_modules', 'src', 'public'],
        extensions: ['', '.js']
    }
};