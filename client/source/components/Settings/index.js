import React from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Loading from '@components/Loading'
import { getUserSettings, saveUserSettings } from '@reducers/user/actions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Component from '@decorators/Component'

const mapStateToProps = ({user, system}) => ({
	settings: user.settings,
	csrf: system.csrfToken
})

@connect(mapStateToProps, { getUserSettings, saveUserSettings })
@Component({ gridClass: styles.grid })
@css(styles, { handleNotFoundStyleName: 'log' })
export default class Settings extends React.Component {

	state = { name: null, email: null, username: null }

	componentDidMount() {
		this.props.getUserSettings()
	}

	saveSettings() {
		const { name, username, password, email, cpassword } = this.state
		const csrf = document.getElementById('csrf-field').value

		const fieldsToPost = { name, username, password, cpassword, email, csrf }

		if(!password && !cpassword) {
			delete fieldsToPost.password
			delete fieldsToPost.cpassword
		}

	//	if(email === this.props.settings.email) { // email not changed
			delete fieldsToPost.email
	//	}

		if(username === this.props.settings.username) { // username not changed
			delete fieldsToPost.username
		}

		if(name === this.props.settings.name) { // name not changed
			delete fieldsToPost.name
		}

		this.props.saveUserSettings(fieldsToPost)
	}

	handleChange(key, value) {
		this.setState({ [key]: value })
	}

	copySettingsToState() {
		const { name, username, email } = this.props.settings
		this.setState({ name, username, email })
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.name === null && nextProps.settings && nextProps.settings.name) {
			const { name, username, email } = nextProps.settings
			this.setState({ name, username, email })
		}
	}

	render() {
		if(!this.state.name) return <Loading />

		return (
			<>
				<div styleName="profile-image">
					<img src="/assets/images/avatar.jpg" />
				</div>
				<div styleName="profile-details">

					<TextField
					id="something14"
						label="Name"
						variant="outlined"
						value={this.state.name}
						onChange={e => this.handleChange('name', e.target.value)}
						margin="normal"
					/>

					<TextField
					id="something15"
						label="Username"
						variant="outlined"
						value={this.state.username}
						onChange={e => this.handleChange('username', e.target.value)}
						margin="normal"
					/>

					<TextField
					id="something16"
						label="Email"
						variant="outlined"
						value={this.state.email}
						disabled={true}
					//	onChange={e => this.handleChange('email', e.target.value)}
						margin="normal"
					/>

					<TextField
					id="something17"
						label="Password"
						variant="outlined"
						value={this.state.password}
						onChange={e => this.handleChange('password', e.target.value)}
						helpertext="Fill only if you want to update password"
						margin="normal"
					/>

					<TextField

						id="something18"
						label="Confirm Password"
						variant="outlined"
						value={this.state.cpassword}
						onChange={e => this.handleChange('cpassword', e.target.value)}
						margin="normal"
					/>

					<input type="hidden" id="csrf-field" defaultValue={this.props.csrf} />

					<Button variant="contained" color="primary" onClick={_ => this.saveSettings()}>
						Update Settings
					</Button>
				</div>
			</>)
	}
}