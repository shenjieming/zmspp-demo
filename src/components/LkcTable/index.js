import React from 'react'
import PropTypes from 'prop-types'
import { Table, Checkbox, Row, Col, InputNumber, Icon, Button } from 'antd'
import { omit, cloneDeep } from 'lodash'
import classnames from 'classnames'

// import { LkcInputNumber } from '../index'
import Styles from './index.less'


const propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  handleSave: PropTypes.func,
}

class LkcTable extends React.Component {
  constructor(props) {
    super(props)
    const { columns } = this.props
    this.state = {
      configClumns: columns,
      headConfigFlag: false, // 默认关闭 判断是否有打开配置
    }
    this.headConfig = this.headConfig.bind(this)
    this.createHeadTitle = this.createHeadTitle.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    if ('columns' in nextProps) {
      const { columns } = nextProps
      this.setState({
        configClumns: columns,
      })
    }
  }

  headConfig() {
    const { headConfigFlag, configClumns } = this.state
    const { handleSave } = this.props

    const arr = configClumns.filter(obj => !obj.headConfigFlag)

    // 复选框 和宽度改变
    const handChange = (obj, index) => {
      const handArr = configClumns.map((item, i) => {
        if (i === index) {
          return obj
        }
        return item
      })
      this.setState({
        configClumns: handArr,
      })
    }

    // 向上 向下改变
    const handle = (type = 'up', index) => {
      const newArr = cloneDeep(configClumns)
      let x = index
      let y = index + 1
      if (type === 'up') {
        x = index - 1
        y = index
      }
      newArr.splice(x, 1, ...newArr.splice(y, 1, newArr[x]))
      this.setState({
        configClumns: newArr,
      })
    }

    const content = arr.map((item, index) => {
      const { title, key, dataIndex, exclude } = item
      return (<Row className={Styles['table-head-li']} span={24} key={key || dataIndex}>
        <Col span={2}>
          <Checkbox
            defaultChecked={!exclude}
            onChange={(e) => {
              const obj = {
                ...item,
                exclude: !e.target.checked,
              }
              handChange(obj, index)
            }}
          />
        </Col>
        <Col span={8}>
          {title}
        </Col>
        <Col span={6}>
          <InputNumber
            min={0}
            max={10}
            onChange={(value) => {
              const obj = {
                ...item,
                width: value,
              }
              handChange(obj, index)
            }}
            placeholder="请输入列宽"
          />
        </Col>
        <Col span={4} style={{ paddingLeft: '10px' }}>
          {
            index !== 0 && <span className="aek-mr10">
              <a onClick={() => {
                handle('up', index)
              }}
              >
                <Icon type="arrow-up" />
              </a>
            </span>
          }
          {
            index !== arr.length - 1 && <span>
              <a onClick={() => {
                handle('down', index)
              }}
              >
                <Icon type="arrow-down" />
              </a>
            </span>
          }
        </Col>
      </Row>)
    })
    return (<div className={classnames(Styles['table-head-config'], { [Styles['table-head-config-show']]: headConfigFlag })}>
      <div className="aek-content-title">
        选择显示字段
      </div>
      <div className={Styles['table-head-content']}>
        {content}
      </div>
      <div>
        <Button
          className="aek-mr10"
          onClick={() => {
            this.setState({
              headConfigFlag: false,
            })
          }}
        >取消</Button>
        <Button
          type="primary"
          onClick={() => {
            if (handleSave) {
              handleSave(this.state.configClumns)
              this.setState({
                headConfigFlag: false,
              })
            }
          }}
        >保存</Button>
      </div>
    </div>)
  }

  createHeadTitle() {
    const { columns } = this.props
    const newColumns = cloneDeep(columns)
    const thiz = this
    return newColumns.map((item) => {
      if (item.headConfigFlag) {
        const obj = {
          ...item,
        }
        obj.title = (
          <a>
            <Icon
              type="plus"
              onClick={() => {
                thiz.setState({
                  headConfigFlag: true,
                })
              }}
            />
          </a>
        )
        return obj
      }
      return item
    }).filter(item => !item.exclude)
  }

  render() {
    const { headConfigFlag } = this.state
    const { dataSource } = this.props

    const props = omit(this.props, ['columns', 'datasource', 'handleSave'])
    const tabelProps = {
      columns: this.createHeadTitle(),
      dataSource,
      ...props,
    }

    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div className={classnames(Styles.maskLayer, { [Styles.maskLayerShow]: headConfigFlag })} />
        <Table
          {...tabelProps}
        />
        {headConfigFlag && this.headConfig()}
      </div>
    )
  }
}
LkcTable.propTypes = propTypes
export default LkcTable
