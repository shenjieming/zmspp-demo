import React from 'react'
import { Select, Input } from 'antd'
import { LkcSelect } from '@components'

const Option = Select.Option
const barcodeRuleReviewStatusList = {
  0: '待审核',
  1: '审核通过',
  2: '审核拒绝',
}
export default {
  getSearchParams: ({
    supplierData = [],
    handleSupplierSearch,
    factoryData = [],
    handleFactorySearch,
  }) => [
    {
      field: 'barcodeType',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="条码类型: 全部">
            全部
          </Option>
          <Option value="1" title="条码类型: 主码">
            主码
          </Option>
          <Option value="2" title="条码类型: 副码">
            副码
          </Option>
        </Select>
      ),
      options: { initialValue: null },
      width: 160,
    },
    {
      field: 'barcodeRuleStatus',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="条码状态: 全部">
            全部
          </Option>
          <Option value="0" title="条码状态: 启用">
            启用
          </Option>
          <Option value="1" title="条码状态: 停用">
            停用
          </Option>
        </Select>
      ),
      options: { initialValue: null },
      width: 160,
    },
    {
      field: 'barcodeRuleReviewStatus',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="审核状态: 全部">
            全部
          </Option>
          <Option value="0" title="审核状态: 待审核">
            待审核
          </Option>
          <Option value="1" title="审核状态: 通过">
            通过
          </Option>
          <Option value="2" title="审核状态: 拒绝">
            拒绝
          </Option>
        </Select>
      ),
      options: { initialValue: null },
      width: 160,
    },
    {
      field: 'supplierOrgId',
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
    {
      field: 'customerOrgId',
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
    {
      field: 'factoryOrgId',
      component: (
        <LkcSelect
          url="/organization/option/27-after-review-list"
          placeholder="生产厂商"
          optionConfig={{
            idStr: 'orgId',
            nameStr: 'orgName',
            prefix: '生产厂商',
          }}
        />
      ),
      width: 250,
    },
    {
      field: 'keywords',
      component: <Input placeholder="请输入条码样例或条码ID" />,
    },
  ],
  getBarcodeColumns: ({ handleAction, editPermission }) => [
    {
      title: '序号',
      key: 'index',
      render: (_, $, i) => i + 1,
      className: 'aek-text-center',
      width: 50,
      fixed: true,
    },
    {
      title: '条码样例',
      dataIndex: 'barcodeExample',
      key: 'barcodeExample',
      fixed: true,
      width: 320,
    },
    {
      title: '操作',
      width: 140,
      fixed: true,
      key: 'action',
      className: 'aek-text-center',
      render: (_, row) => {
        const id = row.barcodeRuleId
        return (
          <div>
            {editPermission ? (
              <span>
                <a onClick={() => handleAction({ id, key: 'edit' })}>编辑</a>
                <span className="ant-divider" />
              </span>
            ) : (
              ''
            )}
            <a onClick={() => handleAction({ id, key: 'version' })}>查看版本</a>
          </div>
        )
      },
    },
    {
      title: '条码类型',
      dataIndex: 'barcodeType',
      key: 'barcodeType',
      render: (text) => {
        if (text === 1) {
          return '主码'
        }
        return '副码'
      },
    },
    {
      title: '条码长度',
      dataIndex: 'barcodeLength',
      key: 'barcodeLength',
    },
    {
      title: '状态',
      key: 'barcodeRuleStatus',
      dataIndex: 'barcodeRuleStatus',
      render: (text) => {
        if (Number(text)) {
          return '停用'
        }
        return '启用'
      },
    },
    {
      title: '审核状态',
      key: 'barcodeRuleReviewStatus',
      dataIndex: 'barcodeRuleReviewStatus',
      render: value => barcodeRuleReviewStatusList[value],
    },
    {
      title: '条码前导符',
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
      title: '跟踪码',
      key: 'trackCode',
      dataIndex: 'trackCode',
    },
    {
      title: '物资条码',
      key: 'materialsCode',
      dataIndex: 'materialsCode',
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
  ],
  dateFormat: ['yyMMdd', 'yydd', 'MMyyyy', 'yyyyMMdd', 'yyyyMM', 'yyyyJJJ', 'yyJJJ', 'MMyy', 'MMddyy'],
}
