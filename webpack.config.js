//使用命令：'npm run build'

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './js/app.js',
  //让打包后生成在build.js文件中
  output: {
    path: './js',
    publicPath: './assets',
    filename: 'build.js'
  },
  module: {
    loaders: [{
        test: /\.vue$/,
        loader: 'vue',
        options:{}
      },
      //转化ES6语法
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      //图片转化，小于8K自动转化为base64的编码
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?name=assets/[name][hash:8].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin("author: lhq\n" + new Date().toLocaleString()),
    new webpack.optimize.UglifyJsPlugin({ //压缩插件
      compress: {
        warnings: false //不显示警告
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("[name]-[hash].css")
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue'
    }
  },
  //这里用于安装babel，如果在根目录下的.babelrc配置了，这里就不写了
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}
