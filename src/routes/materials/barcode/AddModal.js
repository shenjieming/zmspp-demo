import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Select, Button, Radio, message as Message, Upload, Spin, Form } from 'antd'
import classnames from 'classnames'
import { inRange, last, get } from 'lodash'
import Styles from './addModal.less'
import { dateFormat } from './props'
import MoveButton from './MoveButton'
import LkcSelect from '../../../components/LkcSelect'
import {
  uploadProps,
  uploadButtonContent,
  handleFileChange,
} from '../../../components/UploadButton'

const TextArea = Input.TextArea
const Option = Select.Option
const FormItem = Form.Item

const featureIdsArray = [
  'feature1Content',
  'feature2Content',
  'feature3Content',
  'feature4Content',
  'materialsCode',
  'batchNo',
  'produceDate',
  'expiredDate',
  'trackCode',
]

const propTypes = {
  form: PropTypes.object,
  status: PropTypes.oneOf(['add', 'copy', 'edit']),
  details: PropTypes.object,
  factoryData: PropTypes.array,
  supplierData: PropTypes.array,
  approveHandler: PropTypes.func,
  saveEdit: PropTypes.func,
  onCancel: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  handleSelectSearch: PropTypes.func.isRequired,
  onAfterClose: PropTypes.func.isRequired,
  addReasonList: PropTypes.array,
  barcodeMakeList: PropTypes.array,
}

const initialState = {
  inputVisible: false,
  featureFocus: false,
  lightIndexArray: [],
  lightLength: 0,
}

const getIndexFromName = (name, details) => {
  switch (name) {
    case 'feature1':
      return details.feature1Index
    case 'feature2':
      return details.feature2Index
    case 'feature3':
      return details.feature3Index
    case 'feature4':
      return details.feature4Index
    case 'materialsCode':
    case 'batchNo':
    case 'produceDate':
    case 'expiredDate':
    case 'trackCode':
      return details[`${name}Index`]
    default:
      return ''
  }
}

class AddModal extends React.Component {
  static propTypes = propTypes

  static defaultProps = {
    details: {},
    supplierData: [],
    factoryData: [],
  }

  state = initialState

  generateHighlightArray = (content) => {
    const details = this.props.details

    const barcodeExample = details.barcodeExample
    let lightIndex = -1
    const lightIndexArray = []
    let lightLength = 0

    if (content && barcodeExample.includes(content)) {
      lightIndex = barcodeExample.indexOf(content)
      while (lightIndex > -1) {
        lightIndexArray.push(lightIndex + 1)
        lightIndex = barcodeExample.indexOf(content, lightIndex + 1)
      }
      lightLength = content.length

      this.setState({
        lightIndexArray,
        lightLength,
      })
    } else {
      this.setState({
        lightIndexArray,
        lightLength,
      })
    }
  }

  // 获取高亮块
  handleHighlightInputFocus = (e) => {
    const target = e.target
    const id = target.id
    let content = ''
    const details = this.props.details

    if (id === 'feature1Index' || id === 'feature1Content') {
      this.setState({
        featureFocus: 'feature1',
      })
      content = details.feature1Content
    } else if (id === 'feature2Content' || id === 'feature2Index') {
      this.setState({
        featureFocus: 'feature2',
      })
      content = details.feature2Content
    } else if (id === 'feature3Content' || id === 'feature3Index') {
      this.setState({
        featureFocus: 'feature3',
      })
      content = details.feature3Content
    } else if (id === 'feature4Content' || id === 'feature4Index') {
      this.setState({
        featureFocus: 'feature4',
      })
      content = details.feature4Content
    } else if (id === 'materialsCode' || id === 'materialsCodeIndex') {
      this.setState({
        featureFocus: 'materialsCode',
      })
      content = details.materialsCode
    } else if (id === 'batchNo' || id === 'batchNoIndex') {
      this.setState({
        featureFocus: 'batchNo',
      })
      content = details.batchNo
    } else if (id === 'produceDate' || id === 'produceDateIndex') {
      this.setState({
        featureFocus: 'produceDate',
      })
      content = details.produceDate
    } else if (id === 'expiredDate' || id === 'expiredDateIndex') {
      this.setState({
        featureFocus: 'expiredDate',
      })
      content = details.expiredDate
    } else if (id === 'trackCode' || id === 'trackCodeIndex') {
      this.setState({
        featureFocus: 'trackCode',
      })
      content = details.trackCode
    }

    this.generateHighlightArray(content)
  }

