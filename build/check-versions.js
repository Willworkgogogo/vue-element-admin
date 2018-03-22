'use strict'
// chalk 一套颜色库，给需要log的内容包装上各种颜色
const chalk = require('chalk')
// semver 管理node包的版本。 参考 https://www.cnblogs.com/caideyipi/p/8245620.html
// semver.clean('  =v1.2.3   ') // '1.2.3'返回标准版本号，且去掉两边空格
// semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true 第一个参数是测试
// 的版本号，第二个参数是匹配的版本，即第一个参数满足参数二，也就是版本号的比较，参数1是否在参数2的范围内。如果匹配则返回true
const semver = require('semver')
// package.json 导出对象
const packageConfig = require('../package.json')
// 用来执行unix命令的包
// shell.which('npm')， 去系统的路径中寻找命令，这里就是寻找npm命令
const shell = require('shelljs')

// chile_process包（子进程）
// require('child_process').execSync(cmd) 创建同步进程，执行括号中的命令，返回string类型，然后简单处理
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

const versionRequirements = [
  {
    name              : 'node',
    currentVersion    : semver.clean(process.version),   // 返回版本号
    versionRequirement: packageConfig.engines.node       // node版本号要求
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name              : 'npm',
    currentVersion    : exec('npm --version'),     // 执行命令获取本地npm版本号
    versionRequirement: packageConfig.engines.npm  // package.json中定义程序要求版本
  })
}

// 默认导出函数
module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      // 当前环境版本和package.json中要求的版本不符合时，会发出错误警告
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    // 如果有错误，打印错误
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    // process.exit([结束状态码])， 该方法以结束状态码指示Node.js同步终止进程
    // - 结束状态码默认是0， 该码表示success成功
    // - 1， 表示failure失败
    process.exit(1)
  }
}
