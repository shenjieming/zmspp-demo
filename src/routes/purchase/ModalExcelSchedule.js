import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd'
import BadgeTextWrap from '../../components/BadgeTextWrap'
import { getPagination } from '../../utils'
import { IMG_ORIGINAL } from '../../utils/config'
// import
const propTypes = {
  scheduleList: PropTypes.array,
  excelPageConfig: PropTypes.object,
  toAction: PropTypes.func,
  loading: PropTypes.bool,
  scheduleModalVisible: PropTypes.bool,
}
const ScheduleModal = (
  {
    scheduleList,
    excelPageConfig,
    loading,
    toAction,
    scheduleModalVisible,
  }) => {
  const modalOpts = {
    title: '导入进度',
    visible: scheduleModalVisible,
    // afterClose: resetFields,
    footer: false,
    onCancel() {
      toAction({ scheduleModalVisible: false })
    },
    width: 1000,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 200,
      render: text => (
        <div className="aek-text-overflow" title={text} style={{ width: 200 }}>
          {text}
        </div>
      ),
    }, {
      title: '上传人',
      dataIndex: 'operator',
      key: 'operator',
    }, {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    }, {
      title: '耗时/秒',
      dataIndex: 'duration',
      key: 'duration',
    }, {
      title: '处理状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      width: 450,
      render: (text, record) => {
        // 1-待处理 2-处理中 3-完成 4-失败
        const {
          successCount,
          failCount,
          filePathBase,
          filePathFail,
          exception,
        } = record
        if (text === 1) {
          // return <span>待处理</span>
          return <BadgeTextWrap status="processing" text="待处理" />
        } else if (text === 2) {
          return <BadgeTextWrap status="warning" text="处理中" />
        } else if (text === 3) {
          // 完成
          if (!failCount) {
            return (
              <BadgeTextWrap status="success" text={`已成功导入${successCount}条数据，失败0条`} />
            )
          }
          return (
            <p>
              <BadgeTextWrap
                status="error"
                text="已成功导入"
              />
              <span>
                {successCount}条数据，失败{failCount}条，<a href={`${IMG_ORIGINAL}${filePathFail}`}>点这里下载</a>电子表格查看具体原因，修改后再导入
              </span>
            </p>
          )
        }
        return <BadgeTextWrap status="error" text={`处理失败, ${exception}`} />
      },
    },
  ]
  const tableParam = {
    loading,
    columns,
    dataSource: scheduleList,
    pagination: getPagination((current, pageSize) => {
      toAction({ current, pageSize }, 'excelSchedule')
    }, excelPageConfig),
    rowKey: 'taskId',
  }
  return (
    <Modal {...modalOpts}>
      <Table bordered {...tableParam} />
    </Modal>
  )
}
ScheduleModal.propTypes = propTypes

export default ScheduleModal
