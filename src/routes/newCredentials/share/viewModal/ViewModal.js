import React from 'react'
import { Modal, Alert, Timeline, Button, Input, Icon, Spin, Form } from 'antd'
import PropTyps from 'prop-types'
import { noop, sortBy } from 'lodash'
import LkcLightBox from '../../../../components/LkcLightBox'
import scrollToTop from '../../../../components/LkcForm/scrollToTop'
import styles from './index.less'
import { FORM_ITEM_LAYOUT } from '../../../../utils/constant'
import { IMG_COMPRESS } from '../../../../utils/config'
import pdfImage from '../../../../assets/pdf.png'

const propTypes = {
  visible: PropTyps.bool,
  onCancel: PropTyps.func,
  viewType: PropTyps.string,
  certificateNo: PropTyps.string,
  productName: PropTyps.string,
  approveStatus: PropTyps.string,
  refuseReason: PropTyps.string,
  certificateList: PropTyps.array,
  certificateClick: PropTyps.func,
  approveHandler: PropTyps.func,
  refuseHandler: PropTyps.func,
  certificatePlace: PropTyps.string,
  loading: PropTyps.bool,
  form: PropTyps.object,
}
const FormItem = Form.Item
class ViewCertificateModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { photoWallVisible: false, currentData: {}, viewData: [] }
  }
  render() {
    const {
      visible,
      loading,
      onCancel = noop,
      // 查看类型  view & approve
      viewType,
      // 注册证号
      certificateNo,
      // 产品名称
      productName,
      // 审核状态（暂时没有作用，等待其他状态也需要查看的时候使用）
      // approveStatus,
      // 拒绝原因
      refuseReason,
      // 证件列表
      certificateList = [],
      // 审核通过方法
      approveHandler,
      // 审核拒绝方法
      refuseHandler,
      // 档案位置
      certificatePlace,
      form: { getFieldDecorator, validateFields },
    } = this.props
    const getTitle = () => {
      let mainTitle = '查看证件'
      if (viewType === 'approve') {
        mainTitle = '审核证件'
      }
      return <div>{mainTitle}</div>
    }
    const statusHtml = (status) => {
      if (viewType !== 'approve') {
        return ''
      }
      switch (status) {
        case 1:
          return (
            <div className={styles.orangeBlock}>
              <Icon type="search" />待审核
            </div>
          )
        case 2:
          return (
            <div className={styles.redBlock}>
              <Icon type="close" />上次审核拒绝
            </div>
          )
        case 3:
          return (
            <div className={styles.greenBlock}>
              <Icon type="check" />上次审核通过
            </div>
          )
        default:
          return ''
      }
    }
    // const CascadingImage = showImgUrls =>
    //   showImgUrls &&
    //   showImgUrls.map((itemUrl, idx) => {
    //     if (idx > 2) {
    //       return ''
    //     }
    //     return (
    //       <img
    //         key={itemUrl}
    //         src={itemUrl}
    //         alt="证件图片"
    //         style={{
    //           top: `${idx * 5}px`,
    //           left: `${idx * 5}px`,
    //           zIndex: 1000 - idx * 100,
    //         }}
    //       />
    //     )
    //   })
    const renderExpired = (validDate, expireFlag) => (
      <span>
        {validDate}
        {expireFlag && <span className="aek-red">（已过期）</span>}
      </span>
    )
    const descriptionHtml = (item) => {
      const {
        certificateStatus,
        certificateType,
        agentSupplierName,
        validDate,
        expireFlag,
        superiorAuthFactoryName,
        supplierOrgName,
        supplierContactName,
        supplierContactPhone,
      } = item
      switch (certificateType) {
        case '厂家/总代三证':
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{superiorAuthFactoryName}</div>
              <div>国内总代：{agentSupplierName}</div>
              {statusHtml(certificateStatus)}
            </div>
          )

        case '医疗器械注册证':
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{certificateNo}</div>
              <div>{productName}</div>
              <div>有效期：{renderExpired(validDate, expireFlag)}</div>
              {statusHtml(certificateStatus)}
            </div>
          )
        case '经销授权书':
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{superiorAuthFactoryName}</div>
              <div>授权给：{supplierOrgName}</div>
              <div>有效期：{renderExpired(validDate, expireFlag)}</div>
              {statusHtml(certificateStatus)}
            </div>
          )
        case '供应商企业三证':
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{supplierOrgName}</div>
              <div>
                <Icon type="phone" />
                <span style={{ margin: '0px 8px' }}>{supplierContactName}</span>
                {supplierContactPhone}
              </div>
              {statusHtml(certificateStatus)}
            </div>
          )
        case '法人委托书':
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{supplierOrgName}</div>
              <div>业务员：{supplierContactName}</div>
              <div>有效期：{renderExpired(validDate, expireFlag)}</div>
              {statusHtml(certificateStatus)}
            </div>
          )
        default:
          return (
            <div className={styles.leftBox}>
              <div className="aek-text-bold aek-text-primary">{supplierOrgName}</div>
              <div>有效期：{renderExpired(validDate, expireFlag)}</div>
              {statusHtml(certificateStatus)}
            </div>
          )
      }
    }
    const imageHtml = showImgUrls =>
      showImgUrls &&
      showImgUrls[0] && (
        <div className={styles.rightBox}>
          <div className={styles.imgBack}>
            <img
              src={showImgUrls[0].endsWith('.pdf') ? pdfImage : showImgUrls[0] + IMG_COMPRESS}
              alt="图片"
            />
          </div>
        </div>
      )
    const itemClick = (certificateId, showImgUrls) => {
      if (!showImgUrls) {
        return
      }
      // 组织数据
      const currentData = {
        key: certificateId,
        value: showImgUrls[0],
      }
      const viewData = certificateList
        .map((item) => {
          const { certificateType, images } = item
          if (images.every(({ value }) => !value)) {
            return undefined
          }
          const filteredImgs = images.filter(({ value }) => value)
          return {
            groupTitle: certificateType,
            detailDom: descriptionHtml(item),
            key: item.certificateId,
            imgs: sortBy(filteredImgs, itm => itm.index),
          }
        })
        .filter(item => item)
      this.setState({
        photoWallVisible: true,
        currentData,
        viewData,
      })
    }
    // const getStyle = (idx) => {
    //   if (idx !== 0) {
    //     // 不是第一个以及详情未加载好
    //     return undefined
    //   }
    //   if (refuseReason) {
    //     return { marginTop: '156px', paddingTop: '10px' }
    //   }
    //   return { marginTop: '70px', paddingTop: '10px' }
    // }
    const certificateData = (
      <Timeline>
        <Timeline.Item key="detail" className={'aek-text-bold aek-mt20'}>
          <div>
            <div>
              <div>{certificateNo}</div>
              <div>商品名:{productName}</div>
            </div>
            {refuseReason && (
              <Alert
                message={viewType === 'approve' ? '上次审核未通过原因：' : '证件审核未通过原因：'}
                description={refuseReason}
                type="info"
                showIcon
                className="aek-mt10 aek-word-break"
              />
            )}
          </div>
        </Timeline.Item>
        {certificateList.map((item, idx) => {
          const { certificateId, images } = item
          const orderedImgs = sortBy(images, itm => itm.index)
          const showImgUrlValue = orderedImgs[0] && orderedImgs[0].value
          const showImgUrls = showImgUrlValue && showImgUrlValue.split(',')
          return (
            <Timeline.Item key={item.certificateId}>
              <div className="aek-gray">{item.certificateType}</div>
              <div
                className={`${styles.certificateBlock} ${showImgUrls && styles.clickable}`}
                onClick={() => {
                  itemClick(certificateId, showImgUrls)
                }}
              >
                {descriptionHtml(item)}
                {imageHtml(showImgUrls)}
              </div>
            </Timeline.Item>
          )
        })}
      </Timeline>
    )
    const getFooter = viewType === 'approve' && (
      <div>
        <div className={styles.position}>
          <Form>
            {/*<FormItem {...FORM_ITEM_LAYOUT} label="档案存放位置">*/}
              {/*{getFieldDecorator('certificatePlace', {*/}
                {/*initialValue: certificatePlace,*/}
              {/*})(<Input />)}*/}
            {/*</FormItem>*/}
          </Form>
        </div>
        <Button
          type="primary"
          onClick={() => {
            scrollToTop('top')
            validateFields((error, value) => {
              if (!error) {
                approveHandler(value.certificatePlace)
              }
            })
          }}
        >
          通过
        </Button>
        <Button
          type="primary"
          onClick={() => {
            scrollToTop('top')
            validateFields((error, value) => {
              if (!error) {
                refuseHandler(value.certificatePlace)
              }
            })
          }}
        >
          拒绝
        </Button>
      </div>
    )
    const modalProps = {
      visible,
      wrapClassName: `aek-modal ${styles.modalWrapper}`,
      width: 600,
      title: getTitle(),
      onCancel: () => {
        scrollToTop('top')
        onCancel()
      },
      maskClosable: false,
      footer: getFooter,
    }
    const LkcLightBoxProps = {
      isOpen: this.state.photoWallVisible,
      currentData: this.state.currentData,
      dataSource: this.state.viewData,
      // photoIndex: 0,
      onCancel: () => {
        this.setState({ photoWallVisible: false })
      },
    }
    return (
      <div>
        <Modal {...modalProps}>
          <span id="top" />
          <Spin spinning={loading}>
            <div className={styles.listContainer}>{certificateData}</div>
          </Spin>
        </Modal>
        <LkcLightBox {...LkcLightBoxProps} />
      </div>
    )
  }
}

ViewCertificateModal.propTypes = propTypes
export default Form.create()(ViewCertificateModal)
