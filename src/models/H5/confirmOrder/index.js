import React from 'react'
import { inRange } from 'lodash'
import { Modal } from 'antd'
import { parse } from 'qs'
import services from '../../../services/H5/confirmOrder'
import modelExtend from '../../../utils/modelExtend'
import { REQUEST_SUCCESS_REGION, CONSUMER_HOTLINE } from '../../../utils/config'

const initialState = {
  confirmText: '',
  pageStatus: 1, // 0网络错误页 ,//1订单详情页, 2订单确认信息输入页 , 3订单已经确认页
  confirmStatus: 0,
  operateBy: '',
  operateName: '',
  orderInfo: {
    formAmount: ' ', // 订单总金额
    customerOrgLogoUrl: ' ', // Logo图片地址
    purchaseName: ' ', // 采购人
    urgentFlag: 1, // 是否加急
    formStatus: 1, // 订单状态 状态：1-尚未配送；2-部分配送；3-配送完结；4-订单完结；5-已终止；6已作废
    formId: ' ', // 订单标识
    confirmStatus: 0, // 确认状态  订单是否确认：0-未确认；1-确认
    formQty: ' ', // 订单总数量
    formNo: ' ', // 订单号
    customerOrgId: ' ', // 客户机构标识
    saleType: ' ', // 销售方式 销售方式：1-直销；2-分销
    purchasePhone: ' ', // 采购人电话
    purchaseRemark: ' ', // 采购备注
    formType: ' ', // 订单类型 1-普耗；2-寄售；3-跟台
    customerOrgName: ' ', // 客户机构名称
    purchaseTime: ' ', // 采购时间
    items: [
      {
        materialsSku: ' ', // 物料规格型号
        purchasePackageQty: ' ', // 采购包装数量
        skuUnitText: ' ', // 物料规格单位文本
        materialsName: ' ', // 物料名称
        itemId: ' ', // 订单明细标识
        packageUnitText: ' ', // 包装单位文本
        urgentFlag: ' ', // 是否加急
        materialsPrice: ' ', // 物料单价
        materialsCommonName: ' ', // 物料通用名称
        certificateNo: ' ', // 注册证号
        purchaseQty: ' ', // 采购数量
      },
    ],
  },
}

export default modelExtend({
  namespace: 'confirmOrder',
  state: initialState,
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/confirmOrder') {
          const par = parse(search, { ignoreQueryPrefix: true })
          dispatch({
            type: 'getOrderInfo',
            payload: {
              ...par,
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取订单信息
    * getOrderInfo({ payload }, { call, put }) {
      const res = yield call(services.getOrderDetail, {
        formId: payload.formId,
      })
      if (res && res.data && inRange(res.data.code, ...REQUEST_SUCCESS_REGION)) {
        yield put({
          type: 'updateState',
          payload: {
            pageStatus: 1,
            ...payload,
            orderInfo: res.data.content,
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            pageStatus: 0,
            ...payload,
          },
        })
      }
    },
    // 提交确认信息
    * submit({ payload }, { call, put, select }) {
      const state = yield select(app => app.confirmOrder)

      const res = yield call(services.confirmOrder, {
        formId: state.orderInfo.formId,
        confirmType: payload.confirmStatus,
        confirmRemark: payload.confirmText,
        operateBy: state.operateBy,
        operateName: state.operateName,
      })

      if (res && res.data && inRange(res.data.code, ...REQUEST_SUCCESS_REGION)) {
        Modal.success({
          title: '订单确认成功！',
          content: '稍后客户将会收到您的确认信息',
          onOk: () => {
            window.location.reload()
          },
        })
      } else {
        Modal.error({
          title: '提交失败，请重试',
          content: (
            <span>
              提交时出现了一些问题，请检查网络是否通畅，如果需要帮助，请联系客服
              <a href={`tel://${CONSUMER_HOTLINE}`}>{CONSUMER_HOTLINE}</a>
            </span>
          ),
        })
      }
    },
  },
  reducers: {},
})
