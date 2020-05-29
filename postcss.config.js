/*
 * @Author: dull_
 * @Date: 2020-05-29 14:47:46
 * @LastEditTime: 2020-05-29 14:55:15
 * @LastEditors: dull_
 * @Description: 
 * @FilePath: \tree_demo\postcss.config.js
 * @
 */ 
const path = require('path')
const tailwindcss = require("tailwindcss");
const purgecss = require('@fullhuman/postcss-purgecss')({

  // Specify the paths to all of the template files in your project
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.ts',
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})

module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    tailwindcss,
    require('postcss-import')({
      resolve (id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      }
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss'),
    ...process.env.NODE_ENV === 'production'
    ? [purgecss]
    : []
  ]
}
