const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

console.log(__dirname, './src/modules')
module.exports = (env, options) => {
  const isProd = options.mode === 'production';
  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'none' : 'source-map',
    entry: './src/index.js',
    output: {
      filename: 'script.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        'common': path.resolve(__dirname+ '/src/modules/'),
        'game': path.resolve(__dirname+ '/src/game/')
      }
    },
    module: {
      rules: [
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
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: `src/styles`, to: `styles` },
        { from: `src/style.css`, to: `style.css` },
        { from: `src/index.html`, to: `index.html` },
        { from: `src/assets`, to: `assets` },
      ]),
    ],
  };

  return config;
}