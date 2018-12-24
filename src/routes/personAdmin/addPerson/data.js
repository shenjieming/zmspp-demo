import React from 'react'
import { REGEXP_TELEPHONE } from '../../../utils/constant'
import { asyncValidate } from '../../../utils'

const asyncValidateFn = asyncValidate({
  message: '用户名已经存在',
  url: '/account/loginName/unique/verify',
  key: 'loginName',
})
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}
const form = ({
  dispatch,
  deptTreeList,
  personRegistFlag,
  registPerson,
  deptId,
  getFieldValue,
  pasdChange,
  confirmPasdChange,
}) => [
  {
    label: '部门',
    layout: formItemLayout,
    field: 'deptId',
    options: {
      rules: [{ required: true, message: '请选择部门' }],
      initialValue: deptId === '-1' ? undefined : deptId,
    },
    col: 24,
    component: {
      name: 'TreeSelect',
      props: {
        placeholder: '输入选择部门',
        treeData: deptTreeList,
        treeDefaultExpandAll: true,
        allowClear: true,
      },
    },
  },
  {
    label: '员工手机号',
    layout: formItemLayout,
    field: 'mobile',
    view: personRegistFlag,
    options: {
      validateFirst: true,
      rules: [
        {
          required: true,
          message: '请输入手机号码',
        },
        {
          validator: (rule, value, cb) => {
            const temp = value.replace(/\s/g, '')
            if (new RegExp(REGEXP_TELEPHONE).test(temp)) {
              cb()
            } else {
              cb('请输入正确的手机号码')
            }
          },
        },
      ],
      initialValue: personRegistFlag ? (
        <span>
          {registPerson.mobile}
          <a
            onClick={() => {
              dispatch({ type: 'personAdmin/updateState', payload: { personRegistFlag: false } })
            }}
            style={{ marginLeft: '20px' }}
          >
            重新输入
          </a>
        </span>
      ) : (
        ''
      ),
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
        maxLength: '11',
      },
    },
  },
  {
    label: personRegistFlag ? '员工姓名' : '登录名',
    layout: formItemLayout,
    field: 'loginName',
    view: personRegistFlag,
    options: {
      initialValue: personRegistFlag ? registPerson.userName : '',
      validateFirst: true,
      rules: [
        {
          required: true,
          message: '请输入登录名!',
        },
        {
          pattern: '^[a-zA-Z][a-zA-Z0-9]{5,19}$',
          message: '必须以字母开头，6到20位数字字母组合',
        },
        {
          validator: asyncValidateFn,
        },
      ],
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
    label: '员工真实姓名',
    layout: formItemLayout,
    field: 'realName',
    otherProps: {
      help: personRegistFlag ? (
        <span className="aek-red">系统检测出该员工已注册，请填写其真实姓名进行验证</span>
      ) : (
        undefined
      ),
    },
    options: {
      validateFirst: true,
      rules: [
        { required: true, message: '请输入员工姓名' },
        {
          max: 10,
          message: '字符不超过10位',
        },
        {
          pattern: '^[\u4e00-\u9fa5]+$',
          message: '请输入真实姓名',
        },
      ],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入员工全名',
      },
    },
  },
  {
    label: '性别',
    layout: formItemLayout,
    field: 'userGender',
    exclude: personRegistFlag,
    options: {
      validateFirst: true,
      rules: [
        { required: true, message: '请选择性别' },
      ],
    },
    col: 24,
    component: {
      name: 'RadioGroup',
      props: {
        options: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 0,
          },
        ],
      },
    },
  },
  {
    label: '设置密码',
    layout: formItemLayout,
    field: 'password',
    exclude: personRegistFlag,
    options: {
      validateFirst: true,
      rules: [
        {
          required: true,
          message: '请输入密码',
        },
        {
          max: 20,
          min: 6,
          message: '密码应在6-20位之间',
        },
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
          message: '密码不允许包含特殊字符',
        },
        {
          validator: (rule, value, cb) => {
            const otherVal = getFieldValue('confirmPassword')
            if (otherVal && value !== otherVal) {
              cb('密码不一致')
            } else {
              cb()
            }
          },
        },
      ],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入密码',
        type: 'password',
        onChange() {
          pasdChange()
        },
      },
    },
  },
  {
    label: '确认密码',
    layout: formItemLayout,
    field: 'confirmPassword',
    exclude: personRegistFlag,
    options: {
      validateFirst: true,
      rules: [
        {
          required: true,
          message: '请再次输入密码！',
        },
        {
          max: 20,
          min: 6,
          message: '密码应在6-20位之间！',
        },
        {
          pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
          message: '密码不允许包含特殊字符！',
        },
        {
          validator: (rule, value, cb) => {
            const otherVal = getFieldValue('password')
            if (otherVal && value !== otherVal) {
              cb('密码不一致')
            } else {
              cb()
            }
          },
        },
      ],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '请再次输入密码',
        type: 'password',
        onChange() {
          confirmPasdChange()
        },
      },
    },
  },
]
export default {
  form,
}
