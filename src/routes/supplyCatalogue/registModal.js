import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, Row, Col, Table, Alert } from 'antd'

const Search = Input.Search
const RegistModal = ({
  effects,
  dispatch,
  registVisible, // 绑定注册证弹框
  registList, // 注册证列表
  selectedRowKeys,
  registPagitantion,
  registSearchData,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const addModalProp = {
    title: '绑定注册证',
    visible: registVisible,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    width: 600,
    onCancel() {
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { registVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    footer: null,
  }
  const handleSubmit = (value) => {
    dispatch({
      type: 'supplyCatalogueDetail/getRegistList',
      payload: {
        keywords: value,
        current: 1,
        pageSize: 5,
      },
    })
  }
  // 条码列表
  const columns = [
    {
      key: 'certificateNo',
      dataIndex: 'certificateNo',
      title: '注册证',
      render: (value, record) => (
        <div>
          <p style={{ fontWeight: 100 }}>{value}</p>
          <p className="aek-text-help">{record.productName}</p>
        </div>
      ),
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      className: 'aek-text-center',
      width: 50,
      render: (value, record) => (<a
        onClick={() => {
          dispatch({
            type: 'supplyCatalogueDetail/registSubmit',
            payload: {
              pscIds: selectedRowKeys.join(),
              ...record,
            },
          })
        }}
      >选择</a>),
    },
  ]
  // 翻页
  const handlePagination = (paginaeion) => {
    dispatch({
      type: 'supplyCatalogueDetail/getRegistList',
      payload: {
        ...registSearchData,
        ...paginaeion,
      },
    })
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['supplyCatalogueDetail/registSubmit'] || !!effects['supplyCatalogueDetail/getRegistList']}>
        <Alert
          message="只有通过平台审核的的注册证才可以绑定注册证，如果找不到注册证，请先前往“证件档案>我的证件>注册证”中查看是否添加了注册证，并且已经通过了平台审核"
          type="info"
          showIcon
          className="aek-mb10"
        />
        <Row>
          <Col span="24">
            <Search placeholder="输入注册证号或产品名称检索" onSearch={handleSubmit} />
          </Col>
        </Row>
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          pagination={registPagitantion}
          dataSource={registList}
          rowKey="certificateId"
          showHeader={false}
          onChange={handlePagination}
        />
      </Spin>
    </Modal>
  )
}
RegistModal.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  registVisible: PropTypes.bool,
  registList: PropTypes.array,
  selectedRowKeys: PropTypes.array,
  registPagitantion: PropTypes.object,
  registSearchData: PropTypes.object,
}
export default Form.create()(RegistModal)
