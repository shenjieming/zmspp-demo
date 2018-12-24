import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { message, Modal } from 'antd'
import { cloneDeep } from 'lodash'
import SearchTree from '../../components/SearchTree'
import TreeForm from './treeForm'
import ModalForm from './modalForm'
import InfoTable from './infoTable'
import { delay } from './data'
import { getTreeItem, getBasicFn } from '../../utils/'
import Breadcrumb from '../../components/Breadcrumb'
import { COMMON_REDUCER } from '../../utils/constant'

const RootParentId = '-1'

const namespace = 'menuManage'

const confirm = Modal.confirm
const MenuAdmin = ({ menuManage, loading, routes }) => {
  const { gData, formData, submit, modalVisible, tableData, modalContent, modalType } = menuManage
  const { getLoading, dispatchAction } = getBasicFn({ namespace, loading })

  const loadFlag = {
    form: getLoading('queryForm'),
    table: getLoading('queryTable'),
    modal: getLoading('updateTable', 'createTable'),
    tree: getLoading('query', 'update', 'create', 'remove', 'dropNode'),
  }

  const searchTreeProps = {
    rootParentId: RootParentId,
    gData,
    stateSwitch: true,
    treeLoading: loadFlag.tree,
    selected: Object.keys(formData).length,
    addChildNode({ value, label }) {
      dispatchAction({
        type: COMMON_REDUCER,
        payload: {
          formData: {
            id: value,
            name: label,
          },
          submit: 'create',
        },
      })
    },
    removeNode({ value, label }) {
      confirm({
        title: '确定要删除此节点?',
        content: (
          <span>
            删除节点: <span style={{ color: '#F05652' }}>{label}</span>
          </span>
        ),
        onOk() {
          dispatchAction({
            type: 'remove',
            payload: { id: value },
          })
        },
      })
    },
    queryTreeNode(selectedKeys, e) {
      const nodeData = cloneDeep(e.node.props.data)
      const rootData = {}
      const id = nodeData.value

      if (id === RootParentId) {
        const { index, label, parentId, parentName, status } = nodeData
        rootData.id = id
        rootData.index = index
        rootData.name = label
        rootData.parentId = parentId
        rootData.parentName = parentName
        rootData.status = status
        dispatchAction({
          type: COMMON_REDUCER,
          payload: {
            formData: rootData,
            submit: 'update',
          },
        })
      } else {
        dispatchAction({ payload: { menuId: id } })
        dispatchAction({ type: 'queryForm', payload: { menuId: id } })
        dispatchAction({ type: 'queryTable' })
      }
    },
    drop(data) {
      confirm({
        title: '确定要拖动此节点?',
        content: (
          <span>
              将
            <span style={{ color: '#F05652' }}>{getTreeItem(gData, 'value', data.id).label}</span>
              拖到
            <span style={{ color: '#F05652' }}>{data.parentName}</span>
              里面
          </span>
        ),
        onOk() {
          dispatchAction({ type: 'dropNode', payload: data })
        },
      })
    },
  }
  const treeFormProps = {
    formData,
    submit,
    formLoading: loadFlag.form,
    update: delay((data) => {
      if (data.id === RootParentId) {
        message.error('根节点不可被修改')
      } else if (formData.id) {
        dispatchAction({ type: COMMON_REDUCER, payload: { formData: { ...formData, ...data } } })
        dispatchAction({ type: 'update', payload: data })
      } else {
        message.error('请先选择左侧菜单')
      }
    }),
    create(data) {
      const item = getTreeItem(gData, 'value', formData.id)
      let index = 0
      if (Array.isArray(item.children) && item.children.length) {
        index = item.children[item.children.length - 1].index + 1
      }
      const temp = { ...data, index, menuKey: data.menuUrl }
      dispatchAction({ type: 'create', payload: temp })
    },
  }
  const infoTableProps = {
    tableData,
    tableLoading: loadFlag.table,
    addItem: delay(() => {
      if (formData.id) {
        dispatchAction({
          type: COMMON_REDUCER,
          payload: {
            modalVisible: true,
            modalType: 'create',
            modalContent: {
              parentId: formData.id,
              parentName: formData.name,
              menuType: 1,
            },
          },
        })
      } else {
        message.error('请先选择左侧菜单')
      }
    }),
    update(data, type = 'update') {
      const rowData = cloneDeep(data)
      switch (type) {
        case 'update':
          dispatchAction({
            type: COMMON_REDUCER,
            payload: {
              modalVisible: true,
              modalType: 'update',
              modalContent: rowData,
            },
          })
          break
        case 'able':
          if (rowData.status === true) {
            rowData.status = false
            dispatchAction({ type: 'funStatus', payload: rowData })
          }
          break
        case 'disable':
          if (rowData.status === false) {
            rowData.status = true
            dispatchAction({ type: 'funStatus', payload: rowData })
          }
          break
        case 'delete':
          confirm({
            title: '确定要删除此功能?',
            content: (
              <span>
                将 <span style={{ color: '#F05652' }}>{data.name}</span> 功能删除
              </span>
            ),
            onOk() {
              dispatchAction({ type: 'removeTable', payload: rowData })
            },
          })
          break
        default:
          break
      }
    },
  }
  const modalProps = {
    visible: modalVisible,
    modalContent,
    modalType,
    modalLoading: loadFlag.modal,
    onOk(data) {
      const res = {
        ...modalContent,
        ...data,
      }
      if (modalType === 'create') {
        dispatchAction({ type: 'createTable', payload: res })
      } else if (modalType === 'update') {
        dispatchAction({ type: 'updateTable', payload: res })
      }
    },
    onCancel: () => {
      dispatchAction({
        type: COMMON_REDUCER,
        payload: {
          modalVisible: false,
          modalType: '',
          modalContent: {},
        },
      })
    },
  }
  const TreeItemForm = () => <TreeForm {...treeFormProps} />
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <div className="content">
        <div className="aek-layout-hor">
          <div className="left">
            <SearchTree {...searchTreeProps} />
          </div>
          <div className="right" style={{ paddingLeft: 10 }}>
            <TreeItemForm />
            {submit === 'update' && tableData !== [] && <InfoTable {...infoTableProps} />}
          </div>
        </div>
      </div>
      <ModalForm {...modalProps} />
    </div>
  )
}

MenuAdmin.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  menuManage: PropTypes.object,
  routes: PropTypes.array,
}

export default connect(({ menuManage, loading }) => ({ menuManage, loading }))(MenuAdmin)
