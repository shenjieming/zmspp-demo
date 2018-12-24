import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Spin, Button } from 'antd'
import { cloneDeep } from 'lodash'
import { formData } from './data'
import GetFormItem from '../../../components/GetFormItem'
import { getBasicFn } from '../../../utils'

const namespace = 'dictionSelect'
const AddCatalog = ({
  effects,
  dispatch,
  rowData,
  addModalVisible,
  inviteRequired,
  packageUnit,
  branOptionList,
  onSearchBrandListFun,
  customerId,
  form: {
    validateFields,
    resetFields,
    setFields,
    getFieldValue,
  },
}) => {
  const { dispatchAction } = getBasicFn({ namespace })

  // 招标信息下拉
  const selectChange = (value) => {
    let flag = false
    if (value !== '1') {
      flag = true
      dispatch({
        type: 'dictionSelect/updateState',
        payload: {
          inviteRequired: flag,
        },
      })

      const reqData = {
        inviteNo: {
          errors: [new Error('请输入招标编号')],
        },
      }
      setFields(reqData)
    } else {
      dispatch({
        type: 'dictionSelect/updateState',
        payload: {
          inviteRequired: flag,
        },
      })
      const reqData = {
        inviteNo: {
          value: '',
        },
      }
      setFields(reqData)
    }
  }
  const addModalProp = {
    title: '加入目录',
    visible: addModalVisible,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    onCancel() {
      dispatch({
        type: 'dictionSelect/updateState',
        payload: {
          addModalVisible: false,
        },
      })
    },
    afterClose() {
      selectChange('1')
      resetFields()
    },
    width: 800,
    footer: [
      <Button
        key="back"
        onClick={() => {
          selectChange('1')
          resetFields()
          dispatch({
            type: 'dictionSelect/updateState',
            payload: {
              addModalVisible: false,
            },
          })
        }}
      >
      返回
      </Button>,
      <Button
        key="save"
        icon="save"
        onClick={() => {
          validateFields((errors, values) => {
            const reqData = cloneDeep(values)
            if (!errors) {
              if (values.materialsUnit) {
                reqData.materialsUnit = values.materialsUnit.key
                reqData.materialsUnitText = values.materialsUnit.label
              }
              dispatchAction({
                type: 'saveToPush',
                payload: {
                  customerOrgId: customerId,
                  materials: [{ ...rowData, ...reqData }],
                },
              }).then(() => {
                dispatchAction({
                  payload: {
                    selectedRowKeys: [],
                    selectedRows: [],
                  },
                })
              })
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
            if (errors) {
              return
            }
            const rep = cloneDeep(values)
            const foo = () => {
              if (rep.inviteType === '1' && rep.inviteNo) {
                rep.inviteNo = undefined
              }
              if (rep.materialsUnit) {
                rep.materialsUnitText = values.materialsUnit.label
                rep.materialsUnit = values.materialsUnit.key
              }
              dispatchAction({
                type: 'pushToExamine',
                payload: {
                  customerOrgId: customerId,
                  materials: [{
                    ...rowData,
                    ...rep,
                  }],
                },
              }).then(() => {
                dispatchAction({
                  payload: {
                    selectedRowKeys: [],
                    selectedRows: [],
                  },
                })
              })
            }
            if (rep.inviteType === '1' && rep.inviteNo) {
              Modal.confirm({
                title: '是否继续完善招标信息？',
                content: '检测到您填写了招标编号，但没有选择招标类型。如果继续提交，招标编号将被忽视。',
                onCancel() {
                  foo()
                },
                okText: '去完善',
                cancelText: '继续提交',
              })
            } else {
              foo()
            }
          })
        }}
      >
        推送审核
      </Button>,
    ],
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['dictionSelect/saveToPush'] || !!effects['dictionSelect/pushToExamine']}>
        <Form>
          <GetFormItem
            formData={formData({
              rowData,
              packageUnit,
              inviteRequired,
              selectChange,
              getFieldValue,

              branOptionList,
              onSearchBrandListFun,
            })}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
AddCatalog.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  addModalVisible: PropTypes.bool,
  rowData: PropTypes.object,
  accuracy: PropTypes.any,
  accuracyDecimal: PropTypes.any,
  inviteRequired: PropTypes.bool,
  packageUnit: PropTypes.array,
  branOptionList: PropTypes.array,
  onSearchBrandListFun: PropTypes.func,
  customerId: PropTypes.string,
}
export default Form.create()(AddCatalog)
