import React from 'react'
import PropTypes from 'prop-types'
import PDF from '../../../components/LkcLightBox/pdf'
import { connect } from 'dva'
import { Table, Input, Select, Button, message, Modal } from 'antd'
import { debounce } from 'lodash'
import { getBasicFn } from '../../../utils/index'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import PhotoWall from '../../../components/PhotoWall'
import Addcertificate from './addCertificate'
import LkcLightBox from '../../../components/LkcLightBox'
import Styles from './detail.less'

const confirm = Modal.confirm
const namespace = 'registContrastDetail'
const Option = Select.Option
const propTypes = {
  registContrastDetail: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
function RegistDetail({ registContrastDetail, loading, dispatch }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchData,
    pagination,
    compareRegistDetail,
    compareRegistList,
    addModalVisible,
    certSortShow,
    timeIsOffReQuire,
    longStatus,
    certIsOff,
    delayIsOff,
    proxyIsOff,
    produceList, // 标准生产企业列表
    suppProList, // 新证号异步补全列表
    newCertList, // 新证书里异步列表
    fileEndDate,
    supplierCertificateId, // 供应商注册证id
    standardCertificateId, // 标准注册证Id
  } = registContrastDetail
  const defaultRows = [
    {
      title: '注册证号',
      dataIndex: 'certificateNo',
    },
    {
      title: '注册证产品名称',
      dataIndex: 'productName',
    },
    {
      title: '厂家',
      dataIndex: 'produceFactoryName',
    },
    {
      title: '开始日期',
      dataIndex: 'validDateStart',
    },
    {
      title: '结束日期',
      dataIndex: 'validDateEnd',
    },
    {
      title: '总代',
      dataIndex: 'agentSupplierName',
    },
    {
      title: '图片',
      dataIndex: 'certificateImageUrls',
      render(value) {
        if (value) {
          return <PhotoWall urls={`${value}`} />
        }
        return ''
      },
    },
  ]
  // 确认对照
  function showConfirm() {
    confirm({
      title: '确认对照吗？',
      onOk() {
        dispatchAction({
          type: 'saveRegist',
          payload: {
            supplierCertificateId,
            standardCertificateId,
          },
        })
      },
    })
  }
  // 对照表格columns
  const getColumns = () => [
    {
      title: '字段',
      dataIndex: 'title',
      key: 'title',
      className: 'aek-bg-columns',
    },
    {
      title: '待对照数据',
      dataIndex: 'contrast',
      key: 'contrast',
      className: 'aek-text-center',
    },
    {
      title: '选择的标准数据',
      dataIndex: 'standard',
      key: 'standard',
      className: 'aek-text-center',
    },
  ]
  // 对照表格dataSource
  const getDatasource = () => {
    const reqArr = []
    const {
      standardRegisterCertificate = {},
      supplierRegisterCertificate = {},
    } = compareRegistDetail
    for (const obj of defaultRows) {
      const reqObj = {}
      reqObj.title = obj.title
      const render = obj.render || (_ => _)
      if (standardRegisterCertificate && standardRegisterCertificate.validDateLongFlag) {
        standardRegisterCertificate.validDateEnd = '长期有效'
      }
      if (supplierRegisterCertificate && supplierRegisterCertificate.validDateLongFlag) {
        supplierRegisterCertificate.validDateEnd = '长期有效'
      }
      reqObj.contrast = render(
        supplierRegisterCertificate ? supplierRegisterCertificate[obj.dataIndex] : undefined,
      )
      reqObj.standard = render(
        standardRegisterCertificate ? standardRegisterCertificate[obj.dataIndex] : undefined,
      )
      reqArr.push(reqObj)
    }
    return reqArr
  }
  const compaerTablePorps = {
    columns: getColumns(),
    dataSource: getDatasource(),
    loading: getLoading(['getRegistDetail']),
    pagination: false,
    bordered: true,
    rowKey: (record, idx) => idx,
  }
  // 候选列表搜索条件
  const searchFilterProps = {
    components: [
      {
        field: 'certificateNo',
        component: <Input placeholder="注册证号" />,
      },
      {
        field: 'keywords',
        component: <Input placeholder="厂家/总代" />,
        options: {
          initialValue: null,
        },
      },
      {
        field: 'certificateType',
        component: (
          <Select optionLabelProp="title">
            <Option value={'1'} title="证件：注册证">
              注册证
            </Option>
            <Option value={'2'} title="证件：备案证">
              备案证
            </Option>
            <Option value={'3'} title="证件：消毒证">
              消毒证
            </Option>
          </Select>
        ),
        options: {
          initialValue: searchData.certificateType || '1',
        },
      },
      {
        field: 'productName',
        component: <Input placeholder="注册证产品名称" />,
      },
    ],
    onSearch: (value) => {
      dispatch({
        type: 'registContrastDetail/getCompaerRegist',
        payload: {
          ...searchData,
          ...value,
          certificateNo: value.certificateNo !== '' ? value.certificateNo : null,
          keywords: value.keywords !== '' ? value.keywords : null,
          productName: value.productName !== '' ? value.productName : null,
          current: 1,
          pageSize: searchData.pageSize || 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'certificateNo',
      dataIndex: 'certificateNo',
      title: '证号/产品名称',
      render: (value, record) => (
        <div>
          <p>{value}</p>
          <p className="aek-text-disable">{record.productName}</p>
        </div>
      ),
    },
    {
      key: 'produceFactoryName',
      dataIndex: 'produceFactoryName',
      title: '厂家/有效期',
      render: (value, record) => (
        <div>
          <p>{value}</p>
          <p>
            {record.validDateStart}至{record.validDateLongFlag ? '长期有效' : record.validDateEnd}
          </p>
        </div>
      ),
    },
  ]
  // 标准注册证列表
  const compareListProps = {
    columns,
    dataSource: compareRegistList,
    pagination,
    bordered: true,
    onChange(page) {
      dispatch({
        type: 'registContrastDetail/getCompaerRegist',
        payload: {
          ...searchData,
          ...page,
        },
      })
    },
    loading: getLoading(['getCompaerRegist']),
    rowKey: 'certificateId',
    onRowClick(record) {
      dispatch({
        type: 'registContrastDetail/updateState',
        payload: {
          compareRegistDetail: {
            ...compareRegistDetail,
            standardRegisterCertificate: {
              ...record,
            },
          },
          standardCertificateId: record.certificateId,
        },
      })
    },
    rowClassName(record) {
      if (record.certificateId === standardCertificateId) {
        return 'aek-tr-selecterd'
      }
      return ''
    },
  }
  // 获取厂家
  const onSearchProListDelay = debounce((val) => {
    dispatchAction({
      type: 'getProduceFacList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 获取总代
  const onSearchProxyFacListDelay = debounce((val) => {
    dispatchAction({
      type: 'getAllProList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 获取新证号
  const onSearchNewCertListDelays = debounce((val) => {
    dispatchAction({
      type: 'getNewCertList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  const addProps = {
    onSearchProList: onSearchProListDelay,
    onSearchProxyFacList: onSearchProxyFacListDelay,
    onSearchNewCertList: onSearchNewCertListDelays,
    currentItem: compareRegistDetail.supplierRegisterCertificate,
    certSortShow,
    timeIsOffReQuire,
    longStatus,
    certIsOff,
    delayIsOff,
    proxyIsOff,
    produceList,
    suppProList,
    newCertList,
    fileEndDate,
    dispatchAction,
    addModalVisible,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className={`full-content ${Styles.content}`} style={{ padding: 0 }}>
        <div className={Styles['aek-shadow']}>
          <div className="aek-border-bottom">对照</div>
          <div className="aek-pt20">
            <Table {...compaerTablePorps} />
          </div>
          <div className="aek-mt30">
            <Button
              type="primary"
              style={{ float: 'left', marginRight: '20px' }}
              onClick={() => {
                if (!standardCertificateId) {
                  message.error('请选择标准证件')
                  return
                }
                showConfirm()
              }}
            >
              确认对照
            </Button>
            <Button
              style={{ float: 'left' }}
              onClick={() => {
                dispatch({
                  type: 'registContrastDetail/getAddRegistDetail',
                  payload: {
                    supplierCertificateId,
                  },
                })
              }}
            >
              新增注册证
            </Button>
          </div>
        </div>
        <div>
          <div className="aek-border-bottom">候选列表</div>
          <div className="aek-pt20">
            <SearchFormFilter {...searchFilterProps} />
          </div>
          <div>
            <Table {...compareListProps} />
          </div>
        </div>
      </div>
      <Addcertificate {...addProps} />
    </div>
  )
}
RegistDetail.propTypes = propTypes
export default connect(({ registContrastDetail, loading }) => ({ registContrastDetail, loading }))(
  RegistDetail,
)
