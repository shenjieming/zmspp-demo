import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Icon, Badge, Checkbox, Spin } from 'antd'
import style from './style.less'
import img from '../../../../assets/shoppingCart-empty.png'

const propTypes = {
  cartVisible: PropTypes.bool,
  allSelected: PropTypes.bool,
  displayToggle: PropTypes.func,
  allSelect: PropTypes.func,
  onOrder: PropTypes.func,
  sunSelectNum: PropTypes.number,
  selectedNum: PropTypes.number,
  tableArr: PropTypes.array,
}
function Cart({
  cartVisible,
  displayToggle,
  sunSelectNum,
  selectedNum,
  tableArr,
  allSelect,
  onOrder,
  allSelected,
}) {
  return (
    <div className={style.right}>
      <div className={classnames(style.cart, { [style.cartHide]: cartVisible })}>
        <div className={style.iconBg} onClick={displayToggle}>
          <Badge className={style.badge} count={selectedNum} />
          <Icon type="shopping-cart" />
        </div>
      </div>
      <div className={classnames(style.maskLayer, { [style.maskLayerShow]: cartVisible })}>
        <div className={style.cartContent}>
          <Icon type="close" onClick={displayToggle} />
          <div className={style.content}>
            <div className={style.contentTop}>
              <Icon type="shopping-cart" />
              购物车
            </div>
            <Spin className={style.spin} spinning={false}>
              {
                tableArr.length
                  ? tableArr
                  : (
                    <div className={style.shoppingCartEmpty}>
                      <div>
                        <div>
                          <img src={img} alt="购物车为空" />
                          <span className="aek-text-disable">
                            购物车里神马也没有，赶快去采购吧~
                          </span>
                        </div>
                      </div>
                    </div>
                  )
              }
            </Spin>
          </div>
          {
            tableArr.length ?
              <div className={style.footer}>
                <div>
                  <Checkbox
                    checked={allSelected}
                    onChange={({ target: { checked } }) => { allSelect(checked) }}
                  >
                    <span style={{ fontSize: 16 }}>全选</span>
                  </Checkbox>
                </div>
                {
                  selectedNum ? (
                    <div>
                      <div>已选 <span className="aek-red">{selectedNum}</span> 个品规</div>
                      <div>合计数量：<span className="aek-red">{sunSelectNum}</span></div>
                      <div onClick={onOrder}>立即下单</div>
                    </div>
                  ) : null
                }
              </div> : null
          }
        </div>
      </div>
    </div>
  )
}
Cart.propTypes = propTypes
export default Cart
