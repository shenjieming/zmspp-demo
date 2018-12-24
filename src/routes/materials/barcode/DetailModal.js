import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { isEqual } from 'lodash'
import classnames from 'classnames'
import Styles from './Detail.less'
import PhotoWall from '../../../components/PhotoWall'

const barcodeRuleVersionCode = 'barcodeRuleVersionCode'
const lastEditTime = 'lastEditTime'
const lastEditName = 'lastEditName'
const barcodeRuleReviewName = 'barcodeRuleReviewName'
const barcodeRuleReviewTime = 'barcodeRuleReviewTime'
const barcodeLength = 'barcodeLength'
const barcodePrefix = 'barcodePrefix'
const feature1Index = 'feature1Index'
const feature1Content = 'feature1Content'
const feature2Index = 'feature2Index'
const feature2Content = 'feature2Content'
const feature3Index = 'feature3Index'
const feature3Content = 'feature3Content'
const feature4Index = 'feature4Index'
const feature4Content = 'feature4Content'
const materialsCode = 'materialsCode'
const materialsCodeIndex = 'materialsCodeIndex'
const materialsCodeLength = 'materialsCodeLength'
const batchNo = 'batchNo'
const batchNoIndex = 'batchNoIndex'
const batchNoLength = 'batchNoLength'
const produceDate = 'produceDate'
const produceDateIndex = 'produceDateIndex'
const produceDateFormat = 'produceDateFormat'
const expiredDate = 'expiredDate'
const expiredDateIndex = 'expiredDateIndex'
const expiredDateFormat = 'expiredDateFormat'
const trackCode = 'trackCode'
const trackCodeIndex = 'trackCodeIndex'
const trackCodeLength = 'trackCodeLength'
const barcodeType = 'barcodeType'
const barcodeRuleStatus = 'barcodeRuleStatus'
const barcodeSourceCustomer = 'barcodeSourceCustomer'
const barcodeRuleRemark = 'barcodeRuleRemark'
const barcodeMake = 'barcodeMake'
const barcodeRuleAddReason = 'barcodeRuleAddReason'
const colorRed = Styles.red

