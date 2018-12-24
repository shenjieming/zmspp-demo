import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Avatar, Table, Switch, Input } from 'antd'
import { set, includes, toUpper } from 'lodash'
import { getImgCompress } from '@utils'

const propTypes = {
  data: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  adminFlag: PropTypes.bool.isRequired,
  tableLoading: PropTypes.bool.isRequired,
}

class EditModal extends React.PureComponent {
  static defaultProps = {
    data: [],
  }

  state = {
    dataSource: [],
    searchText: '',
    selectedRowKeys: [],
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible && !nextProps.visible) {
      this.setState({ searchText: '' })
    }
    if (nextProps.data !== this.props.data) {
      const data = nextProps.data
      this.setState({
        dataSource: data,
        selectedRowKeys: data
          .filter(({ flag }) => {
            if (nextProps.adminFlag) {
              return true
            }
            return flag
          })
          .map(({ orgId }) => orgId),
      })
    }
  }

  getColumns = () => [
    {
      className: 'aek-text-center',
      width: 50,
      key: 'orgLogoUrl',
      dataIndex: 'orgLogoUrl',
      render: text => <Avatar src={getImgCompress(text)} className="aek-avatar-border" />,
    },
    {
      title: '客户名称',
      dataIndex: 'orgName',
      key: 'orgName',
      render: (text, row) => (
        <div>
          {text}
          {row.customerQty > 0 && (
            <span className="aek-text-disable aek-font-small">(已有{row.customerQty}个业务员)</span>
          )}
        </div>
      ),
    },
    {
      title: '是否接收短信',
      dataIndex: 'smsFlag',
      key: 'smsFlag',
      width: 80,
      className: 'aek-text-center',
      render: (text, row, i) => {
        if (!includes(this.state.selectedRowKeys, row.orgId)) {
          return null
        }
        return (
          <Switch
            onChange={(checked) => {
              this.setState(({ dataSource }) => ({
                dataSource: set(dataSource, [i, 'smsFlag'], checked).concat(),
              }))
            }}
            checked={text}
            unCheckedChildren="否"
            checkedChildren="是"
          />
        )
      },
    },
  ]

  handleInputSearchChange = (e) => {
    this.setState({ searchText: e.target.value })
  }

  handleOk = () => {
    const { selectedRowKeys, dataSource } = this.state
    const list = dataSource
      .filter(({ orgId }) => includes(selectedRowKeys, orgId))
      .map(({ orgId, smsFlag }) => ({ customerOrgId: orgId, smsFlag }))
    this.props.handleOk(list)
  }

  render() {
    const { adminFlag, visible, loading, handleCancel, tableLoading } = this.props
    const { searchText, dataSource, selectedRowKeys } = this.state

    const modalProps = {
      title: '设置业务权限',
      visible,
      confirmLoading: loading,
      width: 600,
      onCancel: handleCancel,
      onOk: this.handleOk,
    }

    const tableProps = {
      dataSource: dataSource.filter(
        ({ orgName, orgNameHelper }) =>
          includes(orgName, searchText) || includes(orgNameHelper, toUpper(searchText)),
      ),
      columns: this.getColumns(),
      rowSelection: {
        selectedRowKeys,
        onChange: (keys) => {
          this.setState({ selectedRowKeys: keys })
        },
        getCheckboxProps: () => ({ disabled: adminFlag }),
      },
      loading: tableLoading,
      rowKey: 'orgId',
      scroll: { y: 450 },
      pagination: false,
    }

    const inputProps = {
      value: searchText,
      onChange: this.handleInputSearchChange,
      placeholder: '请输入客户名称',
      style: { width: 250, marginBottom: 10 },
    }

    return (
      <Modal {...modalProps}>
        <Input.Search {...inputProps} />
        <Table {...tableProps} />
      </Modal>
    )
  }
}

EditModal.propTypes = propTypes

export default EditModal
