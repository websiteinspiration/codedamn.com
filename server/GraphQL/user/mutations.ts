import User from 'models/user'
import xdebug from 'debug'
import { checkAuth } from '../functions'

const { FACEBOOK_APP_ID, FACEBOOK_ACCESS_TOKEN, GOOGLE_AUD_ID, RECAPTCHA_SECRET, COOKIE_SECRET } = process.env

import fetch from 'node-fetch'
import cookie from 'cookie-signature'

const debug = xdebug('cd:users/MutationResolvers')

const resolvers = {
	async fcmToken({token}, req) {
		checkAuth({ req })
		const username = req.session.user.username

		await User.setFCMToken(username, token)
		return true
	},
	async logout(_, req) {
		req.session.destroy()
		return true
	},
	async changeSettings({ newusername, newname, newpassword, newcpassword }, req) {
		checkAuth({ req })

		const res = await User.saveSettings({ 
			username: newusername,
			name: newname,
			password: newpassword,
			cpassword: newcpassword
		}, req.session.user.username)

		if(res.status === 'ok') {
			req.session.user.username = newusername
			req.session.user.name = newname
			req.session.save()
			
			return {
				username: newusername,
				name: newname
			}
		}

		throw new Error(res.data) 
	},

	async registerWithOAuth({ name, email, oauthprovider, id, username }, req) {
		
		const regIPaddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
		
		let googleID, facebookID, profilepic = 'https://codedamn.com/assets/images/avatar.png'

		if(oauthprovider === 'google') {
			const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id}`)
			const { email: googleemail, aud, sub, picture } = await res.json()


			if((googleemail && googleemail !== email) || aud !== GOOGLE_AUD_ID) {
				debug(`Somebody messin around => `, email)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			googleID = sub

			if(picture) {
				profilepic = picture
			}
		} else if(oauthprovider === 'facebook') {

			const res = await fetch(`https://graph.facebook.com/debug_token?input_token=${id}&access_token=${FACEBOOK_ACCESS_TOKEN}`)
			const { data:{app_id, application, user_id} } = await res.json()
		
			// TODO: Move aud to environment?
			if(app_id !== FACEBOOK_APP_ID || application !== 'codedamn') {
				debug(`Somebody messin around fb OAuth => `, email)
				return { success: false, data: 'Invalid OAuth request' }
			}

			const res2 = await fetch(`https://graph.facebook.com/v2.8/me?access_token=${id}&fields=id%2Cname%2Cemail&method=get&pretty=0&sdk=joey&suppress_http_code=1`)

			const { id: userID } = await res2.json()

			if(userID !== user_id) {
				debug(`Somebody messin around fbOAuth => `, email)
				return { success: false, data: 'Invalid OAuth request' }
			}

			facebookID = userID

			profilepic = `https://graph.facebook.com/${facebookID}/picture?type=large`

		} else {
			throw new Error("Invalid OAuth Provider")
		}

		const { error, data } = await User.createOAuth({ profilepic, name, email, username, facebookID, googleID }, regIPaddress)
	
		const user: any = data

		if(!error) {
			
			if(process.env.NODE_ENV === 'production') {
				User.sendWelcomeEmail({ email, name, type: ' oauth '+oauthprovider })
			}

			debug(`Welcome (OAuth) ${name}`)
			req.session.user = user
			req.session.auth = true
		}
		
		return { error, data }
	},

	async registerWithoutOAuth({ name, email, username, password, cpassword, captcha }, req) {

	const regIPaddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
	console.log(process.env)
	const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
        method: 'GET'
    })

	const json = await result.json()
	
    if(json.success) { // Removing recaptcha mobile - Nov 14 2018
        const { error, data } = await User.create({
            name,
            username,
            email,
			password,
			cpassword
		}, regIPaddress)
		

        if(!error) {
			const user = data
			
			debug(`Welcome (OAuth) ${name}`)
			req.session.user = user
			req.session.auth = true
			
			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))

			if(process.env.NODE_ENV === 'production') {
				User.sendWelcomeEmail({ email, name, type: `no oauth graphql` })
			}

			return { error, data: {...data, token } }
		}
	
		return { error, data }
	}
	
	return { error: "Invalid captcha response" }

	}
}

const mutations = `
fcmToken(token: String!): Boolean!
logout: Boolean!
changeSettings(newusername: String!, newname: String!, newpassword: String, newcpassword: String): User!
registerWithOAuth(name: String!, email: String!, username: String!, id: String!, oauthprovider: String!): RegistrationType!
registerWithoutOAuth(name: String!, email: String!, username: String!, password: String!, cpassword: String!, captcha: String!): RegistrationType!
`

const exportObject = {
	mutations,
	resolvers
}

export default exportObject