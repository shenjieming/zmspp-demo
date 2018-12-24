import React from 'react'
import PropTypes from 'prop-types'
import { Row, Radio, Input, Tree, Popover, Spin, Icon } from 'antd'
import style from './SearchTree.less'
import { deepFind, cloneDeep } from '../../utils/'

const Search = Input.Search
const TreeNode = Tree.TreeNode
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const getParentKey = (key, tree) => {
  let parentKey
  for (const node of tree) {
    if (node.children) {
      if (node.children.some(item => item.value === key)) {
        parentKey = String(node.value)
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const getIdAndIndex = (data, value, parentId) => {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]
    if (item.value === value) {
      const chgIndex = item.index
      let addIndex = 0
      if (item.children && item.children.length) {
        addIndex = item.children[item.children.length - 1].index + 1
      }
      return [parentId, chgIndex, addIndex, item.orgId]
    } else if (item.children && item.children.length) {
      const ret = getIdAndIndex(item.children, value, item.value)
      if (ret) return ret
    }
  }
  return undefined
}

const getEnableTree = (data) => {
  const obj = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].label && data[i].value && !data[i].status) {
      if (data[i].children && data[i].children.length) {
        const child = getEnableTree(data[i].children)
        if (Object.keys(child).length !== 0) {
          data[i].children = child
          obj.push(data[i])
        } else if (!data[i].status) {
          data[i].children = []
          obj.push(data[i])
        }
      } else {
        obj.push(data[i])
      }
    }
  }
  return obj
}

const getDisableTree = (data) => {
  const obj = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].label && data[i].value) {
      if (!data[i].status && data[i].children && data[i].children.length) {
        const child = getDisableTree(data[i].children)
        if (Object.keys(child).length !== 0) {
          data[i].children = child
          obj.push(data[i])
        }
      } else if (data[i].status) {
        obj.push(data[i])
      }
    }
  }
  return obj
}
const generateList = (data) => {
  let dataList = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const { value, label, nameHelper } = node
    dataList.push({ value, label, wordArr: [label].concat((nameHelper || '').split('|')) })
    if (node.children) {
      dataList = dataList.concat(generateList(node.children, node.value))
    }
  }
  return dataList
}

class SearchTree extends React.Component {
  static propTypes = {
    gData: PropTypes.array,
    removeNode: PropTypes.func,
    queryTreeNode: PropTypes.func,
    addChildNode: PropTypes.func,
    drop: PropTypes.func,
    treeLoading: PropTypes.bool,
    placeholder: PropTypes.string,
    stateSwitch: PropTypes.bool,
    addDisable: PropTypes.bool,
    selected: PropTypes.number,
    rootParentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    gData: [],
    placeholder: '请输入内容',
    treeLoading: false,
    stateSwitch: false,
    addDisable: false,
    selected: 1,
  }

