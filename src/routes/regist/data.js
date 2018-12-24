import { regexPhone } from '../../utils/constant'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}
const form = () =>
  [{
    label: '供应商名称',
    layout: formItemLayout,
    field: 'dept',
    options: {
      rules: [{ required: true, message: '请选择部门' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入选择部门',
        allowClear: true,
      },
    },
  },
  {
    label: '用户名',
    layout: formItemLayout,
    field: 'mobile',
    options: {
      rules: [{
        required: true,
        message: '请输入',
      },
      {
        validator: (rule, value, cb) => {
          const temp = value.replace(/\s/g, '')
          if (new RegExp(regexPhone).test(temp)) {
            cb()
          } else {
            cb('请输入正确的手机号码')
          }
        },
      }],
      initialValue: personRegistFlag ? (<span>{registPerson.mobile}<a onClick={() => { dispatch({ type: 'personAdmin/updateState', payload: { personRegistFlag: false } }) }} style={{ marginLeft: '20px' }}>重新输入</a></span>) : '',
      getValueFromEvent: (e) => {
        const value = e.target.value.replace(/\s/g, '')
        return `${value}`.trim()
      },
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入员工真实的手机号',
        onBlur(e) {
          dispatch({
            type: 'personAdmin/postRegistFlag',
            payload: {
              mobile: e.target.value,
            },
          })
        },
        maxLength: 11,
      },
    },
  },
  {
    label: '设置密码',
    layout: formItemLayout,
    field: 'userName',
    options: {
      initialValue: '',
      rules: [{ required: true, message: '请输入用户名' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '后期作为员工登录账号',
      },
    },
  },
  {
    label: '确认密码',
    layout: formItemLayout,
    field: 'confirmPassword',
    options: {
      rules: [{
        required: true,
        validator: (rule, value, cb) => {
          // TODO 暂时没有与设置密码比对
          const temp = true
          if (temp) {
            cb()
          } else {
            cb('密码不一致')
          }
        },
      }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '请再次输入密码',
        type: 'password',
      },
    },
  },
  {
    label: '您的真实姓名',
    layout: formItemLayout,
    field: 'userName',
    options: {
      initialValue: '',
      rules: [{ required: true, message: '请输入用户名' }, {
        max: 10,
        message: '字符不超过10位',
      }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '后期作为员工登录账号',
      },
    },
  },
  {
    label: '手机号',
    layout: formItemLayout,
    field: 'userName',
    options: {
      initialValue: '',
      rules: [{ required: true, message: '请输入用户名' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '后期作为员工登录账号',
      },
    },
  },
  {
    label: '验证码',
    layout: formItemLayout,
    field: 'userName',
    options: {
      initialValue: '',
      rules: [{ required: true, message: '请输入用户名' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '后期作为员工登录账号',
      },
    },
  }]
export default {
  form,
}
