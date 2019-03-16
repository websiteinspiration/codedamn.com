import Quiz from './model'
import { string } from '../schema'
import Joi from 'joi'

class Functions {

	static async isValidQuiz(slug) {
		return !Joi.validate(slug, string).error && await this.getQuizDetails({slug})
	}

	static async saveQuiz(data, username) {
		const quiz = new Quiz({
			...data,
			author: username
		})

		return await quiz.save()
	}

	static async updateQuiz(slug, data) {
		return await Quiz.replaceOne({slug}, data)
	}

	static async getQuizzes({ category, subcategory }) {
		const data = await Quiz.find({ category, subcategory })
		return data
	}

	static async getQuizDetails({ slug }) {
		const data = await Quiz.findOne({slug}, { _id: 0 })
		return data
	}

	static async deleteQuiz(slug) {
		return await Quiz.remove({ slug })
	}

}

export default Functions