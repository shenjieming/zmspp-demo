import React from 'react'
import { Icon } from 'antd'
import { verticalContent, segmentation } from '../../../../utils'
import LkcInputNumber from '../../../../components/LkcInputNumber'
import styles from './style.less'

const searchForm = [
  {
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '物资名称/规格型号/厂家/注册证',
      },
    },
  },
]

const commonColumns = [
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    render(materialsName, { materialsCommonName, unAddedFlag }) {
      return unAddedFlag === false
        ? {
          props: { className: 'aek-added' },
          children: verticalContent([materialsName, materialsCommonName]),
        }
        : verticalContent([
          materialsName,
          <span className="aek-text-help">{materialsCommonName}</span>,
        ])
    },
  },
  {
    title: '单位/规格型号',
    dataIndex: 'materialsUnitText',
    render(materialsUnitText, { materialsSku }) {
      return segmentation([materialsUnitText, materialsSku], '/')
    },
  },
  {
    title: '厂家/注册证',
    dataIndex: 'factoryName',
    render(factoryName, { certificateNo }) {
      return verticalContent([factoryName, certificateNo])
    },
  },
]

const getColumns = ({ delPsc, distributeType, startEditing, changePrice }) =>
  [
    {
      title: '序号',
      dataIndex: 'order',
      width: 60,
      className: 'aek-text-center',
      render(_, __, index) {
        return index + 1
      },
    },
    ...commonColumns,
    {
      title: '分销价格',
      dataIndex: 'distributorPrice',
      exclude: distributeType === 1,
      width: 100,
      className: styles.priceContainer,
      render(distributorPrice, row) {
        if (row.editing) {
          return (
            <LkcInputNumber
              defaultValue={distributorPrice}
              onBlur={(e) => {
                changePrice(row, e.target.value)
              }}
            />
          )
        }
        return (
          <span>
            <Icon
              type="edit"
              className={styles.editIcon}
              onClick={() => {
                startEditing(row)
              }}
            />
            <span className="aek-fr">{`￥${distributorPrice}`}</span>
          </span>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'pscId',
      width: 100,
      className: 'aek-text-center',
      render(pscId) {
        return (
          <a
            onClick={() => {
              delPsc(pscId)
            }}
          >
            移除
          </a>
        )
      },
    },
  ].filter(item => !item.exclude)

const getModalColumns = ({ distributeType, priceChange }) =>
  [
    ...commonColumns,
    {
      title: '分销价格',
      dataIndex: 'distributorPrice',
      exclude: distributeType === 1,
      render(distributorPrice, row) {
        return (
          <LkcInputNumber
            disabled={!row.unAddedFlag}
            value={distributorPrice}
            onChange={(value) => {
              priceChange(row, value)
            }}
          />
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'unAddedFlag',
      exclude: distributeType === 2,
      render(unAddedFlag, { distributorOrgName }) {
        if (!unAddedFlag) {
          return `已添加至 ${distributorOrgName} 的配送目录`
        }
        return null
      },
    },
  ].filter(item => !item.exclude)

export default {
  searchForm,
  getColumns,
  getModalColumns,
}
