var path = require('path');
var webpack = require('webpack');
var banner = require('./webpack.banner');
var TARGET = process.env.TARGET || null;

var externals = {
  'react': {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
  },
  'react-motion': {
    root: 'ReactMotion',
    commonjs2: 'react-motion',
    commonjs: 'react-motion',
    amd: 'react-motion'
  },
  'get-prefix': {
    root: 'getPrefix',
    commonjs2: 'get-prefix',
    commonjs: 'get-prefix',
    amd: 'get-prefix'
  }
};

var config = {
  entry: {
    index: './src/react-motion-ui-pack.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-motion-ui-pack.js',
    sourceMapFilename: 'react-motion-ui-pack.sourcemap.js',
    library: 'Transition',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)/, loader: 'babel-loader' },
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: externals
};

if (TARGET === 'minify') {
  config.output.filename = 'react-motion-ui-pack.min.js';
  config.output.sourceMapFilename = 'react-motion-ui-pack.min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['React', 'ReactMotion', 'Transition', 'getPrefix']
    }
  }));
}

module.exports = config;
