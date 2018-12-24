// 商机审核
import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { Form, Alert, Button, message, Spin, Row, Col, Upload, Modal } from 'antd'
import { cloneDeep } from 'lodash'

import GetFormItem from '../../../components/GetFormItem'
import { formData } from './props'
import { getBasicFn } from '../../../utils'
import { uploadZipProps } from '../../../components/UploadButton'

import Breadcrumb from '../../../components/Breadcrumb'


const propTypes = {
  releaseDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
const namespace = 'releaseDetail'

const Release = ({ releaseDetail, loading, form: { validateFields } }) => {
  const {
    data,
    typeList,
    currentFileList,
  } = releaseDetail
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const handleSubmit = (type) => {
    validateFields((errors, values) => {
      if (!errors) {
        const reqData = cloneDeep(values)
        let notUploaded = false
        if (reqData.chanceImageUrls) {
          reqData.chanceImageUrls = values.chanceImageUrls.map(item => item.value).join()
        }
        // let chanceStr = ''
        const chanceAppendixUrls = JSON.stringify(
          currentFileList.map((item) => {
            if (item.status !== 'done') {
              notUploaded = true
              Modal.error({
                content: '当前有文件未成功上传!',
              })
            }
            return {
              name: item.name,
              url: `${item.url || item.response.url}`,
            }
          }),
        )
        if (notUploaded) {
          return
        }
        // 类型
        if (values.chanceTagValue) {
          reqData.chanceTagText = values.chanceTagValue.label
          reqData.chanceTagValue = values.chanceTagValue.key
        }

        let url = 'releaseSubmit'
        if (type) {
          url = 'saveSubmit'
        }
        const payload = {
          ...data,
          ...reqData,
          chanceAppendixUrls,
        }
        dispatchAction({
          type: url,
          payload,
        }).then(() => {
          message.success('操作成功')
          dispatchAction({
            payload: {
              currentImageList: [],
            },
          })
          dispatchAction(routerRedux.push('/business/myRelease'))
        })
      }
    })
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Spin spinning={getLoading('getData', 'releaseSubmit', 'saveSubmit', 'getTagTypeList')}>
          {data &&
            data.showRemarkFlag && (
              <Alert description={data.chanceRemark} type="warning" showIcon className="aek-mt20 aek-word-break" />
            )}
          <Form className="aek-mt20">
            <GetFormItem
              formData={formData({
                typeList,
                data,
              })}
            />
          </Form>
          <Row style={{ marginBottom: '20px' }}>
            <Col offset={3} span={12}>
              <Upload
                className="upload"
                {...uploadZipProps}
                disabled={currentFileList.length > 8}
                fileList={currentFileList}
                onChange={({ fileList }) => {
                  dispatchAction({
                    type: 'updateState',
                    payload: { currentFileList: fileList },
                  })
                }}
              >
                <Button>上传附件</Button>
              </Upload>
            </Col>
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col offset={3} span={12}>
              <div
                style={{
                  color: '#bebebe',
                  fontSize: '12px',
                  fontWeight: 'initial',
                  lineHeight: 2,
                }}
              >
                <div style={{ overflow: 'hidden', paddingLeft: 10 }}>
                  <p>（最多可上传9个附件，格式限Zip、rar，每个文件最大50M）</p>
                </div>
              </div>
            </Col>
          </Row>,
          <Row style={{ marginBottom: '20px' }}>
            <Col offset={3} span={12}>
              <Button
                type="primary"
                className="aek-mr30"
                onClick={() => {
                  handleSubmit()
                }}
              >
                提交审核
              </Button>
              <a
                className="aek-ml10"
                onClick={() => {
                  handleSubmit('save')
                }}
              >
                保存草稿
              </a>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  )
}

Release.propTypes = propTypes
export default connect(({ releaseDetail, loading }) => ({
  releaseDetail,
  loading,
}))(Form.create()(Release))
