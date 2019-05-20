import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Spin, Form} from 'antd'
import GetFormItem from '@components/GetFormItem'
import {form} from './data'
import {debounce} from "lodash";
import {getBasicFn, getOption} from "../../../utils";
const namespace = 'organInfo'
function Edit({
                parentOrgList,
                dispatch,
                loading,
                orgDetail,
                orgEditVisible,
                asyncParentOrgList,
                addressList,
                onSearchOrg,
                secondGradeList,
                parentGradeList,
                orgLegalPersonUrls,
                form: {validateFields, resetFields},
              }) {
  const { dispatchAction } = getBasicFn({ namespace, loading })
  const modalProps = {
    visible: orgEditVisible,
    title: '编辑企业资料',
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'organInfo/updateState',
        payload: {
          orgEditVisible: false,
        },
      })
    },
    onOk() {
      validateFields((error, values) => {
        if (!error) {
          console.log(values)
          // orgLegalPersonUrls
          dispatch({
            type: 'organInfo/editOrgDetail',
            payload: {
              ...orgDetail,
              ...values,
            },
          })
        }
      })
    },
    afterClose() {
      resetFields()
    },
  }
  const onSearchOrgDelay = debounce(onSearchOrg, 500)
  const onSelectOrg = (key, {props: {value: orgId, label: orgName}}) => {
    dispatchAction({
      payload: {selectOrg: {orgId, orgName}},
    })
  }
  const fromProp = {
    dispatch, orgDetail, addressList,
    asyncParentOrgList: {
      children: getOption(parentOrgList, {idStr: 'orgId', nameStr: 'orgName'}),
      onSelect: onSelectOrg,
      onSearch: onSearchOrgDelay
    },
    parentGradeList: {
      children: getOption(parentGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
    secondGradeList: {
      children: getOption(secondGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
  }

  return (
    <Modal {...modalProps} wrapClassName="aek-modal" confirmLoading={loading}>
      <Spin spinning={loading}>
        <Form>
          <GetFormItem formData={form({...fromProp})}/>
        </Form>
      </Spin>
    </Modal>
  )
}

Edit.propTypes = {
  loading: PropTypes.bool,
  dispatch: PropTypes.func,
  form: PropTypes.object,
  orgDetail: PropTypes.object,
  orgEditVisible: PropTypes.bool,
  addressOptions: PropTypes.array,
  addressList: PropTypes.array,
  asyncParentOrgList: PropTypes.array,
  parentOrgList: PropTypes.array,
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  saveAddOrg: PropTypes.func,
  parentGradeList: PropTypes.array,
  secondGradeList: PropTypes.array,
  currentItemOrg: PropTypes.object,
  onWorkAddressChange: PropTypes.func,
  onRegisterAddressChange: PropTypes.func,
  onSearchOrg: PropTypes.func,
  hideItems: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
  bankLevelList: PropTypes.array,
  organizeType: PropTypes.array,
  app: PropTypes.object,
}

export default Form.create()(Edit)
