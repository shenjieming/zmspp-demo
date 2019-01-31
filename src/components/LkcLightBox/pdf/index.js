import React from 'react'
import PropTypes from 'prop-types'
// import { Document, Page } from 'react-pdf'
import { Spin } from 'antd'
import Styles from './index.less'

class PDF extends React.Component {
  static propTypes = {
    pdfUrl: PropTypes.string.isRequired,
    onLoadSuccess: PropTypes.func,
  }
  constructor(props) {
    super(props)
    const { pdfUrl } = this.props
    this.state = {
      pdfUrl,
      pageNumber: 1,
      buttonVisible: true,
      loading: true,
    }
  }
  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages, loading: false })
    const { onLoadSuccess } = this.props
    if (onLoadSuccess) {
      onLoadSuccess()
    }
  }

  onHandleClick = () => {
    const { pageNumber, numPages } = this.state
    if (pageNumber + 1 >= numPages) {
      this.setState({ pageNumber: numPages, buttonVisible: false })
    }
    this.setState({ pageNumber: pageNumber + 1 })
  }

  render() {
    const { pdfUrl, numPages, loading } = this.state
    // 打印的Page
    const getPrintPage = () => {
      const pages = []
      for (let i = 0; i < numPages; i++) {
        pages.push(<Page key={i + 1} renderTextLayer={false} pageNumber={i + 1} />)
      }
      return pages
    }
    // return (
    //   <div className={`${Styles['aek-pdf']}`}>
    //     <Spin
    //       spinning={loading}
    //       size="large"
    //       style={{
    //         height: '100%',
    //         minHeight: '800px',
    //       }}
    //     >
    //       <Document
    //         file={pdfUrl}
    //         onLoadSuccess={this.onDocumentLoad}
    //         loading=""
    //       >
    //         {getPrintPage()}
    //       </Document>
    //     </Spin>
    //   </div>
    // )
  }
}

export default PDF
