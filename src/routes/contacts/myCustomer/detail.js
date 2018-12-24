import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Row,
  Col,
  Avatar,
  Icon,
  Carousel,
  Tabs,
  Progress,
  Form,
  Rate,
  Table,
  Select,
  Modal,
} from 'antd'
import { cloneDeep } from 'lodash'
import Bread from '../../../components/Breadcrumb'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import PlainForm from '../../../components/PlainForm'
import Styles from './detail.less'
import ContactsRelation from '../newContactsRelation/carousel'
import ApplyModal from './applyModal'
import { segmentation, rateValue } from '../../../utils'
import { IMG_COMPRESS, IMG_WATERMARK } from '../../../utils/config'
import PDF from '../../../assets/pdf.png'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
function MyCustomerDetail({ myCustomerDetail, effects, dispatch, routes, orgId }) {
  const {
    id, // 我的客户Id
    contactsType, // 是否解除关系  1 是正常 2 是解除关系 3是区分申请过来的转台
    customerDetail = {}, // 我的客户详情
    applyVisible,
    pathTo, // 返回跳转路径
    detailData,
    detailPagination,
    searchData,
    isNewRelation,
  } = myCustomerDetail
  const leftForm = {
    '企业LOGO|fill': <Avatar size="large" src={customerDetail.orgLogoUrl} />,
    '机构名称|fill': customerDetail.orgName,
    '机构等级|fill': segmentation([customerDetail.orgParentGrade, customerDetail.orgGrade], ' '),
    '法人|fill': customerDetail.legalPerson,
    '注册地址|fill': segmentation(
      [customerDetail.registeredArea, customerDetail.registeredAddress],
      ' ',
    ),
  }
  if (customerDetail.orgTypeValue === '02') {
    leftForm['诊疗科目|fill'] = <div className="aek-word-break">{customerDetail.businessScope}</div>
  } else {
    leftForm['经营范围|fill'] = <div className="aek-word-break">{customerDetail.businessScope}</div>
  }
  const rightForm = {
    '联系负责人|fill': customerDetail.contactName,
    '手机号|fill': customerDetail.contactPhone,
    '固话|fill': customerDetail.orgPhone,
    '传真|fill': customerDetail.fax,
  }
  const certificateType = ['营业执照', '经营许可证', '税务登记证', '医疗器械生产许可证', '医疗器械执业许可证', '经营备案证']
  // 解除恢复关系
  function showConfirm() {
    const content = contactsType === '1' ? '您确定要解除与该机构的关系吗？' : '您确定要恢复与该机构的关系吗？'
    const url =
      contactsType === '1'
        ? 'myCustomerDetail/setRemoveRelation'
        : 'myCustomerDetail/setRecoverRelationSync'
    let reqdata = {}
    if (contactsType === '1') {
      reqdata = {
        customerOrgId: id,
      }
    } else {
      reqdata = {
        customerOrgId: id,
        applyType: 0,
      }
    }
    confirm({
      content,
      onOk() {
        dispatch({
          type: url,
          payload: reqdata,
        })
      },
    })
  }
  // 按钮名称
  let buttonName

  if (!isNewRelation && contactsType === '1') {
    buttonName = (
      <div className="aek-border-bottom-right">
        <a
          onClick={() => {
            showConfirm()
          }}
        >
          <Icon style={{ marginRight: 8 }} type="close-circle-o" />解除关系
        </a>
      </div>
    )
    rightForm['关系建立时间|fill'] = customerDetail.buildDate
  } else if (!isNewRelation && contactsType === '2') {
    buttonName = (
      <div className="aek-border-bottom-right">
        <a
          onClick={() => {
            showConfirm()
          }}
        >
          <Icon style={{ marginRight: 8 }} type="close-circle-o" />恢复关系
        </a>
      </div>
    )
  }
  const carousel = () => {
    const list = []
    if (customerDetail.papers) {
      for (const obj of customerDetail.papers) {
        const { imgUrls, certificateType: type, startDate, endDate } = obj
        list.push(
          <div className={Styles.carousel}>
            <Carousel style={{ width: 280, height: 200 }}>
              {imgUrls.split(',').map((item) => {
                let imgUrl = cloneDeep(item)
                if (imgUrl) {
                  const arr = imgUrl.split('.')
                  if (arr[arr.length - 1] && arr[arr.length - 1].toLowerCase().includes('pdf')) {
                    imgUrl = PDF
                  } else {
                    imgUrl = `${item}${IMG_COMPRESS}/max/280`
                  }
                  return (<div onClick={() => { window.open(`${item}`) }} className={Styles.imgItem} key={item}>
                    <img
                      src={imgUrl}
                      alt="证件"
                    />
                  </div>
                  )
                }
                return null
              })}
            </Carousel>
            <p>{certificateType[type - 1]}</p>
            <p>{`有效期：${segmentation([startDate, endDate || '长期有效'], ' ~ ')}`}</p>
          </div>,
        )
      }
    }
    return list
  }
  // 星级评价
  const columns = [
    {
      title: '总计',
      dataIndex: 'totalEvaluation',
      key: 'totalEvaluation',
      render: (value, record, index) => {
        if (index !== 5) {
          return value
        }
        return <span className="aek-red">{value}</span>
      },
    },
    {
      title: '最近一年',
      dataIndex: 'oneYear',
      key: 'oneYear',
      render: (value, record, index) => {
        if (index !== 5) {
          return value
        }
        return <span className="aek-red">{value}</span>
      },
    },
    {
      title: '最近半年',
      dataIndex: 'halfYear',
      key: 'halfYear',
      render: (value, record, index) => {
        if (index !== 5) {
          return value
        }
        return <span className="aek-red">{value}</span>
      },
    },
    {
      title: '最近三个月',
      dataIndex: 'threeMonth',
      key: 'threeMonth',
      render: (value, record, index) => {
        if (index !== 5) {
          return value
        }
        return <span className="aek-red">{value}</span>
      },
    },
    {
      title: '最近一个月',
      dataIndex: 'oneMonth',
      key: 'oneMonth',
      render: (value, record, index) => {
        if (index !== 5) {
          return value
        }
        return <span className="aek-red">{value}</span>
      },
    },
    {
      title: '星级',
      dataIndex: 'starLevel',
      key: 'starLevel',
      render: (value, record, index) => {
        if (index !== 5) {
          return <Rate disabled defaultValue={5 - index} />
        }
        return ''
      },
    },
  ]
  const detailColumns = [
    {
      title: '星级',
      dataIndex: 'starLevel',
      key: 'starLevel',
      className: 'aek-text-center',
      render: value => <Rate disabled defaultValue={value} />,
    },
    {
      title: '评价内容',
      dataIndex: 'appraiseContent',
      key: 'appraiseContent',
      className: 'aek-text-center',
      render: (value, record) => (
        <span>
          <p>{value || '无'}</p>
          <p className="aek-text-disable">[{record.addTime}]</p>
        </span>
      ),
    },
    {
      title: '评价人',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '交易信息',
      dataIndex: 'formNo',
      key: 'formNo',
      render: value => <span>订单号：{value}</span>,
    },
  ]
  const applyModalProps = {
    applyVisible,
    dispatch,
    effects,
    customerId: id,
    applyType: 0,
  }
  const appraiseRate = (value) => {
    dispatch({
      type: 'myCustomerDetail/getDetailList',
      payload: {
        ...searchData,
        starLevel: value,
      },
    })
  }
  const appraiseContent = (value) => {
    dispatch({
      type: 'myCustomerDetail/getDetailList',
      payload: {
        ...searchData,
        appraise: value,
      },
    })
  }
  const appraiseFunc = () => {
    if (customerDetail && customerDetail.appraise && customerDetail.appraise.overallMerit) {
      const value = rateValue(customerDetail.appraise.overallMerit)
      return value
    }
    return 0
  }
  const appraiseDisFunc = () => {
    if (customerDetail && customerDetail.appraise && customerDetail.appraise.dispatchAppraise) {
      const value = rateValue(customerDetail.appraise.dispatchAppraise)
      return value
    }
    return 0
  }
  const tabChange = (value) => {
    dispatch({
      type: 'myCustomerDetail/getDetailList',
      payload: {
        ...searchData,
        appraiseFlag: value,
        current: 1,
        pageSize: 10,
      },
    })
  }
  // 评价列表翻页
  const tabPagaChange = (pagination) => {
    dispatch({
      type: 'myCustomerDetail/getDetailList',
      payload: {
        ...searchData,
        ...pagination,
      },
    })
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div>
          <Bread routes={routes} />
        </div>
      </div>
      <div className="content" style={{ minHeight: '0px', marginBottom: '10px' }}>
        <div className="aek-border-bottom aek-mb10">
          <div className="aek-border-bottom-left">
            <p>基本信息</p>
          </div>
          {buttonName}
        </div>
        <Row>
          <Col span={12}>
            <PlainForm data={leftForm} itemSpacing="10px" />
          </Col>
          <Col span={12}>
            <PlainForm data={rightForm} />
          </Col>
        </Row>
      </div>
      <div className="content" style={{ minHeight: '0px', marginBottom: '10px' }}>
        <div className="aek-border-bottom aek-mb10">
          <div className="aek-border-bottom-left">
            <p>企业资质证件</p>
          </div>
        </div>
        <div>
          <ContactsRelation itemArr={carousel()} />
        </div>
      </div>
      <div className="content" style={{ minHeight: '0px', marginBottom: '10px' }}>
        <div >
          <Tabs defaultActiveKey="1" onChange={tabChange}>
            <TabPane tab="综合评价" key="1" value="1" />
            {contactsType === '1' ? <TabPane tab="我给的评价" key="2" value="2" /> : ''}
          </Tabs>
          <Row style={{ borderBottom: '1px solid #e2e2e2', paddingBottom: '20px' }}>
            <Col span="11">
              <Row style={{ paddingTop: '40px' }}>
                <Col
                  span="10"
                  className="aek-text-center"
                  style={{ padding: '10px', borderRight: '1px dashed #e2e2e2' }}
                >
                  <Progress
                    type="circle"
                    percent={
                      customerDetail && customerDetail.appraise ? (
                        customerDetail.appraise.overallMerit * 20
                      ) : (
                        0
                      )
                    }
                    format={percent => `${((percent / 100) * 5).toFixed(1)}`}
                  />
                  <p style={{ margin: '10px' }}>综合服务评分</p>
                  <p className="aek-primary-color">
                    超越{customerDetail && customerDetail.appraise ? (
                      customerDetail.appraise.overStep
                    ) : (
                      undefined
                    )}的医院
                  </p>
                </Col>
                <Col span="14" style={{ padding: '10px' }}>
                  <Form>
                    <FormItem {...FORM_ITEM_LAYOUT} label="综合评价">
                      <Rate
                        disabled
                        allowHalf
                        value={appraiseFunc()}
                        defaultValue={appraiseFunc()}
                      />
                      <span className="ant-rate-text">
                        {customerDetail && customerDetail.appraise ? (
                          customerDetail.appraise.overallMerit
                        ) : (
                          0
                        )}
                      </span>
                    </FormItem>
                    {customerDetail.orgTypeValue === '02' ? ''
                      : <FormItem {...FORM_ITEM_LAYOUT} label="配送评价">
                        <Rate
                          disabled
                          allowHalf
                          value={appraiseDisFunc()}
                          defaultValue={appraiseDisFunc()}
                        />
                        <span className="ant-rate-text">
                          {customerDetail && customerDetail.appraise ? (
                            customerDetail.appraise.dispatchAppraise
                          ) : (
                            0
                          )}
                        </span>
                      </FormItem>}
                  </Form>
                </Col>
              </Row>
            </Col>
            <Col span="13">
              <Table
                columns={columns}
                dataSource={
                  customerDetail && customerDetail.appraise && customerDetail.appraise.counts ? (
                    customerDetail.appraise.counts
                  ) : (
                    []
                  )
                }
                pagination={false}
                size="small"
                rowKey={record =>
                  record.starLevel || -1
                }
                rowClassName={(record, index) => {
                  if (index === 5) {
                    return 'aek-primary-color'
                  }
                }}
              />
            </Col>
          </Row>
          <div>
            <Select
              defaultValue={null}
              onSelect={appraiseRate}
              optionLabelProp="title"
              className={Styles['select-layout']}
            >
              <Option value={null} title="评价：全部">
                评价：全部
              </Option>
              <Option value={'5'} title="评价：五星">
                五星
              </Option>
              <Option value={'4'} title="评价：四星">
                四星
              </Option>
              <Option value={'3'} title="评价：三星">
                三星
              </Option>
              <Option value={'2'} title="评价：二星">
                二星
              </Option>
              <Option value={'1'} title="评价：一星">
                一星
              </Option>
            </Select>
            <Select
              defaultValue={null}
              onSelect={appraiseContent}
              optionLabelProp="title"
              className={Styles['select-layout']}
            >
              <Option value={null} title="评价：全部">
                评价：全部
              </Option>
              <Option value={'1'} title="评论：有评论内容">
                有评论内容
              </Option>
              <Option value={'0'} title="评论：无评论内容">
                无评论内容
              </Option>
            </Select>
          </div>
          <Table
            columns={detailColumns}
            dataSource={detailData}
            rowKey="formId"
            pagination={detailPagination}
            onChange={tabPagaChange}
          />
        </div>
      </div>
      <ApplyModal {...applyModalProps} />
    </div>
  )
}

MyCustomerDetail.propTypes = {
  myCustomerDetail: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  addressList: PropTypes.array,
  orgId: PropTypes.any,
}

export default connect(
  ({
    myCustomerDetail,
    loading: { effects },
    app: { constants: { addressList }, orgInfo: { orgId } },
  }) => ({ myCustomerDetail, effects, addressList, orgId }),
)(MyCustomerDetail)
