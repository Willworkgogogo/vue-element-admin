/**
 * webpack 的基本配置文件
 */ 
'use strict'
const path            = require('path')
const utils           = require('./utils')
const config          = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// 定义一个便捷寻址函数，用于获取build文件夹外的所有内容的地址，
// 比如resolve('src/api/login.js') 
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// 对src、test目录下的js、vue文件应用eslint规则
const createLintingRule = () => ({
  test   : /\.(js|vue)$/,
  loader : 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter  : require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'), // 这里应该类似定义了base地址，后面都是基于当前路径读取
  entry  : {
    app: './src/main.js' // 入口文件， 地址加上上面的context环境，才能读取到
  },
  output: {
    /**
     * path: 是打包后所有文件的输出地址，比如上面的js文件打包后就会在dist目录下
     * publicPath: 并不会对生成文件的路径造成影响，主要是对页面里面引入的资源的路径做对应的补全工作
     * */ 
    path    : config.build.assetsRoot, // webpack打包后输出地址，根据配置，最终的地址是dist文件夹
    filename: '[name].js', // 生成的文件的文件名， [name]会去入口文件的属性"app"
    /**
     * process.env属性返回一个包含用户环境信息的对象
     * 这个对象中可以添加自定义的属性，值都是string类型
     * NODE_ENV也是自己添加到自己环境变量中的值。
     * */ 
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      :  config.dev.assetsPublicPath
  },
  resolve: {
    // 扩展名，在require的时候可以不写扩展名的原因就在这
    // webpack 编译的时候会自动来这里读取添加
    // 如果都没有匹配的就会报文件找不到
    extensions: ['.js', '.vue', '.json'],
    alias     : {
      'vue$': 'vue/dist/vue.esm.js',
      '@'   : resolve('src'),
    }
  },
  module: {
    rules: [
      /**
       * ...[] es6写法，展开符号，将数组每一项用逗号分隔展开
       * 下面是判断是否使用eslint对文件管理
       * */ 
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test   : /\.vue$/,
        loader : 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test   : /\.js$/,
        loader : 'babel-loader?cacheDirectory',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test   : /\.svg$/,
        loader : 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test   : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader : 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name : utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test   : /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader : 'url-loader',
        options: {
          limit: 10000,
          name : utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test   : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader : 'url-loader',
        options: {
          limit: 10000,
          name : utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram        : 'empty',
    fs           : 'empty',
    net          : 'empty',
    tls          : 'empty',
    child_process: 'empty'
  }
}
