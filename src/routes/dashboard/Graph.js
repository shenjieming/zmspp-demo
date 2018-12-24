import React from 'react'
import PropTypes from 'prop-types'
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { formatNum } from '@utils'
import { get } from 'lodash'
import Styles from './Tooltip.less'

function Graph(props) {
  const { data = [], statisticsType } = props

  const renderTooltip = ({ payload, label }) => {
    const value = get(payload, ['0', 'value'])
    return (
      <div className={Styles.wrap}>
        <div>{label}</div>
        <div>
          <div className={Styles.circle} />
          <span>{statisticsType === 3 ? formatNum(value) : value}</span>
        </div>
      </div>
    )
  }

  renderTooltip.propTypes = {
    label: PropTypes.string,
    payload: PropTypes.object,
  }

  return (
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9329" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff9329" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={renderTooltip} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ff9329"
          fillOpacity={1}
          fill="url(#colorVal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

Graph.propTypes = {
  data: PropTypes.array.isRequired,
  statisticsType: PropTypes.number.isRequired,
}

export default Graph
