import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import { form } from './data'
import GetFormItem from '../../../../../components/GetFormItem'
import { getOption } from '../../../../../utils/index'

const arr = ['03', '04', '07']
const EditOrgModal = (
  {
    dispatchAction,
    saveAddOrg,
    parentGradeList,
    secondGradeList,
    bankLevelList,
    parentOrgList,
    addressList,
    currentOrgDetail,
    hideItems,
    onChange,
    visible,
    onCancel,
    organizeType,
    onSearchOrg,
    form: { validateFields, resetFields },
  }) => {
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const postData = cloneDeep(vals)
      if (vals.orgParentId) {
        postData.orgParentId = vals.orgParentId.key
      }
      saveAddOrg({ ...postData })
    })
  }

  const getOrganizeType = () => {
    const key = currentOrgDetail.orgTypeCode
    if (arr.includes(key)) {
      return organizeType.map(item => ({
        ...item,
        disabled: !arr.includes(item.value),
      }))
    }
    return organizeType.map(item => ({
      ...item,
      disabled: key !== item.value,
    }))
  }
  const onSearchOrgDelay = debounce(onSearchOrg, 500)
  const onSelectOrg = (key, { props: { value: orgId, label: orgName } }) => {
    dispatchAction({
      payload: { selectOrg: { orgId, orgName } },
    })
  }
  const currentItemAdds = {
    supplierWarehouseName: '',
    supplierContactName: '',
    asyncParentOrgList: {
      children: getOption(parentOrgList, { idStr: 'orgId', nameStr: 'orgName' }),
      onSearch: onSearchOrgDelay,
      onSelect: onSelectOrg,
    },
    hideItems,
    currentOrgDetail,
    addressRegList: {
      options: addressList,
    },
    addressWorkList: {
      options: addressList,
    },
    organizeTypeComp: {
      children: getOption(getOrganizeType(), {
        callback: ({ disabled }) => ({ disabled }),
      }),
      disabled: !arr.includes(currentOrgDetail.orgTypeCode),
      onChange,
    },
    parentGradeList: {
      children: getOption(parentGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
    secondGradeList: {
      children: getOption(secondGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
    bankLevelList: {
      children: getOption(bankLevelList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
  }
  const replace = {
    ...currentItemAdds,
  }
  const footerObj = [
    <Button key="submits" type="primary" size="large" onClick={handleOk} >提交</Button>,
  ]
  const modalOpts = {
    title: '编辑信息',
    visible,
    footer: footerObj,
    afterClose: resetFields,
    onCancel,
    onOk: handleOk,
    width: 700,
    maskClosable: false,
    wrapClassName: 'aek-modal',

  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem
          formData={form(replace)}
        />
      </Form>
    </Modal>
  )
}
EditOrgModal.propTypes = {
  dispatchAction: PropTypes.func,
  saveAddOrg: PropTypes.func,
  parentGradeList: PropTypes.array,
  secondGradeList: PropTypes.array,
  bankLevelList: PropTypes.array,
  onSearchOrg: PropTypes.func,
  parentOrgList: PropTypes.array,
  disabled: PropTypes.object,
  onWorkAddressChange: PropTypes.func,
  onRegisterAddressChange: PropTypes.func,
  addressList: PropTypes.array,
  currentOrgDetail: PropTypes.object,
  hideItems: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
  organizeType: PropTypes.array,
  form: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Form.create()(EditOrgModal)
