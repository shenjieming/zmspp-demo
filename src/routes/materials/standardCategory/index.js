import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchTree from './SearchTree'
import EditNodeForm from './editNodeForm'
import AddNodeForm from './addNodeForm'
import { getBasicFn, cloneDeep } from '../../../utils/'

import styles from './index.less'

const namespace = 'standardCategory'
const StandardCategory = ({ standardCategory, routes, loading }) => {
  const { treeData, currentNode, editPanelVisible, addPanelVisible } = standardCategory
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const updateHandler = ({ values }) => {
    dispatchAction({ type: 'updateCategory', payload: { values } })
  }
  const saveHandler = ({ values }) => {
    dispatchAction({ type: 'saveCategory', payload: { values } })
  }
  const addHandler = (id) => {
    if (id.length === 0) {
      return
    }
    dispatchAction({ payload: { addPanelVisible: true, editPanelVisible: false } })
  }
  const searchTreeProps = {
    gData: treeData,
    stateSwitch: true,
    treeWidth: '326px',
    placeholder: '请输入68码，关键字，拼音码搜索',
    addHandler,
    treeLoading: getLoading('getCategoryTree'),
    queryTreeNode(selectedKeys, e) {
      const nodeData = cloneDeep(e.node.props.data)
      const id = nodeData.value
      dispatchAction({ payload: { addPanelVisible: false, editPanelVisible: false } })
      dispatchAction({ type: 'getNodeDetail', payload: { categoryId: id } })
    },
  }
  const editFormProps = {
    currentNode,
    visible: editPanelVisible,
    loading: getLoading('getNodeDetail'),
    onSubmit: updateHandler,
  }
  const addFormProps = {
    currentNode,
    visible: addPanelVisible,
    loading: getLoading('saveCategory'),
    onSubmit: saveHandler,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <div className={`content ${styles.categoryContainer}`}>
        <div className="aek-layout-hor">
          <div className="left">
            <SearchTree {...searchTreeProps} />
          </div>
          <div className="right">
            <div style={{ maxWidth: '500px', marginTop: '30px' }}>
              <EditNodeForm {...editFormProps} />
              <AddNodeForm {...addFormProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

StandardCategory.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  standardCategory: PropTypes.object,
  routes: PropTypes.array,
}

export default connect(({ standardCategory, loading }) => ({ standardCategory, loading }))(
  StandardCategory,
)