const DetailForm = ({
  data = {},
  addReasonList,
  barcodeMakeList,
  list = [],
  noBasicInfo = false,
}) => (
  <div className={Styles.wrap}>
    {noBasicInfo || (
      <div>
        <div className="aek-form-head">版本基本信息</div>
        <div className={Styles.item}>
          <div className={Styles.label}>1.版本号:</div>
          <span>
            <div className={Styles.first}>{data[barcodeRuleVersionCode]}</div>
          </span>
        </div>
        <div className={Styles.item}>
          <div className={Styles.label}>2.编辑时间:</div>
          <span>
            <div className={Styles.first}>{data[lastEditTime]}</div>
          </span>
        </div>
        <div className={Styles.item}>
          <div className={Styles.label}>3.编辑人:</div>
          <span>
            <div className={Styles.first}>{data[lastEditName]}</div>
          </span>
        </div>
        <div className={Styles.item}>
          <div className={Styles.label}>4.审核人:</div>
          <span>
            <div className={Styles.first}>{data[barcodeRuleReviewName]}</div>
          </span>
        </div>
        <div className={Styles.item}>
          <div className={Styles.label}>5.审核时间:</div>
          <span>
            <div className={Styles.first}>{data[barcodeRuleReviewTime]}</div>
          </span>
        </div>
      </div>
    )}
    <div className="aek-form-head">条码区别的特征</div>
    <div className={Styles.item}>
      <span>
        1.长度共计
        <div className={classnames(Styles.value, { [colorRed]: list.includes(barcodeLength) })}>
          {data[barcodeLength]}
        </div>
        位
      </span>
    </div>
    <div className={Styles.item}>
      <span>
        2.以
        <div className={classnames(Styles.value, { [colorRed]: list.includes(barcodePrefix) })}>
          {data[barcodePrefix]}
        </div>
        开始
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>3.特征符号一:</div>
      <span>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature1Index) })}>
          {data[feature1Index]}
        </div>
        位开始为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature1Content) })}>
          {data[feature1Content]}
        </div>
        固定不变
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>4.特征符号二:</div>
      <span>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature2Index) })}>
          {data[feature2Index]}
        </div>
        位开始为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature2Content) })}>
          {data[feature2Content]}
        </div>
        固定不变
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>5.特征符号三:</div>
      <span>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature3Index) })}>
          {data[feature3Index]}
        </div>
        位开始为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature3Content) })}>
          {data[feature3Content]}
        </div>
        固定不变
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>6.特征符号四:</div>
      <span>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature4Index) })}>
          {data[feature4Index]}
        </div>
        位开始为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(feature4Content) })}>
          {data[feature4Content]}
        </div>
        固定不变
      </span>
    </div>
    <div className="aek-form-head">条码基本信息</div>
    <div className={Styles.item}>
      <div className={Styles.label}>1.物资编码:</div>
      <span>
        <div className={classnames(Styles.first, { [colorRed]: list.includes(materialsCode) })}>
          {data[materialsCode]}
        </div>
        从第
        <div
          className={classnames(Styles.value, { [colorRed]: list.includes(materialsCodeIndex) })}
        >
          {data[materialsCodeIndex]}
        </div>
        个字符开始,取
        <div
          className={classnames(Styles.value, { [colorRed]: list.includes(materialsCodeLength) })}
        >
          {data[materialsCodeLength]}
        </div>
        个字符
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>2.生产批号:</div>
      <span>
        <div className={classnames(Styles.first, { [colorRed]: list.includes(batchNo) })}>
          {data[batchNo]}
        </div>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(batchNoIndex) })}>
          {data[batchNoIndex]}
        </div>
        个字符开始,取
        <div className={classnames(Styles.value, { [colorRed]: list.includes(batchNoLength) })}>
          {data[batchNoLength]}
        </div>
        个字符
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>3.生产日期:</div>
      <span>
        <div className={classnames(Styles.first, { [colorRed]: list.includes(produceDate) })}>
          {data[produceDate]}
        </div>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(produceDateIndex) })}>
          {data[produceDateIndex]}
        </div>
        个字符开始,格式为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(produceDateFormat) })}>
          {data[produceDateFormat]}
        </div>
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>4.有效日期:</div>
      <span>
        <div className={classnames(Styles.first, { [colorRed]: list.includes(expiredDate) })}>
          {data[expiredDate]}
        </div>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(expiredDateIndex) })}>
          {data[expiredDateIndex]}
        </div>
        个字符开始,格式为
        <div className={classnames(Styles.value, { [colorRed]: list.includes(expiredDateFormat) })}>
          {data[expiredDateFormat]}
        </div>
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>5.追踪码:</div>
      <span>
        <div className={classnames(Styles.first, { [colorRed]: list.includes(trackCode) })}>
          {data[trackCode]}
        </div>
        从第
        <div className={classnames(Styles.value, { [colorRed]: list.includes(trackCodeIndex) })}>
          {data[trackCodeIndex]}
        </div>
        个字符开始,取
        <div className={classnames(Styles.value, { [colorRed]: list.includes(trackCodeLength) })}>
          {data[trackCodeLength]}
        </div>
        个字符
      </span>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>6.条码类型:</div>
      <div className={classnames(Styles.first, { [colorRed]: list.includes(barcodeType) })}>
        {data[barcodeType] === 1 ? '主码' : '副码'}
      </div>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>7.是否启用:</div>
      <div className={classnames(Styles.first, { [colorRed]: list.includes(barcodeRuleStatus) })}>
        {data[barcodeRuleStatus] === '1' ? '停用' : '启用'}
      </div>
    </div>
    <div className="aek-form-head">示例图</div>
    <div className={Styles.item}>
      <div className={Styles.first}>
        <PhotoWall urls={data.barcodeImageUrls} />
      </div>
    </div>
    <div className="aek-form-head">备注信息</div>
    <div className={Styles.item}>
      <div className={Styles.label}>添加原因:</div>
      <div
        className={classnames(Styles.first, { [colorRed]: list.includes(barcodeRuleAddReason) })}
      >
        {data[barcodeRuleAddReason]
          ? addReasonList.filter(item => item.dicValue === data[barcodeRuleAddReason])[0]
            .dicValueText
          : ''}
      </div>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>来源客户:</div>
      <div
        className={classnames(Styles.first, { [colorRed]: list.includes(barcodeSourceCustomer) })}
      >
        {data[barcodeSourceCustomer]}
      </div>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>条码制作方:</div>
      <div className={classnames(Styles.first, { [colorRed]: list.includes(barcodeMake) })}>
        {data[barcodeMake]
          ? barcodeMakeList.filter(item => item.dicValue === data[barcodeMake])[0].dicValueText
          : ''}
      </div>
    </div>
    <div className={Styles.item}>
      <div className={Styles.label}>备注:</div>
      <div className={classnames(Styles.first, { [colorRed]: list.includes(barcodeRuleRemark) })}>
        {data[barcodeRuleRemark]}
      </div>
    </div>
  </div>
)

DetailForm.propTypes = {
  data: PropTypes.object.isRequired,
  list: PropTypes.array,
  noBasicInfo: PropTypes.bool,
  addReasonList: PropTypes.array,
  barcodeMakeList: PropTypes.array,
}

function Detail({ addReasonList, barcodeMakeList, data, noBasicInfo }) {
  if (Array.isArray(data)) {
    const hash = []

    const [newOne = {}, oldOne = {}] = data

    for (const [prop, value] of Object.entries(newOne)) {
      const oldValue = oldOne[prop]
      if (!isEqual(value === null ? '' : value, oldValue === null ? '' : oldValue)) {
        hash.push(prop)
      }
    }

    return (
      <Row>
        <Col span="12" className={Styles.border}>
          <DetailForm
            data={newOne}
            addReasonList={addReasonList}
            barcodeMakeList={barcodeMakeList}
            list={hash}
            noBasicInfo={noBasicInfo}
          />
        </Col>
        <Col span="12">
          <DetailForm
            data={oldOne}
            addReasonList={addReasonList}
            barcodeMakeList={barcodeMakeList}
            list={hash}
            noBasicInfo={noBasicInfo}
          />
        </Col>
      </Row>
    )
  }

  return (
    <DetailForm
      data={data}
      addReasonList={addReasonList}
      barcodeMakeList={barcodeMakeList}
      noBasicInfo={noBasicInfo}
    />
  )
}

Detail.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  noBasicInfo: PropTypes.bool,
  addReasonList: PropTypes.array,
  barcodeMakeList: PropTypes.array,
}

export default Detail
