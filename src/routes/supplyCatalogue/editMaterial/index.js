import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Modal, Spin, Button } from 'antd'
import { cloneDeep } from 'lodash'
import { formData } from './data'
import GetFormItem from '../../../components/GetFormItem'
import { getBasicFn } from '../../../utils'

const namespace = 'supplyCatalogueDetail'
const EditMaterial = ({
  editMaterialVisible,
  rowSelectData,
  dispatch,
  effects,
  inviteRequired,
  tabIndex,
  packageUnit,
  onSearchBrandListFun,
  branOptionList,
  customerId,
  form: {
    validateFields,
    resetFields,
    setFields,
  },
}) => {
  const { getLoading } = getBasicFn({ namespace, loading: { effects } })

  // 招标信息下拉
  const selectChange = (value) => {
    let flag = false
    dispatch({
      type: 'supplyCatalogueDetail/updateState',
      payload: {
        rowSelectData: {
          ...rowSelectData,
          inviteType: value,
          inviteNo: '',
        },
      },
    })
    if (value !== '1') {
      flag = true
      dispatch({
        type: 'supplyCatalogueDetail/updateState',
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
        type: 'supplyCatalogueDetail/updateState',
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

  // 判断物料是否修改

  // const getCompare = (row, rep) => {
  //   const keys = ['inviteType', 'inviteNo', 'price', 'materialsUnit', 'materialsCommenName']
  //   const oldArr = keys.map(item => (row[item] ? `${row[item]}` : undefined))
  //   const newArr = keys.map(item => (rep[item] ? `${rep[item]}` : undefined))

  //   for (let i = 0; i < oldArr.length; i += 1) {
  //     if (oldArr[i] !== newArr[i]) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  const addModalProp = {
    title: '编辑物料',
    visible: editMaterialVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    width: 800,
    onCancel() {
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { editMaterialVisible: false, inviteRequired: false } })
    },
    afterClose() {
      selectChange('1')
      resetFields()
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { inviteRequired: false } })
    },
    footer: [
      <Button
        key="back"
        onClick={() => {
          selectChange('1')
          resetFields()
          dispatch({
            type: 'supplyCatalogueDetail/updateState',
            payload: {
              editMaterialVisible: false,
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
              if (values.certificateNo) {
                reqData.certificateId = values.certificateNo.key
                reqData.supplierCertificateNo = values.certificateNo.label
                reqData.certificateNo = undefined
              } else {
                reqData.certificateId = undefined
                reqData.supplierCertificateNo = undefined
                reqData.certificateNo = undefined
              }
              dispatch({
                type: 'supplyCatalogueDetail/saveToPush',
                payload: {
                  customerOrgId: customerId,
                  catalogs: [{ ...rowSelectData, ...reqData }],
                },
              }).then(() => {
                dispatch({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    editMaterialVisible: false,
                  },
                })
                dispatch({
                  type: 'supplyCatalogueDetail/getTableData',
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
                rep.materialsUnitText = rep.materialsUnit.label
                rep.materialsUnit = rep.materialsUnit.key
              }
              if (values.certificateNo) {
                rep.certificateId = values.certificateNo.key
                rep.supplierCertificateNo = values.certificateNo.label
                rep.certificateNo = undefined
              } else {
                rep.certificateId = undefined
                rep.supplierCertificateNo = undefined
                rep.certificateNo = undefined
              }
              dispatch({
                type: 'supplyCatalogueDetail/saveToExamine',
                payload: {
                  customerOrgId: customerId,
                  catalogs: [{
                    ...rowSelectData,
                    ...rep,
                  }],
                },
              }).then(() => {
                dispatch({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    editMaterialVisible: false,
                  },
                })
                dispatch({
                  type: 'supplyCatalogueDetail/getTableData',
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
  if (tabIndex === '3') {
    addModalProp.okText = '保存'
  }

  // 同步标准物料
  const sync = () => {
    dispatch({
      type: 'supplyCatalogueDetail/updateState',
      payload: {
        compareModalVisible: true,
      },
    })
    dispatch({
      type: 'supplyCatalogueDetail/compareModalData',
      payload: {
        materialsSkuId: rowSelectData.materialsSkuId,
      },
    })
  }

  return (
    <Modal {...addModalProp} >
      <Spin spinning={getLoading('saveToPush', 'saveToExamine')}>
        {/* 需求变更 拒绝原因在列表中展示 不在这里进行展示  */}
        {/* {
          rowSelectData.refuseReason ?
            <Alert
              message="拒绝原因"
              description={rowSelectData.refuseReason}
              type="warning"
              showIcon
            />
            : ''
        } */}
        <Form>
          <GetFormItem
            formData={formData({
              rowSelectData,
              packageUnit,
              inviteRequired,
              selectChange,
              sync,
              onSearchBrandListFun,
              branOptionList,
            })}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
EditMaterial.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  editMaterialVisible: PropTypes.bool,
  rowSelectData: PropTypes.object,
  accuracy: PropTypes.any,
  inviteRequired: PropTypes.bool,
  tabIndex: PropTypes.string,
  accuracyDecimal: PropTypes.any,
  packageUnit: PropTypes.array,
  onSearchBrandListFun: PropTypes.func,
  branOptionList: PropTypes.array,
  customerId: PropTypes.string,
}
export default Form.create()(EditMaterial)
