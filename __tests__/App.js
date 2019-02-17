import React from 'react';
import App from 'components/App'
import { shallow } from 'enzyme'

import mockStore from 'redux-mock-store'

test('@c/App', () => {
	
	const store = mockStore({
		system: {
			userLoggedIn: false
		}
	})

	const tree = shallow(<App />, { context: { store } })
	expect(tree.dive()).toMatchSnapshot()
})