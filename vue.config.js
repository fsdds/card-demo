module.exports = {
  lintOnSave: true, // 是否在保存的时候检查
  devServer: {
    // 环境配置
    port: 8084,
  },
  // chainWebpack: config => {
  //   if (process.env.NODE_ENV === 'production'){
  //     config
  //       .plugin('extract-css')
  //          .use(require('mini-css-extract-plugin'))
  //   }
  // }
}