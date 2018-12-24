import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Input, Select } from 'antd'

import { LkcSelect } from '@components'
import SearchForm from '../../../components/SearchFormFilter'

const barcodeRuleReviewStatusList = {
  0: '待审核',
  1: '审核通过',
  2: '审核拒绝',
}

const columns = [
  {
    title: '序号',
    key: 'index',
    render: (_, record, index) => index + 1,
  },
  {
    title: '解析方式',
    key: 'barcodeParseType',
    dataIndex: 'barcodeParseType',
    render: value => (value === 1 ? '特例库解析' : '类库解析'),
  },
  {
    title: '条码类型',
    key: 'barcodeType',
    dataIndex: 'barcodeType',
    render: (text) => {
      if (text === 1) {
        return '主码'
      } else if (text === 2) {
        return '副码'
      }
      return ''
    },
  },
  {
    title: '物资码',
    key: 'materialsCode',
    dataIndex: 'materialsCode',
  },
  {
    title: '跟踪码',
    key: 'trackCode',
    dataIndex: 'trackCode',
  },
  {
    title: '生产日期',
    key: 'produceDate',
    dataIndex: 'produceDate',
  },
  {
    title: '有效期',
    key: 'expiredDate',
    dataIndex: 'expiredDate',
  },
  {
    title: '生产批号',
    key: 'batchNo',
    dataIndex: 'batchNo',
  },
  {
    title: '条码长度',
    dataIndex: 'barcodeLength',
  },
  {
    title: '审核状态',
    dataIndex: 'barcodeRuleReviewStatus',
    render: value => barcodeRuleReviewStatusList[value],
  },
  {
    title: '状态',
    dataIndex: 'barcodeRuleStatus',
    render: (value) => {
      if (!value) {
        return ''
      }
      return value === '0' ? '启用' : '停用'
    },
  },
  {
    title: '前导符',
    key: 'barcodePrefix',
    dataIndex: 'barcodePrefix',
  },
  {
    title: '特征码1',
    key: 'feature1Content',
    dataIndex: 'feature1Content',
  },
  {
    title: '特征码2',
    key: 'feature2Content',
    dataIndex: 'feature2Content',
  },
  {
    title: '特征码3',
    key: 'feature3Content',
    dataIndex: 'feature3Content',
  },
  {
    title: '特征码4',
    key: 'feature4Content',
    dataIndex: 'feature4Content',
  },
  {
    title: '期望匹配值',
    dataIndex: 'hopeScore',
  },
  {
    title: '实际匹配值',
    dataIndex: 'realScore',
  },
  {
    title: '条码Id',
    key: 'barcodeRuleId',
    dataIndex: 'barcodeRuleId',
  },
]

function TestModal({
  dataSource,
  tableLoading,
  visible,
  onCancel,
  searchHandler,
}) {
  const tableProps = {
    bordered: true,
    columns,
    dataSource,
    pagination: false,
    rowKey: (_, i) => i,
    loading: tableLoading,
  }

  const modalProps = {
    title: '条码测试',
    maskClosable: false,
    visible,
    onCancel,
    width: 1366,
    footer: null,
  }
  const searchFormProps = {
    initialValues: {},
    components: [
      {
        field: 'barcodeParseType',
        options: {
          initialValue: '1',
        },
        // component: {
        //   name: 'Select',
        //   props: {
        //     children: getOption(),
        //   },
        // },
        component:
        (
          <Select>
            {
              [{
                id: '1',
                name: '同步的规则',
              }, {
                id: '2',
                name: '平台的规则',
              }].map(item => <Select.Option value={item.id} key={item.id} >{item.name}</Select.Option>)
            }
          </Select>
        ),
      },
      {
        field: 'barcode',
        component: <Input placeholder="请输入条码" />,
        options: {
          initialValue: undefined,
        },
        width: 400,
      },
      {
        field: 'supplierOrgId',
        options: {
          initialValue: undefined,
        },
        component: (
          <LkcSelect
            url="/organization/option/37-after-review-list"
            placeholder="供应商"
            optionConfig={{
              idStr: 'orgId',
              nameStr: 'orgName',
              prefix: '供应商',
            }}
          />
        ),
        width: 250,
      },
      // {
      //   field: 'factoryOrgId',
      //   options: {
      //     initialValue: undefined,
      //   },
      //   component: (
      //     <LkcSelect
      //       url="/organization/option/27-after-review-list"
      //       placeholder="生产厂家"
      //       optionConfig={{
      //         idStr: 'orgId',
      //         nameStr: 'orgName',
      //         prefix: '生产厂家',
      //       }}
      //     />
      //   ),
      //   width: 250,
      // },
      {
        field: 'customerOrgId',
        options: {
          initialValue: undefined,
        },
        component: (
          <LkcSelect
            url="/organization/option/3-after-review-list"
            placeholder="医疗机构"
            optionConfig={{
              idStr: 'orgId',
              nameStr: 'orgName',
              prefix: '医疗机构',
            }}
          />
        ),
        width: 250,
      },
    ],
    onSearch: (values) => {
      searchHandler(values)
    },
  }
  return (
    <Modal {...modalProps}>
      {visible ? <SearchForm {...searchFormProps} /> : ''}
      <Table {...tableProps} />
      <div
        style={{
          margin: '16px 0px 0px 10px',
          width: '44%',
          display: 'inline-block',
          fontSize: '14px',
        }}
      >
        <div>00 ：系列货运包装箱代码，后面是18位固定长度，用于物资识别</div>
        <div>01：全球贸易项目代码，后面是14位固定长度，用于物资识别</div>
        <div>10：批号，可变长度，一般位于条码最后</div>
        <div>11：生产日期，后面固定6位长度，标准格式YYMMDD</div>
        <div>13：包装日期，后面固定6位长度，标准格式YYMMDD</div>
        <div>15：保质期，后面固定6位长度，标准格式YYMMDD</div>
        <div>17：有效期，后面固定6位长度，标准格式YYMMDD</div>
        <div>21：序列号，可变长度，一般位于条码最后</div>
      </div>
    </Modal>
  )
}

TestModal.propTypes = {
  searchHandler: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  cusotmerRequired: PropTypes.bool,
  selectUpdate: PropTypes.func,
}

export default TestModal