  // 生产高亮块类名
  generateBarcodeClassName = (idx) => {
    const details = this.props.details
    const state = this.state

    const { featureFocus, lightIndexArray, lightLength } = state
    const index = getIndexFromName(featureFocus, details)

    let lowLightFlag = false
    let highLightFlag = false

    for (const i of lightIndexArray) {
      if (inRange(idx + 1, i, i + lightLength)) {
        lowLightFlag = true
        if (Number(index) === i) {
          highLightFlag = true
        }
      }
    }

    return classnames({
      [Styles.lowLight]: lowLightFlag,
      [Styles.highLight]: highLightFlag,
    })
  }

  // 高亮div与输入框切换
  handleInputChange = (e) => {
    const target = e.target
    const id = target.id
    const value = target.value
    const handleValueChange = this.props.handleValueChange

    handleValueChange({ [id]: value })
    if (id === 'barcodeExample') {
      const tempValue = value.slice(0, 50).replace(/[()]/g, '')
      handleValueChange({
        barcodeLength: tempValue.length,
        barcodePrefix: tempValue.slice(0, 2),
        barcodeExample: tempValue,
      })
    } else if (id === 'materialsCode') {
      handleValueChange({ materialsCodeLength: value.length })
    } else if (id === 'batchNo') {
      handleValueChange({ batchNoLength: value.length })
    } else if (id === 'trackCode') {
      handleValueChange({ trackCodeLength: value.length })
    }

    if (featureIdsArray.includes(id)) {
      this.generateHighlightArray(value)
    }
  }

  handleMoveButtonClick = (direction) => {
    const state = this.state
    const details = this.props.details
    const handleValueChange = this.props.handleValueChange
    const { featureFocus, lightIndexArray } = state
    const index = getIndexFromName(featureFocus, details)

    if (lightIndexArray.length) {
      if (direction === 'left') {
        const idx = lightIndexArray.indexOf(Number(index))
        if (idx > 0) {
          handleValueChange({ [`${featureFocus}Index`]: String(lightIndexArray[idx - 1]) })
        } else if (idx === -1) {
          handleValueChange({ [`${featureFocus}Index`]: String(lightIndexArray[0]) })
        }
      } else {
        const idx = lightIndexArray.indexOf(Number(index))
        if (idx === -1) {
          handleValueChange({ [`${featureFocus}Index`]: String(last(lightIndexArray)) })
        } else if (lightIndexArray.length - 1 !== idx) {
          handleValueChange({ [`${featureFocus}Index`]: String(lightIndexArray[idx + 1]) })
        }
      }
    }
  }

  handleBarcodeTypechange = (e) => {
    const value = e.target.value
    const handleValueChange = this.props.handleValueChange
    if (value === '2' && !!this.props.details.materialsCode) {
      Modal.confirm({
        title: '请确实该码为副码！',
        content: '物资码已填写，如果切换为副码，物资码将清空，是否继续？',
        onOk: () => {
          handleValueChange({ barcodeType: value })
          handleValueChange({
            materialsCode: '',
            materialsCodeIndex: '',
            materialsCodeLength: 0,
          })
        },
      })
    } else {
      handleValueChange({ barcodeType: value })
      handleValueChange({
        materialsCode: '',
        materialsCodeIndex: '',
        materialsCodeLength: 0,
      })
    }
  }

  // 特征符号判重
  featureSentenced = () => {
    // const details = this.props.details

    // const feature1 = get(details, 'feature1Content', '') + get(details, 'feature1Index', '')
    // const feature2 = get(details, 'feature2Content', '') + get(details, 'feature2Index', '')
    // const feature3 = get(details, 'feature3Content', '') + get(details, 'feature3Index', '')
    // const feature4 = get(details, 'feature4Content', '') + get(details, 'feature4Index', '')

    // let list = [feature1, feature2, feature3, feature4]

    // list = list.filter(x => !!x)

    // const listLength = list.length

    // const realLength = new Set(list).size

    return true
  }

  // 基本信息判重
  basicInfoSentenced = () => {
    // const details = this.props.details

    // const materialsCode = get(details, 'materialsCode', '') + get(details, 'materialsCodeIndex', '')
    // const batchNo = get(details, 'batchNo', '') + get(details, 'batchNoIndex', '')
    // const produceDate = get(details, 'produceDate', '') + get(details, 'produceDateIndex', '')
    // const expiredDate = get(details, 'expiredDate', '') + get(details, 'expiredDateIndex', '')
    // const trackCode = get(details, 'trackCode', '') + get(details, 'trackCodeIndex', '')

    // let list = [materialsCode, batchNo, produceDate, expiredDate, trackCode]

    // list = list.filter(x => !!x)

    // const listLength = list.length

    // const realLength = new Set(list).size

    return true
  }

