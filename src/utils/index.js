import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { parse, stringify } from 'qs'
import { TreeSelect, Timeline } from 'antd'
import { cloneDeep, debounce, noop, mapValues, isPlainObject, groupBy, isNaN, trim } from 'lodash'
import moment from 'moment'
import { render } from 'react-dom'
import pathToRegexp from 'path-to-regexp'
import invariant from 'invariant'
import md5 from 'md5'
import request from './request'
import modelExtend from './modelExtend'
import dispatch from '../index'
import { COMMON_REDUCER, ORG_TYPE } from './constant'
import axios from './axiosInstance'
import {
  UPYUN_SAVE_KEY_EXCEL,
  UPYUN_SAVE_KEY_ZIP,
  ASYNC_SUCCESS_CODE,
  ASYNC_FAIL_CODE,
  UPYUN_SAVE_KEY,
  UPLOAD_KEY,
  baseURL,
  mockURL,
  rapMockURL,
  UPYUN_BUCKET_EXCEL,
  UPLOAD_KEY_EXCEL,
  UPYUN_BUCKET_ZIP,
  UPLOAD_KEY_ZIP,
  IMG_COMPRESS,
} from './config'
import btoa from './btoa'

/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

// Seletable高级函数
const seletableTreeData = fn =>
  function f(data) {
    return data.map((node) => {
      const { children } = node
      let mapedChildren
      const selectable = fn(node)
      if (Array.isArray(children) && children.length > 0) {
        mapedChildren = f(children)
      } else {
        mapedChildren = undefined
      }
      return {
        ...node,
        children: mapedChildren,
        selectable,
      }
    })
  }

// 树选择只有子节点能选中
const mapTreeSelectOnlyChild = seletableTreeData(({ children, value }) => {
  if ((Array.isArray(children) && children.length > 0) || Number(value) === -1) {
    return false
  }
  return true
})
/**
 * @description 2017-12-26 修改新增逻辑
 * @param {Array} data 遍历的数组
 * @param {String} key 数组Id
 * @param {String} value 名称
 * @returns {Array}
 */
const loopTreeNode = (data = [], key, name) =>
  data.map(({ children, key: id, name: value }) => {
    if (Array.isArray(children) && children.length > 0) {
      return (
        <TreeSelect.TreeNode key={id} value={String(value)} title={value}>
          {loopTreeNode(children, key, name)}
        </TreeSelect.TreeNode>
      )
    }
    return <TreeSelect.TreeNode key={id} value={String(value)} title={value} />
  })

const generateRequest = (url, method) =>
  async function f(data = {}) {
    return request({ url, method, data })
  }

const getTreeItem = (tree, propKey, propValue, fun = _ => _) => {
  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i]
    if (item[propKey].toString() === propValue.toString()) {
      tree[i] = fun(item)
      return tree[i]
    } else if (Array.isArray(item.children) && item.children.length) {
      const ret = getTreeItem(item.children, propKey, propValue, fun)
      if (ret !== false) {
        return ret
      }
    }
  }
  return false
}

/**
 * 将对象中moment对象格式化为字符串
 *
 * @param {any} [obj] 源对象
 * @param {string} [format] 字符串格式
 * @param {string} [split] 数组分隔符
 * @returns 格式化后的对象
 */
const transformMomentToString = (obj = {}, format = 'YYYY-MM-DD', split = ',') => {
  const rs = cloneDeep(obj)
  for (const [prop, value] of Object.entries(rs)) {
    if (value instanceof moment) {
      rs[prop] = value.format(format)
    } else if (Array.isArray(value) && value.every(el => el instanceof moment)) {
      rs[prop] = value.map(item => item.format(format)).join(split)
    }
  }
  return rs
}
// 日期组件初始值转换为moment对象
const transformStringToMoment = (dateString) => {
  if (dateString === undefined) {
    return dateString
  }
  const dateArr = dateString.split(',')
  if (dateArr < 2) {
    return moment(dateArr[0])
  }
  dateArr.forEach((item, index) => {
    dateArr[index] = moment(item)
  })
  return dateArr
}

