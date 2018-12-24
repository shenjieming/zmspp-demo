import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { message, Button, Row, Col, Form, Spin } from 'antd'
import Breadcrumb from '../../components/Breadcrumb'
import { getBasicFn } from '../../utils/index'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import { modalFormData } from './data'
import Styles from './index.less'


const namespace = 'articleManageDetail'
function ArticleManageDetail({
  articleManageDetail,
  loading,
  routes,
  dispatch,
  form: {
    validateFields,
    resetFields,
    getFieldsValue,
    setFieldsValue,
  },
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { treeList, articleDetail, articleId } = articleManageDetail

  // 文章发布
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        const articleContent = values.articleContent || ''
        const textArr = articleContent.split('\n')
        const flag = textArr.some(item => item.length > 7)
        if (!(values.articleLinkAddress || flag)) {
          message.error('文章内容和文章外链接必须填写一项')
          return
        }
        dispatchAction({
          type: articleId ? 'setArticleEdit' : 'setArticleAdd',
          payload: {
            ...articleDetail,
            ...values,
            articleId,
          },
        }).then(() => {
          if (articleId) {
            dispatch(routerRedux.push('/websiteManage/articleManage'))
          } else {
            dispatchAction({
              payload: {
                articleDetail: {},
                articleContent: '',
              },
            })
            resetFields()
            dispatch({
              type: 'articleManage/updateState',
              payload: {
                atricleSerachData: {
                  current: 1,
                  pageSize: 10,
                },
              },
              partObj: true,
            })
            dispatch(routerRedux.push('/websiteManage/articleManage'))
          }
        })
      }
    })
  }
  const handleBlur = () => {
    const { articleTitle } = getFieldsValue(['articleTitle', 'seoTitle'])
    if (articleTitle) {
      setFieldsValue({ seoTitle: articleTitle })
    }
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <div className="content">
        <Spin spinning={getLoading('setArticleAdd', 'setArticleEdit')}>
          <h2 className="aek-mb20">{articleId ? '编辑文章' : '新增文章'}</h2>
          <Form className={`${Styles['article-content']}`}>
            <GetFormItem formData={modalFormData(
              {
                treeList,
                dispatchAction,
                articleDetail,
                handleBlur,
              },
            )}
            />
          </Form>
          <Row span={24}>
            <Col span={6} />
            <Col span={12}>
              <Button onClick={handleOk} type="primary">发布</Button>
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  )
}

ArticleManageDetail.propTypes = {
  articleManageDetail: PropTypes.object,
  loading: PropTypes.object,
  routes: PropTypes.array,
  form: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ articleManageDetail, loading }) => ({
  articleManageDetail,
  loading,
}))(Form.create()(ArticleManageDetail))
