
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const formData = (detail = {}) => {
  const { chanceIntentionOrgId, chanceIntentionOrgName, chanceRemark } = detail
  return [{
    label: '合作机构',
    layout: formItemLayout,
    field: 'chanceIntentionOrgId',
    component: {
      name: 'LkcSelect',
      props: {
        url: '/organization/option/exclude/my-all ',
        optionConfig: { idStr: 'orgId', nameStr: 'orgName' },
        placeholder: '所有供应商',
      },
    },
    options: {
      initialValue: (chanceIntentionOrgId && chanceIntentionOrgName) ?
        { label: chanceIntentionOrgName, key: chanceIntentionOrgId } :
        undefined,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
  }, {
    label: '备注',
    layout: formItemLayout,
    field: 'chanceRemark',
    options: {
      rules: [{ required: true, message: '必填项不能为空', whitespace: true }],
      initialValue: chanceRemark,
    },
    component: {
      name: 'TextArea',
      props: {
        placeholder: '请输入',
      },
    },
  }]
}
export default {
  formData,
}
