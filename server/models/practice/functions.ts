import Practice from './model'
import practice from 'interfaces/practice'

class Functions {

	static async getBlock(moduleid: string, challengeid: string): Promise<practice | null> {
		return await Practice.findOne({ slug: moduleid, "flow.slug": challengeid }, { "flow.$": 1, _id: 0 })
	}

}

export default Functions