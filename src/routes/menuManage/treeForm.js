import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Spin } from 'antd'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import { formItemData } from './data'

const TreeForm = ({
  formData,
  submit,
  update,
  create,
  formLoading,
  form: { validateFieldsAndScroll },
}) => {
  let newFormData = {}
  if (submit === 'update') {
    newFormData = formData
  } else {
    newFormData.parentName = formData.name
    newFormData.parentId = formData.id
  }
  function handleSubmit() {
    let data = {}
    validateFieldsAndScroll((errors, value) => {
      if (!errors) {
        if (submit === 'update') {
          data = {
            ...value,
            id: newFormData.id,
            parentId: newFormData.parentId,
            parentName: newFormData.parentName,
          }
          update(data)
        } else {
          data = {
            ...value,
            ...newFormData,
          }
          create(data)
        }
      }
    })
  }
  const replace = {
    ...newFormData,
    menuOrgs: newFormData.menuOrgs ? newFormData.menuOrgs.split(',') : [],
  }
  return (
    <Form>
      <Row style={{ margin: '0 0 24px' }}>
        <Col style={{ fontSize: 17, color: '#444' }} span={6}>
          菜单信息
        </Col>
        <Col style={{ textAlign: 'right' }} span={6} offset={12}>
          <Button type="primary" onClick={handleSubmit}>
            {submit === 'update' ? '修改菜单' : '添加子菜单'}
          </Button>
        </Col>
      </Row>
      <Spin spinning={formLoading}>
        <GetFormItem
          formData={formItemData(replace)}
        />
      </Spin>
    </Form>
  )
}
TreeForm.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Form.create()(TreeForm)
