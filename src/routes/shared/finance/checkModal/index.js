import React from 'react'
import PropTypes from 'prop-types'
import { Table, Row, Col } from 'antd'
import axios from '../../../../utils/axiosInstance'
import { baseURL } from '../../../../utils/config'
import { columns, columnsInner } from './props'
import style from './index.less'
import LkcLightBox from '../../../../components/LkcLightBox'

const handleUrl = (list) => {
  const urlList = []
  for (const { invoiceUrl } of list) {
    urlList.push(invoiceUrl)
  }
  return urlList.join(',')
}
class CheckModal extends React.Component {
  static propTypes = {
    formId: PropTypes.string,
    url: PropTypes.string,
    stockItems: PropTypes.array,
    expandedRowRender: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }
  static defaultProps = {
    url: '/finance/loan-apply/loan-order/invoice-check',
    expandedRowRender({ stockItems = [] }) {
      return (
        <Table
          className="inner-table"
          columns={columnsInner}
          dataSource={stockItems}
          rowKey="stockInItemId"
          pagination={false}
          size="small"
        />
      )
    },
  }
  constructor(props) {
    super(props)
    this.state = {
      formId: props.formId,
      text: props.children || '发票审核',
      loading: false,
      index: 0,
      grantAmount: '',
      stockInStatistics: '',
      invoices: [],
      stockIns: [],
      visible: false,
    }
  }
  onCancel() {
    this.setState({ visible: false })
  }
  show() {
    this.setState({ visible: true })
  }
  changeIndex(index) {
    this.setState({ index })
  }
  request() {
    this.setState({ visible: true, loading: true })
    axios
      .post(`${baseURL}${this.props.url}`, { formId: this.state.formId })
      .then((res) => {
        const { data: { content, code } } = res
        const {
          invoices = [],
          stockIns = [],
          grantAmount = null,
          stockInStatistics = null,
        } = content
        if (code === 200) {
          this.setState({
            grantAmount,
            stockInStatistics,
            invoices,
            stockIns,
            loading: false,
            index: 0,
          })
        }
      })
      .catch((error) => {
        console.error(error)
        this.setState({ loading: false })
      })
  }

  render() {
    const { visible, invoices, index, stockIns, stockInStatistics, grantAmount } = this.state
    const { expandedRowRender } = this.props
    const tableParam = {
      expandedRowRender,
      defaultExpandAllRows: true,
      expandRowByClick: true,
      bordered: true,
      loading: false,
      columns,
      dataSource: stockIns,
      pagination: false,
      rowKey: 'formId',
    }
    const imageDetail = (
      <div className={style.msgWrap} style={{ background: '#fff', height: '100%' }}>
        <div className={style.title}>基本信息</div>
        <div className={style.scroll}>
          <Table {...tableParam} />
          {stockIns.length > 0 && (
            <div className={style.footer}>
              合计共
              <span className={`aek-red ${style.textRed}`}>{stockInStatistics}</span>笔入库单 共贷款
              <span className={`aek-red ${style.textRed}`}>{grantAmount}</span> 元
            </div>
          )}
        </div>
      </div>
    )
    const invoiceItem = invoices[index] || {}
    const imageHeadDetail = (
      <Row className="aek-text-center" gutter={8}>
        <Col span={8}>发票号码：{invoiceItem.invoiceNo}</Col>
        <Col span={8}>发票金额：{invoiceItem.invoiceAmount}</Col>
        <Col span={8}>发票日期：{invoiceItem.invoiceDate}</Col>
      </Row>
    )
    const urls = handleUrl(invoices)
    return (
      <div>
        <LkcLightBox
          isOpen={visible}
          url={urls}
          onCancel={() => {
            this.onCancel()
          }}
          photoIndex={index}
          imageDetail={imageDetail}
          imageDetailWidth={600}
          imageHeadDetail={imageHeadDetail}
          onChange={(idx) => {
            this.changeIndex(idx)
          }}
        />
        <a onClick={() => this.request()}>发票核对</a>
      </div>
    )
  }
}

export default CheckModal
