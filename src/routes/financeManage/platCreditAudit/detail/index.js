import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card, Form, Spin } from 'antd'
import { flattenDeep } from 'lodash'

import { FORM_ITEM_LAYOUT } from '../../../../utils/constant'
import { getBasicFn } from '../../../../utils/index'
import { Breadcrumb, GetFormItem } from '../../../../components'

import styles from './index.less'

const namespace = 'platCreditDetail'
const propTypes = {
  platCreditDetail: PropTypes.object,
  addressList: PropTypes.array,
  loading: PropTypes.object,
}
const InputMaxWidth = 400
const PlatCreditDetail = ({ platCreditDetail, loading, addressList }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { detail } = platCreditDetail
  const viewModel = true
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
        initialValue: detail.customerType,
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
          options: [{ label: '企业', value: 2 }, { label: '个人', value: 1 }],
        },
      },
    },
    {
      label: '客户编号',
      layout: FORM_ITEM_LAYOUT,
      field: 'customerCode',
      view: viewModel,
      options: {
        initialValue: detail.customerCode,
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
        initialValue: detail.crossFlag,
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
          options: [{ label: '是', value: 0 }, { label: '否', value: 1 }],
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
      options: {
        initialValue: detail.legalIdCardValidDate,
        rules: [
          {
            required: true,
            message: '请填写法人的身份证的有效截止时间',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写法人的身份证的有效截止时间',
          style: { maxWidth: InputMaxWidth },
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
          pcdAddresses.split(',').every((element) => {
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
    {
      label: '电子邮件',
      layout: FORM_ITEM_LAYOUT,
      field: 'email',
      view: viewModel,
      options: {
        initialValue: detail.email,
        rules: [
          {
            required: true,
            message: '请填写有效邮箱',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请填写有效邮箱',
          style: { maxWidth: InputMaxWidth },
        },
      },
    },
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
  const content = (
    <Form className={styles.applyDataBox}>
      <GetFormItem formData={flattenDeep(formParams)} />
    </Form>
  )
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Card className="aek-full-card" title="基本信息" bordered={false}>
        <Spin spinning={getLoading('queryData')}>{content}</Spin>
      </Card>
    </div>
  )
}

PlatCreditDetail.propTypes = propTypes
export default connect(({ platCreditDetail, loading, app: { constants: { addressList } } }) => ({
  platCreditDetail,
  loading,
  addressList,
}))(Form.create()(PlatCreditDetail))
