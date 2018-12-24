import React from 'react'
import PropTypes from 'prop-types'
import { Form, Radio, Button, Row, Col, Modal } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { confirm } = Modal
const BasicSetForm = ({
  currentOrgDetail,
  // accuracy,
  dispatchAction,
  form: { getFieldDecorator, validateFields },
}) => {
  // 默认精度为4
  const accuracy = 4
  const { manCertificate, orgErp, orgSupplierReviewFlag, orgTypeCode } = currentOrgDetail
  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 14,
    },
  }
  const formItemLayoutNoLable = {
    wrapperCol: {
      span: 14,
      offset: 5,
    },
  }
  const showConfirm = (e) => {
    confirm({
      content:
        '确认要切换精度吗？如果企业已经有历史业务数据，可能照成这些数据计算精度丢失！此操作需谨慎！',
      onCancel() {
        dispatchAction({ payload: { accuracy } })
      },
      onOk() {
        dispatchAction({
          payload: { accuracy: e.target.value },
        })
        return false
      },
    })
  }
  const handleOk = () => {
    confirm({
      content: '确认保存吗？',
      onOk() {
        validateFields((errors, vals) => {
          if (errors) {
            return
          }
          const data = { ...vals, accuracy }
          dispatchAction({
            type: 'setBasicMsg',
            payload: data,
          })
        })
      },
    })
  }
  return orgTypeCode !== '05' ? (
    <Form layout="horizontal" onSubmit={handleOk} style={{ marginTop: 40 }}>
      <Row>
        <Col style={{ width: 1100 }}>
          {/* 后期可能会变为可设置精度注释代码 请勿删除   */}
          {/* <FormItem label="财务精度" {...formItemLayout}>
            <RadioGroup onChange={showConfirm} value={accuracy}>
              <Radio value={2}>2位小数</Radio>
              <Radio value={3}>3位小数</Radio>
            </RadioGroup>
          </FormItem> */}
          <FormItem label="财务精度" {...formItemLayout}>
            <RadioGroup onChange={showConfirm} value={4}>
              <Radio value={4}>4位小数</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col style={{ width: 1100 }}>
          <FormItem label="是否管控证件" {...formItemLayout}>
            {getFieldDecorator('manCertificate', {
              initialValue: manCertificate || 0,
            })(<RadioGroup options={[{ label: '否', value: 0 }, { label: '是', value: 1 }]} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col style={{ width: 1100 }}>
          <FormItem label="是否对接ERP" {...formItemLayout}>
            {getFieldDecorator('orgErp', {
              initialValue: orgErp || 0,
            })(<RadioGroup options={[{ label: '否', value: 0 }, { label: '是', value: 1 }]} />)}
          </FormItem>
        </Col>
      </Row>
      {orgTypeCode === '02' ? (
        <Row>
          <Col style={{ width: 1100 }}>
            <FormItem label="和供应商建立关系无需供应商审核" {...formItemLayout}>
              {getFieldDecorator('orgSupplierReviewFlag', {
                initialValue: orgSupplierReviewFlag || 0,
              })(<RadioGroup options={[{ label: '否', value: 0 }, { label: '是', value: 1 }]} />)}
            </FormItem>
          </Col>
        </Row>
      ) : (
        ''
      )}
      <Row>
        <Col style={{ width: 1100 }}>
          <FormItem label=" " {...formItemLayoutNoLable}>
            <Button type="primary" onClick={handleOk}>
              保存
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  ) : (
    <Form layout="horizontal" onSubmit={handleOk} style={{ marginTop: 40 }}>
      <Row>
        <Col style={{ width: 1100 }}>
          <FormItem label="是否对接第三方平台" {...formItemLayout}>
            {getFieldDecorator('orgErp', {
              initialValue: orgErp || 0,
            })(<RadioGroup options={[{ label: '否', value: 0 }, { label: '是', value: 1 }]} />)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col style={{ width: 1100 }}>
          <FormItem label=" " {...formItemLayoutNoLable}>
            <Button type="primary" onClick={handleOk}>
              保存
            </Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}
BasicSetForm.propTypes = {
  accuracy: PropTypes.number,
  dispatchAction: PropTypes.func,
  currentOrgDetail: PropTypes.object,
  hideItems: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create()(BasicSetForm)
