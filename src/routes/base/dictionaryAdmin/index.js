import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
import { getBasicFn, getPagination } from '../../../utils'
import AdvancedSearchForm from '../../../components/SearchFormFilter/'
import { columns, formItemData, addOrder } from './data'
import ModalForm from './ModalForm'
import ContentLayout from '../../../components/ContentLayout'

const confirm = Modal.confirm

const propTypes = {
  dictionaryAdmin: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
function DictionaryAdmin({ dictionaryAdmin, loading }) {
  const {
    modalVisible,
    modalType,
    tableData,
    modalInitValue,
    searchKeys,
    pageConfig,
  } = dictionaryAdmin
  const { toAction, getLoading } = getBasicFn({
    namespace: 'dictionaryAdmin',
    loading,
  })

  const pageChange = (current, pageSize) => {
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'listDics',
    )
  }

  const tableProps = {
    loading: getLoading('listDics'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'dicId',
    bordered: true,
    columns: columns({
      updateDic({ dicDescription, dicId, dicStatus, dicType }) {
        toAction({
          modalType: 'update',
          modalVisible: true,
          modalInitValue: { dicDescription, dicId, dicStatus, dicType, exclude: true },
          checkQuery: false,
          checkKey: true,
        })
      },
      stopDic(dicId, dicStatus) {
        confirm({
          content: `您确定要${dicStatus ? '启用' : '停用'}该字典表？`,
          onOk() {
            toAction(
              {
                dicId,
                dicStatus: dicStatus ? 0 : 1,
              },
              'updateDic',
            )
          },
        })
      },
    }),
    rowClassName: ({ dicStatus }) => {
      if (dicStatus) {
        return 'aek-text-disable'
      }
      return undefined
    },
  }

  const modalProps = {
    modalType,
    visible: modalVisible,
    modalInitValue,
    loading: getLoading('saveDic', 'updateDic'),
    addLoading: getLoading('saveAdd'),
    onCancel() {
      toAction({ modalVisible: false })
    },
    onOk(value) {
      toAction({ ...value }, modalType === 'create' ? 'saveDic' : 'updateDic')
    },
    saveAdd(value, fun) {
      toAction(
        {
          data: { ...value },
          fun,
        },
        'saveAdd',
      )
    },
  }
  const addDictionary = () => {
    toAction({
      modalType: 'create',
      modalVisible: true,
      modalInitValue: {
        exclude: false,
      },
      checkQuery: false,
      checkKey: true,
    })
  }
  const onSearch = (value) => {
    toAction(
      {
        ...value,
        current: 1,
        pageSize: 10,
      },
      'listDics',
    )
  }
  const content = (
    <span>
      <AdvancedSearchForm
        formData={formItemData}
        onSearch={onSearch}
        loading={getLoading('listDics')}
        initialValues={searchKeys}
      />
      <Table {...tableProps} />
      <ModalForm {...modalProps} />
    </span>
  )
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    breadRight: [
      {
        name: 'Button',
        props: {
          type: 'primary',
          children: '+ 新增字典',
          onClick: addDictionary,
        },
      },
    ],
    content,
  }
  return <ContentLayout {...contentLayoutProps} />
}
DictionaryAdmin.propTypes = propTypes
export default connect(({ dictionaryAdmin, loading }) => ({ dictionaryAdmin, loading }))(
  DictionaryAdmin,
)
