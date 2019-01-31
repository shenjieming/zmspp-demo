import React from 'react'
import PropTypes from 'prop-types'
import { Radio, DatePicker, Row, Col } from 'antd'
import moment from 'moment'
import Styles from './index.less'
import Graph from './Graph'
import AmountPanel from './AmountPanel'

const RadioButton = Radio.Button

const typesGroupData = [
  { name: '寄销', value: 2 },
  // { name: '普耗', value: 1 },
  // { name: '跟台', value: 3 },
]

function Page(props) {
  const {
    orgType,
    formType,
    statisticsType,
    handleTypeChange,
    endDate,
    startDate,
    handleStatisticsTypeChange,
    graph,
    amount,
    order,
    qty,
    handleClick7days,
    handleClick30days,
    handleRangerChange,
  } = props

  let title
  let numTypesData

  switch (orgType) {
    case '03':
    case '07':
      title = '接单情况'
      numTypesData = [
        { name: '接单量', value: 1 },
        { name: '接单耗材数量', value: 2 },
        { name: '接单金额', value: 3 },
      ]
      break
    default:
      title = '采购情况'
      numTypesData = [
        { name: '采购单量', value: 1 },
        { name: '采购耗材数量', value: 2 },
        { name: '采购金额', value: 3 },
      ]
  }

  const panelTypes = numTypesData

  if (formType === 3) {
    numTypesData = numTypesData.slice(0, 1)
  }

  const typesGroup = (
    <Radio.Group value={formType} onChange={handleTypeChange}>
      {typesGroupData.map(({ value, name }) => (
        <RadioButton key={value} value={value}>
          <span className="aek-plr15">{name}</span>
        </RadioButton>
      ))}
    </Radio.Group>
  )

  const numRadios = (
    <div className="aek-text-center aek-mtb20">
      <Radio.Group size="large" value={statisticsType} onChange={handleStatisticsTypeChange}>
        {numTypesData.map(({ name, value }) => (
          <Radio key={value} value={value}>
            {name}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  )

  const today = moment()

  const rangerPick = (
    <span style={{ float: 'right' }}>
      <a onClick={handleClick7days}>近七天</a>
      <a className="aek-mlr20" onClick={handleClick30days}>
        近三十天
      </a>
      <DatePicker.RangePicker
        allowClear={false}
        value={[startDate, endDate]}
        onChange={handleRangerChange}
        disabledDate={currentDate => currentDate.isAfter(today, 'day')}
      />
    </span>
  )


  const bottom = (
    <Row gutter={24}>
      <Col span="8">
        <AmountPanel data={order} todayText={panelTypes[0].name} />
      </Col>
      <Col span="8">
        <AmountPanel data={qty} todayText={panelTypes[1].name} />
      </Col>
      <Col span="8">
        <AmountPanel data={amount} todayText={`${panelTypes[2].name}(单位: 元)`} />
      </Col>
    </Row>
  )

  return (
    <div className={Styles.left}>
      <div className={Styles.title}>{title}</div>
      <div className={Styles.content}>
        <div>
          {typesGroup}
          {rangerPick}
        </div>
        {numRadios}
        <div className={Styles.graph}>
          <Graph data={graph} statisticsType={statisticsType} />
        </div>
        {bottom}
      </div>
    </div>
  )
}

Page.propTypes = {
  graph: PropTypes.array.isRequired,
  orgType: PropTypes.string.isRequired,
  handleTypeChange: PropTypes.func.isRequired,
  formType: PropTypes.number.isRequired,
  statisticsType: PropTypes.number.isRequired,
  endDate: PropTypes.object.isRequired,
  startDate: PropTypes.object.isRequired,
  handleStatisticsTypeChange: PropTypes.func.isRequired,
  amount: PropTypes.object,
  order: PropTypes.object,
  qty: PropTypes.object,
  handleClick7days: PropTypes.func.isRequired,
  handleClick30days: PropTypes.func.isRequired,
  handleRangerChange: PropTypes.func.isRequired,
}

export default Page
