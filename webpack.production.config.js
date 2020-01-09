var webpack = require('webpack');

module.exports = {
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
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader'],
        query: {
            presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader"
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.css', '.scss']
  },
  plugins: [
    new webpack.ProvidePlugin({
        _: 'lodash'
    })
  ]
}