// 不定形参辅助函数
const argumentHelp = (paramArr) => {
  const ret = {}
  paramArr.forEach((item) => {
    const type = typeof item
    if (['number', 'boolean', 'string', 'function'].includes(type)) {
      ret[type] = item
    } else if (type === 'object') {
      if (Array.isArray(item)) {
        ret.array = item
      } else if (item) {
        ret.object = item
      }
    }
  })
  return ret
}

const deepFind = (...props) => {
  const { array: tree = [], object: findObj = {}, function: callback } = argumentHelp(props)
  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i]
    const finded = Object.entries(findObj).some(
      ([key, value]) => String(item[key]) === String(value),
    )
    if (finded) {
      if (callback) {
        callback(tree[i])
      }
      return cloneDeep(tree[i])
    } else if (Array.isArray(item.children) && item.children.length) {
      const ret = deepFind(item.children, findObj, callback)
      if (ret) {
        return ret
      }
    }
  }
  return undefined
}

// 获取基础函数
const getBasicFn = (config) => {
  const { namespace, loading: { effects = {} } = {}, defaultReducer = COMMON_REDUCER } = config

  invariant(typeof namespace === 'string', 'getBasicFn初始化必须传入namespace')

  const prefix = `${namespace}/`

  const dispatchAction = (action) => {
    const { payload, type = defaultReducer } = action
    return dispatch({
      type: type.includes('/') ? type : prefix + type,
      payload,
    })
  }

  const toAction = (...props) => {
    const {
      object: payload,
      string: type = COMMON_REDUCER,
      boolean: partObj = false,
    } = argumentHelp(props)
    return dispatch({
      type: type.includes('/') ? type : prefix + type,
      payload,
      partObj,
    })
  }

  const getLoading = (...arr) => arr.some(iten => effects[prefix + iten])

  const dispatchUrl = ({ query = {}, pathname, state, clear = true } = {}) => {
    const [path, search] = location.hash.split('?')
    const queryReq = clear
      ? query
      : {
        ...parse(search),
        ...query,
      }
    dispatch(
      routerRedux[pathname ? 'push' : 'replace']({
        pathname: pathname || path.slice(1),
        search: `?${stringify(queryReq)}`,
        state,
      }),
    )
  }
  return { dispatchAction, getLoading, toAction, dispatchUrl }
}

const dispatchUrl = ({ query = {}, pathname, state, clear = true } = {}) => {
  const [path, search] = location.hash.split('?')
  const queryReq = clear
    ? query
    : {
      ...parse(search),
      ...query,
    }
  dispatch(
    routerRedux[pathname ? 'push' : 'replace']({
      pathname: pathname || path.slice(1),
      search: `?${stringify(queryReq)}`,
      state,
    }),
  )
}

// 表格点状标示
const pointColumn = tableData => ({
  title: '',
  key: 'point-column',
  className: 'aek-text-center',
  width: 30,
  render: (text, record, index) => {
    const length = tableData.length
    const req = {
      props: {
        rowSpan: !index ? length : 0,
      },
      children: (
        <Timeline style={{ height: 52 * length - 32 }}>
          {tableData.map((item, i) => <Timeline.Item key={i} style={{ padding: '0 0 42px' }} />)}
        </Timeline>
      ),
    }
    return req
  },
})

