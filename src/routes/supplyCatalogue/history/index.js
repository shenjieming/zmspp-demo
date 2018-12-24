import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Spin, Alert, Badge } from 'antd'

const HistoryModal = ({
  dispatch,
  effects,
  historyVisible, // 查看历史列表modal
  historyList, // 历史列表数据
  historyPagiantion, // 历史列表分页
  historySelected, // 选中需要对比的历史版本
  compareVisible, // 历史对比
  compareList, // 历史对比数据
  singleCompareVisible, // 单条历史
  singleCompareList, // 单条历史数据
  rowSelectData, // 所选行数据
}) => {
  // 历史列表
  const modalOpts = {
    title: '修改历史',
    visible: historyVisible,
    onCancel() {
      dispatch({
        type: 'supplyCatalogueDetail/updateState',
        payload: {
          historyVisible: false,
          historySelected: [],
        },
      })
    },
    width: 700,
    footer: (
      <Button
        disabled={historySelected.length !== 2}
        type="primary"
        onClick={() => {
          dispatch({
            type: 'supplyCatalogueDetail/getCompareHistory',
            payload: {
              id: historySelected[0],
              comparaId: historySelected[1],
              compareVisible: true,
            },
          })
        }}
      >
        版本对比
      </Button>
    ),
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const onPageChange = (page) => {
    dispatch({
      type: 'supplyCatalogueDetail/getHistoryList',
      payload: {
        pscId: rowSelectData.pscId,
        ...page,
      },
    })
  }
  const columns = [
    {
      title: '版本号',
      dataIndex: 'historyId',
      key: 'historyId',
    },
    {
      title: '修改时间',
      dataIndex: 'lastEditTime',
      key: 'lastEditTime',
    },
    {
      title: '修改人',
      dataIndex: 'lastEditName',
      key: 'lastEditName',
      render: (value, record) => <span>{`${record.orgName}-${value}`}</span>,
    },
    {
      title: '审核人',
      dataIndex: 'reviewName',
      key: 'reviewName',
      render: (value, record) => <span>{`${record.orgName}-${value}`}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      className: 'aek-text-center',
      render: (text, record) => (
        <a
          onClick={() => {
            dispatch({
              type: 'supplyCatalogueDetail/getSingleCompareHistory',
              payload: {
                id: record.id,
              },
            })
          }}
        >
          查看
        </a>
      ),
    },
  ]
  const tableParam = {
    rowSelection: {
      onChange: (selectedRowKeys) => {
        dispatch({
          type: 'supplyCatalogueDetail/updateState',
          payload: {
            historySelected: selectedRowKeys.slice(-2),
          },
        })
      },
      selectedRowKeys: historySelected,
    },
    columns,
    dataSource: historyList,
    onChange: onPageChange,
    pagination: historyPagiantion,
    rowKey: 'id',
  }
  // 历史版本对比
  const compareProps = {
    title: '版本对比',
    visible: compareVisible,
    onCancel() {
      dispatch({
        type: 'supplyCatalogueDetail/updateState',
        payload: {
          compareVisible: false,
        },
      })
    },
    width: 1050,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    footer: (
      <Button
        onClick={() => {
          dispatch({
            type: 'supplyCatalogueDetail/updateState',
            payload: {
              compareVisible: false,
            },
          })
        }}
      >
        关闭
      </Button>
    ),
  }
  const { first, comparaInfo } = compareList // 历史对比数据
  const retInvite = (obj) => {
    let invite = ''
    if (obj) {
      if (obj.inviteType === 1) {
        invite = '无'
      } else if (obj.inviteType === 2) {
        invite = `省标：${obj.inviteNo}`
      } else if (obj.inviteType === 3) {
        invite = `市标：${obj.inviteNo}`
      } else if (obj.inviteType === 4) {
        invite = `院标：${obj.inviteNo}`
      }
    }
    return invite
  }
  const compareSource = [
    {
      first: '物料名称',
      second: first.materialsName,
      third: comparaInfo.materialsName,
    },
    {
      first: '通用名称',
      second: first.materialsCommenName,
      third: comparaInfo.materialsCommenName,
    },
    {
      first: '注册证号',
      second: first.certificateNo,
      third: comparaInfo.certificateNo,
    },
    {
      first: '生产厂家',
      second: first.factoryName,
      third: comparaInfo.factoryName,
    },
    {
      first: '规格',
      second: first.materialsSku,
      third: comparaInfo.materialsSku,
    },
    {
      first: '单位',
      second: first.materialsUnitText,
      third: comparaInfo.materialsUnitText,
    },
    {
      first: '品牌',
      second: first.brandName,
      third: comparaInfo.brandName,
    },
    {
      first: '招标信息',
      second: retInvite(first),
      third: retInvite(comparaInfo),
    },
    {
      first: '单价',
      second: first.price,
      third: comparaInfo.price,
    },
    {
      first: '状态',
      second: first.pscStatus === 1 ? '使用中' : '已停用',
      third: comparaInfo.pscStatus === 1 ? '使用中' : '已停用',
    },
  ]
  const compareColumns = [
    {
      dataIndex: 'first',
      key: 'first',
      title: '字段',
      className: 'aek-bg-columns',
      render(value, record) {
        if (record.second === record.third || !!record.first + !!record.second === 0) {
          return <Badge status="1" text={value} />
        }
        return <Badge status="error" text={value} />
      },
    },
    {
      dataIndex: 'second',
      key: 'second',
      className: 'aek-text-center',
      title: (
        <div>
          <p>版本号:{first.historyId}</p>
          <p>
            修改人:{first.orgName}-{first.lastEditName}
          </p>
          <p>
            审核人:{first.orgName}-{first.reviewName}
          </p>
        </div>
      ),
    },
    {
      dataIndex: 'third',
      key: 'third',
      className: 'aek-text-center',
      title: (
        <div>
          <p>版本号:{comparaInfo.historyId}</p>
          <p>
            修改人:{comparaInfo.orgName}-{comparaInfo.lastEditName}
          </p>
          <p>
            审核人:{comparaInfo.orgName}-{comparaInfo.reviewName}
          </p>
        </div>
      ),
    },
  ]
  // 单条历史
  const singleCompareProps = {
    title: '版本对比',
    visible: singleCompareVisible,
    onCancel() {
      dispatch({
        type: 'supplyCatalogueDetail/updateState',
        payload: {
          singleCompareVisible: false,
        },
      })
    },
    maskClosable: false,
    wrapClassName: 'aek-modal',
    footer: (
      <Button
        onClick={() => {
          dispatch({
            type: 'supplyCatalogueDetail/updateState',
            payload: {
              singleCompareVisible: false,
            },
          })
        }}
      >
        关闭
      </Button>
    ),
  }
  const singleCompareColumns = [
    {
      dataIndex: 'first',
      key: 'first',
      title: '字段',
      className: 'aek-bg-columns',
    },
    {
      dataIndex: 'second',
      key: 'second',
      className: 'aek-text-center',
      title: (
        <div>
          <p>版本号:{singleCompareList.historyId}</p>
          <p>
            修改人:{singleCompareList.orgName}-{singleCompareList.lastEditName}
          </p>
          <p>
            审核人:{singleCompareList.orgName}-{singleCompareList.reviewName}
          </p>
        </div>
      ),
    },
  ]
  const singleCompareSource = [
    {
      first: '物料名称',
      second: singleCompareList.materialsName,
    },
    {
      first: '通用名称',
      second: singleCompareList.materialsCommenName,
    },
    {
      first: '注册证号',
      second: singleCompareList.certificateNo,
    },
    {
      first: '生产厂家',
      second: singleCompareList.factoryName,
    },
    {
      first: '规格',
      second: singleCompareList.materialsSku,
    },
    {
      first: '单位',
      second: singleCompareList.materialsUnitText,
    },
    {
      first: '品牌',
      second: singleCompareList.brandName,
    },
    {
      first: '招标信息',
      second: retInvite(singleCompareList),
    },
    {
      first: '单价',
      second: singleCompareList.price,
    },
    {
      first: '状态',
      second: singleCompareList.pscStatus === 1 ? '使用中' : '已停用',
    },
  ]
  return (
    <div>
      <Modal {...modalOpts}>
        <Spin spinning={!!effects['supplyCatalogueDetail/getHistoryList']}>
          <div className="aek-mb10">
            <Alert message="可选择其中两个版本进行对比" type="info" showIcon />
          </div>
          <Table bordered {...tableParam} className="aek-table-no-allcheck" />
        </Spin>
      </Modal>
      <Modal {...compareProps}>
        <Table
          pagination={false}
          columns={compareColumns}
          dataSource={compareSource}
          rowClassName={record => ((record.first === record.second || !!record.first + !!record.second === 0) ? '' : 'aek-bg-difference')}
        />
      </Modal>
      <Modal {...singleCompareProps}>
        <Table pagination={false} columns={singleCompareColumns} dataSource={singleCompareSource} />
      </Modal>
    </div>
  )
}
HistoryModal.propTypes = {
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  historyVisible: PropTypes.bool, // 查看历史列表modal
  historyList: PropTypes.array, // 历史列表数据
  historyPagiantion: PropTypes.object, // 历史列表分页
  historySelected: PropTypes.array, // 选中需要对比的历史版本
  compareVisible: PropTypes.bool, // 历史对比
  compareList: PropTypes.object, // 历史对比数据
  singleCompareVisible: PropTypes.bool, // 单条历史
  singleCompareList: PropTypes.object, // 单条历史数据
  rowSelectData: PropTypes.object, //
}
export default HistoryModal
