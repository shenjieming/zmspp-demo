import React from 'react'
import { Button, Icon, Popconfirm } from 'antd'
import Decimal from 'decimal.js-light'
import style from './style.less'
import CustmTabelInfo from '../../../components/CustmTabelInfo'
import getComponent from '../../../components/GetFormItem/getComponent'
import { getTreeItem, formatNum } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 23 },
}

const formData = [{
  layout: noLabelLayout,
  label: '',
  field: 'keywords',
  width: 380,
  component: {
    name: 'Input',
    props: {
      placeholder: '输入物料名称、规格型号、拼音首字母、省标进行检索',
    },
  },
}]

const getOption = (materialsUnitText, arr = [], addPack) => {
  const voidItem = [{
    name: 'Option',
    props: {
      value: 'voidMark',
      title: materialsUnitText,
      transformValue: 1,
      children: (
        <span>
          {materialsUnitText}
          <span
            style={{ float: 'right' }}
            className="aek-text-disable"
          >
            1
          </span>
        </span>
      ),
    },
  }]
  const retArr = arr.map(itm => ({
    name: 'Option',
    props: {
      value: itm.packageUnitId,
      title: itm.packageUnitText,
      transformValue: itm.packageQuantity,
      children: (
        <span>
          {itm.packageUnitText}
          <span
            style={{ float: 'right' }}
            className="aek-text-disable"
          >
            {`${itm.packageQuantity}${materialsUnitText}`}
          </span>
        </span>
      ),
    },
  }))
  retArr.push({
    name: 'OptGroup',
    props: {
      label: (
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => { addPack(materialsUnitText) }}
        >添加包装</Button>
      ),
      children: [{
        name: 'Option',
        props: {
          style: { display: 'none' },
          key: 'none',
          children: '',
        },
      }],
    },
  })
  return voidItem.concat(retArr)
}

const itemValue = (changeArr, pscId, itemName) => {
  const item = getTreeItem(changeArr, 'pscId', pscId)
  const ret = item
    && item[itemName]
    && (
      Array.isArray(item[itemName])
        ? item[itemName]
        : String(item[itemName])
    )
  return ret
}

const columns = ({ selectId, packChange, itemAdd, addPack, changeArr, addArr, deleteCart }) => [{
  title: '物料名称/通用名称',
  dataIndex: 'materialsName',
  render(materialsName, { materialsCommenName }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[
        materialsName,
        <span className="aek-text-disable">{materialsCommenName}</span>,
      ]}
    />)
  },
}, {
  title: '规格型号',
  dataIndex: 'materialsSku',
}, {
  title: '供应商',
  dataIndex: 'supplierName',
  exclude: !selectId.match('all'),
}, {
  title: '厂家/注册证',
  dataIndex: 'factoryName',
  render(factoryName, { certificateNo }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[factoryName, certificateNo]}
    />)
  },
}, {
  title: '采购数量',
  dataIndex: 'purchaseQty',
  className: 'aek-text-center',
  width: 100,
  render: (purchaseQty, all) => getComponent({
    name: 'InputNumber',
    props: {
      value: (itemValue(addArr, all.pscId, 'purchaseQty') || 0) - 0,
      placeholder: '请输入',
      key: all.pscId,
      style: { width: 80 },
      precision: 0,
      step: 1,
      min: 0,
      max: 99999999,
      onChange: (value) => {
        if (value - 0) {
          if (value > 99999999) {
            return
          }
          const packItem = getTreeItem(changeArr, 'pscId', all.pscId)
          itemAdd({
            ...all,
            purchaseQty: value - 0,
            skuUnitText: all.materialsUnitText,
            packageUnit: (packItem && packItem.packageUnit) || all.packageUnit,
            packageUnitText: (packItem && packItem.packageUnitText) || all.materialsUnitText,
            skuUnitValue: all.materialsUnit,
            packageUnitValue: (packItem && packItem.packageUnitValue) || all.materialsUnit,
            transformValue: (packItem && packItem.transformValue) || 1,
            supplierOrgName: all.supplierName,
            supplierOrgId: all.supplierOrgId,
            materialsPrice: all.price,
          })
        } else {
          deleteCart({
            pscId: all.pscId,
            supplierOrgId: all.supplierOrgId,
          })
        }
      },
    },
  }),
}, {
  title: '单位',
  dataIndex: 'packageUnit',
  className: 'aek-text-center',
  width: 120,
  render: (packageUnit, { materialsUnit, materialsUnitText, pscId }) => (
    <span className="hover-select">
      {
        getComponent({
          name: 'Select',
          props: {
            placeholder: '请选择',
            value: {
              key: itemValue(changeArr, pscId, 'packageUnitValue') || String(materialsUnit),
              label: itemValue(changeArr, pscId, 'packageUnitText') || String(materialsUnitText),
            },
            defaultActiveFirstOption: false,
            labelInValue: true,
            notFoundContent: false,
            style: { width: 100 },
            optionLabelProp: 'title',
            onSelect: ({ key, label }, { props: { transformValue } }) => {
              let obj = {
                packageUnitValue: key,
                packageUnitText: label,
                transformValue,
              }
              if (key === 'voidMark') {
                obj = {
                  packageUnitValue: materialsUnit,
                  packageUnitText: materialsUnitText,
                  transformValue: 1,
                }
              }
              packChange({
                materialsUnit,
                materialsUnitText,
                transformValue,
                pscId,
                ...obj,
              })
            },
            children: getOption(materialsUnitText, itemValue(changeArr, pscId, 'packageUnit') || packageUnit, (text) => { addPack(pscId, text) }),
          },
        })
      }
    </span>
  ),
}, {
  title: '价格',
  dataIndex: 'price',
  className: 'aek-text-right',
  width: 110,
  render: (price, { pscId }) => {
    const findItem = getTreeItem(changeArr, 'pscId', pscId)
    let retTransformValue = 1
    if (findItem && findItem.transformValue) {
      retTransformValue = findItem.transformValue
    }
    const retPrice = new Decimal(price)
    return formatNum(retPrice.times(retTransformValue))
  },
}].filter(_ => !_.exclude)


