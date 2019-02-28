import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Pagination, Spin } from 'antd'
import { concat } from 'lodash'
import GetFormItem from '../../../components/GetFormItem/GetFormItem'
// import Barcode from 'react-barcode'
import style from './style.less'
import { printContent, verticalContent, getPagination } from '../../../utils'
import { baseURL } from '../../../utils/config'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  printData: PropTypes.array,
  form: PropTypes.object,
  pagination: PropTypes.object,
  pageChange: PropTypes.func,
  handleChange: PropTypes.func,
  printType: PropTypes.number,
  loading: PropTypes.bool,
  makeUp: PropTypes.bool,
}
const ModalPrint = ({
  onCancel,
  visible,
  printData,
  pagination,
  pageChange,
  handleChange,
  printType = 1,
  loading,
  makeUp = false,
}) => {
  const getContent = (data = [], isPrint = false) => {
    const tabStyle = () => {
      if (isPrint) {
        if (printType === 1) {
          return {
            pageBreakAfter: 'always',
            display: 'block',
            margin: '0',
          }
        }
        // return {
        //   margin: '8px',
        // }
      }
      return {}
    }

    const info = (item) => {
      const {
        materialsName,
        materialsSku,
        batchNo,
        expiredDate,
        trackCode,
      } = item
      return [
        <div key="materialsName" className={'aek-text-overflow'}>名称：{materialsName}</div>,
        <div key="materialsSku" className="aek-text-overflow">规格：{materialsSku}</div>,
        <div key="batchNo" className="aek-text-overflow">批号：{batchNo}</div>,
        <span key="expiredDate" style={{ display: 'inline-block', width: '50%' }} className="aek-text-overflow">效期：{expiredDate}</span>,
        <span key="trackCode" style={{ display: 'inline-block', width: '50%' }} className="aek-text-overflow">跟踪码：{trackCode}</span>,
      ]
    }

    const getMainContent = () => {
      let retArr = []
      data.forEach((items) => {
        const {
          barcodes = [],
        } = items
        const arr = barcodes.map(item => (
          <div className={style.print} key={item} style={tabStyle()}>
            <div>
              <img
                alt="湘雅医院"
                src={`${baseURL}/generate-barcode?code=${item}`}
              />
              <p>{item}</p>
            </div>
            <div className={style.materials}>
              {info(items)}
            </div>
          </div>
        ))
        retArr = concat(retArr, arr)
      })
      // A4纸 14个为一组 强制换页
      if (isPrint) {
        if (printType !== 1) {
          const simpleArr = []
          const length = Math.ceil(retArr.length / 14)
          for (let i = 0; i < length; i += 1) {
            simpleArr.push([])
          }

          retArr.forEach((item, index) => {
            const i = index + 1
            const a = Math.ceil(i / 14) - 1
            simpleArr[a].push(item)
          })

          return simpleArr.map((item, a) => (<div key={a} style={{ pageBreakAfter: 'always' }}>
            {item}
          </div>))
        }
      }
      return retArr
    }

    return (
      <div>
        {getMainContent()}
      </div>
    )
  }
  const print = <div>{getContent(printData, true)}</div>
  const content = <div>{getContent(printData)}</div>
  const modalOpts = {
    title: '打印预览',
    visible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel,
    okText: '打印',
    onOk() {
      printContent(print)
    },
    width: 500,
  }

  const fomData = [{
    label: '打印纸张',
    field: 'type',
    layout: FORM_ITEM_LAYOUT,
    options: {
      initialValue: printType,
    },
    component: {
      name: 'RadioGroup',
      props: {
        onChange: handleChange,
        options: [
          { label: '标签纸', value: 1 },
          { label: 'A4纸', value: 2 },
        ],
      },
    },

  }, <div className="aek-mb10">
    {printType === 1 && '推荐使用长宽大于等于80MM*50MM标签纸进行打印，过小可能导致打印内容超出'}
  </div>]

  const paginationProps = getPagination({
    ...pagination,
    onChange: pageChange,
  })

  return (<Modal {...modalOpts}>
    <Spin spinning={loading}>
      {!makeUp && <Form>
        <GetFormItem
          formData={fomData}
        />
      </Form>}
      <div style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        {content}
      </div>
      {pagination && <Pagination className="aek-mt10" size="small" {...paginationProps} />}
    </Spin>
  </Modal>)
}

ModalPrint.propTypes = propTypes

export default Form.create()(ModalPrint)
