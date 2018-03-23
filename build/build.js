'use strict'
// 进行版本检查，不通过的话node会终止程序
require('./check-versions')()

// ora 终端微调器， 定义loading颜色、文字
const ora = require('ora')
// rimraf 官方标题 A `rm -rf` util for nodejs
// 这是一个UNIX命令rm -rf的封装
/* 
* 语法规则: 
* rimraf(f, [opts], callback)
* 第一个参数 匹配的通配符； 第二个参数可选，配置项； 回调函数， 如果有错误，则会向函数中传递一个error对象
*/
const rm      = require('rimraf')
const path    = require('path')
const chalk   = require('chalk')
const webpack = require('webpack')
// 引入config对象, 包括开发和生产环境的配置
const config = require('../config')
// 生产环境wepack的配置
const webpackConfig = require('./webpack.prod.conf')
// 用户静态资源服务
const server = require('pushstate-server')

// 暂时理解成ora的实例吧，ora(text),text参数就是会在log中打印的文本
// spinner.start() loading动图显示，文本打印
// spinner.stop() 关闭loading和文本
var spinner = ora('building for '+ process.env.env_config+ ' environment...' )
spinner.start()

/**
 * path.join([...paths]) 使用平台特定的分隔符把全部给定的path片段连接在一起，并规范化生成的路径。参数可选，不传返回”.“,表示当前目录。path必须传字符串
 * examples: 
 * path.join('/foo', 'bar', 'baz/asdf', 'quux', '..') // '/foo/bar/baz/asdf'
 * examples2: 
 * path.join(config.build.assetsRoot, config.build.assetsSubDirectory) // '项目目录/dist/static'
 */
// 这里的目的是移除dist目录里的static文件夹
// 第一次的时候没有该文件
// 多次编译的情况下，清除已有打包文件，重新打包，保持最新
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // 文件移除失败则抛出错误
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    // process.stdout.write()向屏幕输出提示信息
    process.stdout.write(stats.toString({
      colors      : true,
      modules     : false,
      children    : false,
      chunks      : false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    // 如果用户的环境变量中存在npm_config_preview属性，则执行新的服务
    // 这个服务加载文件都是dist里的文件，类似模拟线上资源加载，可以查看最终用户下载资源的大小
    if(process.env.npm_config_preview){
      server.start({
          port     : 9526,
          directory: './dist',
          file     : '/index.html'
      });
      console.log('> Listening at ' +  'http://localhost:9526' + '\n')
    }
  })
})
