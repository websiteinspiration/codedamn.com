import React from 'react'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { logoutUser } from 'reducers/system/actions'

@connect(null, { logoutUser })	
export default class Logout extends React.Component {

	componentWillMount() {
		this.props.logoutUser()
	}

	render() {
		return <Loading />
	}
}