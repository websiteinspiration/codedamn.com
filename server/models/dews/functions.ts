import Dew from './model'

class Functions {
	static async getDews() {
		return await Dew.find({}, { _id: 0 })
	}
}

export default Functions