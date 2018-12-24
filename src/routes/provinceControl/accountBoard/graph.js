import React from 'react'
import PropTypes from 'prop-types'
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { get } from 'lodash'
import { formatNum } from '../../../utils/index'

import Styles from './toolTip.less'

const Graph = ({ data }) => {
  const renderToolTip = ({ payload, label }) => {
    const value = get(payload, ['0', 'value'])
    return (
      <div className={Styles.wrap}>
        <div>{label}</div>
        <div>
          <div className={Styles.circle} />
          <span>{formatNum(value)}</span>
        </div>
      </div>
    )
  }
  return (
    <ResponsiveContainer maxHeight={300} style={{ padding: '10px' }}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" axisLine={false} tickLine={false} />
        <YAxis type="category" width={100} dataKey="name" tickLine={false} />
        <Tooltip cursor={false} content={renderToolTip} />
        <Bar dataKey="value" barSize={35}>
          {data.map(entry => <Cell key={entry.name} fill={'rgba(232,162,117,0.5)'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

Graph.propTypes = {
  data: PropTypes.array.isRequired,
}

export default Graph
