'use strict'
const path = require('path')
const config = require('../config')
/**
 * extract-text-webpack-plugin 该包的用途是提取打包文件中的文本，放置到指定文件中
 * ExtractTextPlugin.extract() , extract意思是提取
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

/**
 * assetsPath
 * 根据开发生产环境，返回路径
 */  
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

/**
 * css loader配置
 * 最终返回一个对象，对象里标识了各种预编译处理器需要用到的loader，根据使用情况对应调用
 * @param {*} options 定义了是否生成map文件， 是否需要提取文件文本
 */ 
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 生成loader字符串用于提取文本插件
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      // 添加到[cssLoader, postcssLoader] 或 [cssLoader] 数组中
      loaders.push({
        loader: loader + '-loader', // 根据传入名字，拼成新的loader
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 生产环境中编译时需要设置成true
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 这里是把所有css预处理器的loader都配置上了
// 当调用这个函数，意味着你可以用所有的sass、less、stylus来写css，而且不用手动添加loader
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

// 返回一个函数
exports.createNotifierCallback = () => {
  // 这个包用于，弹窗提示，mac的效果就是右侧弹窗提示，高大上啊
  // 这是跨平台调用系统原生提示
  const notifier = require('node-notifier')

  // severity 严重程度

  return (severity, errors) => {
    // 只对错误severity为“error”的给予提示
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
