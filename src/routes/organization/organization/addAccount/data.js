import React from 'react'
import { REGEXP_TELEPHONE } from '../../../../utils/constant'
import { asyncValidate } from '../../../../utils'

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
  dispatchAction,
  accountExitFlag,
  backAccountIdObj: { orgName },
  backAccountObj: { mobile, username, realName, gender },
}) => [
  {
    label: '机构名称',
    layout: formItemLayout,
    field: 'orgName',
    view: true,
    options: {
      initialValue: orgName,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  },
  accountExitFlag && (
    <span className="aek-red" style={{ marginBottom: 24, marginLeft: 86, display: 'inline-block' }}>
      提示：检测到该手机已注册，点击提交设置为该机构的管理员
    </span>
  ),
  {
    label: '手机号',
    layout: formItemLayout,
    field: 'mobile',
    view: accountExitFlag,
    options: {
      rules: [
        {
          required: true,
          message: '请输入',
        },
        {
          pattern: REGEXP_TELEPHONE,
          message: '格式错误',
        },
      ],
      initialValue: accountExitFlag ? (
        <span>
          {mobile}
          <a
            onClick={() => {
              dispatchAction({ payload: { accountExitFlag: false, backAccountObj: {} } })
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
        placeholder: '请输入',
        onBlur(e) {
          dispatchAction({
            type: 'acyMobile',
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
    label: '用户名',
    layout: formItemLayout,
    field: 'loginName',
    view: accountExitFlag,
    options: {
      initialValue: accountExitFlag ? username : '',
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
          pattern: '^[a-zA-Z][a-zA-Z0-9]*$',
          message: '非法字符',
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
        placeholder: '请输入',
      },
    },
  },
  {
    label: '真实姓名',
    layout: formItemLayout,
    field: 'realName',
    view: accountExitFlag,
    options: {
      initialValue: realName,
      rules: [
        {
          required: true,
          message: '请输入',
        },
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
        placeholder: '请输入',
      },
    },
  },
  {
    label: '性别',
    layout: formItemLayout,
    col: 24,
    field: 'gender',
    view: accountExitFlag,
    options: {
      initialValue: accountExitFlag ? <span>{gender ? '男' : '女'}</span> : gender,
      rules: [{ required: true, message: '请选择' }],
    },
    component: {
      name: 'RadioGroup',
      props: {
        options: [{ label: '男', value: 1 }, { label: '女', value: 0 }],
      },
    },
  },
]
export default {
  form,
}
