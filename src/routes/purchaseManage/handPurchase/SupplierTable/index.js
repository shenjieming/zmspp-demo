import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Link, Element, scroller, animateScroll } from 'react-scroll'
import { Spin, Popover, Icon, Select } from 'antd'
import { flattenDeep } from 'lodash'
import style from './style.less'

const propTypes = {
  supplierList: PropTypes.array,
  supplierData: PropTypes.array,
  comSupplierData: PropTypes.array,
  comIdArr: PropTypes.array,
  addComSup: PropTypes.func,
  clickRow: PropTypes.func,
  delectComSup: PropTypes.func,
  selectId: PropTypes.string,
  loading: PropTypes.bool,
}
function SupplierTable({
  supplierList,
  supplierData,
  comSupplierData,
  addComSup,
  delectComSup,
  clickRow,
  comIdArr,
  selectId,
  loading,
}) {
  const socrollOptions = {
    duration: 400,
    smooth: true,
    containerId: 'containerElement',
  }
  const getOption = arr => arr.map(item => (
    <Select.Option
      key={item.supplierOrgId}
      value={item.supplierOrgId}
      data={item}
    >
      {item.supplierOrgName}
    </Select.Option>
  ))
  const getElementArr = (arr) => {
    const getClass = (itm, sId) => {
      const { supplierOrgId, supplierOrgNameHelper } = itm
      const idArr = sId.split('|')
      if (idArr[0] === supplierOrgId) {
        if (!supplierOrgNameHelper) {
          return !!idArr[1]
        }
        return !idArr[1]
      }
      return false
    }
    const getIcon = (itm) => {
      if (itm.supplierOrgId !== 'all') {
        const flag = comIdArr.includes(itm.supplierOrgId)
        return (
          <Icon
            className={style.icon}
            type={flag ? 'star' : 'star-o'}
            onClick={(e) => {
              e.stopPropagation()
              if (loading) {
                return
              }
              if (flag) {
                delectComSup(itm)
              } else {
                addComSup(itm)
              }
            }}
          />
        )
      }
      return null
    }
    const retArr = arr.map((item, index) => [
      <Element
        className={`${style.title} aek-text-help`}
        name={item.index}
        key={index}
      >
        {item.index}
      </Element>,
    ].concat(
      item.data.map((itm, idx) => (
        <Element
          className={classnames(style.item, 'aek-text-overflow', { [style.seled]: getClass(itm, selectId) })}
          name={itm.supplierOrgId}
          key={`${index}-${idx}`}
          onClick={() => { clickRow(itm) }}
          title={itm.supplierOrgName}
        >
          {getIcon(itm)}
          {itm.supplierOrgName}
        </Element>
      )),
    ))
    return flattenDeep(retArr)
  }

  const wordIndex = () => {
    const star = (
      <a key="all">
        <Icon
          type="star-o"
          onClick={() => { animateScroll.scrollTo(0, socrollOptions) }}
        />
      </a>
    )
    const wordIndexArr = supplierData.map(
      ({ index }, idx) =>
        <Link to={index} key={idx} {...socrollOptions}>{index}</Link>,
    )
    return [star].concat(wordIndexArr)
  }
  return (
    <div className={style.supplier}>
      <div className={style.select}>
        <Select
          showSearch
          allowClear
          defaultActiveFirstOption={false}
          className={style.search}
          placeholder="请输入供应商名称"
          onChange={(value) => {
            if (value) {
              scroller.scrollTo(value, socrollOptions)
            } else {
              animateScroll.scrollTo(0, socrollOptions)
              clickRow({ supplierOrgId: 'all' })
            }
          }}
          onSelect={(_, { props: { data } }) => {
            clickRow(data)
          }}
          filterOption={(inputValue, { props: { data } }) => {
            const { supplierOrgName, supplierOrgNameHelper } = data
            if (supplierOrgName.includes(inputValue.toUpperCase()) || supplierOrgNameHelper.includes(inputValue.toUpperCase())) {
              return true
            }
            return false
          }}
        >
          {getOption(supplierList)}
        </Select>
      </div>
      <div className={style.table}>
        <div className={style.index}>
          {wordIndex()}
        </div>
        <div className={style.main}>
          <div id="containerElement" style={{ height: '100%', position: 'relative', overflow: 'scroll' }}>
            {getElementArr(comSupplierData.concat(supplierData))}
          </div>
        </div>
      </div>
    </div>
  )
}
SupplierTable.propTypes = propTypes
export default SupplierTable
