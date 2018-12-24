import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Table, Form } from 'antd'
import SearchFormFilter from '../../../components/SearchFormFilter'
import GetFormItem from '../../../components/GetFormItem'
import { modalFormData, applyFormData } from './data'

const propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  onSearch: PropTypes.func,
  onCancel: PropTypes.func,
  applyList: PropTypes.array,
  modalTableColumns: PropTypes.array,
  addressList: PropTypes.array,
  applyModalProps: PropTypes.object,
  form: PropTypes.object,
}

const ModalForm = ({
  visible,
  onCancel,
  loading,
  confirmLoading,
  onSearch,
  applyModalProps,
  addressList = [],
  applyList = [],
  modalTableColumns = [],
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
}) => {
  const modalOpts = {
    title: '添加供应商',
    visible,
    onCancel,
    confirmLoading,
    wrapClassName: 'aek-modal',
    footer: null,
    maskClosable: false,
    width: 600,
  }
  const applyProps = {
    ...applyModalProps,
    afterClose: resetFields,
    onOk() {
      validateFieldsAndScroll((errors, value) => {
        if (!errors) {
          applyModalProps.toApply(value)
        }
      })
    },
  }
  delete applyProps.toApply
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <div style={{ borderBottom: '1px solid #E2DADE', height: 60 }}>
          <SearchFormFilter
            formData={modalFormData(addressList)}
            onSearch={onSearch}
          />
        </div>
        <Table
          showHeader={false}
          pagination={false}
          dataSource={applyList}
          columns={modalTableColumns}
          rowClassName={() => 'table-row-hover'}
          rowKey="orgId"
        />
      </Spin>
      <Modal {...applyProps}>
        <Form>
          <GetFormItem
            formData={applyFormData}
          />
        </Form>
      </Modal>
    </Modal>
  )
}

ModalForm.propTypes = propTypes

export default (Form.create()(ModalForm))
