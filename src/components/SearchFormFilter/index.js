import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Icon } from 'antd'
import { get, isFunction, mapKeys, size, cloneDeep } from 'lodash'
import GetFormItem from '../../components/GetFormItem/GetFormItem'

/* 一些常量 */
const marginRight = { marginRight: 15 }

const SIMPLE_PREFIX = 'simple'
const ADVANCED_PREFIX = 'advanced'

const advancedFormDefaultProps = {
  width: 300,
  layout: { wrapperCol: { span: 16 }, labelCol: { span: 8 } },
}

const simpleFormDefaultProps = {
  layout: { wrapperCol: { span: 22 } },
  width: 220,
}
/* 过滤initialValues */
const getInitialObj = (init, arr) => {
  const initialValues = cloneDeep(init)
  const fieldKeys = []
  for (const item of arr) {
    fieldKeys.push(item.field)
  }
  for (const item of Object.keys(init)) {
    if (!fieldKeys.includes(item)) {
      delete initialValues[item]
    }
  }
  return initialValues
}
class AdvancedSearchForm extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    getPropsForm: PropTypes.func,
    loading: PropTypes.bool,
    buttonDisabled: PropTypes.bool,
    formData: PropTypes.array,
    components: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        field: PropTypes.string.isRequired,
        component: PropTypes.node.isRequired,
        options: PropTypes.object,
      }),
    ),
    form: PropTypes.object,
    advancedForm: PropTypes.array,
    // 查询初始值
    initialValues: PropTypes.object,
  }

  static defaultProps = {
    components: [],
    formData: [],
    loading: false,
    advancedForm: [],
  }

  constructor(props) {
    super(props)
    const { initialValues: filterInitValue, advancedForm, formData, components } = props
    this.initialValues = filterInitValue ? getInitialObj(filterInitValue, [
      ...formData,
      ...components,
      ...advancedForm,
    ]) : {}
    // TODO
    const formDataLen = [...formData, ...components].length

    const advancedVisible = (size(advancedForm) &&
    (size(this.initialValues) > formDataLen || formDataLen === 0)) || false

    this.state = { advancedVisible }
  }

  componentDidMount() {
    const { form, getPropsForm } = this.props

    const { advancedVisible } = this.state

    if (advancedVisible) {
      form.setFieldsValue(mapKeys(this.initialValues, (value, key) => `${ADVANCED_PREFIX}-${key}`))
    } else {
      form.setFieldsValue(mapKeys(this.initialValues, (value, key) => `${SIMPLE_PREFIX}-${key}`))
    }

    if (getPropsForm) {
      getPropsForm(form)
    }
  }

  advancedState = () => {
    this.setState(prevState => ({ advancedVisible: !prevState.advancedVisible }))
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { onSearch, form } = this.props

    if (isFunction(onSearch)) {
      const values = mapKeys(form.getFieldsValue(), (_, key) => key.slice(key.indexOf('-') + 1))

      onSearch(values)
    }
  }

  render() {
    const { loading, advancedForm, form: { resetFields }, formData, components, buttonDisabled } = this.props

    const formItemList = [...formData, ...components]

    const { advancedVisible } = this.state

    let SearchForm

    if (advancedVisible) {
      const mapedAdvancedForm = advancedForm.map(x => ({
        ...advancedFormDefaultProps,
        ...x,
        field: `${ADVANCED_PREFIX}-${x.field}`,
      }))

      SearchForm = (
        <div>
          <GetFormItem formData={mapedAdvancedForm} />
          <Form.Item style={{ textAlign: 'right' }}>
            <Button style={marginRight} size="large" type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={marginRight} size="large" onClick={() => resetFields()}>
              重置
            </Button>
            {!!formData.length && (<a style={{ lineHeight: '32px', ...marginRight }} onClick={this.advancedState}>
               简易搜索 <Icon type="up" style={{ verticalAlign: 'middle' }} />
            </a>)
            }
          </Form.Item>
        </div>
      )
    } else {
      const isAdvanced = !!get(advancedForm, 'length')

      const mapedFormdata = formItemList.map(x => ({
        ...simpleFormDefaultProps,
        ...x,
        field: `${SIMPLE_PREFIX}-${x.field}`,
      }))

      const buttonData = [
        {
          width: 'auto',
          component: {
            name: 'Button',
            props: {
              type: 'primary',
              disabled: buttonDisabled,
              htmlType: 'submit',
              children: '搜索',
              loading,
            },
          },
        },
        {
          view: true,
          width: 'auto',
          exclude: !isAdvanced,
          options: {
            initialValue: (
              <a style={{ lineHeight: '32px', marginLeft: 10 }} onClick={this.advancedState}>
                高级搜索 <Icon type="down" style={{ verticalAlign: 'middle' }} />
              </a>
            ),
          },
        },
      ]

      SearchForm = (
        <div>
          <GetFormItem formData={mapedFormdata.concat(buttonData)} />
        </div>
      )
    }

    return <Form onSubmit={this.handleSubmit}>{SearchForm}</Form>
  }
}

export default Form.create()(AdvancedSearchForm)
