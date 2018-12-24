const { baseURL, rapMockURL, publicPath } = require('./src/utils/config')
const CONFIG_ENV = process.env.CONFIG_ENV
const PROXY_URL = process.env.PROXY_URL
const THEME = process.env.THEME

module.exports = {
  publicPath,
  entry: './src/index.js',
  theme: './theme.config.js',
  hash: true,
  autoprefixer: {
    browsers: ['> 20%', 'ie 9-11', 'not ie <= 8'],
  },
  proxy: {
    [baseURL]: {
      target: PROXY_URL,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [baseURL]: '/aek-mspp',
      },
    },
    [rapMockURL]: {
      target: 'http://192.168.3.152',
      changeOrigin: true,
      pathRewrite: {
        [rapMockURL]: '/',
      },
    },
  },
  extraBabelPlugins: [
    'transform-runtime',
    'recharts',
    'lodash',
    [
      'module-resolver',
      {
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@utils': './src/utils',
          '@themes': './src/themes',
          '@services': './src/services',
          '@config': './src/utils/config',
          '@shared': './src/shared',
        },
      },
    ],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr', ['import', { libraryName: 'antd', style: true }]],
    },
    production: {
      extraBabelPlugins: [['import', { libraryName: 'antd', style: true }]],
    },
  },
  define: {
    'process.env': {},
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.CONFIG_ENV': CONFIG_ENV,
    'process.env.THEME': process.env.THEME,
  },
}
