import queries from './queries'
import types from './types'

export default {
	queries: queries.queries,
	resolvers: {
		...queries.resolvers,
	},
	types
}