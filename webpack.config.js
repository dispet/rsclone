const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        main: ['./client/src/scss/main.scss','./client/src/javascripts/main.js'],
        login: ['./client/src/scss/login.scss','./client/src/javascripts/login.js'],
        signup: ['./client/src/scss/signup.scss','./client/src/javascripts/signup.js']
    },
    output: {
        path: path.resolve(__dirname, 'server/public/dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ]
    },plugins: [
        new CleanWebpackPlugin(),
    ]
    
}