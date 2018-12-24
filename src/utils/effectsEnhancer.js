import invariant from 'invariant'
import warning from 'warning'
import { argumentHelp } from '../utils'
import { COMMON_REDUCER } from '../utils/constant'
import { baseURL } from '../utils/config'
import request from './request'

const SEP = '/'

function prefixType(type, model) {
  const prefixedType = `${model.namespace}/${type}`
  if (
    (model.reducers && model.reducers[prefixedType]) ||
    (model.effects && model.effects[prefixedType])
  ) {
    return prefixedType
  }
  return type
}

function createEffects(sagaEffects, model) {
  function put(action) {
    const { type } = action
    invariant(type, 'dispatch: action should be a plain Object with type')
    warning(
      type.indexOf(`${model.namespace}${SEP}`) !== 0,
      `effects.put: ${type} should not be prefixed with namespace ${model.namespace}`,
    )
    return sagaEffects.put({ ...action, type: prefixType(type, model) })
  }
  function update(payload) {
    return put({ type: COMMON_REDUCER, payload })
  }
  function toAction(...props) {
    const {
      object: payload,
      string: type = COMMON_REDUCER,
      boolean: partObj = false,
    } = argumentHelp(props)
    return put({ type, payload, partObj })
  }
  function toRequest(url, ...props) {
    const {
      object: payload,
      string: method = 'post',
    } = argumentHelp(props)
    const reqUrl = !url.indexOf('/api') ? url : `${baseURL}${url}`
    async function requestFun(data = {}) {
      return request({ url: reqUrl, method, data })
    }
    return sagaEffects.call(requestFun, payload)
  }
  return { ...sagaEffects, put, update, toAction, toRequest }
}

const dvaEffectsEnhancer = {
  onEffect: (effect, sagaEffects, model) =>
    function* effectEnhancer(action) {
      yield effect(action, createEffects(sagaEffects, model))
    },
}

export default dvaEffectsEnhancer
