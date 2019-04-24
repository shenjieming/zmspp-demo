import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import PropTypes from 'prop-types'
import { Input, Table, Tabs, Row, Col, Button, message, Modal, Spin } from 'antd'
import { trim, isEmpty } from 'lodash'
import Styles from './index.less'

import { getBasicFn, getPagination, getTabName } from '../../../utils'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'
import { tableColumns } from './data'
import RefusedModal from '../share/refusedModal/refusedModal'
import ViewModal from '../share/viewModal/ViewModal'

const confirm = Modal.confirm

const propTypes = {
  newCertificateAuditZZ: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'newCertificateAuditZZ'
const CertificatePush = ({ newCertificateAuditZZ, loading }) => {
  const {
    tabType,
    reviewSearchData,
    refusedSearchData,
    data,
    pagination,
    customerList,
    selectedRowKeys,
    selectedCustomer,
    detailModalVisible,
    refusedReasonVisible,
    refusedReasonList,
    keywords,
    customerNo,
    certificateDetail,
    selectedRowData,
  } = newCertificateAuditZZ
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const searchHandlder = (value) => {
    if (value.supplierOrgId && Object.keys(value.supplierOrgId).length) {
      value.supplierOrgId = value.supplierOrgId.key
    }
    dispatchAction({
      type: 'getRefusedList',
      payload: {
        ...refusedSearchData,
        ...value,
        current: 1,
        pageSize: 10,
      },
    })
  }
  const searhProps = {
    initialValues: refusedSearchData,
    formData: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'supplierOrgId',
        width: 220,
        component: {
          name: 'LkcSelect',
          props: {
            url: '/contacts/option/suppliers',
            optionConfig: { idStr: 'supplierOrgId', nameStr: 'supplierOrgName' },
            placeholder: '输入供应商名称检索',
          },
        },
        options: {
          initialValue: undefined,
        },
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 220,
        options: {
          initialValue: undefined,
        },
        component: <Input placeholder="请输入注册证号或产品名称" />,
      },
    ],
    onSearch: searchHandlder,
  }

  // 客户列表
  const List = ({ dataSource = [] }) => {
    const handleClick = (items) => {
      // 若是相同不进行多余操作
      if (items.supplierOrgId === selectedCustomer.supplierOrgId) {
        return
      }
      // 更改当前选择供应商
      dispatchAction({
        type: 'updateState',
        payload: {
          selectedCustomer: {
            supplierOrgId: items.supplierOrgId,
            supplierOrgName: items.supplierOrgName,
          },
        },
      })
      dispatchAction({
        type: 'getCustomerDetail',
        payload: {
          supplierOrgId: items.supplierOrgId,
        },
      })
      dispatchAction({
        type: 'getReviewList',
        payload: {
          supplierOrgId: items.supplierOrgId,
        },
      })
      dispatchAction({
        type: 'getCustomerNo',
      })
    }
    const retList = dataSource.map((item) => {
      let active = ''
      if (item.supplierOrgId === selectedCustomer.supplierOrgId) {
        active = Styles['aek-li-active']
      }
      return (
        <li className={`${Styles['aek-li']} ${active}`} key={item.supplierOrgId}>
          <a
            onClick={() => {
              handleClick(item)
            }}
          >
            {item.supplierOrgName}
          </a>
        </li>
      )
    })
    return (
      <Spin spinning={getLoading('getCustomerDetail')}>
        <ul>{retList || (<li className={`${Styles['aek-li']}`}>没有待审核的注册证</li>)}</ul>
      </Spin>
    )
  }
  List.propTypes = {
    dataSource: PropTypes.array,
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    let url = 'getReviewList'
    let reqData = reviewSearchData
    if (tabType === 'refused') {
      url = 'getRefusedList'
      reqData = refusedSearchData
    }
    dispatchAction({
      payload: {
        selectedRowKeys: [],
      },
    })
    dispatchAction({
      type: url,
      payload: {
        ...reqData,
        current,
        pageSize,
      },
    })
  }
  // 审核事件
  const handleReview = (type, item) => {
    dispatchAction({
      payload: {
        selectedRowData: item,
      },
    })
    dispatchAction({
      payload: {
        detailModalVisible: true,
      },
    })
    // 审核
    dispatchAction({
      type: 'getCertificateDetail',
      payload: {
        id: item.id,
      },
    })
  }
  // 表格参数
  const tableProps = {
    bordered: true,
    rowKey: 'certificateId',
    loading: getLoading('getCustomerDetail', 'getReviewList', 'getRefusedList'),
    columns: tableColumns(tabType, handleReview),
    pagination: getPagination(pageChange, pagination),
    dataSource: data,
  }

  function showConfirm(type, handleOk) {
    confirm({
      title: type === 'refused' ? '确定要批量拒绝吗？' : '确定要批量通过吗？',
      onOk() {
        handleOk()
      },
    })
  }
