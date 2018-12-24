const fs = require('fs')
const path = require('path')

const version = new Date().getTime()
const versionPath = path.join('./dist/version.js')
// 打包时写入文件
fs.writeFile(versionPath, version, (err) => {
  if (err) {
    return err
  }
  return null
})
