import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import { getBasicFn } from '../../../../utils/'
import style from './index.less'

const propTypes = {
  logistics: PropTypes.object,
  location: PropTypes.object,
}

class Logistics extends React.Component {
  state = {
    logistics: this.props.logistics,
  }
  componentWillMount() {
    const initState = {
      formId: '',
      deliverCompanyCode: '',
      currentPageData: {},
      logisticsList: [],
    }
    const { dispatchAction } = getBasicFn({
      namespace: 'logistics',
    })
    dispatchAction({ type: 'updateState', payload: { ...initState } })
    const { pathname } = this.props.location
    const arr = pathname.split('/')
    const formId = arr[arr.length - 1]
    dispatchAction({ type: 'updateState', payload: { formId } })
    dispatchAction({ type: 'queryLogisticsMsg' })
  }
  componentWillReceiveProps() {
    this.setState({ logistics: this.props.logistics })
  }
  render() {
    const {
      currentPageData: {
        deliverCompany,
        deliverName,
        deliverNo,
        deliverPhone,
        deliverPlateNumber,
        deliverType,
      },
      logisticsList,
    } = this.state.logistics
    return (
      <div className="aek-layout">
        <div className="bread">
          <Breadcrumb />
        </div>
        {Number(deliverType) === 1 ? (
          <APanel title="配送" height={'220px'}>
            <div className={style.wrap}>
              <p>
                配送方式：<span className="aek-primary-color">物流配送</span>
              </p>
              <p>
                快递公司：<span>{deliverCompany}</span>
              </p>
              <p>
                运单号：<span>{deliverNo}</span>
              </p>
            </div>
          </APanel>
        ) : (
          <APanel title="配送">
            <div className={style.wrap}>
              <p>
                配送方式：<span className="aek-primary-color">自送</span>
              </p>
              <p>
                配送人：<span>{deliverName}</span>
              </p>
              <p>
                联系电话：<span>{deliverPhone}</span>
              </p>
              <p>
                车牌号：<span>{deliverPlateNumber}</span>
              </p>
            </div>
          </APanel>
        )}
        {Number(deliverType) === 1 ? (
          <APanel title="物流信息">
            {logisticsList.length > 0 ? (
              logisticsList.map(({ acceptTime, acceptStation }, idx) => (
                <div
                  key={idx}
                  className={style.stepWrap}
                  style={idx !== 0 ? { color: '#757575' } : {}}
                >
                  <div className={idx === 0 ? style.currentPoint : style.otherPoint}>
                    <span />
                  </div>
                  <div
                    className={style.msgWrap}
                    style={idx === logisticsList.length - 1 ? { border: 'none' } : {}}
                  >
                    <p>{acceptStation}</p>
                    <p className={style.time}>{acceptTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>未跟踪到信息</div>
            )}
          </APanel>
        ) : (
          ''
        )}
      </div>
    )
  }
}

Logistics.propTypes = propTypes
export default connect(({ logistics }) => ({ logistics }))(Logistics)
