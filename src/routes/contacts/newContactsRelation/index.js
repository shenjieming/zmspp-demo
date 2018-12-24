import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form } from 'antd'
import { getBasicFn, getPagination } from '../../../utils'
import AdvancedSearchForm from '../../../components/SearchFormFilter/'
import { columns, formItemData, addOrder, formData } from './data'
import Carousel from './carousel'
import ContentLayout from '../../../components/ContentLayout'
import GetFormItem from '../../../components/GetFormItem'

const confirm = Modal.confirm
const propTypes = {
  newContactsRelation: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  children: PropTypes.object,
}
function NewContactsRelation({
  newContactsRelation,
  loading,
  form: { validateFieldsAndScroll, resetFields },
}) {
  const { modalVisible, tableData, searchKeys, pageConfig, initValue } = newContactsRelation
  const { toAction, getLoading } = getBasicFn({
    namespace: 'newContactsRelation',
    loading,
  })

  const pageChange = (current, pageSize) => {
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'relationList',
    )
  }
  const tableProps = {
    loading: getLoading('relationList'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'id',
    bordered: true,
    columns: columns({
      relationStatus(id, status) {
        if (status - 3) {
          confirm({
            content: `您确定要${{
              2: '通过',
              4: '忽略',
            }[status]}该机构的申请吗？`,
            onOk() {
              toAction({ id, status }, 'relationStatus')
            },
          })
        } else {
          toAction({
            initValue: { id, status },
            modalVisible: true,
          })
        }
      },
    }),
    rowClassName: () => 'table-row-hover',
  }

  const modalProps = {
    title: '确认提示',
    visible: modalVisible,
    confirmLoading: getLoading('relationStatus'),
    afterClose: resetFields,
    wrapClassName: 'aek-modal',
    onCancel() {
      toAction({ modalVisible: false })
    },
    onOk() {
      validateFieldsAndScroll((errors, value) => {
        if (!errors) {
          toAction(value, 'relationStatus')
        }
      })
    },
    maskClosable: false,
    children: (
      <Form>
        <GetFormItem
          formData={formData(initValue)}
        />
      </Form>
    ),
  }
  const onSearch = (value) => {
    toAction(
      {
        ...searchKeys,
        ...value,
      },
      'relationList',
    )
  }
  const content = (
    <span>
      <AdvancedSearchForm
        formData={formItemData}
        onSearch={onSearch}
        loading={getLoading('relationList')}
        initialValues={searchKeys}
      />
      <Table {...tableProps} />
      <Modal {...modalProps} />
      <Carousel />
    </span>
  )
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content,
  }
  return <ContentLayout {...contentLayoutProps} />
}
NewContactsRelation.propTypes = propTypes
export default connect(({ newContactsRelation, loading }) => ({ newContactsRelation, loading }))(
  Form.create()(NewContactsRelation),
)
