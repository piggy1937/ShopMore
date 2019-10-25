<<<<<<< HEAD
import dva from 'dva';
import './index.css';
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
=======
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import history from './utils/history'
import { Provider } from 'react-redux'
import store from './store'
import PotentialError from '@/components/PotentialError'
moment.locale('zh-cn');

ReactDOM.render(
    <PotentialError>
    <Provider store={store}>
        <Router history={history}>
            <LocaleProvider locale={zh_CN}>
                <App />
            </LocaleProvider>
        </Router>
    </Provider >
    </PotentialError>,
    document.getElementById('root')
    );
serviceWorker.unregister();
>>>>>>> '新增预算信息'