  // 检查是否填写特征码
  checkFeature = () => {
    const details = this.props.details

    const list = [
      [get(details, 'feature1Content', ''), get(details, 'feature1Index', '')],
      [get(details, 'feature2Content', ''), get(details, 'feature2Index', '')],
      [get(details, 'feature3Content', ''), get(details, 'feature3Index', '')],
      [get(details, 'feature4Content', ''), get(details, 'feature4Index', '')],
    ].filter(x => !x.every(y => !y))

    let flag = true

    flag = list.every(x => x.every(y => !!y))

    return flag && !!list.length
  }

  // 检查副码规则（生产批号、生产日期、有效期、追踪码必填一位）
  checkViceCode = () => {
    const details = this.props.details
    const list = [
      [get(details, 'batchNo', ''), get(details, 'batchNoIndex', '')],
      [get(details, 'produceDate', ''), get(details, 'produceDateIndex', '')],
      [get(details, 'expiredDate', ''), get(details, 'expiredDateIndex', '')],
      [get(details, 'trackCode', ''), get(details, 'trackCodeIndex', '')],
    ].filter(x => !x.every(y => !y))
    let flag = true

    flag = list.every(x => x.every(y => !!y))

    return flag && !!list.length
  }

  // 点击确定
  handleOk = () => {
    let flag = true
    const details = this.props.details
    const barcodeType = details.barcodeType

    if (this.featureSentenced()) {
      if (this.basicInfoSentenced()) {
        if (details.barcodeExample) {
          if (barcodeType === '1') {
            if (!details.barcodePrefix) {
              Message.error('请填写条码前导符')
              flag = false
            }
            if (!details.materialsCode) {
              Message.error('请填写物资码')
              flag = false
            }
          } else if (!this.checkFeature()) {
            Message.error('特征码填写不完整')
            flag = false
          } else if (!this.checkViceCode()) {
            Message.error('副码必要规则缺失')
            flag = false
          }
        } else {
          Message.error('请扫描条码')
          flag = false
        }
      } else {
        Message.error('基本信息重复')
        flag = false
      }
    } else {
      Message.error('特征符号重复')
      flag = false
    }

    if (flag) {
      this.props.form.validateFields({ force: true }, (error) => {
        if (!error) {
          this.props.saveEdit(details, this.props.status)
        }
      })
    }
  }

  // 关闭Modal
  handleCancel = () => {
    this.props.onCancel()
  }

  // 关闭modal后清空数据
  handleAfterClose = () => {
    this.props.onAfterClose()
    this.setState(initialState)
  }

  handleUploadChange = (e) => {
    const files = handleFileChange(e)
    this.props.handleValueChange({ barcodeImageUrls: files })
  }

