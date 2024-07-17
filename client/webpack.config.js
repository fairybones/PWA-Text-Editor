const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
// Require the InjectManifest class of the WorkBoxPlugin 
const { InjectManifest } = require('workbox-webpack-plugin');
// Add CSS loaders
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    mode: 'development',
    // Entry point for files
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    // Output for bundles
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // Add and configure workbox plugins for a service worker and manifest file.
    plugins: [
    // Webpack plugin that generates our html file and injects bundles
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Webpack Plugin',
      }),
      new MiniCssExtractPlugin(),
      // creates custom service worker
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'service-worker.js',
      }),
      // creates a manifest.json file to provide necessary info for install to browser
      new WebpackPwaManifest({
        inject: true,
        name: 'My PWA Text Editor',
        short_name: 'MyPWA',
        description: 'An accessible text editor.',
        background_color: '#ffffff',
        start_url: './',
        publicPath: './',
        icons: [
            {
                src: path.resolve('favicon.ico'),
                sizes: [96, 128, 192, 256, 384, 512],
                destination: path.join('assets', 'icons'),
            },
        ],
      }),
    ],
    // Add babel to webpack for parsing.
    module: {
      rules: [
        {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
            // We use babel-loader in order to use ES6 & for browser compatability.
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
      ],
    },
  };
};