// 搜索的search客户列表
  let searchCustomerList = []

  if (customerList && customerList.length) {
    const arr = []
    customerList.forEach((item) => {
      if (
        item.supplierOrgName.indexOf(keywords) > -1 ||
        item.supplierOrgNameHelper.toLowerCase().indexOf(keywords) > -1
      ) {
        arr.push(item)
      }
    })
    searchCustomerList = arr
  }
  const callback = () => {
    dispatchAction({
      type: 'getCustomerNo',
    })
    let url = ''
    let payload = {}
    if (tabType === 'review') {
      url = 'getReviewList'
      payload = {
        ...reviewSearchData,
        supplierOrgId: selectedCustomer.supplierOrgId,
      }
    } else {
      url = 'getRefusedList'
      payload = {
        ...refusedSearchData,
      }
    }
    dispatchAction({
      payload: {
        detailModalVisible: false,
        refusedReasonVisible: false,
      },
    })
    dispatchAction({
      type: url,
      payload,
    })
  }
  // 批量操作 type:操作类型 refused批量拒绝 否则批量通过
  const handleBatchClick = (type) => {
    if (selectedRowKeys && selectedRowKeys.length) {
      if (type && type === 'refused') {
        showConfirm(type, () => {
          dispatchAction({
            payload: {
              refusedReasonVisible: true,
            },
          })
          dispatchAction({
            type: 'getRefusedReason',
            payload: {
              dicKey: 'REFUSEREASON',
            },
          })
        })
        return
      }
      showConfirm(type, () => {
        dispatchAction({
          type: 'setPast',
          payload: {
            certificateIds: selectedRowKeys,
            supplierOrgId: selectedCustomer.supplierOrgId,
            certificatePlace: '',
            callback,
          },
        })
      })
      return
    }
    message.error('请勾选需要通过的证件')
  }
  let content = ''
  if (tabType === 'review') {
    tableProps.rowSelection = {
      selectedRowKeys,
      onChange(keys) {
        console.log(keys)
        dispatchAction({
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    }
    if (searchCustomerList.length) {
      content = (
        <div>
          <Row className={Styles['aek-content']}>
            <Col span="18">
              <div className={Styles['aek-content-block']}>
                <p className="aek-text-bold">{selectedCustomer.supplierOrgName}</p>
                <p className="aek-text-help aek-mt10">
                  {`${selectedCustomer.contactName || ''}-${selectedCustomer.contactPhone || ''}`}
                </p>
              </div>
            </Col>
            <Col span="6">
              <Link
                target="_blank"
                to={`/contacts/mySupplier/detail/${selectedCustomer.supplierOrgId}?status=1`}
              >
                <Button size="large">查看供应商信息</Button>
              </Link>
            </Col>
          </Row>
          <div className="aek-mt20">
            <Row>
              <Col span="18">
                <Button
                  type="primary"
                  className="aek-mr10"
                  onClick={() => {
                    handleBatchClick()
                  }}
                >
                  批量接收
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handleBatchClick('refused')
                  }}
                >
                  批量拒绝
                </Button>
              </Col>
              <Col span="6">
                <Input.Search
                  defaultValue={reviewSearchData.keywords || ''}
                  placeholder="请输入注册证号或注册产品名称"
                  onSearch={(value) => {
                    dispatchAction({
                      type: 'getReviewList',
                      payload: {
                        ...reviewSearchData,
                        keywords: value,
                        current: 1,
                        pageSize: 10,
                      },
                    })
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      )
    } else {
      content = (
        <div>
          <Row className={Styles['aek-content']}>
          </Row>
          <div className="aek-mt20">
            <Row>
              <Col span="18">
                <Button
                  type="primary"
                  className="aek-mr10"
                  onClick={() => {
                    handleBatchClick()
                  }}
                >
                  批量接收
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    handleBatchClick('refused')
                  }}
                >
                  批量拒绝
                </Button>
              </Col>
              <Col span="6">
                <Input.Search
                  defaultValue={reviewSearchData.keywords || ''}
                  placeholder="请输入注册证号或注册产品名称"
                  onSearch={(value) => {
                    dispatchAction({
                      type: 'getReviewList',
                      payload: {
                        ...reviewSearchData,
                        keywords: value,
                        current: 1,
                        pageSize: 10,
                      },
                    })
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      )
    }
  } else if (tabType === 'refused') {
    if (tableProps.rowSelection && Object.keys(tableProps.rowSelection).length) {
      delete tableProps.rowSelection
    }
    content = <SearchForm {...searhProps} />
  }
  // tab页
  const tabChange = (key) => {
    dispatchAction({
      payload: {
        tabType: key,
        reviewSearchData: {},
        refusedSearchData: {},
        selectedRowKeys: [],
        selectedRowData: {},
        selectedCustomer: {},
        keywords: '',
        data: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: undefined,
        },
      },
    })
    let url = 'getRefusedList'
    let payload = refusedSearchData
    if (key === 'review') {
      url = 'getCustomerList'
      payload = {
        certificateStatus: 1,
      }
    }
    dispatchAction({
      type: url,
      payload,
    })
  }

  // 拒绝原因弹框
  const refusedProps = {
    loading: getLoading('getRefusedReason', 'setRefused'),
    handleCancel() {
      dispatchAction({
        payload: {
          refusedReasonVisible: false,
        },
      })
    },
    handleOk(value) {
      dispatchAction({
        type: 'setRefused',
        payload: {
          supplierOrgId: selectedCustomer.supplierOrgId || selectedRowData.supplierOrgId,
          reason: value.refuseReason || '未填写原因',
          certificateIds: isEmpty(selectedRowData)
            ? selectedRowKeys
            : [selectedRowData.certificateId],
          callback,
        },
      })
    },
    refusedReasonVisible,
    refusedReasonList,
  }
  // 审核弹框
  const viewModalProps = {
    viewType: 'approve',
    visible: detailModalVisible,
    certificateList: certificateDetail.certificates || [],
    refuseReason: certificateDetail.refuseReason,
    certificateNo: selectedRowData.certificateNo,
    productName: selectedRowData.productName,
    certificatePlace: certificateDetail.certificatePlace,
    loading: getLoading('getCertificateDetail', 'setPast'),
    approveHandler(position) {
      // 通过事件
      dispatchAction({
        type: 'setPast',
        payload: {
          supplierOrgId: selectedCustomer.supplierOrgId || selectedRowData.supplierOrgId,
          certificateIds: [selectedRowData.certificateId],
          certificatePlace: position,
          callback,
        },
      })
    },
    refuseHandler() {
      // 拒绝事件
      dispatchAction({
        payload: {
          refusedReasonVisible: true,
        },
      })
      dispatchAction({
        type: 'getRefusedReason',
        payload: {
          dicKey: 'REFUSEREASON',
        },
      })
    },
    onCancel() {
      dispatchAction({
        payload: {
          detailModalVisible: false,
          selectedRowData: {}, // 关闭需将其置空，否则拒绝时不知道取selectedRowData还是selectedRowKeys
        },
      })
    },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <div className="aek-layout-hor">
          <div>
            <Tabs defaultActiveKey={tabType} onChange={tabChange}>
              <Tabs.TabPane
                tab={getTabName('待审核', customerNo.pendingReviewNumber || '')}
                key="review"
              />
              <Tabs.TabPane
                tab={getTabName('已拒绝', customerNo.refusedNumber || '')}
                key="refused"
              />
            </Tabs>
          </div>
          {tabType === 'review' ?
            <div className="left">
              <Input.Search
                placeholder="请输入供应商名称搜索"
                onChange={(e) => {
                  dispatchAction({
                    payload: {
                      keywords: trim(e.target.value),
                    },
                  })
                }}
                className="aek-mb10"
                style={{ width: 280 }}
              />
              <List dataSource={searchCustomerList} />
            </div> : undefined
          }
          {
            tabType === 'review' ? (<div className="right aek-pl10">
              {content}
              <Table style={{ marginBottom: '40px' }} className="aek-mt10" {...tableProps} />
            </div>) : (<div className="right" style={{ width: '100%' }}>
              {content}
              <Table style={{ marginBottom: '40px' }} className="aek-mt10" {...tableProps} />
            </div>)
          }
        </div>
      </div>
      {/* 拒绝原因弹框 */}
      <RefusedModal {...refusedProps} />
      {/* 审核弹框 */}
      <ViewModal {...viewModalProps} />
    </div>
  )
}

CertificatePush.propTypes = propTypes
export default connect(({ newCertificateAuditZZ, loading }) => ({ newCertificateAuditZZ, loading }))(
  CertificatePush,
)
