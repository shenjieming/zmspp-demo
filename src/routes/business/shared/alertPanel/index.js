import React from 'react'
import { Carousel } from 'antd'
import propTypes from 'prop-types'
import { panel } from '../index.less'
import styles from './index.less'

const PropTypes = {
  data: propTypes.array,
  name: propTypes.string,
}
const AlertPanel = ({ data, name }) =>
  data.length > 0 && (
    <div className={panel}>
      <Carousel key={name} vertical autoplay dots={false}>
        {data.map((item) => {
          const { carourselContent, carourselId, carourselType } = item
          const content =
            carourselType === 1
              ? `${carourselContent} 有新回复！`
              : `恭喜  ${carourselContent} 达成合作!`
          return (
            <div key={carourselId} className={styles.alertItem}>
              {content}
            </div>
          )
        })}
      </Carousel>
    </div>
  )

AlertPanel.propTypes = PropTypes
export default AlertPanel
