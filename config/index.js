'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/fapi/*': {
        target:'http://tdt.wzmap.gov.cn',
        secure: false
      },
      '/pubApi/*': {
        target: 'http://tdt.wzmap.gov.cn',
        secure: false
      },
      '/upload/*': {
        target: 'http://tdt.wzmap.gov.cn',
        secure: false
      },
      '/%e6%af%8f%e5%91%a8%e4%b8%80%e5%9b%be%e5%9b%be%e6%a0%87v.2/*':{
        target: 'https://portal.wzdmdz.com',
        secure:false
      },
      '/每周一图图标v.2/*':{
        target: 'https://portal.wzdmdz.com',
        secure:false
      },
      '/proxy.jsp':{
        target: 'http://tdt.wzmap.gov.cn',
        secure:false
      },
      '/sousuo/*':{
      target: 'http://tdt.wzmap.gov.cn',
        secure:false
      },
      '/sousuo2/*':{
        target: 'http://tdt.wzmap.gov.cn',
        secure:false
      }
    },
    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 7023, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    inline: false, //页面自动刷新
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: '#source-map',//eval-source-map

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/map.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'wxdt',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
// Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
