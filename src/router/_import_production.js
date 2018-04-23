// 线上环境
// 编译之后使用es6的语法，所以这里返回一个函数，函数内部使用import导入文件
module.exports = file => () => import('@/views/' + file + '.vue')
