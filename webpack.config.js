const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    main: ['./client/src/scss/main.scss', './client/src/javascripts/main.js'],
    login: ['./client/src/scss/login.scss', './client/src/javascripts/login.js'],
    signup: ['./client/src/scss/signup.scss', './client/src/javascripts/signup.js']
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
        test: /\.(jpg|jpeg|svg|gif|png|ico)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|wof|wof2|eot)$/,
        use: ["file-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }, plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "client/src/assets/img/"),
          to: path.resolve(__dirname, "server/public/dist/src/assets/img/")
        },
        {
          from: path.resolve(__dirname, "client/src/assets/sound"),
          to: path.resolve(__dirname, "server/public/dist/src/assets/sound")
        }
      ]
    }),
    new ESLintPlugin()
  ]

}
