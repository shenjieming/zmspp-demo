import moment from 'moment'
import { REGEXP_PHONE } from '../../utils/constant'
import { asyncValidate } from '../../utils'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}

const asyncMobile = asyncValidate({
  message: '该手机号已存在',
  url: '/account/user/unique/mobile',
  key: 'mobile',
})

const asyncEmail = asyncValidate({
  message: '该邮箱已存在',
  url: '/account/user/unique/email',
  key: 'email',
})

// 编辑个人资料
const editPersonInfo = ({ modalInitValue: { userName, realName, birthday, gender } }) => [
  {
    label: '用户名',
    layout: formItemLayout,
    view: true,
    options: {
      initialValue: userName,
    },
  },
  {
    label: '真实姓名',
    layout: formItemLayout,
    field: 'realName',
    options: {
      initialValue: realName,
      rules: [
        {
          max: 10,
          message: '字符不超过10位',
        },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '出生日期',
    layout: formItemLayout,
    field: 'birthday',
    options: {
      initialValue: birthday ? moment(birthday, 'YYYY-MM-DD') : undefined,
    },
    component: {
      name: 'DatePicker',
    },
  },
  {
    label: '性别',
    layout: formItemLayout,
    field: 'gender',
    options: {
      initialValue: gender === undefined ? 2 : gender,
    },
    component: {
      name: 'RadioGroup',
      props: {
        options: [{ label: '男', value: 1 }, { label: '女', value: 0 }],
      },
    },
  },
]

// 修改密码
const rePassword = ({ other: { getValidator } }) => [
  {
    label: '原密码',
    layout: formItemLayout,
    field: 'oldPassword',
    options: {
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
        type: 'password',
      },
    },
  },
  {
    label: '新密码',
    layout: formItemLayout,
    field: 'newPassword',
    options: {
      rules: [
        { required: true, message: '必填项不能为空' },
        { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/, message: '用户非法输入' },
        { max: 20, min: 6, message: '请输入6~20位密码' },
        { validator: getValidator('reNewPassword') },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
        type: 'password',
      },
    },
  },
  {
    label: '确认新密码',
    layout: formItemLayout,
    field: 'reNewPassword',
    options: {
      rules: [
        { required: true, message: '必填项不能为空' },
        { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/, message: '用户非法输入' },
        { max: 20, min: 6, message: '请输入6~20位密码' },
        { validator: getValidator('newPassword') },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
        type: 'password',
      },
    },
  },
]

// 更换邮箱/绑定邮箱
const mailForm = ({ modalInitValue: { userName, email }, other: { getCountTime } }) => [
  {
    label: '用户名',
    layout: formItemLayout,
    view: true,
    options: {
      initialValue: userName,
    },
  },
  {
    label: '用户密码',
    layout: formItemLayout,
    field: 'password',
    options: {
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        type: 'password',
        placeholder: '请输入',
      },
    },
  },
  {
    label: '邮箱',
    layout: formItemLayout,
    field: 'email',
    options: {
      initialValue: email,
      rules: [
        { required: true, message: '必填项不能为空' },
        { type: 'email', message: '请输入正确的邮箱' },
        { validator: asyncEmail },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '验证码',
    layout: formItemLayout,
    field: 'verifyCode',
    options: {
      rules: [
        { required: true, message: '必填项不能为空' },
        { max: 6, message: '请输入正确格式的验证码' },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
        maxLength: '8',
        suffix: getCountTime('email'),
      },
    },
  },
]

// 更改手机号
const rePhone = ({ modalInitValue: { userName, mobile }, other: { getCountTime } }) => [
  {
    label: '用户名',
    layout: formItemLayout,
    view: true,
    options: {
      initialValue: userName,
    },
  },
  {
    label: '用户密码',
    layout: formItemLayout,
    field: 'password',
    options: {
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        type: 'password',
        placeholder: '请输入',
      },
    },
  },
  {
    label: '新手机号',
    layout: formItemLayout,
    field: 'mobile',
    options: {
      initialValue: mobile,
      rules: [
        { required: true, message: '必填项不能为空' },
        { pattern: REGEXP_PHONE, message: '请输入正确的手机号' },
        { validator: asyncMobile },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '验证码',
    layout: formItemLayout,
    field: 'verifyCode',
    options: {
      rules: [
        { required: true, message: '必填项不能为空' },
        { max: 6, message: '请输入正确格式的验证码' },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
        maxLength: '8',
        suffix: getCountTime('mobile'),
      },
    },
  },
]

const modalFormData = (type, { modalInitValue, other }) =>
  ({
    editPersonInfo,
    rePassword,
    mailForm,
    reMail: mailForm,
    rePhone,
  }[type]({ modalInitValue, other }))

export default modalFormData
