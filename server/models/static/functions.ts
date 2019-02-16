import Static from './model'
import { statics } from '@interfaces/static'

class Functions {

	static async getAllTags() {
		const data: statics = await Static.findOne({ type: 'tags' }, { _id: 0, value: 1 })
		return data.value
	}

	// safe
	static async isValidSubCategory(category, subcategory) {
		return !!(await Static.findOne({ type: 'category', [`value.${category}`]: subcategory }))
	}

	// safe
	static async isValidCategory(category) {
		return !!(await Static.findOne({ type: 'category', [`value.${category}`]: { $exists: true }}))
	}
	
	static async getCategories() {
		const doc: statics = await Static.findOne({ type: 'category' })
		return Object.keys(doc.value)
	}

	static async getSubCategories(category) {
		const doc: statics = await Static.findOne({ type: 'category' }, { [`value.${category}`]: 1 })
		return doc.value[category]
	}

}

export default Functions