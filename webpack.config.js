import webpack from 'webpack';
import {resolve} from 'path';
import ForceCaseSensitivityPlugin from 'force-case-sensitivity-webpack-plugin';


export default {

  recordsPath: resolve(__dirname, '.webpackrecords'),
  context: resolve(__dirname),
  devtool: '#source-map',
  entry: {
    'index': './src/js/index.js',
    'login': './src/js/login.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|woff2||woff|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader',
      },
      {
        test: /\.(?:ico|jpg|jpeg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 81920,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      resolve(__dirname, 'node_modules'),
      resolve(__dirname, 'src', 'js'),
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  plugins: [
    new ForceCaseSensitivityPlugin(),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
    }),
  ],
}
