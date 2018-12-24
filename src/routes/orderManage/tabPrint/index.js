import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Form, Modal, Icon } from 'antd'
import { aekConnect, getBasicFn } from '../../../utils'
import { ContentLayout, LkcForm } from '../../../components'
import { getFormData } from './data'
import { typeMenu, act } from './style.less'
import ModalPrint from './ModalPrint'
import TabTypePrint from '../../shared/tabPrint'


const namespace = 'tabPrint'
const Confirm = Modal.confirm
const propTypes = {
  toAction: PropTypes.func,
  getLoading: PropTypes.func,
  form: PropTypes.object,
  tabPrint: PropTypes.object,
}
function TabPrint({
  toAction,
  form: {
    getFieldValue, getFieldDecorator,
    resetFields, validateFieldsAndScroll,
    setFields,
  },
  tabPrint: {
    isbarCode,
    barcode,
    isSinglePrint,
    modalPrintView,
    printData,

    tabPrintType,
    tabType,
    tabPrintModalVisible,
    tabPrintData,
  },
  getLoading,
}) {
  const { dispatchAction } = getBasicFn({ namespace })
  const tabChange = (type) => {
    resetFields()

    switch (type) {
      case 1:
        toAction({
          tabPrintType: false,
          isbarCode: true,
          barcode: false,
        })
        break
      case 2:
        toAction({
          tabPrintType: false,
          isbarCode: false,
          barcode: true,
        })
        break
      default:
        toAction({
          tabPrintType: true,
          isbarCode: false,
          barcode: false,
        })
        break
    }
  }
  const printView = () => {
    validateFieldsAndScroll((err, value) => {
      if (!err) {
        if (tabPrintType) {
          let all = []
          if (value.code.endsWith('\n')) {
            const len = value.code.length
            all = value.code.substr(0, len - 1).split('\n')
          } else {
            all = value.code.split('\n')
          }

          dispatchAction({
            type: 'check',
            payload: {
              barcodes: all,
            },
          }).then((content) => {
            const req = all.filter((item) => {
              if (content.barcodes.indexOf(item) > -1 || content.deleteBarcodes.indexOf(item) > -1) {
                return false
              }
              return true
            })
            if (content.checkFlag === 1) {
              dispatchAction({
                payload: {
                  tabPrintModalVisible: true,
                },
              })
              dispatchAction({
                type: 'checkDataList',
                payload: {
                  barcodes: req,
                },
              })
            } else if (content.checkFlag === 2) {
              Confirm({
                content: (<div>
                  {(!!content.barcodes && !!content.barcodes.length) && <p className="aek-word-break">如下院内码未找到配送信息，请检查是否填写有误(请注意，院内码每行填写就一个)：{content.barcodes.join()}</p>}
                  {(!!content.deleteBarcodes && !!content.deleteBarcodes.length) && <p className="aek-word-break">如下院内码的配送单已作废，无法打印:{content.deleteBarcodes.join()}</p>}
                  <p>单击确定打印剩余部分院内码</p>
                </div>),
                onOk() {
                  dispatchAction({
                    payload: {
                      tabPrintModalVisible: true,
                    },
                  })
                  dispatchAction({
                    type: 'checkDataList',
                    payload: {
                      barcodes: req,
                    },
                  })
                },
              })
            } else if (content.checkFlag === 3) {
              Modal.error({
                content: (
                  <div>
                    {(!!content.barcodes && !!content.barcodes.length) && <p className="aek-word-break">如下院内码未找到配送信息，请检查是否填写有误(请注意，院内码每行填写就一个)：{content.barcodes.join()}</p>}
                    {(!!content.deleteBarcodes && !!content.deleteBarcodes.length) && <p className="aek-word-break">如下院内码的配送单已作废，无法打印:{content.deleteBarcodes.join()}</p>}
                  </div>
                ),
              })
            }
          })
          return
        }
        const viewModal = () => {
          toAction({
            modalPrintView: true,
            printData: value,
          })
        }


        if (!value.SN && (value.endSN - value.startSN > 99)) {
          Modal.confirm({
            title: '打印序列号SN个数已大于100，您确定打印?',
            content: `起始序列：${value.startSN}，终止序列：${value.endSN}`,
            onOk() { viewModal() },
          })
        } else { viewModal() }
      }
    })
  }
  const modalPrintProps = {
    printData,
    isbarCode,
    visible: modalPrintView,
    onCancel() {
      toAction({
        modalPrintView: false,
        printData: {},
      })
    },
  }

  const getTitle = () => {
    if (isbarCode) {
      return '条形码打印'
    } else if (barcode) {
      return '标签打印'
    } else if (tabPrintType) {
      return '院内码标签打印'
    }
    return ''
  }

  // 打印标签
  const tabPrintProps = {
    onCancel() {
      dispatchAction({
        payload: {
          tabPrintModalVisible: false,
        },
      })
    },
    visible: tabPrintModalVisible,
    printData: tabPrintData,
    printType: tabType,
    loading: getLoading('getTabPrintData'),
    makeUp: true,
  }

  const printPaperChange = (e) => {
    dispatchAction({
      payload: {
        tabType: Number(e.target.value),
      },
    })
  }

  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: (
      <div className="aek-layout-hor">
        <div className="left" style={{ paddingRight: 10 }}>
          <div className="aek-content-title">打印类型选择</div>
          <div
            style={{ marginTop: '-10px' }}
            className={classnames(typeMenu, { [act]: isbarCode })}
            onClick={() => {
              tabChange(1)
            }}
          >
            条形码打印
          </div>
          <div
            className={classnames(typeMenu, { [act]: barcode })}
            onClick={() => {
              tabChange(2)
            }}
          >
            标签打印
          </div>
          <div
            className={classnames(typeMenu, { [act]: tabPrintType })}
            onClick={() => {
              tabChange(3)
            }}
          >
            院内标签打印
          </div>
        </div>
        <div className="right" style={{ paddingLeft: 10 }}>
          <div className="aek-content-title">{getTitle()}</div>
          <LkcForm
            style={{ marginTop: 40, width: 700 }}
            getFieldDecorator={getFieldDecorator}
            onSubmit={printView}
            formData={getFormData({
              isbarCode,
              isSinglePrint,
              getFieldValue,
              setFields,
              tabPrintType,
              printPaperChange,
              numChange({ target: { value } }) {
                toAction({ isSinglePrint: value === 'single' })
              },
            })}
          />
          <ModalPrint {...modalPrintProps} />
          {/* 院内码标签打印 */}
          <TabTypePrint {...tabPrintProps} />
        </div>
      </div>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}

TabPrint.propTypes = propTypes
export default aekConnect()(Form.create()(TabPrint))
