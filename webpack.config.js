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
        use: ["react-hot", "babel-loader?presets[]=es2015&presets[]=react"]
      },
      {
        test: /\.scss|\.css$/,
        use: "style-loader!css-loader!sass-loader"
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.jsx', '.css', '.scss'],
  },
  plugins: [
    new webpack.ProvidePlugin({
        _: 'lodash'
    })
  ]
}
