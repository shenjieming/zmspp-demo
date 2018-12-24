import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Badge } from 'antd'
import { segmentation } from '../../utils'
import { INVITE_TYPE } from '../../utils/constant'
import RowTable from './index'

const defaultRows = [{
  title: '物料名称',
  dataIndex: 'materialsName',
}, {
  title: '通用名称',
  dataIndex: 'materialsCommenName',
}, {
  title: '注册证号',
  dataIndex: 'certificateNo',
}, {
  title: '生产厂家',
  dataIndex: 'factoryName',
}, {
  title: '规格',
  dataIndex: 'materialsSku',
}, {
  title: '单位',
  dataIndex: 'materialsUnitText',
}, {
  title: '品牌',
  dataIndex: 'brandName',
}, {
  title: '招标信息',
  dataIndex: 'inviteType',
  render: (text, { inviteNo }) => segmentation([INVITE_TYPE[text], inviteNo], '：'),
}, {
  title: '单价',
  dataIndex: 'price',
}, {
  title: '状态',
  dataIndex: 'pscStatus',
  render: text => ({ 1: '使用中', 2: '已停用' }[text]),
}]

const defaultTitleRender = (dataItem) => {
  const { historyId, lastEditName, reviewName, lastEditTime } = dataItem
  return (
    <div>
      <p>版本号：{historyId}</p>
      <p>{segmentation({
        [`修改人：${lastEditName}`]: lastEditName,
        [`审核人：${reviewName}`]: reviewName,
      }, '，')}</p>
      <p>{lastEditTime}</p>
    </div>
  )
}

const propTypes = {
  compareModalVisible: PropTypes.bool,
  loading: PropTypes.bool,
  versionDoubleList: PropTypes.array,
  dataSource: PropTypes.array,
  rows: PropTypes.array,
  onCancel: PropTypes.func,
  titleRender: PropTypes.func,
  title: PropTypes.string,
  zIndex: PropTypes.number,
  footer: PropTypes.array,
  alertInfo: PropTypes.func,
}

function ModalCompare({
  dataSource,
  compareModalVisible,
  onCancel,
  loading,
  rows,
  titleRender,
  title,
  zIndex = 1001,
  footer,
  alertInfo,
}) {
  const modalOpts = {
    title: title || (dataSource.length > 1 ? '版本对比' : '版本详情'),
    visible: compareModalVisible,
    onCancel,
    width: dataSource.length ? 120 + (dataSource.length * 400) : 520,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    footer: footer || null,
    zIndex,
  }

  const isEquality = itemData =>
    Object.entries(itemData)
      .map(_ => _[1])
      .filter((itm, idx) => idx)
      .every((itm, idx, self) => (!!self[0] + !!itm === 0) || itm === self[0])

  const tableProps = {
    rows: rows || defaultRows,
    dataSource,
    loading,
    titleRender: titleRender || defaultTitleRender,
    columns: [{
      width: 110,
      render: (text, all) => {
        if (isEquality(all)) {
          return <Badge status="1" text={text} />
        }
        return <Badge status="error" text={text} />
      },
    }],
    tableProps: {
      rowClassName(all) {
        return isEquality(all) ? '' : 'aek-bg-difference'
      },
    },
  }

  return (
    <Modal {...modalOpts}>
      {alertInfo ? alertInfo() : undefined }
      <RowTable {...tableProps} />
    </Modal>
  )
}
ModalCompare.propTypes = propTypes
export default ModalCompare
