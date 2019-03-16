import { checkAuth } from '../functions'
import Language from 'models/language'
//import TimelineBundle from '@models/timelineBundle'

const resolvers = {
	async learnblocks(_, req) {
		
		//checkAuth({ req })

		const learnblocks = await Language.getAllBlocks()
		// const stacks = await TimelineBundle.getAllBundles()

		//const userTags = req.session.user.favtags

		/**
		 * Algorithm for user:
		 * provide tags for languages
		 * filter tags here from user's most favourite
		 * with 3-5% variation everytime
		 */

		const categoryIndexes = {}

		let catIndex = 0
		
		const data: any = { learnblocks: [], timelinebundles: [] }
		learnblocks.forEach( timeline => {

			categoryIndexes[timeline.category] = isNaN(categoryIndexes[timeline.category]) ? catIndex++ : categoryIndexes[timeline.category]

			const index = categoryIndexes[timeline.category]

			data.learnblocks[index] = data.learnblocks[index] || { name: timeline.category, timelines: [], score: 0 }

			data.learnblocks[index].timelines.push(timeline)

			//data.learnblocks[timeline.category].push(timeline)
		})

		return data.learnblocks
	},

	// needed for web version. 
	async timelineBySlug({ slug }, req) {
		// checkAuth({ req })

		const lang = await Language.findTimeline({ slug })

		if(!lang) return null
		
		const { _id, name, icon, description, views, shortname, category, creator, flow } = lang.toJSON()
	
		return { name, icon, description, views, shortname, category, creator, flow, id: _id }
	},

	// deprecate this on mobile apps in favor for web version
	async timeline({ id }, req) {

		checkAuth({ req })

		const lang = await Language.findTimeline({ _id: id })

		if(!lang) return null

		const { _id, name, icon, description, views, shortname, category, creator, flow } = lang.toJSON()
	
		return { name, icon, description, views, shortname, category, creator, flow, id: _id }
	},


	// deprecate this on app in favor of slug method below
	async dotInfo({ parentID, slug }, req) {
		checkAuth({ req })
		const data = await Language.getDotInfo({_id: parentID}, slug)
		return data
	},

	// need slug method for web
	async dotInfoBySlug({ parentSlug, dotSlug }, req) {
		// checkAuth({ req })
		const data = await Language.getDotInfo({ slug: parentSlug }, dotSlug)
		return data
	}
}

const queries = `
learnblocks: [LearnBlock!]!
timeline(id: String!): Timeline
timelineBySlug(slug: String!): Timeline
dotInfo(parentID: String!, slug: String!): DotInfo!
dotInfoBySlug(parentSlug: String!, dotSlug: String!): DotInfo!
`

const exportObject = {
	queries,
	resolvers
}

export default exportObject