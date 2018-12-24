import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { forEach } from 'lodash'
import { Row, Col, Input, Form, Rate, Popover, Button, Checkbox, Avatar, Spin } from 'antd'

import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import { getBasicFn } from '../../../../utils/index'

import styles from './index.less'

const FormItem = Form.Item
const TextArea = Input.TextArea
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
const namespace = 'orderRate'

const OrderRate = ({
  orderRate,
  loading,
  routes,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const { supplierInfo, formId } = orderRate
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const appraiseItems = []
      forEach(values, (n, key) => {
        const match = key.match('appraiseType')
        if (match) {
          const item = {
            appraiseType: Number(key.replace('appraiseType', '')),
            appraiseScore: n,
          }
          appraiseItems.push(item)
        }
      })
      const param = {
        appraiseAnonymous: values.appraiseAnonymous,
        appraiseContent: values.appraiseContent,
        appraiseItems,
        formId,
        supplierOrgId: supplierInfo.supplierOrgId,
        supplierOrgName: supplierInfo.supplierOrgName,
      }
      dispatchAction({ type: 'saveAppraise', payload: { ...param } })
    })
  }
  const appraiseList = ['配送速度', '服务态度']
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <APanel>
        <Spin spinning={getLoading('getSupplierInfo')}>
          <Row className={styles.supplierInfo}>
            <Col span="12" className={styles.topRight}>
              <Avatar
                className={styles.avatar}
                src={supplierInfo.supplierOrgLogoUrl}
                icon="user"
              />
              <div className={styles.dealerBasic}>
                <div className="aek-font-large">{supplierInfo.supplierOrgName}</div>
                <div>
                  {supplierInfo.contactName}
                  <span className="aek-fill-15" />
                  {supplierInfo.contactPhone}
                </div>
              </div>
            </Col>
          </Row>
          <div className={styles.rateFrom}>
            <Row>
              <Col span="12" style={{ padding: '10px' }}>
                <span className="aek-font-large">评价内容</span>
                {getFieldDecorator('appraiseContent')(
                  <TextArea className={styles.textArea} rows={10} spellCheck="false" />,
                )}
              </Col>
            </Row>
            <Row>
              <Col span="12" style={{ padding: '10px' }}>
                <Form>
                  {appraiseList.map((text, index) => (
                    <FormItem
                      {...FORM_ITEM_LAYOUT}
                      key={index}
                      label={text}
                    >
                      {getFieldDecorator(`appraiseType${index + 1}`, {
                        initialValue: 5,
                      })(
                        <Rate />,
                      )}
                    </FormItem>
                  ))}
                </Form>
              </Col>
            </Row>
            <Row style={{ padding: '10px' }}>
              <Button type="primary" onClick={submitHandler}>
                保存
              </Button>
              {getFieldDecorator('appraiseAnonymous', {
                initialValue: true,
                valuePropName: 'checked',
              })(
                <Checkbox style={{ marginLeft: '40px' }}>匿名评价</Checkbox>,
              )}
            </Row>
          </div>
        </Spin>
      </APanel>
    </div>
  )
}

OrderRate.propTypes = {
  orderRate: PropTypes.object,
  loading: PropTypes.object,
  routes: PropTypes.array,
  form: PropTypes.object,
}
export default connect(({ orderRate, loading }) => ({ orderRate, loading }))(Form.create()(OrderRate))
