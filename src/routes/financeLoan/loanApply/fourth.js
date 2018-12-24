import React from 'react'
import PropTypes from 'prop-types'
import { Input, Button, Form, Row, Col, Icon, Tooltip, Spin } from 'antd'
import { getBasicFn, formatNum } from '../../../utils/index'
import Styles from './index.less'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import InputNumber from '../../../components/LkcInputNumber'


const FormItem = Form.Item
const namespace = 'loanApply'
const { TextArea } = Input
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
const Fourth = ({
  loanApply,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
  },
}) => {
  const {
    stepIndex,
    payMoneySum,
    receivableOrderMoney,
    orderId,
    radomKey,
  } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  // 上一步按钮
  const firstPrevClick = () => {
    dispatchAction({
      payload: {
        stepIndex: stepIndex - 1,
        receivableOrderSearchdata: {},
        photoSelectedList: [],
        payMoneySum: 0,
        orderId: '',
        invoiceCapitalList: [{
          invoiceCapital: '零元整',
          invoiceNo: '',
          invoiceDate: '',
          invoiceAmount: '',
          invoiceUrl: {},
          radomKey: radomKey + 1,
        }],
        radomKey: radomKey + 1,
      },
    })
  }
  // 下一步按钮事件
  const secondNextClick = () => {
    validateFields((errors, data) => {
      if (!errors) {
        dispatchAction({
          type: 'setFourthSubmit',
          payload: {
            formId: orderId,
            payAmount: payMoneySum,
            receivableAmount: receivableOrderMoney,
            ...data,
            ownAmount: data.ownAmount || 0,
          },
        })
      }
    })
  }
  const extraNode = (<span>
    温馨提示：申请说明请参照《申请说明模板》
    <Tooltip
      placement="top"
      title={<div>
        <p>贷款机构：xxxxxxx公司</p>
        <p>入库单所属医院：xxxxxxx医院</p>
        <p>委托支付机构：xxxxxxx公司</p>
        <p>贷款金额：xxxxxxx元</p>
        {/* <p>自有资金：xxxxxxx元（若有需要填写）</p> */}
      </div>}
    >
      <Icon type="info-circle" />
    </Tooltip>
  </span>)
  // 贷款金额失焦事件
  const amountBlur = (even) => {
    const value = even.target.value || 0
    dispatchAction({
      payload: {
        payMoneySum: formatNum(value, { unit: '' }),
      },
    })
  }
  return (
    <div>
      <Spin spinning={getLoading('setFourthSubmit')}>

        <div className={Styles['aek-fourth-title']}>
        应收单款项合计{receivableOrderMoney}元
        </div>
        <div className={Styles['aek-fourth-content']}>
          <Form>
            <FormItem label="应收单款项合计" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('receivableAmount')(
                <span className="ant-form-text">{receivableOrderMoney}元</span>,
              )}
            </FormItem>
            <FormItem label="贷款金额" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('loanAmount', {
                rules: [{
                  required: true,
                  message: '贷款金额不能为空',
                }],
              })(
                <InputNumber
                  max={parseFloat(receivableOrderMoney * 0.8)}
                  placeholder="请输入金额"
                  onBlur={(e) => {
                    amountBlur(e, 'ownAmount')
                  }}
                />,
              )}
            </FormItem>
            {/* <FormItem
              label="自有资金支付金额"
              extra="温馨提示：请确保结算卡中的自有资金是充足的，否则付款失败。"
              {...FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('ownAmount')(
                <InputNumber
                  placeholder="请输入金额"
                  onBlur={(e) => {
                    amountBlur(e, 'loanAmount')
                  }}
                />,
              )}
            </FormItem> */}
            <FormItem
              label="支付贷款总额"
              {...FORM_ITEM_LAYOUT}
              // extra="说明：付款金额=自有支付金额+贷款支付金额"
            >
              {getFieldDecorator('payAmount')(
                <span className="ant-form-text">{payMoneySum || 0}元</span>,
              )}
            </FormItem>
            <FormItem
              label="申请说明"
              {...FORM_ITEM_LAYOUT}
              extra={extraNode}
            >
              {getFieldDecorator('loanRemark', {
                rules: [{
                  required: true,
                  message: '申请说明不能为空',
                }],
              })(
                <TextArea
                  placeholder="请输入申请说明"
                  autosize={{ minRows: 3, maxRows: 4 }}
                />,
              )}
            </FormItem>
          </Form>
          <Row span={24} className="aek-mt30">
            <Col span={6} />
            <Col>
              <Button onClick={secondNextClick} className="aek-mr20" type="primary">确认申请</Button>
              <Button onClick={firstPrevClick} >上一步</Button>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  )
}

Fourth.propTypes = propTypes
export default Form.create()(Fourth)
