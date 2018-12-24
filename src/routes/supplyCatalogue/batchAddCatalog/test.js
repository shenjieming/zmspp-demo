import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Button, Table, Form, Input, Select, Row, Col } from 'antd'
import { cloneDeep } from 'lodash'
// import { getBasicFn, getOption } from '../../../utils'
import { LkcInputNumber, LkcSelect } from '../../../components'
import Styles from '../detail.less'

// const namespace = 'dictionSelect'
const FormItem = Form.Item
const BatchAddCatalog = ({
  effects,
  batchAddModalVisible,
  packageUnit,
  batchDataList,
  modalType, // 1 批量加入目录 2 批量编辑目录
  handleBack, // 返回
  handleSave, // 保存至待推送
  handlePush, // 推送审核
  onSearchBrandListFun,
  onSelectChange, //
  handleCertificate,
  form: {
    getFieldDecorator,
    setFields,
    validateFields,
    resetFields,
  },
}) => {
  // const { dispatchAction } = getBasicFn({ namespace })


  const getFormValue = (data) => {
    const list = cloneDeep(batchDataList)
    for (const [key, value] of Object.entries(data)) {
      const arr = key.split('-')
      const index = Number(arr[1])
      if (arr[0] === 'materialsUnit') {
        if (value) {
          list[index].materialsUnit = value.key
          list[index].materialsUnitText = value.label
        } else {
          list[index].materialsUnit = undefined
          list[index].materialsUnitText = undefined
        }
      } else if (arr[0] === 'certificateId') {
        if (modalType === 1) {
          if (value) {
            list[index].certificateId = value.key
            list[index].certificateNo = value.label
          } else {
            list[index].certificateId = undefined
            list[index].certificateNo = undefined
          }
        } else if (value) {
          list[index].certificateId = value.key
          list[index].supplierCertificateNo = value.label
        } else {
          list[index].certificateId = undefined
          list[index].supplierCertificateNo = undefined
        }
      } else {
        list[index][arr[0]] = value
      }
    }
    return list
  }

  const getTtile = (index) => {
    let str = ''
    switch (index) {
      case 1:
        str = '批量加入目录'
        break
      default:
        str = '批量编辑物料'
        break
    }
    return str
  }

  const addModalProp = {
    key: batchAddModalVisible,
    title: getTtile(modalType),
    visible: batchAddModalVisible,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    afterClose() {
      resetFields()
      handleBack()
    },
    onCancel() {
      resetFields()
      handleBack()
    },
    width: 1000,
    footer: [
      <Button
        key="back"
        onClick={() => {
          resetFields()
          handleBack()
        }}
      >
      返回
      </Button>,
      <Button
        key="save"
        icon="save"
        onClick={() => {
          validateFields((errors, values) => {
            if (!errors) {
              handleSave(getFormValue(values))
            }
          })
        }}
      >
      保存至待推送
      </Button>,
      <Button
        type="primary"
        icon="right"
        key="push"
        onClick={() => {
          validateFields((errors, values) => {
            if (!errors) {
              handlePush(getFormValue(values))
            }
          })
        }}
      >
        推送审核
      </Button>,
    ],
  }


  const selectChange = (value, select, index) => {
    const list = cloneDeep(batchDataList)
    if (value !== '1') {
      list[index].inviteRequired = true
      list[index].inviteType = value
      const reqData = {
        [select]: {
          errors: [new Error('请输入招标编号')],
        },
      }
      setFields(reqData)
    } else {
      list[index].inviteRequired = false
      list[index].inviteType = value
      const reqData = {
        [select]: {
          value: '',
        },
      }
      setFields(reqData)
    }
    onSelectChange(list)
  }

  const columns = () => [{
    title: '物资名称',
    key: 'materialsName',
    dataIndex: 'materialsName',
    width: 130,
  }, {
    title: '规格型号',
    key: 'materialsSku',
    dataIndex: 'materialsSku',
    width: 100,
  }, {
    title: '品牌',
    key: 'brandName',
    dataIndex: 'brandName',
    width: 150,
    render(text, record, index) {
      const props = {
        placeholder: '请输入品牌',
        onSearch(val) {
          onSearchBrandListFun(val, index)
        },
        mode: 'combobox',
        optionLabelProp: 'title',
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
        size: 'small',
      }
      const { branOptionList = [] } = record
      return (
        // <FormItem>
        //   {getFieldDecorator(`brandName-${index}-${record.pscId || record.materialsSkuId}`, {
        //     initialValue: text,
        //     rules: [{
        //       max: 40,
        //       message: '最多输入40个字符',
        //     }],
        //   })(
        <Select
          {...props}
        >
          {branOptionList.map(items =>
            (<Select.Option
              key={items.brandName}
              value={items.brandName}
              title={items.brandName}
            >
              {items.brandName}
            </Select.Option>))
          }
        </Select>
        //   )}
        // </FormItem>
      )
    },
  }, {
    title: '注册证',
    key: 'certificateId',
    dataIndex: 'certificateId',
    width: 280,
    render(text, record, index) {
      const props = {
        placeholder: '请输入注册证号',
        url: '/certificate/my/register/options',
        optionConfig: {
          idStr: 'certificateId',
          nameStr: 'certificateNo',
        },
        style: {
          width: '200px',
        },
        size: 'small',
        // dropdownMatchSelectWidth: false,
      }
      // const props = {
      //   placeholder: '请输入注册证号',
      //   onSearch(val) {
      //     handleCertificate(val, index)
      //   },
      //   size: 'small',
      //   labelInValue: true,
      //   showSearch: true,
      //   allowClear: true,
      //   filterOption: false,
      //   style: {
      //     width: '170px',
      //   },
      // }
      // const { certificateOptionList = [] } = record
      return (
        <FormItem>
          {getFieldDecorator(`certificateId-${index}-${record.pscId || record.materialsSkuId}`, {
            initialValue: (record.certificateNo && text) ? {
              label: record.certificateNo,
              key: text,
            } : undefined,
          })(
            <LkcSelect
              {...props}
            />,
          )}
        </FormItem>


        // <FormItem>
        //   {getFieldDecorator(`certificateId-${index}-${record.pscId || record.materialsSkuId}`, {
        //     initialValue: (record.certificateNo && text) ? {
        //       label: record.certificateNo,
        //       key: text,
        //     } : undefined,
        //   })(
        // <Select {...props}>
        //   {certificateOptionList.map(item => (
        //     <Select.Option key={item.certificateId}>{item.certificateNo}</Select.Option>
        //   ))}
        // </Select>
        //   )}
        // </FormItem>


      )
    },
  }, {
    title: '产品编号',
    key: 'productCode',
    width: 140,
    dataIndex: 'productCode',
    render(text, record, index) {
      const props = {
        placeholder: '请输入产品编号',
        size: 'small',
      }
      return (
        // <FormItem>
        //   {getFieldDecorator(`productCode-${index}-${record.pscId || record.materialsSkuId}`, {
        //     initialValue: text,
        //     rules: [{
        //       max: 32,
        //       message: '最多输入32个字符',
        //     }],
        //   })(
        <Input
          {...props}
        />
        //   )}
        // </FormItem>
      )
    },
  }, {
    title: <span><span className="aek-red">*</span>价格</span>,
    key: 'price',
    dataIndex: 'price',
    width: 100,
    render(text, record, index) {
      const props = {
        placeholder: '请输入单价',
        size: 'small',
      }
      return (
        <FormItem>
          {getFieldDecorator(`price-${index}-${record.pscId || record.materialsSkuId}`, {
            initialValue: text,
            rules: [{
              required: true,
              message: '必填项不能为空',
            }],
          })(
            <LkcInputNumber
              {...props}
            />,
          )}
        </FormItem>
      )
    },
  }, {
    title: <span><span className="aek-red">*</span>单位</span>,
    key: 'materialsUnit',
    dataIndex: 'materialsUnit',
    width: 120,
    render(text, record, index) {
      const props = {
        showSearch: true,
        placeholder: '请选择单位',
        optionFilterProp: 'children',
        allowClear: true,
        labelInValue: true,
        size: 'small',
      }
      return (
        <FormItem>
          {getFieldDecorator(`materialsUnit-${index}-${record.pscId || record.materialsSkuId}`, {
            initialValue: (text && record.materialsUnitText ?
              { label: record.materialsUnitText, key: text } :
              undefined),
            rules: [{
              required: true,
              message: '必填项不能为空',
            }],
          })(<Select
            {...props}
          >
            {packageUnit.map(item =>
              (<Select.Option
                title={item.dicValueText}
                key={item.dicValue}
              >
                {item.dicValueText}
              </Select.Option>))}
          </Select>)
          }
        </FormItem>
      )
    },
  }, {
    title: '通用名称',
    key: 'materialsCommenName',
    dataIndex: 'materialsCommenName',
    width: 130,
    render(text, record, index) {
      const props = {
        placeholder: '请输入通用名称',
        size: 'small',
      }
      return (
        // <FormItem>
        //   {getFieldDecorator(`materialsCommenName-${index}-${record.pscId || record.materialsSkuId}`, {
        //     initialValue: text,
        //     rules: [{
        //       max: 200,
        //       message: '最多输入200个字符',
        //     }],
        //   })(
        <Input
          {...props}
        />
        //   )}
        // </FormItem>
      )
    },
  }, {
    title: '招标信息',
    key: 'inviteType',
    dataIndex: 'inviteType',
    width: 260,
    render(text, record, index) {
      return (
        <Row span={24}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator(`inviteType-${index}-${record.pscId || record.materialsSkuId}`, {
                initialValue: text ? `${text}` : '1',
                rules: [{
                  required: true,
                  message: '必填项不能为空',
                }],
              })(<Select
                onSelect={(value) => { selectChange(value, `inviteNo-${index}-${record.pscId || record.materialsSkuId}`, index) }}
                size="small"
              >
                {[{
                  id: '1',
                  name: '无',
                }, {
                  id: '2',
                  name: '省标',
                }, {
                  id: '3',
                  name: '市标',
                }, {
                  id: '4',
                  name: '院标',
                }].map(item =>
                  <Select.Option key={item.id} title={item.name}>{item.name}</Select.Option>)}
              </Select>)
              }

            </FormItem>
          </Col>
          <Col span={14} offset={1}>
            <FormItem>
              {getFieldDecorator(`inviteNo-${index}-${record.pscId || record.materialsSkuId}`, {
                initialValue: record.inviteNo,
                rules: [{
                  required: !!record.inviteRequired,
                  message: '必填项不能为空',
                }, {
                  max: 50,
                  message: '最多输入50个字符',
                }],
              })(<Input
                disabled={Number(text) === 1}
                placeholder="请输入招标编号"
                size="small"
              />)
              }
            </FormItem>
          </Col>
        </Row>
      )
    },
  }]

  const retColumns = columns({ packageUnit })

  const tableProps = {
    columns: retColumns.filter((items) => {
      if (modalType === 1 && items.key === 'certificateId') {
        return false
      }
      return true
    }),
    dataSource: batchDataList,
    rowKey({ pscId, materialsSkuId }) {
      return pscId || materialsSkuId
    },
    pagination: false,
    // size: 'small',
    // scroll: { x: true },
    // className: Styles['aek-modal-table'],
    bordered: true,
    style: { width: 1100, paddingRight: '16px' },
  }


  return (
    <Modal {...addModalProp} >
      <Spin spinning={
        !!effects['dictionSelect/saveToPush'] ||
        !!effects['dictionSelect/pushToExamine'] ||
        !!effects['supplyCatalogueDetail/getOptions'] ||
        !!effects['supplyCatalogueDetail/saveToPush'] ||
        !!effects['supplyCatalogueDetail/saveToExamine']
      }
      >
        <Form>
          <Table
            {...tableProps}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
BatchAddCatalog.propTypes = {
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  batchAddModalVisible: PropTypes.bool,
  packageUnit: PropTypes.array,
  form: PropTypes.object,
  batchDataList: PropTypes.array,
  modalType: PropTypes.number,
  handleBack: PropTypes.func, // 返回
  handleSave: PropTypes.func, // 保存至待推送
  handlePush: PropTypes.func, // 推送审核
  branOptionList: PropTypes.array,
  onSearchBrandListFun: PropTypes.func,
  onSelectChange: PropTypes.func,

  certificateOptionList: PropTypes.array, // 注册证下拉列表
  handleCertificate: PropTypes.func,
}
export default Form.create()(BatchAddCatalog)
