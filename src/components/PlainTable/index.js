import React from 'react'
import PropTypes from 'prop-types'
import { get, isFunction, isPlainObject } from 'lodash'
import Styles from './index.less'
import { prodEnv } from '../../utils/config'

function PlainTable(props) {
  const { columns = [], dataSource = [], rowKey, footer, style = {} } = props

  if (!prodEnv) {
    /* eslint-disable */
    console.assert(rowKey, '当前表格未设置rowKey')
  }

  const tHeader = (
    <tr>{columns.map(({ key, dataIndex, title }) => <th key={key || dataIndex}>{title}</th>)}</tr>
  )

  const cols = (
    <colgroup>
      {columns.map(({ width, dataIndex, key }) => <col width={width} key={key || dataIndex} />)}
    </colgroup>
  )

  const tBody = (
    <tbody>
      {dataSource.map((item, i) => {
        const trKey = isFunction(rowKey) ? rowKey(item, i) : get(item, rowKey)

        return (
          <tr key={trKey}>
            {columns.map((row, idx) => {
              const { render, dataIndex, key, className } = row

              const text = get(item, dataIndex)

              const tdKey = dataIndex || key

              const Td = function(props) {
                return <td className={className} {...props} />
              }

              if (isFunction(render)) {
                const renderText = render(text, item, i)

                if (renderText && !React.isValidElement(renderText) && isPlainObject(renderText)) {
                  const renderObj = renderText.props
                  // console.log(renderObj)
                  if (get(renderObj, 'colSpan') === 0 || get(renderObj, 'rowSpan') === 0) {
                    return null
                  }

                  return (
                    <Td {...renderText.props} key={tdKey}>
                      {renderText.children}
                    </Td>
                  )
                }

                return <Td key={tdKey}>{renderText}</Td>
              }

              return <Td key={tdKey}>{text}</Td>
            })}
          </tr>
        )
      })}
    </tbody>
  )

  const tableFooter = isFunction(footer) ? (
    <div className={Styles.footer}>{footer(dataSource)}</div>
  ) : null

  const divProps = {
    style,
    className: props.className,
  }

  return (
    <div {...divProps}>
      <table className={Styles.table}>
        {cols}
        <thead>{tHeader}</thead>
        {tBody}
      </table>
      {tableFooter}
    </div>
  )
}

PlainTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  footer: PropTypes.func,
  style: PropTypes.object,
}

export default PlainTable
