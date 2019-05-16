import { checkAuth } from '../functions'
import Practice from 'models/practice'
import practice from 'interfaces/practice'

const resolvers = {
	async practiceBlock({ challengeid, moduleid }, req: Request) {
		checkAuth({ req })

		const data = await Practice.getBlock(moduleid, challengeid)
		debugger
		if(!data) {
			throw new Error('Invalid slugs')
		}

		return (<practice>data).flow[0]
	}
}

const queries = `
practiceBlock(challengeid: String!, moduleid: String!): PracticeBlock!
`

const exportObject = {
	queries,
	resolvers
}

export default exportObject