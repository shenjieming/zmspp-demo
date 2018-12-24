import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Tooltip, Icon } from 'antd'

import styles from './index.less'

const MenusTree = ({
  dispatchAction,
  total,
  showType,
}) => {
  const isAllNotChecked = (targetItem) => {
    if (targetItem.children.every(({ checked }) => checked === false)) {
      targetItem.checked = false
      return true
    }
    return false
  }
  const checkHandler = (e, item, appId, menuId) => {
    // 第一步：将自身状态先改变
    const checked = !!e.target.checked
    item.checked = checked
    // 有children的话，全部置为自身状态
    if (item.children.length > 0) {
      item.children.forEach((ele) => {
        ele.checked = checked
        if (ele.children.length > 0) {
          ele.children.forEach((leaf) => {
            leaf.checked = checked
          })
        }
      })
    }
    // 找出根节点和父节点
    let rootItem = null
    let parentItem = null
    if (appId && menuId) {
      rootItem = total.filter(({ id }) => id === appId)
      parentItem = rootItem[0].children.filter(({ id }) => id === menuId)
    } else if (appId && !menuId) {
      parentItem = total.filter(({ id }) => id === appId)
    }
    if (checked || item.type === 1) { // 如果状态是选中，直接将父根设为checked
      parentItem[0].checked = true
      if (rootItem) {
        rootItem[0].checked = true
      }
    } else { // 如果状态为不选中，先遍历父节点下的所有子
      const parentAllNot = isAllNotChecked(parentItem[0])
      // 若有其上还有并且父级全未选的
      if (rootItem && parentAllNot) {
        isAllNotChecked(rootItem[0])
      }
    }
    dispatchAction({})
  }
  // 三级渲染方法
  const renderThirdMenus = (list, appId, menuId) => {
    const thirdList = list.map(item => (
      <div key={item.id} className={styles.thirdInner}>
        {
          showType === 'view' ? (
            <Checkbox
              key={item.id}
              checked={item.checked}
              className={styles.functionLevel}
            >
              {item.name}
              {
                item.tip ?
                  <Tooltip title={item.tip}>
                    <Icon type="question-circle-o" />
                  </Tooltip> : ''
              }
            </Checkbox>
          ) : (
            <Checkbox
              key={item.id}
              checked={item.checked}
              className={styles.functionLevel}
              onChange={(e) => { checkHandler(e, item, appId, menuId) }}
            >
              {item.name}
              {
                item.tip ?
                  <Tooltip title={item.tip}>
                    <Icon type="question-circle-o" />
                  </Tooltip> : ''
              }
            </Checkbox>
          )
        }
      </div>
    ))
    return thirdList
  }
  // 二级渲染方法
  const renderSecondMenus = (list) => {
    const secondList = list.map(item => (
      <div
        key={item.id}
        className={item.type === 1 ? styles.functionContainer : styles.secondInner}
      >
        {
          showType === 'view' ? (
            <Checkbox
              key={item.id}
              className={styles.menuLevel}
              checked={item.checked}
            >
              {item.name}
              {
                item.tip ?
                  <Tooltip title={item.tip}>
                    <Icon type="question-circle-o" />
                  </Tooltip> : ''
              }
            </Checkbox>
          ) : (
            <Checkbox
              key={item.id}
              className={styles.menuLevel}
              checked={item.checked}
              onChange={(e) => { checkHandler(e, item, item.parentId) }}
            >
              {item.name}
              {
                item.tip ?
                  <Tooltip title={item.tip}>
                    <Icon type="question-circle-o" />
                  </Tooltip> : ''
              }
            </Checkbox>
          )
        }
        <div className={styles.thirdContainer}>
          {renderThirdMenus(item.children, item.parentId, item.id)}
        </div>
      </div>
    ))
    return secondList
  }
  // 一级渲染方法
  const renderFirstMenus = (list) => {
    const firstList = list.map((item) => {
      if (showType === 'view') {
        if (!item.checked) {
          return ''
        }
        return (
          <div key={item.id} className={styles.firstInner}>
            <div key={item.id} className={styles.appLevel}>
              {item.name}
              {
                item.tip ?
                  <Tooltip title={item.tip}>
                    <Icon type="question-circle-o" />
                  </Tooltip> : ''
              }
            </div>
            <div className={styles.secondContainer}>
              {renderSecondMenus(item.children)}
            </div>
          </div>
        )
      }
      return (
        <div key={item.id} className={styles.firstInner}>
          <Checkbox
            key={item.id}
            className={styles.appLevel}
            checked={item.checked}
            onChange={(e) => { checkHandler(e, item, item.id) }}
          >
            {item.name}
            {
              item.tip ?
                <Tooltip title={item.tip}>
                  <Icon type="question-circle-o" />
                </Tooltip> : ''
            }
          </Checkbox>
          <div className={styles.secondContainer}>
            {renderSecondMenus(item.children)}
          </div>
        </div>
      )
    })
    return firstList
  }
  return (
    <div className={showType === 'view' ? styles.viewModel : styles.editModel}>
      <div className={styles.firstContainer}>
        {renderFirstMenus(total)}
      </div>
    </div>
  )
}

MenusTree.propTypes = {
  dispatchAction: PropTypes.func,
  actionName: PropTypes.string,
  total: PropTypes.array,
  showType: PropTypes.string,
}

export default MenusTree
