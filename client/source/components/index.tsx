import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store, history } from '../redux/store'

ReactDOM.render(
	<Provider store={store}>
		<App history={history} />
	</Provider>
, document.getElementById('root'))

if(module && (module as any).hot && (module as any).hot.accept) (module as any).hot.accept()