// 获取Option的组件格式数据
const getOption = (data = [], { prefix = '', idStr, nameStr, callback = () => {} } = {}) => {
  let newArr = []
  if (data.length > 0) {
    const keys = Object.keys(data[0])
    const id = idStr || keys.filter(_ => ['id', 'value', 'key'].includes(_))[0]
    const name = nameStr || keys.filter(_ => ['name', 'label', 'title'].includes(_))[0]
    if (id && name) {
      newArr = data.map(item => ({
        name: 'Option',
        props: {
          key: String(item[id]),
          value: item[id] && String(item[id]),
          title: (prefix && `${prefix} : `) + item[name],
          children: item[name],
          disabled: item.disabled,
          ...callback(item),
        },
      }))
    } else {
      throw keys
    }
  }
  return newArr
}

// 获取pagination
const getPagination = (...props) => {
  const { function: pageChange = noop, object: pageConfig } = argumentHelp(props)
  return {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    onShowSizeChange: pageChange,
    onChange: pageChange,
    // pageSizeOptions: ['2', '4'],
    ...pageConfig,
  }
}

// 获取setup订阅
const getSetup = ({ path, initFun }) => {
  const setup = ({ dispatch: modalDispatch, history }) => {
    const toAction = (...props) => {
      const {
        object: payload,
        string: type = COMMON_REDUCER,
        boolean: partObj = false,
      } = argumentHelp(props)
      modalDispatch({ type, payload, partObj })
    }
    history.listen(({ pathname, state, search }) => {
      const pathArr = Array.isArray(path) ? path : [path]
      let match
      pathArr.some((item) => {
        match = pathToRegexp(item).exec(pathname)
        return match
      })
      if (match) {
        initFun({
          toAction,
          dispatch: modalDispatch,
          id: match[1],
          query: parse(search.slice(1)),
          state,
          dispatchUrl,
          history,
        })
      }
    })
  }
  return { setup }
}

/**
 * 生成异步校验函数
 * @param message {String} 校验不通过的提示的错误信息
 * @param url {String} 请求地址
 * @param method {String} 请求类型, 支持get 和 post
 * @param key {String} 请求参数key
 */
const asyncValidate = ({
  message,
  url,
  method = 'POST',
  key,
  prefixStr = 'baseURL',
  callback: callbackFun,
}) => {
  const urlPrefix = { baseURL, rapMockURL }
  const type = method.toUpperCase() === 'POST' ? 'data' : 'params'
  return debounce((rule, value, callback) => {
    const req = callbackFun ? callbackFun(value) : { [key]: value }
    axios({
      method,
      url: `${urlPrefix[prefixStr]}${url}`,
      [type]: req,
    })
      .then(({ data }) => {
        const { code } = data
        if (code === ASYNC_SUCCESS_CODE) {
          callback()
        } else if (code === ASYNC_FAIL_CODE) {
          callback(message)
        } else {
          callback(data.message)
        }
      })
      .catch(() => {
        callback('网络异常')
      })
  }, 500)
}

/**
 * 生成又拍云签名
 * TODO
 * 该方法为旧api, 适当时间应更换为的生成方法
 */
const getUploadAuth = (type) => {
  // 生成又拍云token
  // 详情http://docs.upyun.com/cloud/authorization/#_1
  let saveKey = UPYUN_SAVE_KEY
  let bucket = UPYUN_BUCKET
  let uploadKey = UPLOAD_KEY

  if (type === 'excel') {
    saveKey = UPYUN_SAVE_KEY_EXCEL
    bucket = UPYUN_BUCKET_EXCEL
    uploadKey = UPLOAD_KEY_EXCEL
  }
  if (type === 'zip') {
    saveKey = UPYUN_SAVE_KEY_ZIP
    bucket = UPYUN_BUCKET_ZIP
    uploadKey = UPLOAD_KEY_ZIP
  }
  // 设置上传的信息
  const now = Date.now()
  let policy = {
    bucket,
    'save-key': saveKey,
    expiration: now + (30 * 60),
  }

  policy = btoa(JSON.stringify(policy))

  const signature = md5(`${policy}&${uploadKey}`)
  return { policy, signature }
}