  state = {
    expandedKeys: [this.props.rootParentId],
    autoExpandParent: true,
    searchValue: '',
    treeStatus: 1,
    selectedKeys: [],
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.selected && this.state.selectedKeys.length) {
      this.setSelecte([])
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  setSelecte = (selectedKeys) => {
    this.setState({ selectedKeys })
  }
  toSearch = (expand, wordKey) => {
    this.setState({
      expandedKeys: expand,
      searchValue: wordKey,
      autoExpandParent: true,
    })
  }
  updateTreeState = (e) => {
    this.setState({
      treeStatus: e.target.value - 0,
    })
  }

  render() {
    const { searchValue, expandedKeys, treeStatus, autoExpandParent, selectedKeys } = this.state
    const {
      gData,
      queryTreeNode,
      drop,
      placeholder,
      treeLoading,
      stateSwitch,
      removeNode,
      addChildNode,
      addDisable,
    } = this.props
    const dataList = generateList(gData)
    const enAbleTree = getEnableTree(cloneDeep(gData))
    const disAbleTree = getDisableTree(cloneDeep(gData))

    const onDrop = (info) => {
      const seq = {}
      const dropKey = info.node.props.eventKey
      const dropPos = info.node.props.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      seq.id = info.dragNode.props.eventKey
      const idAndIndex = getIdAndIndex(gData, dropKey, this.props.rootParentId)
      if (!idAndIndex) return undefined
      if (info.dropToGap) {
        if (dropKey === this.props.rootParentId) return undefined
        if (dropPosition !== -1) {
          // 拖放到下面
          idAndIndex[1] += 1
        }
        seq.parentId = idAndIndex[0]
        seq.index = idAndIndex[1]
      } else {
        // 拖放到某节点上松开
        seq.parentId = dropKey
        seq.index = idAndIndex[2]
      }
      seq.orgId = idAndIndex[3]
      seq.parentName = deepFind(gData, { value: seq.parentId }).label
      if (drop) {
        this.setSelecte([String(seq.id)])
        drop(seq)
      }
    }

    const treePopover = (title, nodeData) => {
      if (removeNode !== undefined && addChildNode !== undefined) {
        return (
          <Popover
            overlayClassName={style.popover}
            placement="right"
            overlayStyle={{ color: '#666' }}
            content={
              <span className={style.icon}>
                {nodeData.value - 0 === -1 || (
                  <Icon
                    type="minus-circle-o"
                    onClick={() => {
                      removeNode(nodeData)
                    }}
                  />
                )}
                {(addDisable && nodeData.value - 0 !== -1) || (
                  <Icon
                    type="plus-circle-o"
                    onClick={() => {
                      this.setSelecte([String(nodeData.value)])
                      addChildNode(nodeData)
                    }}
                  />
                )}
              </span>
            }
            trigger="hover"
          >
            {title}
          </Popover>
        )
      }
      return title
    }

    const loop = data =>
      data.map((item) => {
        const { wordArr } = deepFind(dataList, { value: item.value })
        let index
        wordArr.some(_ => (index = _.search(searchValue.toUpperCase())) > -1)
        const beforeStr = item.label.substr(0, index)
        const middle = item.label.substr(index, searchValue.length)
        const afterStr = item.label.substr(index + searchValue.length)
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{middle}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.label}</span>
          )
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.value} data={item} title={treePopover(title, item)}>
              {loop(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode key={item.value} data={item} title={treePopover(title, item)} />
      })
    const selectTreeNode = (key, e) => {
      if (e.selected) {
        this.setSelecte(key)
      }
      queryTreeNode(key, e)
    }
    const statusTree = (status) => {
      if (status === 0) {
        return loop(disAbleTree)
      } else if (status === 1) {
        return loop(enAbleTree)
      }
      return loop(cloneDeep(gData))
    }
    const onChange = (e) => {
      const wordKey = e.target.value
      const expand = dataList
        .map(({ value, wordArr }) => {
          if (wordArr.some(_ => _.indexOf(wordKey.toUpperCase()) > -1)) {
            return getParentKey(value, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      this.toSearch(wordKey ? expand : ['-1'], wordKey)
    }
    const searchTreeContent = (
      <Row>
        <RadioGroup
          style={{ marginTop: 10, marginBottom: 10, width: '100%', maxWidth: 250 }}
          defaultValue="1"
          onChange={this.updateTreeState}
        >
          <RadioButton style={{ width: '50%', textAlign: 'center' }} value="1" children="启用" />
          <RadioButton style={{ width: '50%', textAlign: 'center' }} value="0" children="停用" />
        </RadioGroup>
      </Row>
    )
    return (
      <div>
        <Row>
          <Search
            style={{ width: '100%', maxWidth: 250 }}
            placeholder={placeholder}
            onChange={onChange}
          />
        </Row>
        {stateSwitch && searchTreeContent}
        <Spin spinning={treeLoading}>
          <Tree
            className={style.tree}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            showLine
            draggable={drop !== undefined}
            onDrop={drop && onDrop}
            onSelect={selectTreeNode}
            selectedKeys={selectedKeys}
          >
            {statusTree(treeStatus)}
          </Tree>
        </Spin>
      </div>
    )
  }
}

export default SearchTree
