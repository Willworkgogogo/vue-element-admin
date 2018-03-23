'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
/**
 * webpack-merge 用于合并webpack配置项
 * */ 
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 这个插件会生成一个包含所有页面中使用script标签引用的webpack打包的文件
// 下面使用的地方，就是用这个插件生成了dist目录里的index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 友好提示插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
/**
 * portfinder 方便设置服务端口
 * portfinder.getPort((err, port) => {
 *   // 回调函数会获得两个参数
 *   // port这个端口被保证是环境中为被使用的
 * })
 * 默认portfinder会从8000端口开始查起
 * 可以修改起始值, 直接设置portfinder.basePort
 * */ 
const portfinder = require('portfinder')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // TODO 详细了解
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true, // 设置脚本位置，head还是body
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin',
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
