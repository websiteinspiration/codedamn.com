import mutations from './mutations'
import types from './types'

export default {
	mutations: mutations.mutations,
	resolvers: {
		...mutations.resolvers,
	},
	types
}