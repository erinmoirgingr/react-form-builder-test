var webpack = require('webpack');

module.exports = {
  entry: {
    app:   ["webpack/hot/dev-server", "./app.js"],
    gingr: ["webpack/hot/dev-server", "./gingr.js"]
  },

  output: {
    filename: "[name].js",
    path: __dirname + "/build",
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            query: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['react-hot-loader/babel']
            }
          }
        ]
      },
      {
        test: /\.scss|\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.jsx', '.css', '.scss'],
    alias: { 'react': __dirname + '/node_modules/react' }
  },
  plugins: [
    new webpack.ProvidePlugin({
        _: 'lodash'
    })
  ]
}
