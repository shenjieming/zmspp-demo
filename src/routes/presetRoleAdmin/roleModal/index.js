import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select, Radio } from 'antd'

import MenusTree from '../../../components/menusTree'
import { REGEXP_NUMLETTERCHAR } from '../../../utils/constant'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { error } = Modal

const RoleModal = ({
  dispatchAction,
  title,
  visible,
  totalMenus,
  roleDetail,
  orgType,
  onHide,
  onOk,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const getData = (total) => {
    let menus = []
    let nextLevelMenus = []
    total.forEach((first) => {
      const item = { menuName: null, menuId: null, childrenFunction: [] }
      if (first.checked) {
        item.menuId = first.id
        item.menuName = first.name
        // 要是下一层就有功能节点，直接向childrenFunction赋值
        if (first.children.length > 0 && first.children[0].type !== 0) {
          first.children.forEach((second) => {
            if (second.checked) {
              item.childrenFunction.push({ functionId: second.id })
            }
          })
          menus.push(item)
        } else if (first.children.length > 0 && first.children[0].type === 0) {
          // 否则新写入一个item
          menus.push(item)
          nextLevelMenus = getData(first.children)
          menus = menus.concat(nextLevelMenus)
        } else {
          menus.push(item)
        }
      }
    })
    return menus
  }
  const okHandler = () => {
    validateFields((err, values) => {
      if (!err) {
        // 拼接数据
        const menusData = getData(totalMenus)
        // 必须要有一个选中的
        if (menusData.length === 0) {
          error({
            content: '至少选择一个权限',
          })
          return
        }
        if (!roleDetail) {
          // values.adminFlag = Boolean(values.adminFlag)
          onOk({ ...values, menus: menusData })
        } else {
          onOk({ roleId: roleDetail.roleId, roleName: values.roleName, menus: menusData })
        }
      }
    })
  }
  const modalOpts = {
    title,
    visible,
    afterClose: resetFields,
    onCancel: onHide,
    onOk: okHandler,
    maskClosable: false,
    width: 700,
    wrapClassName: 'aek-modal',
  }
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  const editMenusParam = {
    dispatchAction,
    total: totalMenus,
    showType: 'edit',
  }
  return (
    <Modal {...modalOpts}>
      <Form onSubmit={okHandler}>
        <FormItem {...formItemLayout} label="角色名称">
          {getFieldDecorator('roleName', {
            initialValue: roleDetail && roleDetail.roleName,
            rules: [
              { required: true, whitespace: true, message: '请输入角色名称' },
              { pattern: REGEXP_NUMLETTERCHAR, message: '只能输入中文、字母以及数字' },
              { max: 15, message: '最多输入15位字符' },
            ],
            validateFirst: true,
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
        {!roleDetail ? (
          <FormItem {...formItemLayout} label="机构类型">
            {getFieldDecorator('orgTypeValue', {
              rules: [{ required: true, message: '请选择机构类型' }],
            })(
              <Select placeholder="请选择机构类型">
                {orgType.map(item => (
                  <Select.Option
                    title={`机构类型: ${item.dicValueText}`}
                    key={item.dicValueId}
                    value={item.dicValue}
                  >
                    {item.dicValueText}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </FormItem>
        ) : (
          <FormItem {...formItemLayout} label="机构类型">
            <span className="ant-form-text">{roleDetail.orgType}</span>
          </FormItem>
        )}
        {!roleDetail ? (
          <FormItem {...formItemLayout} label="机构管理员角色">
            {getFieldDecorator('adminFlag', {
              initialValue: 'false',
            })(
              <RadioGroup>
                <Radio value="true">是</Radio>
                <Radio value="false">否</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        ) : (
          <FormItem {...formItemLayout} label="机构管理员角色">
            <span className="ant-form-text">{roleDetail.adminFlag ? '是' : '否'}</span>
          </FormItem>
        )}
        <MenusTree {...editMenusParam} />
      </Form>
    </Modal>
  )
}

RoleModal.propTypes = {
  onOk: PropTypes.func,
  onHide: PropTypes.func,
  form: PropTypes.object,
  roleName: PropTypes.string,
  loading: PropTypes.object,
  visible: PropTypes.bool,
  totalMenus: PropTypes.array,
  roleDetail: PropTypes.object,
  orgType: PropTypes.array,
  title: PropTypes.string,
  dispatchAction: PropTypes.func,
}

export default Form.create()(RoleModal)
