import { checkAuth } from "../functions"
import Practice from 'models/practice'
import User from 'models/user'

const resolvers = {
	async practiceCompleted({ moduleid, challengeid }, req) {
		checkAuth({ req })

		const p = await Practice.getBlock(moduleid, challengeid)

		if(!p) {
			throw new Error('Invalid practice challenge')
		}

		const username = req.session.user.username
		const res = await User.practiceCompleted(challengeid, username)

		if(res.nModified === 1) {
			// record was not found
			req.session.user.damns += 50
			await User.setDamns(req.session.user.damns, username)
			return true
		}

		return false
	}
}

const mutations = `
practiceCompleted(moduleid: String!, challengeid: String!): Boolean!
`

const exportObject = {
	mutations,
	resolvers
}

export default exportObject