  render() {
    const { status, visible } = this.props
    const props = this.props
    const details = this.props.details
    const approvePermission = this.props.approvePermission
    const addReasonList = this.props.addReasonList
    const barcodeMakeList = this.props.barcodeMakeList
    const { getFieldDecorator, resetFields } = this.props.form
    const handleInputChange = this.handleInputChange
    const state = this.state
    const inputVisible = state.inputVisible
    const generateBarcodeClassName = this.generateBarcodeClassName
    const featureInputCommonProps = {
      onFocus: this.handleHighlightInputFocus,
    }
    const moveBtnCommonProps = {
      leftButtonClick: () => {
        this.handleMoveButtonClick('left')
      },
      rightButtonClick: () => {
        this.handleMoveButtonClick('right')
      },
      buttonDisable: !state.lightIndexArray.length,
    }

    const footerContent =
      Number(details.barcodeRuleReviewStatus) === 0 ? (
        approvePermission && (
          <div>
            <Button
              type="primary"
              onClick={() => {
                this.props.approveHandler({
                  ...details,
                  barcodeRuleReviewStatus: '1',
                })
              }}
            >
              审核通过
            </Button>
            <Button
              type="primary"
              onClick={() => {
                this.props.approveHandler({
                  ...details,
                  barcodeRuleReviewStatus: '2',
                })
              }}
            >
              审核拒绝
            </Button>
          </div>
        )
      ) : (
        <Button type="primary" onClick={this.handleOk}>
          {' '}
          提交
        </Button>
      )
    return (
      <Modal
        title={`${status === 'edit' ? '维护' : '新增'}规则`}
        visible={visible}
        width={1200}
        wrapClassName="aek-modal"
        onOk={this.handleOk}
        footer={footerContent}
        onCancel={this.handleCancel}
        afterClose={() => {
          resetFields()
          this.handleAfterClose()
        }}
        maskClosable={false}
      >
        <Spin spinning={props.loading}>
          <div className="aek-sub-head">条码</div>
          <div style={{ display: !inputVisible ? 'inherit' : 'none' }}>
            <div className={classnames('aek-barcode', Styles.barcode)}>
              {!!details.barcodeExample &&
                details.barcodeExample.split('').map((x, i) => (
                  <span key={i} className={`${generateBarcodeClassName(i)} ${Styles.idx}`}>
                    {x}
                  </span>
                ))}
            </div>
            <div className={Styles.barcodeIndex}>
              {!!details.barcodeLength &&
                Array(Number(details.barcodeLength))
                  .fill(0)
                  .map((x, i) => (
                    <span key={i} className={classnames(Styles.idx, Styles.index)}>
                      <span className={`${generateBarcodeClassName(i)} ${Styles.sub}`}>
                        {i + 1}
                      </span>
                    </span>
                  ))}
            </div>
          </div>
          <div className="aek-sub-head">请输入条码区别的特征</div>
          <div className={Styles.wrap} style={{ width: '54%', display: 'inline-block' }}>
            <div>
              1.长度共计
              <span className={Styles.codeLength}>{details.barcodeLength}</span>
              位
            </div>
            <div>
              2.以<Input
                className={Styles.short}
                value={details.barcodePrefix}
                id="barcodePrefix"
                onChange={handleInputChange}
              />开始
            </div>
            <div>
              3.特征符号一： 从第
              <Input
                className={Styles.short}
                value={details.feature1Index}
                id="feature1Index"
                onChange={handleInputChange}
                {...featureInputCommonProps}
              />
              位开始为
              <Input
                className={Styles.short}
                id="feature1Content"
                onChange={handleInputChange}
                value={details.feature1Content}
                {...featureInputCommonProps}
              />
              固定不变
              <MoveButton visible={state.featureFocus === 'feature1'} {...moveBtnCommonProps} />
            </div>
            <div>
              4.特征符号二： 从第
              <Input
                className={Styles.short}
                id="feature2Index"
                value={details.feature2Index}
                onChange={handleInputChange}
                {...featureInputCommonProps}
              />
              位开始为
              <Input
                className={Styles.short}
                id="feature2Content"
                onChange={handleInputChange}
                value={details.feature2Content}
                {...featureInputCommonProps}
              />
              固定不变
              <MoveButton visible={state.featureFocus === 'feature2'} {...moveBtnCommonProps} />
            </div>
            <div>
              5.特征符号三： 从第
              <Input
                className={Styles.short}
                value={details.feature3Index}
                id="feature3Index"
                onChange={handleInputChange}
                {...featureInputCommonProps}
              />
              位开始为
              <Input
                className={Styles.short}
                id="feature3Content"
                onChange={handleInputChange}
                value={details.feature3Content}
                {...featureInputCommonProps}
              />
              固定不变
              <MoveButton visible={state.featureFocus === 'feature3'} {...moveBtnCommonProps} />
            </div>
            <div>
              6.特征符号四： 从第
              <Input
                className={Styles.short}
                value={details.feature4Index}
                id="feature4Index"
                onChange={handleInputChange}
                {...featureInputCommonProps}
              />
              位开始为
              <Input
                className={Styles.short}
                id="feature4Content"
                onChange={handleInputChange}
                value={details.feature4Content}
                {...featureInputCommonProps}
              />
              固定不变
              <MoveButton visible={state.featureFocus === 'feature4'} {...moveBtnCommonProps} />
            </div>
          </div>
          <div className={Styles.wrap} style={{ width: '44%', display: 'inline-block' }}>
            <div>00 ：系列货运包装箱代码，后面是18位固定长度，用于物资识别</div>
            <div>01：全球贸易项目代码，后面是14位固定长度，用于物资识别</div>
            <div>10：批号，可变长度，一般位于条码最后</div>
            <div>11：生产日期，后面固定6位长度，标准格式YYMMDD</div>
            <div>13：包装日期，后面固定6位长度，标准格式YYMMDD</div>
            <div>15：保质期，后面固定6位长度，标准格式YYMMDD</div>
            <div>17：有效期，后面固定6位长度，标准格式YYMMDD</div>
            <div>21：序列号，可变长度，一般位于条码最后</div>
          </div>
          <div className="aek-sub-head">请输入条码基本信息</div>
          <div className={Styles.wrap}>
            <div>
              1.物资编码
              <Input
                className={Styles.long}
                value={details.materialsCode}
                id="materialsCode"
                onChange={handleInputChange}
                disabled={details.barcodeType === '2'}
                onFocus={this.handleHighlightInputFocus}
              />
              从第
              <Input
                className={Styles.short}
                id="materialsCodeIndex"
                value={details.materialsCodeIndex}
                onChange={handleInputChange}
                disabled={details.barcodeType === '2'}
                onFocus={this.handleHighlightInputFocus}
              />
              个字符开始, 取
              <span className={Styles.codeLength}>{details.materialsCodeLength}</span>
              个字符
              <MoveButton
                visible={state.featureFocus === 'materialsCode'}
                {...moveBtnCommonProps}
              />
            </div>
            <div>
              2.生产批号
              <Input
                className={Styles.long}
                value={details.batchNo}
                id="batchNo"
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              从第
              <Input
                className={Styles.short}
                id="batchNoIndex"
                value={details.batchNoIndex}
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              个字符开始, 取
              <span className={Styles.codeLength}>{details.batchNoLength}</span>
              个字符
              <MoveButton visible={state.featureFocus === 'batchNo'} {...moveBtnCommonProps} />
            </div>
            <div>
              3.生产日期
              <Input
                className={Styles.long}
                value={details.produceDate}
                id="produceDate"
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              从第
              <Input
                className={Styles.short}
                id="produceDateIndex"
                value={details.produceDateIndex}
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              个字符开始, 格式为{' '}
              <Select
                style={{ width: 100 }}
                value={details.produceDateFormat}
                onChange={value => this.props.handleValueChange({ produceDateFormat: value })}
                allowClear
              >
                {dateFormat.map(x => (
                  <Option key={x} value={x}>
                    {x}
                  </Option>
                ))}
              </Select>
              <MoveButton visible={state.featureFocus === 'produceDate'} {...moveBtnCommonProps} />
            </div>
            <div>
              4.有效日期
              <Input
                className={Styles.long}
                value={details.expiredDate}
                id="expiredDate"
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              从第
              <Input
                className={Styles.short}
                id="expiredDateIndex"
                value={details.expiredDateIndex}
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              个字符开始, 格式为{' '}
              <Select
                style={{ width: 100 }}
                value={details.expiredDateFormat}
                onChange={value => this.props.handleValueChange({ expiredDateFormat: value })}
                allowClear
              >
                {dateFormat.map(x => (
                  <Option key={x} value={x}>
                    {x}
                  </Option>
                ))}
              </Select>
              <MoveButton visible={state.featureFocus === 'expiredDate'} {...moveBtnCommonProps} />
            </div>
            <div>
              5.
              <span className={Styles.label}>追踪码</span>
              <Input
                className={Styles.long}
                value={details.trackCode}
                id="trackCode"
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              从第
              <Input
                className={Styles.short}
                id="trackCodeIndex"
                value={details.trackCodeIndex}
                onChange={handleInputChange}
                onFocus={this.handleHighlightInputFocus}
              />
              个字符开始, 取
              <span className={Styles.codeLength}>{details.trackCodeLength}</span>
              个字符
              <MoveButton visible={state.featureFocus === 'trackCode'} {...moveBtnCommonProps} />
            </div>
            <div>
              6.条码类型{' '}
              <Radio.Group value={details.barcodeType} onChange={this.handleBarcodeTypechange}>
                <Radio value="1">主码</Radio>
                <Radio value="2">副码</Radio>
              </Radio.Group>
            </div>
            <div>
              7.是否启用{' '}
              <Radio.Group
                value={details.barcodeRuleStatus}
                onChange={e => this.props.handleValueChange({ barcodeRuleStatus: e.target.value })}
              >
                <Radio value="0">启用</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="aek-sub-head">优先级特征</div>
          <div className={Styles.wrap}>
            <div>
              <span className={Styles.label}>供应商</span>
              <LkcSelect
                style={{ width: '500px', marginLeft: '5px' }}
                url="/organization/option/37-after-review-list"
                placeholder="供应商"
                mode="multiple"
                optionConfig={{
                  idStr: 'orgId',
                  nameStr: 'orgName',
                }}
                onChange={(e) => {
                  props.handleValueChange({ supplierOrgList: e })
                }}
                value={details.supplierOrgList}
              />
            </div>
            <div>
              生产厂家
              <LkcSelect
                style={{ width: '500px', marginLeft: '5px' }}
                url="/organization/option/27-after-review-list"
                placeholder="生产厂家"
                mode="multiple"
                optionConfig={{
                  idStr: 'orgId',
                  nameStr: 'orgName',
                }}
                onChange={(e) => {
                  props.handleValueChange({ factoryOrgList: e })
                }}
                value={details.factoryOrgList}
              />
            </div>
            <div>
              医疗机构
              <LkcSelect
                style={{ width: '500px', marginLeft: '5px' }}
                url="/organization/option/3-after-review-list"
                placeholder="医疗机构"
                mode="multiple"
                optionConfig={{
                  idStr: 'orgId',
                  nameStr: 'orgName',
                }}
                onChange={(e) => {
                  props.handleValueChange({ customerOrgList: e })
                }}
                value={details.customerOrgList}
              />
            </div>
          </div>
          <div className="aek-sub-head">条码标签、包装信息、说明书等,越多越好</div>
          <div>
            <Upload
              {...uploadProps}
              onChange={this.handleUploadChange}
              fileList={details.barcodeImageUrls}
            >
              {uploadButtonContent}
            </Upload>
          </div>
          <div className="aek-sub-head">
            备注信息
            <span className="aek-red aek-font-small">
              （以下信息如果有，请一定要填写，方便后期整理条码规则）
            </span>
          </div>
          <div className={Styles.wrap}>
            <Form layout="inline">
              <FormItem label="添加原因" style={{ display: 'block', margin: '10px 0' }}>
                {getFieldDecorator('addReason', {
                  initialValue: details.addReason,
                  rules: [
                    { required: true, message: ' ' },
                    {
                      validator: (_, value, callback) => {
                        if (value === '0') {
                          callback(' ')
                        }
                        callback()
                      },
                    },
                  ],
                })(
                  <Select
                    style={{ width: '200px', marginLeft: '12px' }}
                    placeholder="添加原因"
                    onChange={(value) => {
                      props.handleValueChange({ addReason: value })
                    }}
                  >
                    {addReasonList.map(item => (
                      <Option key={item.dicValueId} value={item.dicValue}>
                        {item.dicValueText}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="来源客户" style={{ display: 'block', margin: '10px 0' }}>
                {getFieldDecorator('sourceCustomer', {
                  initialValue: details.sourceCustomer,
                  rules: [{ required: details.addReason !== '1', message: ' ' }],
                })(
                  <Input
                    style={{ width: '200px', marginLeft: '12px' }}
                    placeholder="来源客户"
                    onChange={(e) => {
                      props.handleValueChange({ sourceCustomer: e.target.value })
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="条码制作方" style={{ display: 'block', margin: '10px 0' }}>
                {getFieldDecorator('barcodeMake', {
                  initialValue: details.barcodeMake,
                  rules: [{ required: details.addReason !== '1', message: ' ' }],
                })(
                  <Select
                    style={{ width: '200px', marginLeft: '12px' }}
                    placeholder="条码制作方"
                    onChange={(value) => {
                      props.handleValueChange({ barcodeMake: value })
                    }}
                  >
                    {barcodeMakeList.map(item => (
                      <Option key={item.dicValueId} value={item.dicValue}>
                        {item.dicValueText}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="备注" style={{ display: 'block', margin: '10px 0' }}>
                {getFieldDecorator('remark', {
                  initialValue: details.remark,
                })(
                  <TextArea
                    style={{ resize: 'none', width: '800px' }}
                    rows={6}
                    maxLength={1000}
                    placeholder="如果有更详细的信息，请在这里描述，信息越多,越方便研发和产品改进条码解析技术"
                    onChange={(e) => {
                      props.handleValueChange({ remark: e.target.value })
                    }}
                  />,
                )}
              </FormItem>
            </Form>
          </div>
        </Spin>
      </Modal>
    )
  }
}

AddModal.propTypes = propTypes

export default Form.create()(AddModal)
