import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  Button,
  message,
  Row,
  Col,
  Form,
  Input,
  Modal,
  DatePicker,
  Icon,
  Upload,
  Popover,
} from 'antd'
import moment from 'moment'
import { cloneDeep, debounce } from 'lodash'
import { getBasicFn, digitUppercase, getUploadAuth } from '../../../utils/index'
import Styles from './index.less'
import InputNumber from '../../../components/LkcInputNumber'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import SelectModal from './certificateSelect'
import {
  getConfig,
  uploadButton,
} from '../../../components/UploadButton'
import {
  IMG_UPLOAD,
  UPYUN_BUCKET,
  IMG_SIZE_LIMIT,
  IMG_ORIGINAL,
} from '../../../utils/config'
import LoanAuth from '../../../assets/loanThirdAuth.png'
import LoanBid from '../../../assets/loanThirdBid.png'
import LoanInvoice from '../../../assets/loanThirdInvoice.png'
import LoanPurchase from '../../../assets/loanThirdPurchase.png'
import LoanSale from '../../../assets/loanThirdSale.png'
import { popoverPhotoList } from '../../shared/fianceLoan'

const namespace = 'loanApply'
const FormItem = Form.Item
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
const Third = ({
  loanApply,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
  },
}) => {
  const {
    stepIndex,
    receivableOrderMoney,
    invoiceCapitalList,
    photoSelectedList,
    receivableOrderSelectedList,
    receivableOrderSelected,
    customerSelected,
    radomKey,
  } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const columns = [{
    dataIndex: 'index',
    key: 'index',
    title: '序号',
    className: 'aek-text-center',
    width: 50,
    render(value, record, index) {
      return index + 1
    },
  }, {
    dataIndex: 'formNo',
    key: 'formNo',
    title: '入库单号',
  }, {
    dataIndex: 'stockInTime',
    key: 'stockInTime',
    title: '入库时间',
    className: 'aek-text-center',
  }, {
    dataIndex: 'formAmount',
    key: 'formAmount',
    title: '入库单金额（元）',
    className: 'aek-text-right',
  }, {
    dataIndex: 'balance',
    key: 'balance',
    title: '可贷金额（元）',
    className: 'aek-text-right',
  }, {
    dataIndex: 'formId',
    key: 'formId',
    title: '操作',
    className: 'aek-text-center',
    width: 60,
    render(value) {
      const review = () => {
        dispatchAction({
          type: 'getReceivableOrderDetail',
          payload: {
            formId: value,
            orderDetailVisible: true,
          },
        })
      }
      return (<a onClick={review}>详情</a>)
    },
  }]

  const tableProps = {
    dataSource: receivableOrderSelectedList,
    bordered: true,
    columns,
    rowKey: 'formId',
    loading: getLoading('setSecondSubmit'),
    pagination: false,
  }
  // 获取所有填写的发票信息
  const getInvoiceInfo = (data) => {
    const basicReq = data
    const retList = cloneDeep(invoiceCapitalList)
    const fields = ['invoiceNo', 'invoiceDate', 'invoiceAmount', 'invoiceCapital', 'invoiceUrl']
    for (const [key, value] of Object.entries(basicReq)) {
      fields.some((item) => {
        const flag = key.includes(item)
        if (flag) {
          const splArray = key.split('-')
          const second = parseInt(splArray[1], 10)
          retList.forEach((retItem, index) => {
            if (retItem.radomKey === second) {
              retItem[splArray[0]] = value
              if (splArray[0] === 'invoiceCapital') {
                retItem.invoiceCapital = invoiceCapitalList[index].invoiceCapital
              } else if (splArray[0] === 'invoiceUrl') {
                retItem.invoiceUrl = invoiceCapitalList[index].invoiceUrl
              }
            }
          })
        }
        return flag
      })
    }
    return retList
  }
  // 发票信息至少有一项填写完整
  const onceComplete = ({
    invoiceNo = '',
    invoiceDate,
    invoiceAmount,
    invoiceCapital,
    invoiceUrl,
  }) => !!(invoiceNo.trim().length && invoiceDate && invoiceAmount && invoiceCapital && Object.keys(invoiceUrl).length)
  // 金额失焦事件
  const inputNumberBlur = (e, fields) => {
    const array = cloneDeep(invoiceCapitalList)
    const value = e.target.value
    let retMoney = 0
    if (value) {
      retMoney = digitUppercase(value)
    } else {
      retMoney = digitUppercase(0)
    }
    const splitArr = fields.split('-')
    for (const item of array) {
      if (item.radomKey === parseInt(splitArr[1], 10)) {
        item.invoiceCapital = retMoney
      }
    }
    dispatchAction({
      payload: {
        invoiceCapitalList: array,
      },
    })
  }

  // 添加发票
  const addInvoice = () => {
    if (!(invoiceCapitalList && invoiceCapitalList.length)) {
      const invoicelist = []
      invoicelist.push({
        invoiceCapital: '零元整',
        invoiceNo: '',
        invoiceDate: '',
        invoiceAmount: '',
        invoiceUrl: {},
        radomKey: radomKey + 1,
      })
      dispatchAction({
        payload: {
          invoiceCapitalList: invoicelist,
          radomKey: radomKey + 1,
        },
      })
    }
    // 从form表单中获取数据
    validateFields((error, data) => {
      const invoicelist = getInvoiceInfo(data)
      // const invoicelist = cloneDeep(invoiceCapitalList)
      for (const item of invoicelist) {
        const flag = onceComplete(item)
        if (!flag) {
          message.error('请完善发票信息')
          return
        }
      }
      invoicelist.push({
        invoiceCapital: '零元整',
        invoiceNo: '',
        invoiceDate: '',
        invoiceAmount: '',
        invoiceUrl: {},
        radomKey: radomKey + 1,
      })
      dispatchAction({
        payload: {
          invoiceCapitalList: invoicelist,
          radomKey: radomKey + 1,
        },
      })
    })
  }
  const onSearchOrgDelay = debounce(() => {
    addInvoice()
  }, 500)
  // 删除事件
  const deleteInvoice = (index, key) => {
    const array = cloneDeep(invoiceCapitalList)
    for (const item of array) {
      if (item.radomKey === key) {
        array.splice(index, 1)
        break
      }
    }
    dispatchAction({
      payload: {
        invoiceCapitalList: array,
      },
    })
  }
  // 限制图片大小
  const handleBeforeUpload = (file) => {
    const isLtLimit = file.size / 1024 / 2014 < IMG_SIZE_LIMIT
    if (!isLtLimit) {
      Modal.error({
        content: `您只能上传小于${IMG_SIZE_LIMIT}MB的文件`,
        maskClosable: true,
      })
    }
    return isLtLimit
  }
  // 发票信息
  const invoiceList = () => {
    const retList = []
    invoiceCapitalList.forEach((item, index) => {
      retList.push(
        <div key={item.radomKey} className={Styles['aek-invoice-content']}>
          <Form className={Styles['aek-invoice-list']}>
            <Row span={24}>
              <Col span={8}>
                <FormItem label="发票号码" {...FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(`invoiceNo-${item.radomKey}`, {
                    initialValue: item.invoiceNo,
                    rules: [
                      {
                        pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
                        message: '用户非法输入',
                      },
                    ],
                  })(
                    <Input placeholder="请输入发票号码" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="发票日期" {...FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(`invoiceDate-${item.radomKey}`, {
                    initialValue: item.invoiceDate ? moment(item.invoiceDate) : null,
                  })(
                    <DatePicker
                      placeholder="请输入发票日期"
                      disabledDate={current => current && current.valueOf() >= Date.now()}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col span={8}>
                <FormItem label="发票金额" {...FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(`invoiceAmount-${item.radomKey}`, {
                    initialValue: item.invoiceAmount,
                  })(
                    <InputNumber
                      placeholder="请输入金额"
                      onBlur={(e) => {
                        inputNumberBlur(e, `invoiceAmount-${item.radomKey}`)
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="金额大写" {...FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(`invoiceCapital-${item.radomKey}`)(
                    <span className="ant-form-text">{item.invoiceCapital}</span>,
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem label="发票图片" {...FORM_ITEM_LAYOUT}>
                  {getFieldDecorator(`invoiceUrl-${item.radomKey}`)(
                    <Upload
                      name="file"
                      headers={
                        { 'X-Requested-With': null }
                      }
                      data={getUploadAuth()}
                      action={`${IMG_UPLOAD}/${UPYUN_BUCKET}`}
                      accept=".jpg,.png,.bmp,.pdf"
                      beforeUpload={handleBeforeUpload}
                      showUploadList={false}
                      onChange={(info) => {
                        const fileList = cloneDeep(invoiceCapitalList)
                        if (info.file.status === 'done') {
                          fileList[index].invoiceUrl = {
                            ...info.file,
                            url: `${IMG_ORIGINAL}/${info.file.response.content}`,
                          }
                          dispatchAction({
                            payload: {
                              invoiceCapitalList: fileList,
                            },
                          })
                        } else if (info.file.status === 'error') {
                          Modal.error({
                            content: '图片上传失败',
                            maskClosable: true,
                          })
                        }
                      }}
                    >
                      <Button>
                        <Icon type="upload" />上传图片
                      </Button>
                      <p>
                        {(invoiceCapitalList[index].invoiceUrl) ? invoiceCapitalList[index].invoiceUrl.name : ''}
                      </p>
                    </Upload>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className={`${Styles['aek-invoice-delete']}`}>
            <a
              onClick={() => {
                deleteInvoice(index, item.radomKey)
              }}
            ><Icon type="close-circle-o" /></a>
          </div>
        </div>,
      )
    })
    return retList
  }
  // 上一步按钮
  const firstPrevClick = () => {
    dispatchAction({
      payload: {
        stepIndex: stepIndex - 1,
        receivableOrderSelected: [],
        receivableOrderMoney: 0,
        invoiceCapitalList: [{
          invoiceCapital: '零元整',
          invoiceNo: '',
          invoiceDate: '',
          invoiceAmount: '',
          invoiceUrl: {},
          radomKey: radomKey + 1,
        }],
      },
    })
    dispatchAction({
      type: 'getReceivableOrderList',
      payload: {
        current: 1,
        pageSize: 10,
        customerOrgId: customerSelected[0],
      },
    })
  }
  // 下一步按钮事件
  const secondNextClick = () => {
    const photoList = cloneDeep(photoSelectedList)
    validateFields((errors, data) => {
      const invoicelist = getInvoiceInfo(data)
      const newList = invoicelist.filter((item) => {
        const flag = onceComplete(item)
        // 排除没有完善的信息
        return flag
      })
      if (!newList.length) {
        Modal.error({
          title: '请完善信息',
          content: '发票信息至少要完整填写一项',
        })
        return
      }
      if (!photoList.length) {
        message.error('请选择资质信息')
        return
      }
      let str = ''
      if (data.delayedCertificateImageUrls.length) {
        for (const obj of data.delayedCertificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
        photoList.push({
          mortgageType: 5,
          mortgageUrl: str,
        })
      }
      for (const item of newList) {
        item.invoiceDate = item.invoiceDate.format('YYYY-MM-DD')
        item.invoiceUrl = `${item.invoiceUrl.url}`
      }
      dispatchAction({
        type: 'setThirdSubmit',
        payload: {
          customerOrgId: customerSelected.join(','),
          formIds: receivableOrderSelected.join(','),
          invoices: newList,
          mortgages: photoList,
          receivableAmount: receivableOrderMoney,
        },
      })
    })
  }
  // 证件选择改变函数
  const handleVisibleChange = () => {
    dispatchAction({
      type: 'getMortgageList',
      payload: {
        customerOrgId: customerSelected[0],
      },
    })
  }
  // 供应商证件
  const supplier = [{
    name: '1、中标通知书',
    src: LoanBid,
  }, {
    name: '2、与医院签订的采购合同',
    src: LoanPurchase,
  }, {
    name: '3、与厂家签订的销售合同',
    src: LoanSale,
  }]
  // 配送商
  const distributor = [{
    name: '1、经销授权书',
    src: LoanAuth,
  }, {
    name: '2、上游开具的发票',
    src: LoanInvoice,
  }]
  const extraNode = (<span>
    温馨提示：证件类型参照
    <Popover
      content={<div>
        <p>一、我是供应商--所需要提前准备证件</p>
        <div style={{ width: '330px' }}>
          {supplier.map(item => (
            <div className={Styles['aek-tooltip-list']} key={item.name}>
              <img src={item.src} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <p>一、我是配送商--所需要提前准备证件</p>
        <div style={{ width: '330px' }}>
          {distributor.map(item => (
            <div className={Styles['aek-tooltip-list']} key={item.name}>
              <img src={item.src} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>}
    >
      <Icon type="info-circle" />
    </Popover>
  </span>)
  // 证件选择弹框参数
  const modalProps = {
    loanApply,
    loading,
  }
  return (
    <div>
      <Table
        {...tableProps}
      />
      <Row span={24} className={`aek-mt20 ${Styles['aek-total']}`}>
        <Col span={2}>
          总计
        </Col>
        <Col span={5}>
          共选择{receivableOrderSelectedList.length || 0}笔入库单
        </Col>
        <Col span={6} offset={10}>
          可贷金额{receivableOrderMoney || 0}元
        </Col>
      </Row>
      <div className={`${Styles['aek-content-title']} aek-mt20`}>
        发票信息
      </div>
      <div>
        {invoiceList()}
      </div>
      <div className={Styles['aek-invoice-add']}>
        <a
          onClick={onSearchOrgDelay}
        >
          <Icon type="plus-circle-o" /><span style={{ fontSize: 'initial' }} className="aek-ml10">添加发票</span>
        </a>
      </div>
      <div className={`${Styles['aek-content-title']} aek-mt20`}>
        供货资质
      </div>
      <div className="aek-mt30">
        <Form>
          <FormItem
            label="供货资质"
            {...FORM_ITEM_LAYOUT}
            extra={extraNode}
          >
            {getFieldDecorator('mortgages')(
              <Button onClick={handleVisibleChange}>选择证件</Button>,
            )}
          </FormItem>
          <Row className="aek-mb20" span={24}>
            <Col span={6} />
            <Col span={18}>
              <div className={Styles['aek-photo-content']}>
                {popoverPhotoList({
                  imageList: photoSelectedList,
                })}
              </div>
            </Col>
          </Row>
          <FormItem label="上游开具的发票" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('delayedCertificateImageUrls', {
              ...getConfig(),
              rules: [{
                validator: (_, value, callback) => {
                  if (value.some(({ status }) => status !== 'done')) {
                    callback('图片上传中，请稍等')
                  }
                  callback()
                },
              }],
            })(uploadButton)}
          </FormItem>
        </Form>
      </div>
      <div className="aek-mt30">
        <Button onClick={secondNextClick} className="aek-mr20" type="primary">下一步</Button>
        <Button onClick={firstPrevClick} >上一步</Button>
      </div>
      <SelectModal {...modalProps} />
    </div>
  )
}

Third.propTypes = propTypes
export default Form.create()(Third)
