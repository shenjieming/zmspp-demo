const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

module.exports = () => {
  const themePath = path.join(__dirname, './src/themes/default.less')
  const theme = lessToJs(fs.readFileSync(themePath, 'utf8'))
  if (process.env.THEME === 'yibei') {
    return Object.assign({}, theme, { '@primary-color': '#FF8601' })
  }
  return theme
}
