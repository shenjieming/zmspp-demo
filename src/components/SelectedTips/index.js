import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

function SelectedTips({ number, onCancel }) {
  return (
    <div>
      {Number(number) > 0 && <Alert
        style={{
          margin: '5px 0',
        }}
        type="info"
        showIcon
        closable
        message={
          <div>
            已选择{<span className="aek-deep-blue">{` ${number} `}</span>}项数据
            {typeof onCancel === 'function' && <span>,<a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onCancel()
              }}
            >全部取消</a></span>}
          </div>
        }
      />}
    </div>
  )
}

SelectedTips.propTypes = {
  number: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  onCancel: PropTypes.func,
}

export default SelectedTips
