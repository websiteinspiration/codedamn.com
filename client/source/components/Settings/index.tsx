import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Loading from 'components/Loading'
import { getUserSettings, saveUserSettings } from 'reducers/user/actions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Component from 'decorators/Component'

const mapStateToProps = ({user, system}) => ({
	settings: user.settings,
	csrf: system.csrfToken
})

function Settings(props) {

	const [name, setName] = useState(null)
	const [email, setEmail] = useState(null)
	const [username, setUsername] = useState(null)
	const [password, setPassword] = useState(null)
	const [cpassword, setCpassword] = useState(null)

	useEffect(() => {
		props.getUserSettings()
	}, [])

	useEffect(() => {
		setName(props.settings.name)
		setEmail(props.settings.email)
		setUsername(props.settings.username)
	}, [props.settings.name, props.settings.username, props.settings.email])


	function saveSettings() {
		const csrf = (document.getElementById('csrf-field') as HTMLInputElement).value

		const fieldsToPost = { name, username, password, cpassword, email, csrf }

		if(!password && !cpassword) {
			delete fieldsToPost.password
			delete fieldsToPost.cpassword
		}

	//	if(email === this.props.settings.email) { // email not changed
			delete fieldsToPost.email
	//	}

		if(username === props.settings.username) { // username not changed
			delete fieldsToPost.username
		}

		if(name === props.settings.name) { // name not changed
			delete fieldsToPost.name
		}

		props.saveUserSettings(fieldsToPost)
	}

	/*componentWillReceiveProps(nextProps) {
		if(this.state.name === null && nextProps.settings && nextProps.settings.name) {
			const { name, username, email } = nextProps.settings
			this.setState({ name, username, email })
		}
	}*/

	if(!name) return <Loading />

	return (
		<>
			<div styleName="profile-image">
				<img src="/assets/images/avatar.jpg" />
			</div>
			<div styleName="profile-details">

				<TextField
					label="Name"
					variant="outlined"
					value={name}
					onChange={e => setName(e.target.value)}
					margin="normal"
				/>

				<TextField
					label="Username"
					variant="outlined"
					value={username}
					onChange={e => setUsername(e.target.value)}
					margin="normal"
				/>

				<TextField
					label="Email"
					variant="outlined"
					value={email}
					disabled={true}
				//	onChange={e => this.handleChange('email', e.target.value)}
					margin="normal"
				/>

				<TextField
					label="Password"
					variant="outlined"
					value={password}
					onChange={e => setPassword(e.target.value)}
					helperText="Fill only if you want to update password"
					margin="normal"
				/>

				<TextField
					label="Confirm Password"
					variant="outlined"
					value={cpassword}
					onChange={e => setCpassword(e.target.value)}
					margin="normal"
				/>

				<input type="hidden" id="csrf-field" defaultValue={props.csrf} />

				<Button variant="contained" color="primary" onClick={saveSettings}>
					Update Settings
				</Button>
			</div>
		</>)
}

let com = Settings
com = css(styles, { handleNotFoundStyleName: 'log' })(com)
com = Component({ gridClass: styles.grid })(com)
com = connect(mapStateToProps, { getUserSettings, saveUserSettings })(com)

export default com