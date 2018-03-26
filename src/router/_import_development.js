// 开发环境
// commonjs 默认导出的写法，require().default
module.exports = file => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+
