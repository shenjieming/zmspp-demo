import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Tree, Spin } from 'antd'

const TreeNode = Tree.TreeNode
const Search = Input.Search

const modal = ({
  scopeLoadingStatus = false,
  searchValue,
  onChangePara,
  expandedKeys,
  onExpand,
  autoExpandParent,
  onOkScope,
  category68Ids,
  onCheckTree,
  categoryTree,
  scopeModalVisible,
  onCancel,
}) => {
  const visible = scopeModalVisible
  const modalOpts = {
    title: '经营范围设置',
    visible,
    onCancel,
    onOk: onOkScope,
    width: 600,
    wrapClassName: 'aek-modal',
    maskClosable: false,
  }
  const generateList = (data) => {
    let dataList = []
    for (const item of data) {
      const node = item
      const { value, label, textHelp } = node
      dataList.push({ value, label, wordArr: [label].concat(textHelp) })
      if (node.children.length) {
        dataList = dataList.concat(generateList(node.children, node.value))
      }
    }
    return dataList
  }
  const loop = data =>
    data.map((item) => {
      const { label, value, textHelp } = item
      const wordArr = [label].concat(textHelp || '')
      let index
      wordArr.some((_items) => {
        index = _items.search(searchValue.toUpperCase())
        return index > -1
      })
      const beforeStr = label.substr(0, index)
      const middle = label.substr(index, searchValue.length)
      const afterStr = label.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{middle}</span>
            {afterStr}
          </span>
        ) : (
          <span>{label}</span>
        )
      if (item.children.length > 0) {
        return (
          <TreeNode key={value} data={item} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={value} data={item} title={title} />
    })
  return (
    <Modal {...modalOpts}>
      <Spin spinning={scopeLoadingStatus}>
        {visible ? (
          <div>
            <Search style={{ width: 560 }} placeholder="" onChange={onChangePara} />
            <div style={{ height: 400, overflowY: 'auto' }}>
              <Tree
                checkable
                showLine
                onExpand={onExpand}
                onCheck={onCheckTree}
                checkedKeys={category68Ids}
                expandedKeys={[...expandedKeys, '-1']}
                autoExpandParent={autoExpandParent}
              >
                {loop(categoryTree)}
              </Tree>
            </div>
          </div>
        ) : (
          ''
        )}
      </Spin>
    </Modal>
  )
}
modal.propTypes = {
  scopeLoadingStatus: PropTypes.bool,
  searchValue: PropTypes.string,
  onChangePara: PropTypes.func,
  expandedKeys: PropTypes.array,
  onExpand: PropTypes.func,
  autoExpandParent: PropTypes.bool,
  onOkScope: PropTypes.func,
  category68Ids: PropTypes.array,
  onCheckTree: PropTypes.func,
  categoryTree: PropTypes.array,
  scopeModalVisible: PropTypes.bool,
  addressList: PropTypes.array,
  onCascaderChange: PropTypes.func,
  onOkAddress: PropTypes.func,
  modalType: PropTypes.string,
  form: PropTypes.object.isRequired,
  currentItemAdds: PropTypes.object,
  onCancel: PropTypes.func,
}
export default Form.create()(modal)