// 信息判空分割
const segmentation = (data, fences = ' - ') => {
  let arr = []
  if (Array.isArray(data)) {
    arr = data
  } else if (typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        arr.push(key)
      }
    }
  }
  return arr.filter((value) => {
    if (value) {
      return true
    }
    return false
  }).join(fences)
}

// 评分小数判断
const rateValue = (data) => {
  if (parseInt(data, 10) === data) {
    return data
  }
  return parseInt(data, 10) + 0.5
}

// 获取表格减式查询的页码
const getCurrent = ({ current, pageSize, total }, length = 1) => {
  const maxPageNum = Math.ceil((total - length) / pageSize) || 1
  return Math.min(current, maxPageNum)
}

// 浏览器打印
const printContent = (content) => {
  render(content, document.querySelector('#printRoot'), () => {
    window.print()
  })
}

const pathResolve = (pre = '', after = '') => {
  if (after.charAt(0) === '/') {
    return pre + after
  }
  return `${pre}/${after}`
}

const getServices = (data = {}, basePrefix) => {
  let apiPrefix = baseURL

  if (basePrefix === 'mock') {
    apiPrefix = mockURL
  } else if (basePrefix === 'rap') {
    apiPrefix = rapMockURL
  }

  return mapValues(data, (val) => {
    if (isPlainObject(val)) {
      const { url, type = 'post', prefix } = val

      let api

      switch (prefix) {
        case 'base':
          api = pathResolve(baseURL, url)
          break
        case 'mock':
          api = pathResolve(mockURL, url)
          break
        case 'rap':
          api = pathResolve(rapMockURL, url)
          break
        default:
          api = pathResolve(apiPrefix, url)
      }

      return generateRequest(api, type)
    }
    return generateRequest(pathResolve(apiPrefix, val), 'post')
  })
}
// 增加表格行合并字段
// 根据 物资名称和规格
const addRowspanField = (list = [], nameFiled, skuFiled, addFiled) => {
  const countArr = []
  const sortObj = groupBy(list, item => item[nameFiled] + item[skuFiled])
  for (const item of list) {
    if (countArr.includes(item[nameFiled] + item[skuFiled])) {
      item[addFiled] = 0
    } else {
      countArr.push(item[nameFiled] + item[skuFiled])
      item[addFiled] = sortObj[item[nameFiled] + item[skuFiled]].length
    }
  }
  return list
}
// Tab页tabPane的tab属性组件
const getTabName = (name = '', num = 0) => {
  if (num) {
    return (
      <span>
        {name}
        <span className="aek-red aek-ml10 aek-font-small">{`(${num})`}</span>
      </span>
    )
  }
  return <span>{name}</span>
}

// 在connect中使用， 需命名空间名和路径名保持一致
const modifier = (fun = () => undefined) => (all) => {
  const { '@@dva': _, loading, routing, ...namespaceObjs } = all
  const pathnameArr = all.routing.location.pathname.split('/')
  const namespaceArr = Object.keys(namespaceObjs)
  const filterArr = pathnameArr.filter(item => namespaceArr.includes(item))
  const namespace = filterArr[filterArr.length - 1] || 'null'
  const basicFn = getBasicFn({ namespace, loading })
  return {
    ...namespaceObjs,
    ...fun(all),
    ...basicFn,
    namespace: all[namespace], // 后退有bug，暂时勿用此属性
  }
}
// 替换connect
const aekConnect = fun => connect(modifier(fun))

// 纵向排列多条信息
const verticalContent = (...props) => {
  const { array: arr = [], object: style, string: className } = argumentHelp(props)
  const content = []
  arr.forEach((item, index) => {
    if (item) {
      content.push(<li key={`li${index}`}>{item}</li>)
    }
  })
  return (
    <ul className={className} style={style}>
      {content}
    </ul>
  )
}

