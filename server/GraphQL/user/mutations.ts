import User from 'models/user'
import xdebug from 'debug'
import { checkAuth } from '../functions'
import Language from 'models/language'

const { FACEBOOK_APP_ID, FACEBOOK_ACCESS_TOKEN, GOOGLE_AUD_ID, RECAPTCHA_SECRET, COOKIE_SECRET, NODE_ENV } = process.env

import fetch from 'node-fetch'
import cookie from 'cookie-signature'
import { Request } from 'express'
import { user } from 'interfaces/user'
import bcrypt from 'bcrypt'

const debug = xdebug('cd:users/MutationResolvers')

const resolvers = {	
	
	async fcmToken({ token }, req: Request) {
		checkAuth({ req })
		const username = req.session.user.username
		await User.setFCMToken(username, token)
		return true
	},

	async logout(_, req: Request) {
		req.session.destroy(_ => _)
		return true
	},

	async changeSettings({ newusername, newname, newpassword, newcpassword }, req: Request) {
		checkAuth({ req })

		const res = await User.saveSettings({
			username: newusername,
			name: newname,
			password: newpassword,
			cpassword: newcpassword
		}, req.session.user.username)

		if (res.status === 'ok') {
			req.session.user.username = newusername
			req.session.user.name = newname
			req.session.save(_ => _)

			return {
				username: newusername,
				name: newname
			}
		}

		throw new Error(res.data)
	},

	async registerWithOAuth({ name, email, oauthprovider, id, username }, req: Request) {

		const regIPaddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()

		let googleID: string, facebookID: string, profilepic = 'https://codedamn.com/assets/images/avatar.png'

		if (oauthprovider === 'google') {
			const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id}`)
			const { email: googleemail, aud, sub, picture } = await res.json()


			if ((googleemail && googleemail !== email) || aud !== GOOGLE_AUD_ID) {
				debug(`Somebody messin around => `, email)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			googleID = sub

			if (picture) {
				profilepic = picture
			}
		} else if (oauthprovider === 'facebook') {

			const res = await fetch(`https://graph.facebook.com/debug_token?input_token=${id}&access_token=${FACEBOOK_ACCESS_TOKEN}`)

			const d = await res.json()

			const { data: { app_id, application, user_id } } = d

			// TODO: Move aud to environment?
			if (app_id !== FACEBOOK_APP_ID || application !== 'codedamn') {
				debug(`Somebody messin around fb OAuth => `, email)
				return { success: false, data: 'Invalid OAuth request' }
			}

			const res2 = await fetch(`https://graph.facebook.com/v2.8/me?access_token=${id}&fields=id%2Cname%2Cemail&method=get&pretty=0&sdk=joey&suppress_http_code=1`)

			const { id: userID } = await res2.json()

			if (userID !== user_id) {
				debug(`Somebody messin around fbOAuth => `, email)
				return { success: false, data: 'Invalid OAuth request' }
			}

			facebookID = userID

			profilepic = `https://graph.facebook.com/${facebookID}/picture?type=large`

		} else {
			throw new Error("Invalid OAuth Provider")
		}

		const { error, data } = await User.createOAuth({ profilepic, name, email, username, facebookID, googleID }, regIPaddress)

		if (error) {
			return { error, data: null }
		}


		const user = (await User.findByID(data)).toJSON()
		const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))
		const progressBar = User.getProgressBar(user.damns)
		const status = User.getStatus(user.damns)

		if (process.env.NODE_ENV === 'production') {
			User.sendWelcomeEmail({ email, name, type: ' oauth ' + oauthprovider })
		}

		debug(`Welcome (OAuth) ${name}`)
		req.session.user = user
		req.session.auth = true


		return { error, data: { ...user, token, progressBar, status } }
	},

	async registerWithoutOAuth({ name, email, username, password, cpassword, captcha }, req: Request) {

		const regIPaddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()

		const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
			method: 'GET'
		})

		const json = await result.json()

		if (json.success || (captcha != null && captcha === process.env.TEST_CAPTCHA_VALUE)) {
			const { error, data } = await User.create({
				name,
				username,
				email,
				password,
				cpassword
			}, regIPaddress)


			if (!error) {
				const user = data

				debug(`Welcome (OAuth) ${name}`)
				req.session.user = user
				req.session.auth = true

				const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))

				if (NODE_ENV === 'production') {
					User.sendWelcomeEmail({ email, name, type: `no oauth graphql` })
				}

				return { error, data: { ...data, token } }
			}

			return { error, data }
		}

		return { error: "Invalid captcha response" }

	},
	async addEnergyPoints({ parentslug, slug }, req: Request): Promise<number> {
		checkAuth({ req })
		const username = req.session.user.username
		
		if(await Language.findDotBySlug(parentslug, slug)) {	
			const res = await User.markDone(slug, username)
			if(res.nModified === 1) {
				// record not found
				req.session.user.damns += 10
				await User.setDamns(req.session.user.damns, username)
				return 10
			}
		}
		
		return 0
	},
	async resetPassword({ email, captcha }, req: Request) {

		const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
			method: 'GET'
		})

		const json = await result.json()
		
		if(json.success) {
			const user: user = await User.findDamner({ email })

			if(user) {
				debugger
				const rawPassword = Math.random().toString(36).substring(7)
				user.password = bcrypt.hashSync(rawPassword, 10)
				console.log(await user.save())

				const r = await User.sendResetEmail({ name: user.name, email, password: rawPassword })

				if(r) {
					debug(`Sent reset email successfully to ${email}`)
				} else {
					debug(`Error sending password reset email to ${email}`, r)
				}

				return true
			}
			return false
		}

		return false
	}
}

const mutations = `
fcmToken(token: String!): Boolean!
logout: Boolean!
changeSettings(newusername: String!, newname: String!, newpassword: String, newcpassword: String): User!
registerWithOAuth(name: String!, email: String!, username: String!, id: String!, oauthprovider: String!): RegistrationType!
registerWithoutOAuth(name: String!, email: String!, username: String!, password: String!, cpassword: String!, captcha: String!): RegistrationType!
addEnergyPoints(parentslug: String!, slug: String!): Boolean!
resetPassword(email: String!, captcha: String!): Boolean!
`

const exportObject = {
	mutations,
	resolvers
}

export default exportObject