import React from 'react'
import PropTypes from 'prop-types'
import { Select, Spin, message as MSG } from 'antd'
import { debounce, get, trim } from 'lodash'
import { axios, getOption, pathResolve } from '../../utils'
import { REQUEST_SUCCESS_CODE, urlPrefix } from '../../utils/config'

const getComponent = arr => arr.map(({ props }) => <Select.Option {...props} />)

const getContainer = () => {
  const layout = document.querySelector('.aek-layout')

  if (layout) {
    return layout
  }
  return document.querySelector('body')
}

const removePrefix = (value, optionConfig) => {
  if (value && optionConfig && optionConfig.prefix) {
    const rs = { ...value }
    rs.label = trim(rs.label.split(':')[1])
    return rs
  }
  return value
}

const addPrefix = (value, optionConfig) => {
  if (value && optionConfig && optionConfig.prefix) {
    const rs = { ...value }
    rs.label = `${optionConfig.prefix} : ${rs.label}`
    return rs
  }

  return value
}

const getNotFoundContent = (loading, searchText) => {
  if (loading) {
    return <Spin size="small" />
  } else if (searchText) {
    return '无匹配内容'
  }
  return '请输入关键字进行检索'
}

class LkcSelect extends React.Component {
  static propTypes = {
    contentRender: PropTypes.func,
    url: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        type: PropTypes.string,
        perfix: PropTypes.string,
      }),
    ]),
    transformPayload: PropTypes.func,
    optionConfig: PropTypes.shape({
      prefix: PropTypes.string,
      idStr: PropTypes.string,
      nameStr: PropTypes.string,
      callback: PropTypes.func,
    }),
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ]),
    onSelect: PropTypes.func,
    modeType: PropTypes.string,
  }

  constructor(props) {
    super(props)

    const value = props.value || props.defaultValue
    this.state = {
      value: addPrefix(value, props.optionConfig),
      dataSource: [],
      loading: false,
      searchText: '',
    }
  }

  componentDidMount() {
    this.request()
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value, defaultValue, optionConfig } = nextProps
      this.setState({ value: addPrefix(value || defaultValue, optionConfig) })
    }
  }

  request = debounce((keywords = '') => {
    const { url, transformPayload, contentRender = _ => _ } = this.props
    if (!url) return null
    let pathname
    let method = 'POST'
    let perfix = 'base'

    if (typeof url === 'string') {
      pathname = url
    } else if (typeof url === 'object') {
      method = url.type
      perfix = url.perfix
      pathname = url.url
    }
    const type = method.toUpperCase() === 'POST' ? 'data' : 'params'

    this.setState({ loading: true })
    this.setState({ searchText: keywords })
    axios({
      method,
      url: pathResolve(urlPrefix[perfix], pathname),
      [type]: transformPayload ? transformPayload(keywords) : { keywords },
    })
      .then(({ data: { code, content, message } }) => {
        this.setState({ loading: false })

        if (code === REQUEST_SUCCESS_CODE) {
          this.setState({
            dataSource: contentRender(content) || [],
          })
        } else {
          MSG.error(message)
        }
      })
      .catch(() => {
        this.setState({ loading: false })
      })
    return null
  }, 400)

  triggerChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value })
    }
    const { onChange, optionConfig } = this.props
    if (onChange) {
      onChange(removePrefix(value, optionConfig))
    }
  }

  triggerSearch = (text) => {
    const { onSearch, modeType = 'autoComplete' } = this.props
    if (modeType !== 'select') {
      this.request(text)
    }
    if (onSearch) {
      onSearch(text)
    }
  }

  triggerSelect = (value) => {
    const { dataSource } = this.state
    const { onSelect, optionConfig } = this.props
    if (onSelect) {
      onSelect(
        removePrefix(value, optionConfig),
        dataSource.find(x => x[get(optionConfig, 'idStr')] === get(value, 'key')),
      )
    }
  }

  render() {
    const { value, dataSource, loading, searchText } = this.state
    const {
      optionConfig = {},
      url,
      transformPayload,
      contentRender,
      modeType = 'autoComplete',
      ...otherProps
    } = this.props
    const child = getComponent(getOption(dataSource, optionConfig))

    const props = {
      optionLabelProp: 'title',
      allowClear: true,
      filterOption: modeType === 'select',
      placeholder: '请输入关键字查询',
      notFoundContent: getNotFoundContent(loading, searchText),
      getPopupContainer: getContainer,
      showSearch: true,
      labelInValue: true,
      ...otherProps,
      value,
      onSelect: this.triggerSelect,
      onChange: this.triggerChange,
      onSearch: this.triggerSearch,
      children: loading ? undefined : child,
    }

    return <Select {...props} />
  }
}

export default LkcSelect
