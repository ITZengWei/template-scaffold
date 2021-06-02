import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import config from './config'
import store from './store/index'
import routes from './routes/index'
import zhCN from 'antd/lib/locale/zh_CN'
import { BasicStyle, GenericStyle } from './styles'
import 'antd/dist/antd.css'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <GenericStyle />
        <BasicStyle />

        <Router basename={config.BASENAME}>
          <div className="app">{renderRoutes(routes)}</div>
        </Router>
      </Provider>
    </ConfigProvider>
  )
}

export default App
