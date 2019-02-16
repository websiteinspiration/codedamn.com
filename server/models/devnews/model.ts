const mongoose = require('mongoose')
const shortid = require('shortid')

const noID = { _id: false }

const CommentType = new mongoose.Schema({
	id: { type: String, default: shortid.generate },
	author: String,
	avatar: String,
	comment: String,
	date: { type: Date, default: Date.now },
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 }
}, noID)

const Schema = new mongoose.Schema({
	id: String,
	title: String,
	body: String,
	image: String,
	author: String,
	tags: [String],
	url: String,
	searchTerm: String,
	score: Number,
	readingTime: Number,
	likedBy: [String],
	comments: [CommentType]
}, { collection: 'devnews' })

const model = mongoose.model('devnews', Schema)

export default model