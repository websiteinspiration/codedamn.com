import Practice from './model'
import practice from 'interfaces/practice'

class Functions {

	static async getBlock(moduleid: string, challengeid: string): Promise<practice | null> {
		return await Practice.findOne({ slug: moduleid, "flow.slug": challengeid }, { "flow.$": 1, _id: 0 })
	}

	static async getNodes(moduleid: string): Promise<practice | null> {
		return await Practice.findOne({ slug: moduleid }, { _id: 0, flow: 1 })
	}

	static async getBlocksInfo() {
		return await Practice.find({}, { category: 1, slug: 1, title: 1, desc: 1, image: 1, _id: 0 })
	}
}

export default Functions