// 数字千分位
const thousandSplit = (amount, config = { integerResult: false }) => {
  if (!amount) {
    return '0'
  }
  const value = String(amount)
  const list = value.split('.')
  let num = list[0]
  let result = ''
  let decimal = ''
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  if (!config.intergeResult) {
    decimal = list[1] ? `.${list[1]}` : '.00'
  } else {
    decimal = ''
  }
  return `${result}${decimal}`
}

/**
 * 默认保留小数[2,4]位
 * @param num {String | Number}
 * @param unit 货币符号
 * @param format {boolean} 默认不格式化
 */

const formatNum = (num, { unit = '￥', format = false } = {}) => {
  const showUnit = unit ? `${unit} ` : ''
  if (isNaN(Number(num))) {
    return `${showUnit}0.00`
  }
  const numStr = Number(num).toString()
  let finalStr = ''
  const numArr = numStr.split('.')
  const intPart = numArr[0]
  if (!numArr[1]) {
    finalStr = `${intPart}.00`
  } else {
    const decimalLen = numArr[1].length
    if (decimalLen <= 1) {
      finalStr = `${intPart}.${numArr[1]}0`
    } else if (decimalLen > 1 && decimalLen <= 4) {
      finalStr = `${intPart}.${numArr[1]}`
    } else {
      finalStr = `${intPart}.${numArr[1].substr(0, 4)}`
    }
  }
  return format ? `${showUnit}${thousandSplit(finalStr)}` : `${showUnit}${finalStr}`
}
/**
 * 获取图片压缩路径
 * @param {String} url 图片路径
 */
const getImgCompress = (url) => {
  // if (typeof url === 'string') {
  //   return url + IMG_COMPRESS
  // }
  return url
}
/**
 * 判断所属组织 是否显示维护经营范围按钮 医院和监管机构不显示维护经营范围按钮
 * @param {string} orgType  所属组织Id
 * @returns {Boolean} false 时 显示按钮  true隐藏按钮
 */
const manageFlag = (orgType) => {
  for (const obj of ORG_TYPE) {
    if (orgType === obj.id && !obj.manageButtonFlag) {
      return true
    }
  }
  return false
}

function digitUppercase(foo) {
  let money = foo
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 999999999999999.9999
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i += 1) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount += 1
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i += 1) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

// 全角空格为12288，半角空格为32
// 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248
// 半角转换为全角函数 (制作半角的() 转换为（）)
function halfToFull(txtstring) {
  const str = trim(txtstring)
  let tmp = ''
  for (let i = 0; i < str.length; i += 1) {
    if (str.charCodeAt(i) === 40) {
      tmp += String.fromCharCode(65288)
    } else if (str.charCodeAt(i) === 41) {
      tmp += String.fromCharCode(65289)
    } else {
      tmp += str[i]
    }
  }
  return tmp
}

// 全角转换为半角函数
function fullToHalf(txtstring) {
  const str = trim(txtstring)
  let tmp = ''
  for (let i = 0; i < str.length; i += 1) {
    if (str.charCodeAt(i) !== 12288) {
      if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
      } else {
        tmp += String.fromCharCode(str.charCodeAt(i))
      }
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
    }
  }
  return tmp
}

export default {
  axios,
  getTreeItem,
  loopTreeNode,
  mapTreeSelectOnlyChild,
  seletableTreeData,
  request,
  generateRequest,
  transformMomentToString,
  transformStringToMoment,
  getBasicFn,
  pointColumn,
  getOption,
  cloneDeep,
  queryURL,
  modelExtend,
  getSetup,
  getPagination,
  asyncValidate,
  getUploadAuth,
  segmentation,
  rateValue,
  argumentHelp,
  getCurrent,
  printContent,
  pathResolve,
  getServices,
  addRowspanField,
  getTabName,
  aekConnect,
  verticalContent,
  formatNum,
  getImgCompress,
  manageFlag,
  digitUppercase,
  dispatchUrl,
  deepFind,
  halfToFull,
  fullToHalf,
  thousandSplit,
}
