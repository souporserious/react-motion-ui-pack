var path = require('path');
var webpack = require('webpack');
var TARGET = process.env.TARGET || null;

var config = {
    entry: {
        index: './src/ReactMotionUIPack.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: 'ReactMotionUIPack.js',
        sourceMapFilename: 'ReactMotionUIPack.sourcemap.js',
        library: 'ReactMotionUIPack',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.(js|jsx)/, loader: 'babel?stage=0' }
        ]
    },
    plugins: [],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        'react': 'React',
        'react/addons': 'React',
        'react-motion': 'TransitionSpring',
    },
};

if(TARGET === 'minify') {
    config.output.filename = 'ReactMotionUIPack.min.js';
    config.output.sourceMapFilename = 'ReactMotionUIPack.min.js';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        mangle: {
            except: ['React', 'Spring']
        }
    }));
}

module.exports = config;