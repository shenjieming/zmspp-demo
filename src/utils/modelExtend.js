import dvaModelExtend from 'dva-model-extend'
import { defaultsDeep, cloneDeep } from 'lodash'
import { COMMON_REDUCER } from './constant'

export default function (model) {
  const initialState = cloneDeep(model.state)

  return dvaModelExtend(
    {
      reducers: {
        [COMMON_REDUCER](state, { payload = {}, partObj = false }) {
          if (partObj) {
            return defaultsDeep(payload, state)
          }
          return { ...state, ...payload }
        },
        reset() {
          return { ...initialState }
        },
      },
    },
    model,
  )
}
