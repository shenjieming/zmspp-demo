import React from 'react'
import Decimal from 'decimal.js-light'
import { Icon, Popconfirm } from 'antd'
import style from './style.less'
import { formatNum } from '../../../../utils'
import CustmTabelInfo from '../../../../components/CustmTabelInfo'
import getComponent from '../../../../components/GetFormItem/getComponent'

const orderFormColumns = ({ changeItem, deleteItem }) => [{
  title: '物料名称/通用名称',
  dataIndex: 'materialsName',
  render(materialsName, { materialsCommonName, disabled }) {
    return {
      props: disabled ? { className: 'aek-disabled' } : undefined,
      children: (
        <div style={disabled ? { marginLeft: 16 } : undefined}>
          <CustmTabelInfo
            logoUrl="nil"
            otherInfo={[
              materialsName,
              <span className="aek-text-disable">{materialsCommonName}</span>,
            ]}
          />
        </div>
      ),
    }
  },
}, {
  title: '规格型号',
  dataIndex: 'materialsSku',
}, {
  title: '厂家/注册证',
  dataIndex: 'factoryName',
  render(factoryName, { certificateNo }) {
    return (
      <CustmTabelInfo
        logoUrl="nil"
        otherInfo={[factoryName, certificateNo]}
      />
    )
  },
}, {
  title: '采购数量',
  dataIndex: 'purchaseQty',
  className: 'aek-text-center',
  width: 100,
  render: (purchaseQty, all) => getComponent({
    name: 'InputNumber',
    props: {
      disabled: all.disabled,
      value: purchaseQty,
      placeholder: '请输入',
      key: Math.random(),
      style: { width: 80 },
      precision: 0,
      step: 1,
      min: 1,
      onChange: (value) => {
        if (value) {
          changeItem({
            purchaseQty: value && value - 0,
            pscId: all.pscId,
          })
        }
      },
    },
  }),
}, {
  title: '单位',
  dataIndex: 'packageUnitText',
  className: 'aek-text-center',
  width: 80,
  render: (packageUnitText, { skuUnitText, materialsUnitText }) => (packageUnitText || skuUnitText || materialsUnitText),
}, {
  title: '单价',
  dataIndex: 'materialsPrice',
  className: 'aek-text-right',
  width: 100,
  render: (materialsPrice, { transformValue = 1 }) => {
    const retPrice = new Decimal(materialsPrice)
    return formatNum(retPrice.times(transformValue))
  },
}, {
  title: '金额',
  dataIndex: 'materialsAmount',
  className: 'aek-text-right',
  width: 100,
  render: materialsAmount => formatNum(materialsAmount),
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  width: 60,
  render: (_, { pscId }) => (
    <Popconfirm
      title="您确定要将该物料从订单中移除？"
      placement="topRight"
      onConfirm={() => { deleteItem(pscId) }}
    >
      <Icon
        type="delete"
        className={style.Icon}
      />
    </Popconfirm>
  ),
}]

const render = (text, { formId }) => {
  if (formId === 'all') {
    return <span className="aek-primary-color">{text}</span>
  }
  return text
}
const orderFormInfoColumns = [{
  title: '订单编号',
  dataIndex: 'formNo',
  className: 'aek-text-center',
  render,
}, {
  title: '供应商',
  dataIndex: 'supplierOrgName',
  className: 'aek-text-center',
  render,
}, {
  title: '数量',
  dataIndex: 'formQty',
  className: 'aek-text-center',
  render,
}, {
  title: '金额',
  dataIndex: 'formAmount',
  className: 'aek-text-right',
  render: (formAmount, { formId }) => {
    const ret = formatNum(formAmount)
    if (formId === 'all') {
      return <span className="aek-primary-color">{ret}</span>
    }
    return ret
  },
}]

export default {
  orderFormColumns,
  orderFormInfoColumns,
}
