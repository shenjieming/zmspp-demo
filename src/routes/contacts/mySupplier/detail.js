import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Avatar, Icon, Carousel, Tabs, Progress, Form, Rate, Table, Modal, Select } from 'antd'
import { cloneDeep } from 'lodash'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import PlainForm from '../../../components/PlainForm'
import GetFormItem from '../../../components/GetFormItem'
import getComponent from '../../../components/GetFormItem/getComponent'
import { getBasicFn, segmentation, rateValue, getOption, getPagination } from '../../../utils'
import { columns, detailColumns, retAppraiseList } from './detailData'
import { applyFormData } from './data'
import ContentLayout from '../../../components/ContentLayout'
import ContactsRelation from '../newContactsRelation/carousel'
import { IMG_COMPRESS } from '../../../utils/config'
import style from './style.less'
import PDF from '../../../assets/pdf.png'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

const propTypes = {
  mySupplierDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  addressList: PropTypes.array,
}

function MySupplierDetail({
  mySupplierDetail,
  loading,
  form: { validateFieldsAndScroll, resetFields },
}) {
  const {
    supplierOrgId,
    supplierStatus, // 1 已建立 2 已解除 3 未建立
    supplierDetail = {},
    appraise,
    applyModalVisible,
    isNewRelation,
    detailData,
    pageConfig,
    searchKey,
    tabStatus,
  } = mySupplierDetail
  const { toAction, getLoading, dispatchUrl } = getBasicFn({
    namespace: 'mySupplierDetail',
    loading,
  })
  const leftForm = {
    '企业LOGO|fill': <Avatar size="large" src={supplierDetail.orgLogoUrl} />,
    '机构名称|fill': supplierDetail.orgName,
    '法人|fill': supplierDetail.legalPerson,
    '注册地址|fill': segmentation(
      [supplierDetail.registeredArea, supplierDetail.registeredAddress],
      ' ',
    ),
    '经营范围|fill': <div className="aek-word-break">{supplierDetail.businessScope}</div>,
  }
  const rightForm = {
    '联系负责人|fill': supplierDetail.contactName,
    '手机号|fill': supplierDetail.contactPhone,
    '固话|fill': supplierDetail.orgPhone,
    '传真|fill': supplierDetail.fax,
    [`关系建立时间|fill|${supplierStatus === '1'}`]: supplierDetail.buildDate,
  }
  const certificateType = ['营业执照', '经营许可证', '税务登记证', '医疗器械生产许可证', '医疗器械执业许可证', '经营备案证']

  const getButton = () => {
    if (['1', '2'].includes(supplierStatus) && !isNewRelation) {
      const prop =
        supplierStatus - 1
          ? {
            name: '恢复关系',
            type: 'plus-circle-o',
            onClick() {
              Modal.confirm({
                content: '您确定要恢复与该机构的关系吗？',
                onOk() {
                  toAction({ supplierOrgId }, 'recoverRelationCheck')
                },
              })
            },
          }
          : {
            name: '解除关系',
            type: 'minus-circle-o',
            onClick() {
              Modal.confirm({
                content: '您确定要解除与该机构的关系吗？',
                onOk() {
                  toAction({ supplierOrgId }, 'removeRelation').then(() => {
                    dispatchUrl({
                      query: { status: 3 },
                      type: 'replace',
                    })
                  })
                },
              })
            },
          }

      return (
        <a onClick={prop.onClick}>
          <Icon style={{ marginRight: 6 }} type={prop.type} />
          {prop.name}
        </a>
      )
    }
    return null
  }

  const applyProps = {
    title: '申请',
    visible: applyModalVisible,
    confirmLoading: getLoading('recoverRelation'),
    wrapClassName: 'aek-modal',
    onCancel() {
      toAction({ applyModalVisible: false })
    },
    maskClosable: false,
    afterClose: resetFields,
    onOk() {
      validateFieldsAndScroll((errors, value) => {
        if (!errors) {
          toAction(
            {
              ...value,
              supplierOrgId,
            },
            'recoverRelation',
          )
        }
      })
    },
  }
  const carousel = () => {
    const list = []
    if (supplierDetail.papers) {
      for (const obj of supplierDetail.papers) {
        const { imgUrls, certificateType: type, startDate, endDate } = obj
        list.push(
          <div className={style.carousel}>
            <Carousel style={{ width: 280, height: 200 }}>
              {imgUrls.split(',').map((item) => {
                let imgUrl = cloneDeep(item)
                if (imgUrl) {
                  const arr = imgUrl.split('.')
                  if (arr[arr.length - 1] && arr[arr.length - 1].toLowerCase().includes('pdf')) {
                    imgUrl = PDF
                  } else {
                    imgUrl = `${item}`
                  }
                  return (
                    <div
                      onClick={() => { window.open(`${item}`) }}
                      className={style.imgItem}
                      key={item}
                    >
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
  const appraiseFunc = (itemStr) => {
    if (appraise && appraise[itemStr]) {
      return rateValue(appraise[itemStr])
    }
    return 0
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: [
      <span>
        <div className="aek-border-bottom aek-mb10">
          <div className="aek-border-bottom-left"><p>基本信息</p></div>
          <div className="aek-border-bottom-right">{getButton()}</div>
        </div>
        <Row>
          <Col span={12}>
            <PlainForm data={leftForm} itemSpacing="10px" />
          </Col>
          <Col span={12}>
            <PlainForm data={rightForm} />
          </Col>
        </Row>
      </span>,
      <span>
        <div className="aek-border-bottom aek-mb10">
          <p>企业资质证件</p>
        </div>
        <div>
          <ContactsRelation itemArr={carousel()} />
        </div>
        <Modal {...applyProps}>
          <Form>
            <GetFormItem
              formData={applyFormData}
            />
          </Form>
        </Modal>
      </span>,
      <div>
        <Tabs
          activeKey={tabStatus}
          onChange={(key) => {
            toAction({ tabStatus: key })
            toAction({
              ...searchKey,
              appraise: null,
              starLevel: null,
              appraiseFlag: key,
              current: 1,
              pageSize: 10,
            }, 'appraises')
          }}
        >
          <TabPane tab="综合评价" key="1" />
          {
            supplierStatus === '1'
              ? <TabPane tab="我给的评价" key="2" />
              : null
          }
        </Tabs>
        <Row className={style.evaluate}>
          <Col span="11" style={{ marginTop: 40 }}>
            <Row>
              <Col
                span="10"
                className="aek-text-center"
                style={{ padding: '10px', borderRight: '1px dashed #e2e2e2' }}
              >
                <Progress
                  type="circle"
                  percent={
                    appraise && appraise.overallMerit
                      ? appraise.overallMerit * 20
                      : 0
                  }
                  format={percent => `${(percent / 20).toFixed(1)}`}
                />
                <p style={{ margin: '10px' }}>综合服务评分</p>
                <p className="aek-primary-color">
                  超越{appraise.overStep}的供应商
                </p>
              </Col>
              <Col span="14" style={{ padding: '10px' }}>
                <Form>
                  <FormItem {...FORM_ITEM_LAYOUT} label="服务评价">
                    <Rate
                      disabled
                      allowHalf
                      value={appraiseFunc('serviceAppraise')}
                    />
                    <span className="ant-rate-text">
                      {
                        appraise && appraise.serviceAppraise
                          ? appraise.serviceAppraise
                          : 0
                      }
                    </span>
                  </FormItem>
                  <FormItem {...FORM_ITEM_LAYOUT} label="配送评价">
                    <Rate
                      disabled
                      allowHalf
                      value={appraiseFunc('dispatchAppraise')}
                    />
                    <span className="ant-rate-text">
                      {
                        appraise && appraise.dispatchAppraise
                          ? appraise.dispatchAppraise
                          : 0
                      }
                    </span>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col span="13">
            <Table
              columns={columns}
              dataSource={retAppraiseList(appraise.counts)}
              pagination={false}
              rowKey="starLevel"
              size="small"
            />
          </Col>
        </Row>
        <div className={style.select} key={tabStatus}>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              toAction({
                ...searchKey,
                starLevel: value && value - 0,
                current: 1,
                pageSize: 10,
              }, 'appraises')
            }}
            optionLabelProp="title"
            style={{ marginRight: 20 }}
          >{getComponent(getOption([{
              id: null,
              name: '全部',
            }, {
              id: '5',
              name: '五星',
            }, {
              id: '4',
              name: '四星',
            }, {
              id: '3',
              name: '三星',
            }, {
              id: '2',
              name: '二星',
            }, {
              id: '1',
              name: '一星',
            }], { prefix: '星级' }))}
          </Select>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              toAction({
                ...searchKey,
                appraise: value - 0,
                current: 1,
                pageSize: 10,
              }, 'appraises')
            }}
            optionLabelProp="title"
          >{getComponent(getOption([{
              id: null,
              name: '全部',
            }, {
              id: '1',
              name: '有评论内容',
            }, {
              id: '0',
              name: '无评论内容',
            }], { prefix: '评价' }))}
          </Select>
        </div>
        <Table
          columns={detailColumns}
          dataSource={detailData}
          rowKey="formId"
          bordered
          loading={getLoading('appraises')}
          pagination={getPagination(pageConfig, (current, pageSize) => {
            toAction({
              ...searchKey,
              current,
              pageSize,
            }, 'appraises')
          })}
        />
      </div>,
    ],
  }

  return <ContentLayout {...contentLayoutProps} />
}

MySupplierDetail.propTypes = propTypes

export default connect(({ mySupplierDetail, loading, app: { constants: { addressList } } }) => ({
  mySupplierDetail,
  loading,
  addressList,
}))(Form.create()(MySupplierDetail))
