import User from 'models/user'
import * as cookie from 'cookie-signature'
import * as Sentry from '@sentry/node'
import xdebug from 'debug'
import fetch from 'node-fetch'
import { checkAuth, isLoggedIn } from '../functions'
import { Request } from 'express';
// deprecate checkAuth

const debug = xdebug('cd:userResolver')

const { FACEBOOK_APP_ID, COOKIE_SECRET, FACEBOOK_ACCESS_TOKEN, GOOGLE_AUD_ID } = process.env

const resolvers = {

	async loginWithUsernamePassword({ username, password }, req: Request) {
		let data = await User.findDamnerByUsernamePassword(username, password)

		if(data) {
			// User exists! Create a session
	
			req.session.user = data
			req.session.auth = true
			
			//const token = req.sessionID // token is for mobile app
			
			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))
			
			const { email, name, username, firstTime, damns, profilepic } = data
	
			Sentry.configureScope((scope) => {
				scope.setUser({email, username: username})
			})

			return { 
				profilepic, 
				email, 
				name, 
				username, 
				firstTime, 
				token, 
				status: User.getStatus(damns), 
				damns 
			}
		}
	},
	
	async loginWithOAuth({ oauthprovider, id }, req: Request) {
		
		let user

		if(oauthprovider === 'google') {
			const data = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id}`)

			const res = await data.json() // change this from email to unique user ID because if person did not gave access to email while registering but filled it later on then it'll not login through OAuth provider
	
			const { aud, sub, picture } = res
	
			const email = res.email
	
			if(aud !== GOOGLE_AUD_ID) {
				debug(`Somebody messin around google OAuth => ${email}`)
				return null
			}
	
			user = await User.findDamner({ googleID: sub }) // TODO: Remove this email ONLY WHEN all NON googleID accounts have been replaced with GOOGLE IDs
		
			// added on oct 16 2018 for existing users
			if(user && user.profilepic == "https://codedamn.com/assets/images/avatar.jpg" && picture) {
				// update profilepic
				user.profilepic = picture.replace('s96', 's256')
				await user.save()
			}

		} else if(oauthprovider === 'facebook') {

			const res = await fetch(`https://graph.facebook.com/debug_token?input_token=${id}&access_token=${FACEBOOK_ACCESS_TOKEN}`)
			const { data:{ app_id, application, user_id } } = await res.json()
	
			// TODO: Move aud to environment?
			if(app_id !== FACEBOOK_APP_ID || application !== 'codedamn' || !user_id) {
				debug(`Somebody messin around fb OAuth login `)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			user = await User.findDamner({ facebookID: user_id })

			// added on oct 16 2018 for existing users
			if(user && user.profilepic == "https://codedamn.com/assets/images/avatar.jpg") {
				// update profilepic
				const photo = `https://graph.facebook.com/${user.facebookID}/picture?type=large`
				user.profilepic = photo
				await user.save()
			}

		} else {
			throw new Error('Invalid OAuth provider')
		}
		
		
		if(user) {
			req.session.user = user
			req.session.auth = true

			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))
			const progressBar = User.getProgressBar(user.damns)

			Sentry.configureScope((scope) => {
				scope.setUser({email: user.email, username: user.username})
			})
			
			return {
				progressBar, 
				profilepic: user.profilepic, 
				email: user.email, 
				name: user.name, 
				username: user.username, 
				firstTime: user.firstTime, 
				token, 
				status: User.getStatus(user.damns), 
				damns: user.damns
			}
		}
		
		return null
	
	},

	async loginWithToken({ token }, req: Request) {
		if(req.session.user) {
			const user = req.session.user
			return {
				progressBar: user.progressBar, 
				profilepic: user.profilepic, 
				email: user.email, 
				name: user.name, 
				username: user.username, 
				firstTime: user.firstTime, 
				token, 
				status: User.getStatus(user.damns), 
				damns: user.damns
			}
		}
	},
	async profileData(_, req: Request) {
		
		if(!isLoggedIn(req)) return null

		const user = await User.findDamner({ username: req.session.user.username })

		return {
			progressBar: user.progressBar, 
			profilepic: user.profilepic, 
			email: user.email, 
			name: user.name, 
			username: user.username, 
			firstTime: user.firstTime, 
			status: User.getStatus(user.damns), 
			damns: user.damns,
			selfRank: User.getUserRank(user.username),
			favtags: user.favtags,
			doj: user.doj,
			activeStreak: user.streak,
			activeDates: user.activeDates,
			practiceDone: user.practiceDone,
			completed: user.completed
		}
	}
}

const queries = `
loginWithUsernamePassword(username: String!, password: String!): User
loginWithOAuth(oauthprovider: String!, id: String!): User
loginWithToken(token: String!): User
profileData: User
`;

const exportObj = {
	queries,
	resolvers
}

export default exportObj