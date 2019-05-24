import User from './model'
import xdebug from 'debug'
import { user } from 'interfaces/user'
//import * as Mailjet from 'node-mailjet'
import * as nodemailer from 'nodemailer'
import * as bcrypt from 'bcrypt'
import Joi from 'joi'
import { registrationSchema, settingsSchema, oauthSchema } from './schema'
const { ZOHO_PASSWORD } = process.env
// Create the transporter with the required configuration for Gmail
// change the user and pass !
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'support@codedamn.com',
        pass: ZOHO_PASSWORD
    }
})

const debug = xdebug('cd:UserController')

function sendEmail({ email, subject, message, name }) {
	return new Promise((resolve, reject) => {
		const options = {
			from: '"codedamn bot" <support@codedamn.com>',
			to: email,
			subject,
			html: message
		}
	
		transporter.sendMail(options, function(error, info) {
			if(error) {
				resolve({ status: "error", error: error })
			} else {
				resolve({ status: "ok", message: info })
			}
		})
	})
}

class Functions {

	static async practiceCompleted(id, username) {
		return await User.updateOne({ username }, { $addToSet: { practiceDone: id } })
	}

	static async markDone(slug, username) {
		return await User.updateOne({ username }, { $addToSet: { completed: slug } })
	}

	static async setDamns(damns, username) {
		return await User.updateOne({ username }, { $set: { damns } })
	}

	static async setActiveDate(today, streak, username) {
		const res = await User.updateOne({ username }, { 
			$addToSet: { activeDates: today },
			$set: { streak }
		})
	}

	static findByID(id) {
		return User.findById(id)
	}

	static async setFCMToken(username: string, token: string): Promise<boolean> {
		const res = await User.updateOne({ username }, { $set: { fcmToken: token } })
		return !!res
	}

	static async saveTags(tags: string[], username: string) {
		
		console.log(await User.updateOne({ username }, { $set: { favtags: tags, firstTime: false }}))
		
	}

	static getProgressBar(points: number): number {
		if(points < 30) return points/30
		if(points < 60) return (points-30)/30
		if(points < 120) return (points-60)/60
		if(points < 240) return (points-120)/120
		if(points < 480) return (points-240)/240
		if(points < 960) return (points-480)/480
		return 1
	}

	static getStatus(points: number): string {
		// To Do: HOW to decide this?
		if(points < 30) return 'Absolute Beginner'
		if(points < 60) return 'Learner'
		if(points < 120) return 'Student'
		if(points < 240) return 'Developer'
		if(points < 480) return 'Mr. Robot'
		if(points < 960) return 'Almost God'
		return 'God'
	}

	static async getDamnList() {
		// TODO: expensive?
		const users = await User.find({ damns: { $gt: 0 } }, { _id: 0, damns: 1, doj: 1, username: 1, name: 1, activeDates: 1 }).sort({ damns: -1 }).limit(150)
		return users
	}

	static async getUserRank(username: string): Promise<number> {
		const user = await User.findOne({ username })
		return ( await User.count({ damns: { $gt: user.damns }}) ) + 1
	}

	static async getDamns(username) {
		return (await User.findOne({ username }, { _id: 0, damns: 1 })).damns
	}

	static async getSettings(username) {
		//debugger
		const data = await User.findOne({username}, { _id: 0, name: 1, username: 1, email: 1 })
		return data
	}

	static async saveSettings(details, sessionUsername) {

		const { error, value } = Joi.validate(details, settingsSchema)

		if(error) {
			return { status: 'error', data: error.details ? error.details[0].message : error.message }
		}

		if(value.username !== sessionUsername) {
			const user = await User.findOne({ username: value.username })

			if(user) {
				return { status: 'error', data: 'Username already exists' }
			}
		}

		if(value.password) {
			const saltRounds = 10
			value.password = bcrypt.hashSync(value.password, saltRounds)
		}
		
		await User.updateOne({username: sessionUsername}, { $set: value })
		
		return { status: 'ok' }
	}

	static async createOAuth(details, regIPaddress) {
		
		const { error, value } = Joi.validate(details, oauthSchema)

		if(error) {
			return { status: 'error', error: error.details ? error.details[0].message : error.message }
		}

		if(await User.findOne({ email: value.email })) {
			return {status: 'error', error: 'Email already exists' }
		}

		if(await User.findOne({ username: value.username })) {
			return { status: 'error', error: 'Username already exists' }
		}
		
		const user = new User({
			favtags: ["Web Development"],
			firstTime: true,
			regIPaddress,
			...value
		})

		const _user = await user.save()
		
		return { status: 'ok', data: _user.id, error: null }
	}

	static async create(details, regIPaddress) {
		const { error, value } = Joi.validate(details, registrationSchema)
		if(error) {
			return { status: 'error', error: error.details ? error.details[0].message : error.message }
		}

		if(await User.findOne({ email: value.email })) {
			return { status: 'error', error: 'Email already exists' }
		}

		if(await User.findOne({ username: value.username })) {
			return { status: 'error', error: 'Username taken' }
		}

		const saltRounds = 10
		const hashedPass = bcrypt.hashSync(details.password, saltRounds)

		const metadata = {
            name: details.name,
			username: details.username,
			firstTime: true,
			favtags: ["Web Development"],
			email: details.email,
			password: hashedPass,
			regIPaddress
    	}

		const user = new User(metadata)
    	user.save()
    	return { status: 'ok', error: null, data: user }
	}

	static async findDamnerByUsernamePassword(username, password): Promise<user> {
		
		let data = await User.findOne({ username })
		
		if(!data) {
			data = await User.findOne({ email: username })
			if(!data) return null
		}

		const hash = data.password
		
		if(bcrypt.compareSync(password, hash)) {
			return data
		}
		
		return null
	}

	static async findDamner(obj): Promise<user> {
		let password
		

		if(obj.password) {
			password = obj.password
			delete obj.password
		}
		const data = await User.findOne(obj)
		

		if(!data) return null

		if(password && data.password) {
			const hash = data.password

			if(bcrypt.compareSync(password, hash)) {
				return data
			} else {
				return null
			}
		}
		
		return data
	}

	static async sendWelcomeEmail({ email, name, type }) {
		
		const subject = `Wohoo! Welcome aboard! =?utf-8?Q?=F0=9F=92=BB=F0=9F=98=8E=F0=9F=8E=89?=`
		// better message
		const message = `Hello ${name}! This email marks you've registered on codedamn. Welcome!`
		sendEmail({ name, email: 'technotweaksteam@gmail.com', subject: 'New Registeration', message: name + ' | ' + email + ' just joined via ' + type })
		
		const res = await sendEmail({ name, email, subject, message })
		return res
	}

	static async sendResetEmail({name, email, password}) {
		const subject = `Password reset request | codedamn`
		const message = `Your new password is ${password}. Make sure to change it through settings after logging in.`
	
		return await sendEmail({ name, email, message, subject })
	}
}

export default Functions