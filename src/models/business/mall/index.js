import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  list: '/business-chance/my-releases/list',
})
const initState = {
  // 商机列表
  dataList: [],
  // 翻页参数
  pagination: {
    current: 1,
    pageSize: 10,
    total: 10,
  },
  // 搜索参数
  searchParams: {},
}
export default modelExtend({
  namespace: 'mall',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/business/mall') {
          if (history.action !== 'POP') {
            // 设置初始状态
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    //  获取商品列表
    * getData({ payload = {} }, { select, call, update }) {
      const { pagination, searchParams } = yield select(({ mall }) => mall)
      const params = { ...pagination, ...searchParams, ...payload }
      yield setTimeout(() => {}, 2000)
      yield update({
        dataList: [
          {
            commodityCode: 'magna Ut minim in',
            commodityId: 'Ut Exc',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_04/07_52_18_1jjdi91bk523el0p2evk92k5f8nccxvr.jpg!watermark',
            commodityInventory: 23,
            commodityName: '100元话费充值',
            commodityOriginalIntegral: 'proident velit fugiat',
            commodityOriginalPrice: '11',
            commodityPayType: 60042749,
            commodityPromotionsFlag: false,
            commodityPromotionsIntegral: '1123',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1943-12-21T21:04:35.092Z',
            commoditySellTimeStart: '1976-03-21T20:27:05.136Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'magna cillum est dolor',
            commodityId: 'nostrud dolore',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_04/10_19_39_m8705dt1ci7xp2mfo7gpp8vjbosvn9ge.png!watermark',
            commodityInventory: 232,
            commodityName: '50元话费充值',
            commodityOriginalIntegral: 'dolore in velit reprehenderi',
            commodityOriginalPrice: '11',
            commodityPayType: -17042115,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '122222',
            commodityPromotionsPrice: '123',
            commoditySellTimeEnd: '1972-02-22T23:35:40.770Z',
            commoditySellTimeStart: '2011-11-27T00:08:20.964Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'pariatur Duis id',
            commodityId: 'mollit id aliquip in',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_04/10_19_45_c51g8rtkei59kxko0med6gpm82to0xwo.png',
            commodityInventory: 0,
            commodityName: '自动折叠伞',
            commodityOriginalIntegral: 'sed Ut',
            commodityOriginalPrice: '11',
            commodityPayType: -45970844,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '11111',
            commodityPromotionsPrice: '22',
            commoditySellTimeEnd: '2016-03-22T01:37:27.291Z',
            commoditySellTimeStart: '1988-08-11T10:44:41.061Z',
            commodityStatus: 2,
          },
          {
            commodityCode: 'do consequat ipsum',
            commodityId: 'deserunt occaecat adipisicing',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_04/10_21_57_hj1wdeq5263fu6b5nrsdt89c7os0tin6.png',
            commodityInventory: 0,
            commodityName: '移动电源',
            commodityOriginalIntegral: 'ullamco velit',
            commodityOriginalPrice: '11',
            commodityPayType: 58166177,
            commodityPromotionsFlag: false,
            commodityPromotionsIntegral: '2222',
            commodityPromotionsPrice: '2322',
            commoditySellTimeEnd: '1992-12-22T11:30:03.045Z',
            commoditySellTimeStart: '1961-07-01T19:59:17.531Z',
            commodityStatus: 2,
          },
          {
            commodityCode: 'esse tempor irure',
            commodityId: 'velit cu',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_04/10_22_00_phytzbn9qfwoc83skd8aba098pe7ve0q.png',
            commodityInventory: 12,
            commodityName: '多功能护颈枕',
            commodityOriginalIntegral: 'sint magna sit',
            commodityOriginalPrice: '11',
            commodityPayType: 23901325,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '233232',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1945-09-16T22:30:12.052Z',
            commoditySellTimeStart: '1994-06-22T07:25:05.527Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'esse tempor irure',
            commodityId: 'velit222 cu',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_05/02_58_02_xx9o0ogkgsrw9oan7d9bwxdxppbgu0kw.png',
            commodityInventory: 12,
            commodityName: '小米手环3',
            commodityOriginalIntegral: 'sint magna sit',
            commodityOriginalPrice: '11',
            commodityPayType: 23901325,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '233232',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1945-09-16T22:30:12.052Z',
            commoditySellTimeStart: '1994-06-22T07:25:05.527Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'esse tempor irure',
            commodityId: 'velit 1212cu',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_05/03_09_25_loz1ek83axayl0w8kqr3orgrnsljx6jm.png',
            commodityInventory: 12,
            commodityName: '小米手环3',
            commodityOriginalIntegral: 'sint magna sit',
            commodityOriginalPrice: '11',
            commodityPayType: 23901325,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '233232',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1945-09-16T22:30:12.052Z',
            commoditySellTimeStart: '1994-06-22T07:25:05.527Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'esse tempor irure',
            commodityId: 'velit cu234',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_05/03_09_28_zubzv73oagpxosuh0l3gxqzts35qhp41.png',
            commodityInventory: 12,
            commodityName: '电动牙刷',
            commodityOriginalIntegral: 'sint magna sit',
            commodityOriginalPrice: '11',
            commodityPayType: 23901325,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '233232',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1945-09-16T22:30:12.052Z',
            commoditySellTimeStart: '1994-06-22T07:25:05.527Z',
            commodityStatus: 1,
          },
          {
            commodityCode: 'esse tempor irure',
            commodityId: '222velit cu',
            commodityImageUrl:
              'http://img.test.youcdn.aek56.com/userImage/2018_07_05/03_09_33_dmcirml8ot8v78go5a0ai9ysjarb7pe4.png',
            commodityInventory: 12,
            commodityName: '小米手电筒',
            commodityOriginalIntegral: 'sint magna sit',
            commodityOriginalPrice: '11',
            commodityPayType: 23901325,
            commodityPromotionsFlag: true,
            commodityPromotionsIntegral: '233232',
            commodityPromotionsPrice: undefined,
            commoditySellTimeEnd: '1945-09-16T22:30:12.052Z',
            commoditySellTimeStart: '1994-06-22T07:25:05.527Z',
            commodityStatus: 1,
          },
        ],
        // pagination: { current, total, pageSize },
      })
    },
  },
  reducers: {},
})
