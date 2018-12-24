import React from 'react'
import { Modal } from 'antd'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

const modalFormData = ({
  treeList,
  dispatchAction,
  articleDetail,
  handleBlur,
}) => {
  const {
    articleContent,
    articleCoverUrl,
    articleLinkAddress,
    articleTitle,
    columns,
    seoDescription,
    seoKeywords,
    seoTitle,
  } = articleDetail
  return [{
    label: '栏目',
    layout: formItemLayout,
    field: 'columns',
    options: {
      initialValue: columns,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'TreeSelect',
      props: {
        treeNodeFilterProp: 'title',
        showSearch: true,
        allowClear: true,
        multiple: true,
        treeDefaultExpandAll: true,
        dropdownStyle: { maxHeight: 400, overflow: 'auto' },
        placeholder: '请选择栏目',
        treeData: treeList,
        getPopupContainer: () => {
          const layout = document.querySelector('.aek-layout')
          if (layout) {
            return layout
          }
          return document.querySelector('body')
        },
      },
    },
  }, {
    label: '标题',
    layout: formItemLayout,
    field: 'articleTitle',
    options: {
      initialValue: articleTitle,
      rules: [{ required: true, whitespace: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请用简要的文字描述主题',
        maxLength: '30',
        onBlur: handleBlur,
      },
    },
  }, {
    label: '文章内容',
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    field: 'articleContent',
    options: {
      initialValue: articleContent,
    },
    component: {
      name: 'Editor',
    },
  }, {
    label: '封面图片',
    layout: formItemLayout,
    field: 'articleCoverUrl',
    extra: '分辨率为260*120,图片请小于200k,格式PNG,JPG',
    options: {
      imgSrc: articleCoverUrl,
      initialValue: articleCoverUrl,
    },
    component: {
      name: 'PicturesWall',
      props: {
        placeholder: '请输入',
        imageUrl: articleCoverUrl,
        accept: '.jpg,.png',
        handleChange(url) {
          dispatchAction({
            payload: {
              articleDetail: {
                ...articleDetail,
                articleCoverUrl: url,
              },
            },
          })
        },
        beforeFunc(file) {
          const isLtLimit = file.size / 1024 < 200
          if (!isLtLimit) {
            Modal.error({
              content: `您只能上传小于${200}K的文件`,
              maskClosable: true,
            })
          }
          return isLtLimit
        },
      },
    },
  }, {
    label: '文章外链',
    layout: formItemLayout,
    field: 'articleLinkAddress',
    options: {
      initialValue: articleLinkAddress,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '如果为外部链接请填写链接地址，填写链接后用户点开文章会自动跳转至该外链',
      },
    },
  },
    (<div className="aek-content-title" style={{ marginBottom: '20px' }}>SEO设置</div>),
    {
      label: '栏目标题',
      layout: formItemLayout,
      field: 'seoTitle',
      options: {
        initialValue: seoTitle,
      },
      component: {
        name: 'Input',
        props: {
          placeholder: 'title标签内容',
          maxLength: '200',
        },
      },
    },
    {
      label: '关键词',
      layout: formItemLayout,
      field: 'seoKeywords',
      options: {
        initialValue: seoKeywords,
      },
      component: {
        name: 'Input',
        props: {
          placeholder: 'keywords信息，多个逗号',
          maxLength: '200',
        },
      },
    },
    {
      label: '描述',
      layout: formItemLayout,
      field: 'seoDescription',
      options: {
        initialValue: seoDescription,
      },
      component: {
        name: 'TextArea',
        props: {
          placeholder: 'description信息',
          maxLength: '200',
        },
      },
    },
  ]
}

export default {
  modalFormData,
}
