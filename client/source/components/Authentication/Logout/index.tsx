import React, { useEffect } from 'react'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { logoutUser } from 'reducers/system/actions'

function Logout(props) {

	useEffect(() => {
		props.logoutUser()
	})
	
	return <Loading />
}

export default connect(null, { logoutUser })(Logout)