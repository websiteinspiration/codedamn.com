import mutations from './mutations'
import queries from './queries'
import types from './types'

export default {
	mutations: mutations.mutations,
	queries: queries.queries,
	resolvers: {
		...mutations.resolvers,
		...queries.resolvers,
	},
	types
}