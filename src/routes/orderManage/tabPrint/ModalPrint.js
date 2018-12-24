import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
// import Barcode from 'react-barcode'
import style from './style.less'
import { printContent, verticalContent } from '../../../utils'
import { baseURL } from '../../../utils/config'

const propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  printData: PropTypes.object,
  isbarCode: PropTypes.bool,
}
const ModalPrint = ({ onCancel, isbarCode, visible, printData }) => {
  const getCode = ({ productCode, SN, startSN = 0, endSN = 0, batchNumber, validity }) => {
    const SNlength = Math.max(startSN.length, endSN.length)
    const ret = []
    const date = (validity || '').replace(/-/g, '').substr(2)
    if (SN) {
      ret.push({
        code: `${productCode ? `01${productCode}` : ''}${batchNumber ? `10${batchNumber}` : ''}${
          date ? `17${date}` : ''
        }${SN ? `21${SN}` : ''}`,
        view: `${productCode ? `(01)${productCode}` : ''}${
          batchNumber ? `(10)${batchNumber}` : ''
        }${date ? `(17)${date}` : ''}${SN ? `(21)${SN}` : ''}`,
      })
    } else if (!startSN && !endSN) {
      ret.push({
        code: `${productCode ? `01${productCode}` : ''}${batchNumber ? `10${batchNumber}` : ''}${
          date ? `17${date}` : ''
        }`,
        view: `${productCode ? `(01)${productCode}` : ''}${
          batchNumber ? `(10)${batchNumber}` : ''
        }${date ? `(17)${date}` : ''}`,
      })
    } else {
      for (let i = startSN - 0; i <= endSN - 0; i += 1) {
        let idx = ''
        for (let idxI = 0; idxI < SNlength - String(i).length; idxI += 1) {
          idx = `0${idx}`
        }
        idx = `${idx}${i}`
        ret.push({
          idx,
          code: `${productCode ? `01${productCode}` : ''}${batchNumber ? `10${batchNumber}` : ''}${
            date ? `17${date}` : ''
          }${idx ? `21${idx}` : ''}`,
          view: `${productCode ? `(01)${productCode}` : ''}${
            batchNumber ? `(10)${batchNumber}` : ''
          }${date ? `(17)${date}` : ''}${idx ? `(21)${idx}` : ''}`,
        })
      }
    }
    return ret
  }
  const getContent = (data = {}, isPrint = false) => {
    const codeArr = getCode(data)
    const {
      materialsName,
      specification,
      factory,
      productCode,
      batchNumber,
      validity,
      SN,
      printPaper,
    } = data
    const tabStyle = () => {
      if (isPrint) {
        if (printPaper === 'tab') {
          return {
            pageBreakAfter: 'always',
            display: 'block',
            margin: '0',
          }
        }
        return codeArr.length === 1 ? { margin: '0' } : undefined
      }
      return undefined
    }
    const iofo = verticalContent([
      materialsName && <div className="aek-text-overflow">{`物资名称：${materialsName}`}</div>,
      specification && `规格型号：${specification}`,
      factory && <div className="aek-text-overflow">{`生产厂家：${factory}`}</div>,
      productCode && `产品码：${productCode}`,
      batchNumber && `生产批号：${batchNumber}`,
      validity && `有效期：${validity}`,
      SN && `序列号：${SN}`,
    ])
    return (
      <div>
        {codeArr.map(({ code, idx, view }) => (
          <div className={style.print} key={code} style={tabStyle()}>
            {!isbarCode ? iofo : null}
            {productCode && idx ? <p>{`序列号：${idx}`}</p> : null}
            <div>
              <img
                style={{ width: '200px', height: '40px' }}
                alt="tag"
                src={`${baseURL}/generate-barcode?code=${code}`}
              />
              <p>{view}</p>
            </div>
          </div>
        ))}
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
  return <Modal {...modalOpts}>{content}</Modal>
}

ModalPrint.propTypes = propTypes

export default ModalPrint
