import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal } from 'antd'
import { getBasicFn, getPagination } from '../../../../utils'
import AdvancedSearchForm from '../../../../components/SearchFormFilter/'
import { columns, formItemData } from './data'
import ModalForm from './ModalForm'
import ContentLayout from '../../../../components/ContentLayout'

const confirm = Modal.confirm

const propTypes = {
  dictionaryDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
function DictionaryDetail({ dictionaryDetail, loading }) {
  const {
    modalVisible,
    modalType,
    tableData,
    modalInitValue,
    searchKeys,
    pageConfig,
    checked,
  } = dictionaryDetail
  const { toAction, getLoading } = getBasicFn({
    namespace: 'dictionaryDetail',
    loading,
  })

  const pageChange = (current, pageSize) => {
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'listDicValues',
    )
  }
  const tableProps = {
    loading: getLoading('listDicValues'),
    dataSource: tableData || [],
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'dicValueId',
    bordered: true,
    columns: columns({
      updateDicValue({ dicValueText, dicValue, dicValueStatus, dicValueId }) {
        toAction({
          modalType: 'update',
          modalVisible: true,
          modalInitValue: {
            dicValueText,
            dicValue,
            dicValueStatus,
            dicValueId,
            exclude: true,
            dicId: searchKeys.dicId,
          },
          checkQuery: false,
          checked: false,
          checkKey: true,
        })
      },
      stopDicValue(dicValueId, dicValueStatus) {
        confirm({
          content: `您确定要${dicValueStatus ? '启用' : '停用'}该字典值？`,
          onOk() {
            toAction(
              {
                dicValueId,
                dicValueStatus: dicValueStatus ? 0 : 1,
              },
              'updateDicValue',
            )
          },
        })
      },
    }),
    rowClassName: ({ dicValueStatus }) => {
      if (dicValueStatus) {
        return 'aek-text-disable'
      }
    },
  }
  const modalProps = {
    modalType,
    visible: modalVisible,
    modalInitValue,
    loading: getLoading('saveDicValue', 'updateDicValue'),
    addLoading: getLoading('saveAdd'),
    checked,
    checkboxEvern({ target }) {
      toAction({
        checked: target.checked,
        checkKey: true,
      })
    },
    onCancel() {
      toAction({ modalVisible: false })
    },
    onOk(value) {
      toAction({ ...value }, modalType === 'create' ? 'saveDicValue' : 'updateDicValue')
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
        dicId: searchKeys.dicId,
      },
      checkQuery: false,
      checked: false,
      checkKey: true,
    })
  }
  const onSearch = (value) => {
    toAction(
      {
        ...searchKeys,
        ...value,
      },
      'listDicValues',
    )
  }
  const content = (
    <span>
      <AdvancedSearchForm formData={formItemData} onSearch={onSearch} />
      <Table {...tableProps} />
      <ModalForm {...modalProps} />
    </span>
  )
  const contentLayoutProps = {
    breadLeft: [
      {
        name: 'Breadcrumb',
      },
    ],
    breadRight: [
      {
        name: 'Button',
        props: {
          type: 'primary',
          children: '+ 新增字典值',
          onClick: addDictionary,
        },
      },
    ],
    content,
  }
  return <ContentLayout {...contentLayoutProps} />
}

DictionaryDetail.propTypes = propTypes
export default connect(({ dictionaryDetail, loading }) => ({ dictionaryDetail, loading }))(
  DictionaryDetail,
)
