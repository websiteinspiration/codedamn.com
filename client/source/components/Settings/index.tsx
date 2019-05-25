import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Loading from 'components/Loading'
import { getUserSettings, saveUserSettings } from 'reducers/user/actions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Component from 'decorators/Component'
import CalendarHeatmap from 'react-calendar-heatmap'
import md5 from 'js-md5'

const mapStateToProps = ({user, system}) => ({
	settings: user.settings,
	csrf: system.csrfToken
})

function Settings(props) {

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [cpassword, setCpassword] = useState('')

	useEffect(() => {
		props.getUserSettings()
	}, [])

	useEffect(() => {
		if(props.settings) {
			setName(props.settings.name)
			setEmail(props.settings.email)
			setUsername(props.settings.username)
		}
	}, [props.settings])


	function saveSettings() {
		// const csrf = (document.getElementById('csrf-field') as HTMLInputElement).value

		const fieldsToPost = { 
			newname: name, 
			newusername: username, 
			newpassword: password, 
			newcpassword: cpassword
		}

		if(!fieldsToPost.newpassword) {
			delete fieldsToPost.newpassword
		}
		if(!fieldsToPost.newcpassword) {
			delete fieldsToPost.newcpassword
		}
		
		props.saveUserSettings(fieldsToPost)
	}

	if(!name) return <Loading />

	console.log(props.settings.activeDates)
	return (
		<>


			<div styleName="activity-chart">
				<div styleName="profile-image">
					<img src={`https://www.gravatar.com/avatar/${md5(email.toLowerCase())}?s=200`} />
				</div>

				<CalendarHeatmap
					endDate={new Date()}
					startDate={new Date(new Date().getTime() - 186 *24*60*60*1000)}
					values={(props.settings.activeDates || []).map(date => ({ date, count: 1 })) /*[
						// YYYY-MM-DD
						{ date: '2018-10-01', count: 1 }
						// ...and so on
					]*/}
					classForValue={(value) => {
						if (!value) {
						return 'color-empty';
						}
						return `color-scale-${value.count}`;
					}}
				/>
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

let com: any = Settings
com = css(styles, { handleNotFoundStyleName: 'log' })(com)
com = Component({ gridClass: styles.grid })(com)
com = connect(mapStateToProps, { getUserSettings, saveUserSettings })(com)

export default com