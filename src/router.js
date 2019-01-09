import React from 'react'
import PropTypes from 'prop-types'
import { Route, routerRedux, Switch } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from './routes/App/index'
import { routes } from './utils/routesTree'
const { ConnectedRouter } = routerRedux

function Routers({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          {routes.map(({ path, ...dynamics }) => (
            <Route exact key={path} path={path} component={dynamic({ app, ...dynamics })} />
          ))}
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
}

export default Routers
