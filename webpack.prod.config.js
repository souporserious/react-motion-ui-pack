var path = require('path');
var webpack = require('webpack');
var TARGET = process.env.TARGET || null;

var config = {
    entry: {
        index: './src/react-motion-ui-pack.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: 'react-motion-ui-pack.js',
        sourceMapFilename: 'react-motion-ui-pack.sourcemap.js',
        library: 'react-motion-ui-pack',
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
        'react-motion': 'Spring',
        'react-motion': 'TransitionSpring'
    },
};

if(TARGET === 'minify') {
    config.output.filename = 'react-motion-ui-pack.min.js';
    config.output.sourceMapFilename = 'react-motion-ui-pack.min.js';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        mangle: {
            except: ['React', 'Spring', 'TransitionSpring']
        }
    }));
}

module.exports = config;