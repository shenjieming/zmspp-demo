import React from 'react'
import { Modal, Input } from 'antd'
import { CopyText } from '../../components'

// 成功弹框
function success(url) {
  const content = (
    <Input
      value={url}
      addonAfter={
        <CopyText text={url} />
      }
    />
  )
  Modal.success({
    title: '订单已提交成功，需要您登录融信通平台进行支付确认，请用IE浏览器打开以下链接',
    content,
  })
}

/**
 * window.open方法被拦截
 * 当window.open为用户触发事件内部或者加载时，不会被拦截，
 * 一旦将弹出代码移动到ajax或者一段异步代码内部，马上就出现被拦截的表现了。
 */
const windowNewOpen = (url) => {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'newOpen')
  // 防止反复添加
  if (!document.getElementById('newOpen')) {
    document.body.appendChild(a)
  }

  // 判断是否是Ie浏览器
  const match = window.navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/)

  if (match) {
    a.click()
    return
  }
  success(url)
}

export default windowNewOpen
