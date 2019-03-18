import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import { form } from '../data'
import GetFormItem from '../../../../components/GetFormItem'
import { getOption } from '../../../../utils/index'

const App = ({
  dispatchAction,
  getLoading,
  saveAddOrg,
  secondGradeList,
  parentGradeList,
  bankLevelList,
  parentOrgList,
  onWorkAddressChange,
  onRegisterAddressChange,
  addressList,
  currentItemOrg,
  hideItems,
  onChange,
  visible,
  onCancel,
  organizeType,
  onSearchOrg,
  form: { validateFields, resetFields, setFieldsValue, getFieldInstance },
}) => {
  function handleOk(e) {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const postData = cloneDeep(vals)
      if (vals.orgParentId) {
        postData.orgParentId = vals.orgParentId.key
      }
      saveAddOrg({ ...postData, accountFlag: e })
    })
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
    hideItems,
    currentItemOrg,
    asyncParentOrgList: {
      children: getOption(parentOrgList, { idStr: 'orgId', nameStr: 'orgName' }),
      onSelect: onSelectOrg,
      onSearch: onSearchOrgDelay,
    },
    addressRegList: {
      options: addressList,
      onChange: onRegisterAddressChange,
    },
    addressWorkList: {
      options: addressList,
      onChange: onWorkAddressChange,
    },
    organizeTypeComp: {
      children: getOption(organizeType),
      onChange: (e) => {
        onChange(e)
        if (getFieldInstance('orgGrade')) {
          setFieldsValue({ orgGrade: undefined })
        }
      },
    },
    parentGradeList: {
      children: getOption(parentGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
    bankLevelList: {
      children: getOption(bankLevelList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
    secondGradeList: {
      children: getOption(secondGradeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
  }
  const replace = {
    ...currentItemAdds,
  }
  const footerObj = [
    <Button
      key="submits"
      loading={getLoading('saveAddOrg')}
      type="primary"
      size="large"
      onClick={() => handleOk(0)}
    >
      提交
    </Button>,
    <Button
      key="submit"
      loading={getLoading('saveAddAccount')}
      type="primary"
      size="large"
      onClick={() => handleOk(1)}
    >
      提交并生成账号
    </Button>,
  ]
  const modalOpts = {
    title: '新增机构',
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
        <GetFormItem formData={form(replace)} />
      </Form>
    </Modal>
  )
}
App.propTypes = {
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  saveAddOrg: PropTypes.func,
  parentGradeList: PropTypes.array,
  secondGradeList: PropTypes.array,
  parentOrgList: PropTypes.array,
  currentItemOrg: PropTypes.object,
  addressList: PropTypes.array,
  onWorkAddressChange: PropTypes.func,
  onRegisterAddressChange: PropTypes.func,
  onSearchOrg: PropTypes.func,
  hideItems: PropTypes.object,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
  bankLevelList: PropTypes.array,
  organizeType: PropTypes.array,
  form: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Form.create()(App)
