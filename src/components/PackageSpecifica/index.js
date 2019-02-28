import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Row, Col, Table, Select, InputNumber, Icon, message, Alert } from 'antd'
import { deepFind, cloneDeep } from '../../utils'

class PackageSpecifica extends React.Component {
  static propTypes = {
    handleModalCancel: PropTypes.func.isRequired,
    handleModalOk: PropTypes.func.isRequired,
    packageUnit: PropTypes.array.isRequired,
    packageList: PropTypes.object.isRequired,
    modalVisible: PropTypes.bool,
    loading: PropTypes.bool,
    buttonLoading: PropTypes.bool,
  }

  static defaultProps = {
    modalVisible: false, // 弹框visible
    packageUnit: [], // 包装规格所有单位
    packageList: {}, // 渲染表格数据
    loading: false, // bodyLoading
    buttonLoading: false, // 提交loading
  }

  state = {
    packageList: [],
  }

  componentWillReceiveProps = ({ packageList }) => {
    this.setState({ packageList: packageList.data })
  }

  packageListChange = (packageList) => {
    this.setState({ packageList })
  }

  render() {
    const { packageList: statePackageList } = this.state
    const {
      modalVisible,
      handleModalCancel,
      handleModalOk,
      packageUnit,
      loading,
      buttonLoading,
      packageList: { unitText },
    } = this.props
    const packageList = cloneDeep(statePackageList)

    // 弹框参数
    const modalProp = {
      title: '包装规格维护',
      visible: modalVisible,
      okText: '保存',
      confirmLoading: buttonLoading,
      wrapClassName: 'aek-modal',
      onCancel() {
        handleModalCancel()
      },
      afterClose() {
        handleModalCancel()
      },
      onOk() {
        const len = packageList.length - 1
        if (packageList.length === 0) {
          handleModalOk()
          return
        } else if (packageList.length !== 0) {
          if (!packageList[len].packageQuantity || !packageList[len].packageUnitId) {
            message.error('请先完善数据！', 3)
            return
          }
        }
        const req = packageList.map((item) => {
          const findItem = deepFind(packageUnit, { dicValue: item.packageUnitId })
          if (findItem) {
            return { ...item, packageUnitText: findItem.dicValueText }
          }
          return item
        })
        handleModalOk(req)
      },
    }

    // 下拉框数据
    const optionList = []
    if (packageUnit && packageList) {
      for (const obj of packageUnit) {
        let flag = false
        for (const objs of packageList) {
          if (obj.dicValue === objs.packageUnitId || obj.dicValueText === unitText) {
            flag = true
          }
        }
        optionList.push(
          <Select.Option key={obj.dicValue} disabled={flag} value={obj.dicValue}>
            {obj.dicValueText}
          </Select.Option>,
        )
      }
    }

    const columns = [
      {
        key: 'packageQuantity',
        dataIndex: 'packageQuantity',
        title: '包装数量',
        width: 150,
        className: 'aek-text-center',
        render: (value, record, index) => (
          <div style={{ verticalAlign: 'middle' }}>
            <div style={{ width: 80, marginRight: 8, display: 'inline-block' }}>
              <InputNumber
                onChange={(inputValue) => {
                  packageList[index].packageQuantity = inputValue
                  this.packageListChange(packageList)
                }}
                value={value}
                placeholder="请输入"
                min={1}
                style={{ verticalAlign: 'middle' }}
                precision={0}
              />
            </div>
            <div style={{ display: 'inline-block', height: '28px', lineHeight: '28px', overflow: 'hidden', verticalAlign: 'middle' }}>
              {unitText}
            </div>
          </div>
        ),
      },
      {
        key: 'packageUnitId',
        dataIndex: 'packageUnitId',
        title: '包装单位',
        className: 'aek-text-center',
        render: (value, { pscId }, index) => (
          <Select
            value={value}
            style={{ width: '80px' }}
            showSearch
            placeholder="请选择"
            optionFilterProp="children"
            onSelect={(val) => {
              const item = deepFind(packageUnit, { dicValue: val })
              packageList[index].packageUnitId = val
              packageList[index].dicValueText = item.dicValueText
              packageList[index].pscId = pscId
              this.packageListChange(packageList)
            }}
          >
            {optionList}
          </Select>
        ),
      },
      {
        key: 'operation',
        dataIndex: 'operation',
        title: <a>
          <Icon
            type="plus-circle-o"
            style={{ fontSize: 16 }}
            onClick={() => {
              console.log(packageList)
              if (packageList.length >= 5) {
                message.error('最多添加5条数据！', 3)
                return
              }
              const len = packageList.length - 1
              if (packageList.length !== 0) {
                if (!packageList[len].packageQuantity || !packageList[len].packageUnitId) {
                  message.error('请先完善数据！', 3)
                  return
                }
              }
              const obj = {
                packageQuantity: '',
                packageUnitId: '',
              }
              packageList.push(obj)
              this.packageListChange(packageList)
            }}
          />
        </a>,
        className: 'aek-text-center',
        render: (value, record, index) => (<a
          onClick={() => {
            packageList.splice(index, 1)
            const arr = packageList.map((itm, idx) => ({ ...itm, index: idx }))
            this.packageListChange(arr)
          }}
        >
          <Icon type="minus-circle-o" style={{ fontSize: 16 }} />
        </a>),
      },
    ]

    return (
      <Modal {...modalProp}>
        <Spin spinning={loading}>
          <Alert message="示例：例如某耗材一箱是500套，那么包装数量填“500”，单位选择“箱”即可。" type="info" showIcon />
          <Row className="aek-mtb10">
            <Col span={6}>
              <div className="aek-from-head">
                基本信息
              </div>
            </Col>
          </Row>
          <Table
            columns={columns}
            pagination={false}
            dataSource={packageList}
            rowKey={(record, idx) => record.packageUnitId || idx}
          />
        </Spin>
      </Modal>
    )
  }
}

export default PackageSpecifica
