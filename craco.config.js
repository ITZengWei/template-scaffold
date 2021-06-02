const { when, whenProd, whenDev } = require('@craco/craco')
const CracoAntDesignPlugin = require('craco-antd')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
/** 使用可视化打包插件 图形化打包详情 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
/** 热刷新 */
// const FastRefreshCracoPlugin = require('craco-fast-refresh')
/** 自定义主题 */
const modifyVars = require('./lessVars')

// 是否显示体积大小
const isBuildAnalyzer = process.env.BUILD_ANALYZER === 'true'

module.exports = {
  webpack: {
    plugins: [
      // 查看打包的进度
      new SimpleProgressWebpackPlugin(),
      /**
       * 编译产物分析
       *  - https://www.npmjs.com/package/webpack-bundle-analyzer
       * 新增打包产物分析插件
       */
      ...when(isBuildAnalyzer, () => [], []),
      // new BundleAnalyzerPlugin(),
      /**  打压缩包 */
      ...whenProd(
        () => [
          new TerserPlugin({
            sourceMap: false,
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {
                warnings: false,
                drop_console: true, // 生产环境下移除控制台所有的内容
                drop_debugger: true, // 移除断点
                pure_funcs: ['console.log'], // 生产环境下移除console
              },
            },
          }),
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 1024,
            minRatio: 0.8,
          }),
        ],
        [],
      ),
    ],
  },
  plugins: [
    /** 热更新 */
    ...whenDev(
      () => [
        // {
        //   plugin: FastRefreshCracoPlugin,
        // },
      ],
      [],
    ),
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: modifyVars,
      },
    },
  ],
}
