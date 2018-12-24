import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import { getBasicFn, getPagination } from '../../../utils'
import AdvancedSearchForm from '../../../components/SearchFormFilter/'
import { columns, formData, addOrder } from './data'
import ModalEditMaterial from '../ModalEditMaterial'
import ContentLayout from '../../../components/ContentLayout'

const propTypes = {
  addForDic: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  accuracy: PropTypes.number,
  accuracyDecimal: PropTypes.number,
}
function AddForDic({
  addForDic,
  loading,
  accuracy,
  accuracyDecimal,
}) {
  const { tableData, searchKeys, pageConfig, editModalVisible, modalInitValue, codeMust, suppliersSelect, poduceFactoryArr, certificateArr, categoryTree } = addForDic
  const { toAction, getLoading } = getBasicFn({
    namespace: 'addForDic',
    loading,
  })
  const pageChange = (current, pageSize) => {
    toAction({
      ...searchKeys,
      current,
      pageSize,
    }, 'terrace')
  }
  const tableProps = {
    loading: getLoading('terrace'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'order',
    bordered: true,
    columns: columns((initValue) => {
      toAction({ keywords: null }, 'suppliersSelect')
      toAction({
        modalInitValue: initValue,
        editModalVisible: true,
      })
    }),
  }
  const modalEditMaterialProps = {
    loading: getLoading('addStandardMaterial'),
    editModalVisible,
    modalType: 'addForDic',
    modalInitValue,
    toAction,
    codeMust,
    accuracy,
    accuracyDecimal,
    suppliersSelect,
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: (
      <span>
        <AdvancedSearchForm
          formData={formData({
            poduceFactoryArr,
            certificateArr,
            categoryTree,
            certificateSearch(keywords) {
              toAction({ keywords }, 'certificate')
            },
            poduceFactorySearch(keywords) {
              toAction({ keywords }, 'getProduceFactoryInfo')
            },
          })}
          loading={getLoading('terrace')}
          onSearch={(value) => {
            const getKey = (obj) => {
              if (obj && obj.key) {
                return obj.key
              }
              return null
            }
            const req = value
            req.certificateId = getKey(req.certificateId)
            req.factoryId = getKey(req.factoryId)
            toAction({
              ...searchKeys,
              ...value,
            }, 'terrace')
          }}
        />
        <Table {...tableProps} />
        <ModalEditMaterial {...modalEditMaterialProps} />
      </span>
    ),
  }
  return (
    <ContentLayout {...contentLayoutProps} />
  )
}
AddForDic.propTypes = propTypes
export default connect(({
  addForDic,
  loading,
  app: { orgInfo: { accuracy, accuracyDecimal } },
}) => ({ addForDic, loading, accuracy, accuracyDecimal }),
)(AddForDic)
