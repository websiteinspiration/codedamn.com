import { checkAuth } from "../functions"
import Language from 'models/language'
import shortid from 'shortid'

const resolvers = {
	async addDotComment({ parentID, comment, slug }, req) {
		checkAuth({ req })

		const dot = await Language.findDot(parentID, slug)

		if(!dot) throw new Error("Given dot doesn't exist")
		
		const user = req.session.user

		const commentObj = {
			comment,
			author: user.username,
			avatar: user.profilepic,
			date: Date.now(),
			id: shortid.generate(),
			upvotes: 0
		}

		await Language.addDotComment(parentID, slug, commentObj)
		return commentObj
	},

	async addDotCommentBySlug({ parentSlug, comment, slug }, req) {
		checkAuth({ req })

		const dot = await Language.findDotBySlug(parentSlug, slug)

		if(!dot) throw new Error("Given dot doesn't exist")
		
		const user = req.session.user

		const commentObj = {
			comment,
			author: user.username,
			avatar: user.profilepic,
			date: Date.now(),
			id: shortid.generate(),
			upvotes: 0
		}

		await Language.addDotCommentBySlug(parentSlug, slug, commentObj)
		return commentObj
	}
}

const mutations = `
addDotComment(parentID: String!, comment: String!, slug: String!): CommentType!
addDotCommentBySlug(parentSlug: String!, comment: String!, slug: String!): CommentType!
`

const exportObject = {
	mutations,
	resolvers
}

export default exportObject