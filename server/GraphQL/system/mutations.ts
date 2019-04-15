import shortid from 'shortid'
import fetch from 'node-fetch'

const { RECAPTCHA_SECRET, MJ_API_PUBLICKEY, MJ_API_PRIVATEKEY } = process.env

const resolvers = {
	async sendFeedback({ captcha, email, message, name }, req) {
		const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
			method: 'GET'
		})

		const json = await result.json()

		if (!json.success) {
			return { status: "error", data: "Invalid captcha" }
		}

		const Mailjet = require('node-mailjet').connect(MJ_API_PUBLICKEY, MJ_API_PRIVATEKEY)

		const options = {
			FromEmail: 'support@codedamn.com',
			FromName: name,
			Recipients: [{ Email: 'technotweaksteam@gmail.com' }],
			Subject: `Feedback From ${name} | ${email} | codedamn`,
			'Text-part': message
		}

		try {
			const request = await Mailjet.post('send').request(options)

			if (request) {
				return { status: "ok" }
			}

		} catch (e) {
			console.error(e)
			return { status: "error", data: "Failed to send email" }
		}
	}
}

const mutations = `
sendFeedback(captcha: String!, email: String!, message: String!, name: String!): FeedbackType!
`

const exportObject = {
	mutations,
	resolvers
}

export default exportObject