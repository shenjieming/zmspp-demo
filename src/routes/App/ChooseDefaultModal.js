import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Avatar, Alert, Button } from 'antd'
import { getImgCompress } from '@utils'


const columns = [
  {
    key: 'orgLogoUrl',
    dataIndex: 'orgLogoUrl',
    render: text => <Avatar size="large" src={getImgCompress(text)} className="aek-avatar-border" />,
    className: 'aek-text-center',
  },
  {
    dataIndex: 'orgName',
    key: 'orgName',
  },
]

class ChooseDefaultModal extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    handleOk: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    const { dataSource } = props
    this.state = {
      selectedRowKeys: dataSource.length ? [dataSource.find(x => x.isDefaultOrg).orgId] : [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true && this.props.visible === false) {
      const { dataSource } = nextProps
      const selectedRowKeys = [dataSource.find(x => x.isDefaultOrg).orgId]
      this.setState({
        selectedRowKeys,
      })
    }
  }

  handleSelectedChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { visible, dataSource, handleClose, loading, handleOk } = this.props
    const { selectedRowKeys } = this.state

    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      onChange: this.handleSelectedChange,
      selectedRowKeys,
    }

    return (
      <Modal
        visible={visible}
        title="设置默认组织"
        onCancel={handleClose}
        maskClosable={false}
        footer={null}
      >
        <Alert message="默认组织设置成功后, 将作为登录后默认显示的组织" type="warning" />
        <Table
          rowKey="orgId"
          columns={columns}
          className="no-zebra"
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={false}
          showHeader={false}
        />
        <div className="aek-text-right aek-pt10">
          <Button
            onClick={() => {
              handleOk(selectedRowKeys.toString())
            }}
            loading={loading}
            type="primary"
            size="large"
          >
            设为默认组织
          </Button>
        </div>
      </Modal>
    )
  }
}

export default ChooseDefaultModal
