import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form } from 'antd'
import { getBasicFn, getPagination } from '../../../utils'
import AdvancedSearchForm from '../../../components/SearchFormFilter/'
import { columns, formItemData, addOrder, editFormData, modalTableColumns } from './data'
import ModalForm from './ModalForm'
import ContentLayout from '../../../components/ContentLayout'
import GetFormItem from '../../../components/GetFormItem'

const confirm = Modal.confirm
const propTypes = {
  mySupplier: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  addressList: PropTypes.array,
}
function MySupplier({
  mySupplier,
  loading,
  addressList,
  form: { validateFieldsAndScroll, resetFields },
}) {
  const {
    modalVisible,
    modalType,
    tableData,
    modalInitValue,
    searchKeys,
    pageConfig,
    editModalVisible,
    applyList,
    applyModalVisible,
    orgIdSign,
  } = mySupplier
  const { toAction, getLoading } = getBasicFn({
    namespace: 'mySupplier',
    loading,
  })

  const pageChange = (current, pageSize) => {
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'suppliers',
    )
  }

  const tableProps = {
    loading: getLoading('suppliers'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'supplierId',
    bordered: true,
    columns: columns({
      editContact(initValue) {
        toAction({
          modalType: 'edit',
          editModalVisible: true,
          modalInitValue: initValue,
        })
      },
      relationChange(supplierOrgId, supplierStatus) {
        toAction({ supplierOrgId })
        confirm({
          content: `您确定要${supplierStatus - 1 ? '恢复' : '解除'}该机构的关系？`,
          onOk() {
            toAction({ supplierOrgId }, supplierStatus - 1 ? 'check' : 'remove')
          },
        })
      },
      radioChange (supplierOrgId, editFlag) {
        toAction({ supplierOrgId })
        confirm({
          content: `您确定要${editFlag - 1 ? '开启' : '关闭'}证件修改？`,
          onOk() {
            toAction({ supplierOrgId }, editFlag - 1 ? 'open' : 'close')
          },
        })
      }
    }),
    rowClassName: () => 'table-row-hover',
  }

  const editModalProps = {
    title: (() => {
      if (modalType === 'edit') {
        if (modalInitValue.contactName || modalInitValue.contactPhone) {
          return '编辑联系人'
        }
        return '添加联系人'
      }
      return '申请'
    })(),
    visible: editModalVisible,
    confirmLoading: getLoading('contact'),
    afterClose: () => {
      resetFields()
      toAction({ modalInitValue: {} })
    },
    wrapClassName: 'aek-modal',
    onCancel() {
      toAction({ editModalVisible: false })
    },
    onOk() {
      validateFieldsAndScroll((errors, value) => {
        if (!errors) {
          toAction(value, modalType === 'edit' ? 'contact' : 'recover')
        }
      })
    },
    maskClosable: false,
    children: (
      <Form>
        <GetFormItem
          formData={editFormData(modalType, modalInitValue)}
        />
      </Form>
    ),
  }
  const modalProps = {
    visible: modalVisible,
    applyList,
    loading: getLoading('addSuppliersList'),
    modalTableColumns: modalTableColumns(
      (orgId, needApply) => {
        if (needApply) {
          toAction({
            orgIdSign: orgId,
            applyModalVisible: true,
          })
        } else {
          toAction({ orgIdSign: orgId })
          toAction({ orgIdSign: orgId }, 'addSuppliers')
        }
      },
      getLoading('addSuppliers'),
      orgIdSign,
    ),
    linkClick() {
      toAction({ modalVisible: false })
    },
    addressList,
    onCancel() {
      toAction({ modalVisible: false })
    },
    onSearch({ keywords = null, orgRegAddr = [] }) {
      toAction(
        {
          keywords,
          orgRegAddr: orgRegAddr.join() || null,
        },
        'addSuppliersList',
      )
    },
    applyModalProps: {
      title: '申请',
      visible: applyModalVisible,
      confirmLoading: getLoading('applyAddSuppliers'),
      wrapClassName: 'aek-modal',
      onCancel() {
        toAction({ applyModalVisible: false })
      },
      maskClosable: false,
      toApply(value) {
        toAction(value, 'applyAddSuppliers')
      },
    },
  }

  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    breadRight: [
      {
        name: 'Button',
        props: {
          type: 'primary',
          children: '+ 添加供应商',
          onClick: () => {
            toAction('app/queryAddress')
            toAction('addSuppliersList')
            toAction({ modalVisible: true })
          },
        },
      },
    ],
    content: (
      <span>
        <AdvancedSearchForm
          formData={formItemData}
          loading={getLoading('suppliers')}
          initialValues={searchKeys}
          onSearch={(value) => {
            toAction(
              {
                ...value,
                current: 1,
                pageSize: 10,
              },
              'suppliers',
            )
          }}
        />
        <Table {...tableProps} />
        <ModalForm {...modalProps} />
        <Modal {...editModalProps} />
      </span>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}
MySupplier.propTypes = propTypes
export default connect(({ mySupplier, loading, app: { constants: { addressList } } }) => ({
  mySupplier,
  loading,
  addressList,
}))(Form.create()(MySupplier))
