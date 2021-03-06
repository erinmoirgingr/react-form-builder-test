var webpack = require('webpack');

module.exports = {
  devtool: "eval-source-map",
  entry: {
    app: ["./src/app.jsx"]
  },

  output: {
    path: __dirname + "/lib",
    filename: "app.js",
    library: 'ReactFormBuilder',
    libraryTarget: 'umd',
  },

  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'react',
    'react-dom': 'react-dom',
    'jquery': 'jquery',
    'bootstrap': 'bootstrap'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", "css-loader", "sass-loader"
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
  ],
}
