import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import Styles from './index.less'
import Items from './TodoItem'

function TodoList(props) {
  const { dataSource, loading } = props

  return (
    <div className={Styles.right}>
      <div className={Styles.title}>待办事项</div>
      <div className={Styles.content}>
        <Spin spinning={loading}>
          {dataSource.map(({ title, data }) => (
            <div className={Styles.item} key={title}>
              <span className={Styles.block} />
              <div className={Styles.subTitle}>{title}</div>
              <Items list={data} />
            </div>
          ))}
        </Spin>
      </div>
    </div>
  )
}

TodoList.propTypes = {
  dataSource: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default TodoList
