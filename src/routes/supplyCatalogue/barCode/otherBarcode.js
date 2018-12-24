import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Button, Table } from 'antd'

const OtherBarCode = ({
  effects,
  dispatch,
  otherCodeVisible,
  otherCodeList,
  rowSelectData,
}) => {
  const addModalProp = {
    title: '条码绑定的物资',
    visible: otherCodeVisible,
    wrapClassName: 'aek-modal',
    width: 550,
    maskClosable: false,
    footer: null,
    zIndex: 1100,
    onCancel() {
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { otherCodeVisible: false } })
    },
  }
  // 条码列表
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      className: 'aek-text-center',
      width: 50,
      render: (value, record, index) => index + 1,
    },
    {
      key: 'materialsName',
      dataIndex: 'materialsName',
      title: '物资名称',
    },
    {
      key: 'materialsUnitText',
      dataIndex: 'materialsUnitText',
      title: '单位/规格型号',
      render: (value, record) => <span>{value}/{record.materialsSku}</span>,
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      className: 'aek-text-center',
      render: (value, record, index) => (<Button
        value={record.barcode}
        size="small"
        loading={rowSelectData.barcode === record.barcode && !!effects['supplyCatalogueDetail/delSkuBarcode']}
        onClick={() => {
          dispatch({
            type: 'supplyCatalogueDetail/delSkuBarcode',
            payload: {
              pscId: record.pscId,
              materialsSkuBarcode: record.materialsSkuBarcode,
              index,
            },
          }).then(() => {
            dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { otherCodeVisible: false } })
          })
        }}
      >删除</Button>),
    },
  ]
  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['supplyCatalogueDetail/delSkuBarcode']}>
        <p className="aek-mtb10">该条码绑定的物资如下</p>
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          pagination={false}
          dataSource={otherCodeList}
          rowKey="barcode"
        />
      </Spin>
    </Modal>
  )
}
OtherBarCode.propTypes = {
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  otherCodeVisible: PropTypes.bool,
  otherCodeList: PropTypes.array,
  rowSelectData: PropTypes.object,
  customerId: PropTypes.any,
}
export default OtherBarCode
