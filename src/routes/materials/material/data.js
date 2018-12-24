import React from 'react'
import { Link } from 'dva/router'
import { Dropdown, Menu } from 'antd'
import { MATERIALS_TYPE_ARRAY, MATERIALS_TYPE, FORM_ITEM_LAYOUT } from '../../../utils/constant'
import { getOption, mapTreeSelectOnlyChild } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const advancedForm = ({
  regOptionList,
  asyncRegList,
  GoodsCategoryTreeData,
  produceList,
  onSearchProList,
}) => [
  {
    layout: FORM_ITEM_LAYOUT,
    label: '状态',
    field: 'materialsStatus',
    component: {
      name: 'Select',
      props: {
        children: getOption([{
          id: null,
          name: '全部',
        }, {
          id: '0',
          name: '启用',
        }, {
          id: '1',
          name: '停用',
        }]),
      },
    },
    options: {
      initialValue: null,
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '属性',
    field: 'materialsAttribute',
    component: {
      name: 'Select',
      props: {
        children: getOption([{
          id: null,
          name: '全部',
        }, ...MATERIALS_TYPE]),
      },
    },
    options: {
      initialValue: null,
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '来源',
    field: 'sourceType',
    component: {
      name: 'Select',
      props: {
        children: getOption([{
          id: null,
          name: '全部',
        }, {
          id: '1',
          name: '平台新增',
        }, {
          id: '2',
          name: '对照新增',
        }]),
      },
    },
    options: {
      initialValue: null,
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '注册证',
    field: 'handleRegisterCertificateId',
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择注册证',
        labelInValue: true,
        children: getOption(regOptionList, {
          idStr: 'certificateId',
          nameStr: 'certificateNo',
        }),
        onSearch: asyncRegList,
        dropdownMatchSelectWidth: false,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '标准分类',
    field: 'handleStandardCategoryId',
    col: 12,
    options: {
      initialValue: undefined,
      rules: [
        {
          transform: obj => obj.value,
        },
      ],
    },
    component: {
      name: 'TreeSelect',
      props: {
        showSearch: true,
        treeNodeFilterProp: 'title',
        allowClear: true,
        labelInValue: true,
        dropdownMatchSelectWidth: false,
        dropdownStyle: {
          height: '400px',
        },
        treeData: mapTreeSelectOnlyChild(GoodsCategoryTreeData),
        placeholder: '请选择标准分类',
      },
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '厂家',
    field: 'handleProduceFactoryId',
    component: {
      name: 'Select',
      props: {
        labelInValue: true,
        placeholder: '请选择厂家',
        children: getOption(produceList, { idStr: 'produceFactoryId', nameStr: 'produceFactoryName' }),
        onSearch: onSearchProList,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '物料名称',
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '物料名称/物资编码/拼音',
      },
    },
  }, {
    layout: FORM_ITEM_LAYOUT,
    label: '品牌',
    field: 'brandName',
    component: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  }]


const formData = ({ regOptionList, asyncRegList }) => [{
  layout: noLabelLayout,
  field: 'materialsStatus',
  width: 220,
  component: {
    name: 'Select',
    props: {
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: '0',
        name: '启用',
      }, {
        id: '1',
        name: '停用',
      }], { prefix: '状态' }),
    },
  },
  options: {
    initialValue: null,
  },
}, {
  layout: noLabelLayout,
  field: 'materialsAttribute',
  width: 220,
  component: {
    name: 'Select',
    props: {
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, ...MATERIALS_TYPE], { prefix: '属性' }),
    },
  },
  options: {
    initialValue: null,
  },
}, {
  layout: noLabelLayout,
  field: 'handleRegisterCertificateId',
  width: 220,
  component: {
    name: 'Select',
    props: {
      placeholder: '请选择注册证',
      labelInValue: true,
      children: getOption(regOptionList, {
        idStr: 'certificateId',
        nameStr: 'certificateNo',
      }),
      onSearch: asyncRegList,
      dropdownMatchSelectWidth: false,
      showSearch: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      allowClear: true,
    },
  },
  options: {
    initialValue: undefined,
  },
}, {
  layout: noLabelLayout,
  field: 'keywords',
  width: 220,
  component: {
    name: 'Input',
    props: {
      placeholder: '物料名称/物资编码/拼音',
    },
  },
}]
const genColumns = ({ handleAction, addModalShow }) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    className: 'aek-text-center',
    render: (text, record, idx) => idx + 1,
  }, {
    title: '物资编码',
    dataIndex: 'materialsCode',
    key: 'materialsCode',
  }, {
    title: '属性',
    dataIndex: 'materialsAttribute',
    key: 'materialsAttribute',
    render: text => MATERIALS_TYPE_ARRAY[Number(text)],
  }, {
    title: '物资名称',
    dataIndex: 'materialsName',
    key: 'materialsName',
  }, {
    title: '生产厂家',
    dataIndex: 'produceFactoryName',
    key: 'produceFactoryName',
  }, {
    title: '注册证号',
    dataIndex: 'registerCertificateNo',
    key: 'registerCertificateNo',
  }, {
    title: '品牌',
    dataIndex: 'brandName',
    key: 'brandName',
  }, {
    title: '来源',
    dataIndex: 'sourceType',
    key: 'sourceType',
    render: text => (text === 1 ? '平台添加' : '对照新增'),
  }, {
    title: '状态',
    dataIndex: 'materialsStatus',
    key: 'materialsStatus',
    render: text => (text ? '停用' : '启用'),
  }, {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right',
    render: (text, record) => {
      const { materialsStatus: status } = record
      const menu = (
        <Menu onClick={e => handleAction(e, record)}>
          {
            status ?
              <Menu.Item key="0">启用</Menu.Item> :
              <Menu.Item key="1">停用</Menu.Item>
          }
          <Menu.Item key="3">修改历史</Menu.Item>
        </Menu>
      )
      return (
        <span>
          <a onClick={() => addModalShow(record)}>编辑</a>
          <span className="ant-divider" />
          <Link to={`/materials/material/materialDetail/${record.materialsId}`}>查看规格</Link>
          <span className="ant-divider" />
          <Dropdown overlay={menu}>
            <a>更多</a>
          </Dropdown>
        </span>
      )
    },
  }]

export default {
  genColumns,
  formData,
  advancedForm,
}
