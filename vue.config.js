// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  indexPath: 'templates/index.html',
  assetsDir: 'static',
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Python Web IDE'  // Change this to your desired title
        return args
      })
  },
  css: {
    extract: true,
    sourceMap: false
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver({importStyle: false})],
      }),
      Components({
        resolvers: [ElementPlusResolver({importStyle: false})],
      }),
      new NodePolyfillPlugin(),
    ],
  },
})
