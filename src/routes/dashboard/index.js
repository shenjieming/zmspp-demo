import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Redirect } from 'dva/router'
import { getBasicFn } from '@utils'
import { Breadcrumb } from '@components'
import { namespace, GET_STATISTICS, GET_ORDER, INITIAL_SEARCH_PARAM } from '@shared/home/board'
import { get } from 'lodash'
import GraphPanel from './GraphPanel'
import TodoList from './Todolist'

class Page extends React.PureComponent {
  componentWillMount() {
    const { dispatch, orgType } = this.props
    if (orgType !== '01') {
      dispatch({ type: `${namespace}/${GET_STATISTICS}` })
      dispatch({ type: `${namespace}/${GET_ORDER}`, payload: { ...INITIAL_SEARCH_PARAM } })
    }
  }

  render() {
    const { state, loading, orgType } = this.props
    if (orgType === '01') {
      return <Redirect to="/personInfo" />
    }

    const { getLoading, dispatchAction } = getBasicFn({ loading, namespace })

    const { formType, statisticsType, endDate, startDate, graph, amount, order, qty } = state

    const GraphPanelProps = {
      orgType,
      formType,
      statisticsType,
      endDate,
      startDate,
      handleTypeChange: (e) => {
        const value = e.target.value
        dispatchAction({ type: GET_ORDER, payload: { formType: value, statisticsType: 1 } })
      },
      handleStatisticsTypeChange: (e) => {
        const value = e.target.value
        dispatchAction({ type: GET_ORDER, payload: { statisticsType: value } })
      },
      graph,
      amount,
      order,
      qty,
      handleClick7days: () => {
        dispatchAction({
          type: GET_ORDER,
          payload: { startDate: moment().subtract(6, 'days'), endDate: moment() },
        })
      },
      handleClick30days: () => {
        dispatchAction({
          type: GET_ORDER,
          payload: { startDate: moment().subtract(29, 'days'), endDate: moment() },
        })
      },
      handleRangerChange: (dates) => {
        dispatchAction({ type: GET_ORDER, payload: { startDate: dates[0], endDate: dates[1] } })
      },
    }

    return (
      <div className="aek-layout">
        <div className="bread">
          <Breadcrumb />
        </div>
        <div className="full-content">
          <GraphPanel {...GraphPanelProps} />
          <TodoList dataSource={state.todoList} loading={getLoading('getStatistics')} />
        </div>
      </div>
    )
  }
}

Page.propTypes = {
  state: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  orgType: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = store => ({
  state: store[namespace],
  loading: store.loading,
  orgType: get(store, ['app', 'orgInfo', 'orgType']),
})

export default connect(mapStateToProps)(Page)
