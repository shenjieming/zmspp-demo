import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { message, Form, Row, Col, Alert, Button, Icon, Card, Spin, Upload, Tooltip } from 'antd'
import { flattenDeep } from 'lodash'
import moment from 'moment'
import {
  CREDIT_TEMPLATE_URL,
  FORM_ITEM_LAYOUT,
  REGEXP_TELEPHONE,
  REGEXP_FAX,
  REGEXP_PHONE,
  REGEXP_EMAIL,
} from '../../../utils/constant'
import { getBasicFn } from '../../../utils/index'
import { Breadcrumb, GetFormItem } from '../../../components'
import { uploadZipProps } from '../../../components/UploadButton'
import { ZIP_DOWNLOAD } from '../../../utils/config'

import styles from './index.less'

const namespace = 'creditManage'
const propTypes = {
  creditManage: PropTypes.object,
  addressList: PropTypes.array,
  loading: PropTypes.object,
  form: PropTypes.object,
}
const FormItem = Form.Item
const InputMaxWidth = 400
const CreditManage = ({ creditManage, loading, addressList, form: { validateFields } }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { viewModel, detail, currentFileList } = creditManage
  const { editFlag, creditStatus, creditFailRemark, creditApplyExistFlag } = detail
  // 提交信息
  const submitInfo = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (currentFileList.length === 0) {
        message.error('请上传授信资料')
        return
      } else if (currentFileList[0].status !== 'done') {
        message.error('文件正在上传中...')
        return
      }
      dispatchAction({
        type: 'submitInfo',
        payload: {
          ...values,
          creditId: detail.creditId,
          applyOrgName: detail.applyOrgName,
          customerCode: detail.customerCode || values.customerCode,
          legalIdCardValidDate: moment(values.legalIdCardValidDate).format('YYYY-MM-DD'),
          legalPcdAddress: values.legalPcdAddress && values.legalPcdAddress.toString(),
          applyDataName: currentFileList[0].name,
          applyDataUrl: currentFileList[0].response
            ? `${ZIP_DOWNLOAD}${currentFileList[0].response.url}`
            : currentFileList[0].url,
        },
      })
    })
  }
  // 滚动至说明
  const scrollTo = () => {
    const anchor = document.querySelector('#requiredFiles')
    if (anchor) {
      anchor.focus()
    }
  }
  const formParams = [
    {
      label: '企业名称',
      layout: FORM_ITEM_LAYOUT,
      field: 'applyOrgName',
      view: true,
      options: {
        initialValue: detail.applyOrgName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '结算账户类型',
      layout: FORM_ITEM_LAYOUT,
      field: 'customerType',
      view: viewModel,
      viewRender() {
        if (detail.customerType === 1) {
          return '个人'
        }
        return '企业'
      },
      options: {
        initialValue: detail.customerType || 2,
        rules: [
          {
            required: true,
            message: '请选择结算账户类型',
          },
        ],
      },
      component: {
        name: 'RadioGroup',
        props: {
          options: [{ label: '企业', value: 2 }],
        },
      },
    },
    {
      label: '客户编号',
      layout: FORM_ITEM_LAYOUT,
      field: 'customerCode',
      view: true,
      options: {
        initialValue: detail.customerCode || '后台自动生成',
        rules: [
          {
            required: true,
            message: '请填写客户编号',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写客户编号',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '结算账户名',
      layout: FORM_ITEM_LAYOUT,
      field: 'settleAccountName',
      view: viewModel,
      options: {
        initialValue: detail.settleAccountName,
        rules: [
          {
            required: true,
            message: '请填写在华夏银行开户结算账户名',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写在华夏银行开户结算账户名',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '是否为华夏银行',
      layout: FORM_ITEM_LAYOUT,
      field: 'crossFlag',
      view: viewModel,
      viewRender() {
        if (detail.crossFlag) {
          return '否'
        }
        return '是'
      },
      options: {
        initialValue: !!detail.crossFlag,
        rules: [
          {
            required: true,
            message: '请选择是否为华夏银行',
          },
        ],
      },
      component: {
        name: 'RadioGroup',
        props: {
          options: [{ label: '是', value: false }],
        },
      },
    },
    {
      label: '结算账户号',
      layout: FORM_ITEM_LAYOUT,
      field: 'settleAccount',
      view: viewModel,
      options: {
        initialValue: detail.settleAccount,
        rules: [
          {
            required: true,
            message: '请填写在华夏银行开户结算账户号',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写在华夏银行开户结算账户号',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人姓名',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalName',
      view: viewModel,
      options: {
        initialValue: detail.legalName,
        rules: [
          {
            required: true,
            message: '请填写法人姓名',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写法人姓名',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人证件号码',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalIdCard',
      view: viewModel,
      options: {
        initialValue: detail.legalIdCard,
        rules: [
          {
            required: true,
            message: '请填写法人的身份证号码',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写法人的身份证号码',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人证件有效期',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalIdCardValidDate',
      view: viewModel,
      viewRender() {
        return detail.legalIdCardValidDate
      },
      options: {
        initialValue:
          detail.legalIdCardValidDate && moment(detail.legalIdCardValidDate, 'YYYY-MM-DD'),
        rules: [
          {
            required: true,
            message: '请填写法人的身份证的有效截止时间',
          },
        ],
      },
      component: {
        name: 'DatePicker',
        props: {
          placeholder: '请填写法人的身份证的有效截止时间',
          style: { width: '100%', maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人移动电话',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalMobile',
      view: viewModel,
      options: {
        initialValue: detail.legalMobile,
        rules: [
          {
            pattern: REGEXP_TELEPHONE,
            message: '手机号不正确',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '法人移动电话',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人固定电话',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalTel',
      view: viewModel,
      options: {
        initialValue: detail.legalTel,
        rules: [
          {
            pattern: REGEXP_FAX,
            message: '固定电话不正确',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '法人固定电话',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '法人联系地址',
      layout: FORM_ITEM_LAYOUT,
      field: 'legalPcdAddress',
      view: viewModel,
      viewRender() {
        const pcdAddresses = detail.legalPcdAddress
        let dataSource = addressList
        if (detail.legalPcdAddress && addressList.length > 0) {
          let addressString = ''
          pcdAddresses
            .split(',')
            .splice(0, 3)
            .every((element) => {
              const current = dataSource.find(({ value }) => {
                if (value === element) {
                  return 1
                }
                return 0
              })
              addressString += current.label
              dataSource = current.children
              return true
            })
          return addressString + detail.legalDetailAddress
        }
        return detail.legalPcdAddress
      },
      options: {
        initialValue: detail.legalPcdAddress && detail.legalPcdAddress.split(','),
        getValueFromEvent: (val, selectedOptions) => {
          const addressArray = [...val]
          for (const item of selectedOptions) {
            addressArray.push(item.label)
          }
          return addressArray
        },
      },
      component: {
        name: 'Cascader',
        props: {
          options: addressList,
          style: { maxWidth: InputMaxWidth },
          placeholder: '省/市/区',
        },
      },
    },
    {
      layout: { wrapperCol: { offset: 6, span: 18 } },
      field: 'legalDetailAddress',
      view: viewModel,
      exclude: viewModel,
      options: {
        initialValue: detail.legalDetailAddress,
      },
      component: {
        name: 'TextArea',
        props: {
          rows: 2,
          style: { maxWidth: InputMaxWidth, resize: 'none' },
          placeholder: '请输入详细地址',
        },
      },
    },
    // {
    //   label: '电子邮件',
    //   layout: FORM_ITEM_LAYOUT,
    //   field: 'email',
    //   view: viewModel,
    //   options: {
    //     initialValue: detail.email,
    //     rules: [
    //       {
    //         required: true,
    //         message: '请填写有效邮箱',
    //       },
    //       {
    //         pattern: REGEXP_EMAIL,
    //         message: '邮箱不正确',
    //       },
    //     ],
    //   },
    //   component: {
    //     name: 'Input',
    //     props: {
    //       placeholder: '请填写有效邮箱',
    //       style: { maxWidth: InputMaxWidth },
    //     },
    //   },
    // },
    {
      label: '公司财务负责人',
      layout: FORM_ITEM_LAYOUT,
      field: 'financialOfficer',
      view: viewModel,
      options: {
        initialValue: detail.financialOfficer,
        rules: [
          {
            required: true,
            message: '请填写公司财务负责人',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写公司财务负责人',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '财务负责人联系电话',
      layout: FORM_ITEM_LAYOUT,
      field: 'financialOfficerMobile',
      view: viewModel,
      options: {
        initialValue: detail.financialOfficerMobile,
        rules: [
          {
            required: true,
            message: '请填写财务负责人联系电话',
          },
          {
            pattern: REGEXP_PHONE,
            message: '联系电话不正确',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写财务负责人联系电话',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
    {
      label: '授信资料',
      layout: FORM_ITEM_LAYOUT,
      view: false,
      exclude: !viewModel,
      component: (
        <span>
          <span>{detail.applyDataName}</span>
          <span className="aek-fill-15" />
          <a className="aek-link" href={detail.applyDataUrl} download={detail.applyDataName}>
            点击下载
          </a>
        </span>
      ),
    },
  ]
  const getInfoByStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <Alert
            type="warning"
            showIcon
            className="aek-font-large"
            style={{ marginBottom: '10px' }}
            message="【您提交的授信资料正在审核，请耐心等待】"
          />
        )
      case 1:
        return (
          <Alert
            type="success"
            showIcon
            className="aek-font-large"
            style={{ marginBottom: '10px' }}
            message="审核通过"
          />
        )
      case 2:
        return (
          <Alert
            type="warning"
            showIcon
            className="aek-font-large"
            style={{ marginBottom: '10px' }}
            message={`审核拒绝${creditFailRemark ? `【${creditFailRemark}】` : ''}`}
          />
        )
      default:
        return ''
    }
  }
  let info = '' // 上方提示栏
  let content = <div style={{ minHeight: '500px' }} /> // 正文内容
  if (viewModel === true) {
    info = getInfoByStatus(creditStatus)
    content = (
      <div>
        <Form className={styles.viewContainer}>
          <GetFormItem formData={flattenDeep(formParams)} />
        </Form>
        {editFlag ? (
          <Row className={styles.viewContainer} style={{ margin: '20px 0px' }}>
            <Col offset={6} span={18}>
              <Button
                onClick={() => {
                  dispatchAction({ type: 'updateState', payload: { viewModel: false } })
                  scrollTo()
                }}
              >
                编辑
              </Button>
              <Tooltip title="每年只有2次修改的机会，请认真填写">
                <Icon style={{ marginLeft: '20px' }} type="question-circle-o" />
              </Tooltip>
            </Col>
          </Row>
        ) : (
          ''
        )}
      </div>
    )
  } else if (viewModel === false) {
    info = (
      <Alert
        type="warning"
        showIcon
        className="aek-font-large"
        style={{ marginBottom: '10px' }}
        message={
          <span>
            您需要完善以下信息来完成授信工作，其中包括一些您企业、结算账户的一些基本信息，以及您需要提前准备的授信资料电子档，
            <a className="aek-link" onClick={scrollTo}>
              点这里查看
            </a>需要准备的资料
          </span>
        }
      />
    )
    content = (
      <div>
        <Form className={styles.rangeContainer}>
          <GetFormItem formData={flattenDeep(formParams)} />
          <FormItem
            {...FORM_ITEM_LAYOUT}
            label="授信资料电子档"
            extra="温馨提示：请将所有文件打包压缩成一个文件包上传。格式为.Rar"
          >
            <Row>
              <Col span={12} className={styles.inlineBox}>
                <Upload
                  className="upload"
                  {...uploadZipProps}
                  disabled={currentFileList.length > 0}
                  fileList={currentFileList}
                  onChange={({ fileList }) => {
                    dispatchAction({
                      type: 'updateState',
                      payload: { currentFileList: fileList },
                    })
                  }}
                >
                  <Button style={{ display: 'inline-block' }}>
                    <Icon type="upload" /> 选择本地文件
                  </Button>
                </Upload>
                <a className="aek-link" href={CREDIT_TEMPLATE_URL} download="授信资料模板.rar">
                  下载模板
                </a>
              </Col>
            </Row>
          </FormItem>
          <Row style={{ margin: '20px 0px' }}>
            <Col offset={6} span={18}>
              <Button type="primary" onClick={submitInfo}>
                提交
              </Button>
            </Col>
          </Row>
        </Form>
        <div className={styles.RequiredBox}>
          <Row className={styles.rangeContainer}>
            <Col offset={6} span={18}>
              <ul style={{ lineHeight: '30px', padding: '20px 0px' }}>
                <li id="requiredFiles" tabIndex="-1" style={{ outline: 'none' }}>
                  需要准备的授信资料电子档如下：
                </li>
                <li>1、法定代表人(实际控制人）及其配偶身份证、户口本、结婚证。</li>
                <li>2、法定代表人(实际控制人）资产证明。</li>
                <li>
                  3、营业执照正、副本复印件（需经过年鉴）（未经过三证合一需提供组织机构代码证、税务登记证）。
                </li>
                <li>4、医疗经营许可证及产品授权书等。</li>
                <li>5、工商局出具的公司在册/章程、变更情况登记表。</li>
                <li>6、公司的验资报告（审计出的）。</li>
                <li>
                  7、从当前年份往前推三年的年度年报（有审计报告的请提供审计报告）及现金流量表（如果有）。
                </li>
                <li>8、当前年份最新一个月财务报表。</li>
                <li>9、当前年份最近一期月报各个科目明细账及款项形成的时间和原因。</li>
                <li>10、银行要求的其他资料。</li>
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      {info}
      <Card className="aek-full-card" title="基本信息" bordered={false}>
        <Spin style={{ height: '100%' }} spinning={getLoading('queryData', 'submitInfo')}>
          {content}
        </Spin>
      </Card>
    </div>
  )
}

CreditManage.propTypes = propTypes
export default connect(({ creditManage, loading, app: { constants: { addressList } } }) => ({
  creditManage,
  addressList,
  loading,
}))(Form.create()(CreditManage))