const cartItemColumns = ({ supplierOrgName, itemAdd, deleteCart, addArr }) => [{
  title: <div style={{ textAlign: 'left', marginLeft: -31, fontWeight: 'bold' }}>{supplierOrgName}</div>,
  dataIndex: 'materialsName',
  render(materialsName, { materialsSku, materialsCommonName, disabled }) {
    return {
      props: disabled ? { className: 'aek-disabled' } : undefined,
      children: (
        <div style={disabled ? { marginLeft: 16 } : undefined}>
          <CustmTabelInfo
            logoUrl="nil"
            otherInfo={[
              materialsName,
              materialsSku,
              <span className="aek-text-disable">{materialsCommonName}</span>,
            ]}
          />
        </div>
      ),
    }
  },
}, {
  title: '',
  dataIndex: 'purchaseQty',
  width: 140,
  render: (purchaseQty, { pscId, packageUnitText, skuUnitText, materialsUnitText, disabled }) => (
    <span>
      {getComponent({
        name: 'InputNumber',
        props: {
          disabled,
          value: getTreeItem(addArr, 'pscId', pscId).purchaseQty,
          placeholder: '请输入',
          style: { width: 80 },
          precision: 0,
          step: 1,
          min: 1,
          onChange: (value) => {
            if (value) {
              itemAdd({
                purchaseQty: String(value),
                pscId,
              })
            }
          },
        },
      })}&nbsp;
      {packageUnitText || skuUnitText || materialsUnitText}
    </span>
  ),
}, {
  title: '',
  dataIndex: 'materialsPrice',
  className: 'aek-text-right',
  width: 120,
  render: (materialsPrice, { transformValue }) => {
    const retPrice = new Decimal(materialsPrice)
    return formatNum(retPrice.times(transformValue))
  },
}, {
  title: '',
  dataIndex: 'operation',
  className: 'aek-text-right',
  width: 60,
  render: (_, { pscId, supplierOrgId }) => (
    <Popconfirm
      title="您确定要将该物料从购物车移除？"
      placement="topRight"
      onConfirm={() => { deleteCart({ pscId, supplierOrgId }) }}
    >
      <Icon
        type="delete"
        className={style.Icon}
      />
    </Popconfirm>
  ),
}]

const addOrder = (arr, fun) => arr.map((item, index) => {
  const copyObj = { ...item }
  fun && fun(copyObj, index)
  copyObj.order = index + 1
  return item
})

export default {
  addOrder,
  formData,
  columns,
  cartItemColumns,
}
