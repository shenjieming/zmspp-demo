const NODE_ENV = process.env.NODE_ENV
const CONFIG_ENV = process.env.CONFIG_ENV
// const THEME = process.env.THEME

// 开发环境默认配置
let config = {
  name: '零库存',
  prefix: 'aek',
  footerText:
    'Copyright © 2014-2017 HZ LKC. All Rights Reserved\n浙ICP备13028265号\n互联网药品信息服务资格证书(浙)－经营性－2015－0002',
  logoText: '零库存',
  publicPath: './',
  baseURL: '/aek-mspp',
  mockURL: '/api/mock',
  rapMockURL: '/api/rapMock',
  // sockURL: 'http://192.168.1.91:9005/endpoint',
  // sockURL: '10.18.59.34:9005/endpoint',  11/30删除
  subscribeURL: '/user/topic',
  openUrl: ['/login', '/regist', '/forgetPasd', '/confirmOrder', '/useClause'],
  // 是否是线上生产环境
  IS_CONFIG_PROD_ENV: CONFIG_ENV === 'production',
  NODE_ENV,
  // 当前是否是生产环境
  prodEnv: NODE_ENV === 'production',
  // 是否是医贝
  isYibei: process.env.THEME === 'yibei',
  // 开发模式
  devModel: false,
  // 首页
  homePage: '/dashboard',
  // 客服热线
  CONSUMER_HOTLINE: '4000525256',
  // 客服QQ
  CONSUMER_QQ: 2777618728,
  // 系统代号
  SYSTEM_CODE: '01',

  /* ajax请求设置 */
  // token
  TOKEN: 'x-auth-token',
  // 请求头系统代号参数名
  REQUEST_HEADER_SYSTEM_CODE: 'aek-system-code',
  // 请求头用户id参数名
  REQUEST_HEADER_USER_ID: 'aek-user-key',
  // 登陆失效
  LOGIN_TIMEOUT_CODE: 2007,
  // 普通请求成功码
  REQUEST_SUCCESS_CODE: 200,
  // 异步校验成功码
  ASYNC_SUCCESS_CODE: 201,
  // 异步校验错误码
  ASYNC_FAIL_CODE: 202,
  // 请求成功区间(开区间)
  REQUEST_SUCCESS_REGION: [199, 301],
  // 请求失败区间(开区间)
  REQUEST_FAIL_REGION: [999, 6000],
  // 请求需要返回上一页操作
  BACK_REQUEST_FAIL: 1000,
  // 系统异常区间(闭区间)
  SYSTEM_ERROR_REGION: 6000,
  /* ajax end */

  /* 图片上传设置 */
  // 上传图片大小限制(MB)
  IMG_SIZE_LIMIT: 20,
  // // 用户名
  UPLOAD_USERNAME: 'chenrui',
  // // 密码
  UPLOAD_PASSWORD: 'aek56.com',
  // 图片上传地址
  IMG_UPLOAD: 'http://192.168.31.195:9003/aek-mspp/upload',
  // 原始图片查看地址
  IMG_ORIGINAL: 'http://192.168.31.195:9003/aek-mspp/download',
  // 缩略图服务名
  IMG_COMPRESS: '!compress',
  // 水印图服务名
  IMG_WATERMARK: '/water',
  // 上传密钥
  UPLOAD_KEY: '/rmfhYt8ZWiCPAPlVcTfHW1R7HI=',
  // 又拍云服务名
  UPYUN_BUCKET: 'aek-image-test',
  // 图片保存路径
  UPYUN_SAVE_KEY: 'userImage/{year}_{mon}_{day}/{hour}_{min}_{sec}_{random32}.{suffix}',

  /* Excel上传设置 */
  // 上传大小限制(MB)
  EXCEL_SIZE_LIMIT: 5,
  // 保存路径
  UPYUN_SAVE_KEY_EXCEL: '/excel/{year}_{mon}_{day}/{hour}_{min}_{sec}_{random32}.{suffix}',
  // 服务名
  UPYUN_BUCKET_EXCEL: 'aek-doc-test',
  // 帐号
  UPLOAD_USERNAME_EXCEL: 'zhengfeng',
  // 密码
  UPLOAD_PASSWORD_EXCEL: 'zhengfeng123456',
  // 上传密钥
  UPLOAD_KEY_EXCEL: 'FKMR0jo/7OfxrLnUsruBny3YZ/g=',
  // Excel下载
  EXCEL_DOWNLOAD: 'http://192.168.31.195:9003/aek-mspp/download-temp',

  /* Zip上传设置 */
  // 上传大小限制(MB)
  ZIP_SIZE_LIMIT: 50,
  // 保存路径
  UPYUN_SAVE_KEY_ZIP: '/zip/{year}_{mon}_{day}/{hour}_{min}_{sec}_{random32}.{suffix}',
  // 服务名
  UPYUN_BUCKET_ZIP: 'aek-finance-test',
  // 上传密钥
  UPLOAD_KEY_ZIP: 'FjyBYes93mi1/UTA3ddmny/YP50=',
  // 下载地址
  ZIP_DOWNLOAD: 'http://192.168.31.195:9003/download-temp',
  // 自动登录跳转域名
  AUTO_LOGIN: 'http://localhost:8000/#/login',
}

// 内部测试环境测试
if (CONFIG_ENV === 'test') {
  const target = 'http://192.168.31.195:9003/aek-mspp'

  config = Object.assign({}, config, {
    baseURL: target,
    mockURL: target,
    rapMockURL: target,
    devModel: false,
    AUTO_LOGIN: 'http://test.web.aek56.com/#/login',
  })
} else if (NODE_ENV === 'production') {
  // 生产环境
  const target = 'http://192.168.31.195:9003/aek-mspp'
  let publicPath = './'
  // if (THEME === 'yibei') {
  //   publicPath = 'http://fin.prod.youcdn.aek56.com/'
  // } else {
  //   publicPath = 'http://web.prod.youcdn.aek56.com/'
  // }
  config = Object.assign({}, config, {
    baseURL: target,
    mockURL: target,
    rapMockURL: target,
    devModel: false,
    // IMG_UPLOAD: 'http://192.168.31.195:9003/aek-mspp/upload',
    publicPath,
    // UPYUN_BUCKET: 'aek-prod-image',
    // UPYUN_BUCKET_EXCEL: 'aek-prod-doc',
    // UPYUN_BUCKET_ZIP: 'aek-prod-finance',
    // IMG_ORIGINAL: 'http://192.168.31.195:9003/aek-mspp/download',
    // UPLOAD_KEY: 'TAWioRGrsIMBmiqqKsk0l06E5p8=',
    // UPLOAD_KEY_EXCEL: 'ssKyym8pFmk6rfIrUU1wtU7xRzc=',
    // UPLOAD_KEY_ZIP: 'QLOlnvpb7yDNUqO1IsRorze6XVc=',
    // EXCEL_DOWNLOAD: 'http://doc.prod.youcdn.aek56.com',
    // ZIP_DOWNLOAD: 'http://fin.prod.youcdn.aek56.com',
    // sockURL: 'http://notify.aek56.com:8082/endpoint', 11/30 删除
    // AUTO_LOGIN: 'http://caigou.aek56.com/#/login',
  })
}

config.urlPrefix = {
  base: config.baseURL,
  mock: config.mockURL,
  rap: config.rapMockURL,
}
module.exports = config
