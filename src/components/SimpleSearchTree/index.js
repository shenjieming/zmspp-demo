import React from 'react'
import PropTypes from 'prop-types'
import { Tree, Input } from 'antd'
import styles from './index.less'

const Search = Input.Search
const TreeNode = Tree.TreeNode

let dataList = []
const generateList = (data) => {
  for (const node of data) {
    const temp = { ...node }
    delete temp.children
    dataList.push(temp)
    if (node.children) {
      generateList(node.children)
    }
  }
}

const getParentKey = (key, tree) => {
  let parentKey
  for (const node of tree) {
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

class SearchTree extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    checkable: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
    placeholder: '请输入...',
    selectedKeys: ['-1'],
    checkable: false,
  }

  state = {
    expandedKeys: ['-1'],
    searchValue: '',
    autoExpandParent: true,
  }

  componentWillMount() {
    const { dataSource } = this.props
    generateList(dataSource)
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps
    dataList = []
    generateList(dataSource)
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onChange = (keyword) => {
    const value = keyword.trim().toUpperCase()
    let expandedKeys
    if (value) {
      expandedKeys = dataList
        .filter(({ text, parentId, textHelp }) => {
          const helperList = (textHelp ? textHelp.split('|') : []).concat(text)
          return helperList.some(item => item.includes(value)) && parentId
        })
        .map(({ parentId }) => String(parentId))
    } else {
      expandedKeys = ['-1']
    }
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    })
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state
    const { dataSource, placeholder, onSelect, selectedKeys, checkable } = this.props

    const loop = data => data.map((item) => {
      const { text, id, textHelp } = item
      let index
      const searchList = [text].concat(textHelp ? textHelp.split('|') : [])
      for (const el of searchList) {
        index = el.search(searchValue)
        if (index > -1) {
          break
        }
      }
      const beforeStr = text.substr(0, index)
      const replaceStr = text.substr(index, searchValue.length)
      const afterStr = text.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span className={styles.search}>{replaceStr}</span>
          {afterStr}
        </span>
      ) : <span>{text}</span>
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={String(id)} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={String(id)} title={title} />
    })

    return (
      <div className={styles.normal}>
        <Search placeholder={placeholder} onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          showLine
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          checkable={checkable}
        >
          {loop(dataSource)}
        </Tree>
      </div>
    )
  }
}

export default SearchTree
