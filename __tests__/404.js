import React from 'react'
import Four04 from 'components/404'
import { mount } from 'enzyme'

import { BrowserRouter as Router } from 'react-router-dom'

test('@c/404', () => {
	const tree = mount(<Router><Four04 /></Router>)
	expect(tree.find('.four04').text().trim()).toBe("404 Not Found | Go Home")
	expect(tree).toMatchSnapshot()
})