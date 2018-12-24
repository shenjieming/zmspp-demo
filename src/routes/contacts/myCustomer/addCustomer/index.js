import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, Cascader, Table, Button } from 'antd'
import { FORM_ITEM_LAYOUT } from '../../../../utils/constant'
import SearchFormFilter from '../../../../components/SearchFormFilter'
import CustmTable from '../../../../components/CustmTabelInfo'
import ApplyModal from './applyModl'
import { segmentation } from '../../../../utils'

const FormItem = Form.Item
const AddCustomer = ({
  addCustomerVisible,
  dispatch,
  effects,
  addressList,
  addCustomerList,
  addCustSearchData,
  addCustomerDetail,
  applyVisible,
  customerId,
  applyType,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  // modal 弹框数据
  const addModalProp = {
    title: '添加客户',
    visible: addCustomerVisible,
    width: 600,
    footer: false,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    onCancel() {
      dispatch({ type: 'myCustomer/updateState', payload: { addCustomerVisible: false, addCustSearchData: {} } })
    },
    afterClose() {
      resetFields()
      dispatch({
        type: 'myCustomer/updateState',
        payload: {
          addCustomerVisible: false,
          addCustSearchData: {},
        },
      })
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        dispatch({
          type: 'myCustomer/setCustomerContrast',
          payload: {
            ...values,
          },
        })
      })
    },
  }
  // 搜索条件
  const searchFormProps = {
    components: [{
      field: 'orgRegAddr',
      component: (
        <Cascader options={addressList} placeholder="请选择" />
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'keywords',
      component: (
        <Input placeholder="输入名称、拼音码搜索" />
      ),
      options: {
        initialValue: null,
      },
    }],
    onSearch: (value) => {
      dispatch({
        type: 'myCustomer/getAddCustomerList',
        payload: {
          ...addCustSearchData,
          ...value,
          orgRegAddr: value.orgRegAddr ? value.orgRegAddr.join(',') : '',
        },
      })
    },
  }
  // 表格
  const columns = [
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      render: (value, record) => {
        const data = {
          logoUrl: record.orgLogoUrl,
          orgName: record.orgName,
          address: segmentation([record.address, record.orgRegAddrDetail], ' '),
          to: `/contacts/myCustomer/detail/${record.orgId}?status=3`,
          linkClick() {
            dispatch({
              type: 'myCustomer/updateState',
              payload: {
                editContactVisible: false,
              },
            })
          },
          contactEditClick() {
            dispatch({
              type: 'myCustomer/updateState',
              payload: {
                editContactVisible: true,
                defaultContactObj: record,
              },
            })
          },
        }
        return (
          <CustmTable {...data} />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, record) => {
        if (record.orgRelationStatus === 2) {
          return (<Button
            size="large"
            disabled
          >已申请</Button>)
        } else if (record.orgRelationStatus === 3) {
          return (<Button
            size="large"
            disabled
          >已添加</Button>)
        } else if (record.orgRelationStatus === 1) {
          return (<Button
            size="large"
            type="primary"
            style={{ width: 80 }}
            onClick={() => { dispatch({ type: 'myCustomer/updateState', payload: { applyVisible: true, customerId: record.orgId, applyType: 1 } }) }}
          >申请</Button>
          )
        }
        return null
      },
    },
  ]
  // 申请
  const applyModalProps = {
    dispatch,
    effects,
    applyVisible,
    customerId,
    applyType,
  }
  return (
    <div>
      <Modal {...addModalProp} >
        <Spin spinning={!!effects['myCustomer/getAddCustomerList']}>
          <SearchFormFilter {...searchFormProps} />
          <Table
            showHeader={false}
            pagination={false}
            dataSource={addCustomerList}
            columns={columns}
            rowClassName={() => 'table-row-hover'}
            rowKey="orgId"
          />
        </Spin>
      </Modal>
      <ApplyModal {...applyModalProps} />
    </div>
  )
}
AddCustomer.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  addCustomerVisible: PropTypes.bool,
  addressList: PropTypes.array,
  addCustomerList: PropTypes.array,
  addCustSearchData: PropTypes.object,
  addCustomerDetail: PropTypes.object,
  applyVisible: PropTypes.bool,
  customerId: PropTypes.string,
  applyType: PropTypes.number,
}
export default Form.create()(AddCustomer)
