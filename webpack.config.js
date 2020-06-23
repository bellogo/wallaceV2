const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
    entry: {
        index: "./src/js/index.js",
        dashboard: "./src/js/dashboard.js"
    }, 
    output: {
        filename: "./[name].bundle.js" 
    },

    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(jpg|png|svg|gif)$/,
                use: [
                    'file-loader'
                ]
            },

            {
                test: /\.(scss)$/,
    use: [{
      loader: 'style-loader', // inject CSS to page
    }, {
      loader: 'css-loader', // translates CSS into CommonJS modules
    }, {
      loader: 'postcss-loader', // Run post css actions
      options: {
        plugins: function () { // post css plugins, can be exported to postcss.config.js
          return [
            require('precss'),
            require('autoprefixer')
          ];
        }
      }
    }, {
      loader: 'sass-loader' // compiles Sass to CSS
    }]
              },

            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
            ,
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true}
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            favicon: "./src/images/favicon.png",
            chunks: ['index']  
        }),
        new HtmlWebPackPlugin({
            template: "./src/dashboard.html",
            filename: "./dashboard.html",
            favicon: "./src/images/favicon.png",
            chunks: ['dashboard']  
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkfilename: "[id].css"
        })
    ]
}