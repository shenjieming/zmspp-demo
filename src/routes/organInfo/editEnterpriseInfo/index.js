import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Form } from 'antd'
import GetFormItem from '@components/GetFormItem'
import { form } from './data'

function Edit({
  dispatch,
  loading,
  orgDetail,
  orgEditVisible,
  addressList,
  form: { validateFields, resetFields },
}) {
  const modalProps = {
    visible: orgEditVisible,
    title: '编辑企业资料',
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'organInfo/updateState',
        payload: {
          orgEditVisible: false,
        },
      })
    },
    onOk() {
      validateFields((error, values) => {
        if (!error) {
          dispatch({
            type: 'organInfo/editOrgDetail',
            payload: {
              ...orgDetail,
              ...values,
            },
          })
        }
      })
    },
    afterClose() {
      resetFields()
    },
  }
  return (
    <Modal {...modalProps} wrapClassName="aek-modal" confirmLoading={loading}>
      <Spin spinning={loading}>
        <Form>
          <GetFormItem formData={form({ dispatch, orgDetail, addressList })} />
        </Form>
      </Spin>
    </Modal>
  )
}

Edit.propTypes = {
  loading: PropTypes.bool,
  dispatch: PropTypes.func,
  form: PropTypes.object,
  orgDetail: PropTypes.object,
  orgEditVisible: PropTypes.bool,
  addressOptions: PropTypes.array,
  addressList: PropTypes.array,
}

export default Form.create()(Edit)
