import mongoose from 'mongoose'
import { language } from 'interfaces/site'

import shortid from 'shortid'

const noID = { _id: false }


/* keep in sync with Project schema in do.codedamn */
const CommentType = new mongoose.Schema({
	id: { type: String, default: shortid.generate },
	author: String,
	avatar: String,
	comment: String,
	date: { type: Date, default: Date.now },
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 }
}, noID)

const FlowType = new mongoose.Schema({
	type: String,
	title: String,
	slug: String,
	extras: mongoose.Schema.Types.Mixed,
	score: { type: Number, default: 0 },
	reviews: { type: [String], default: [] },
	comments: { type: [CommentType], default: [] }
}, noID)

const SectionType = new mongoose.Schema({
	title: String,
	markdown: String
}, noID)

const TaskType = new mongoose.Schema({
	slug: String,
	title: String,
	sections: [SectionType],
	rawCode: String,
}, noID)

const LangSchema = new mongoose.Schema({  
  name: String,
  slug: String,
  tags: [String],
  description: String,
  flow: [FlowType],
  icon: String,
  tasks: [TaskType],
  category: String,
  views: { type: Number, default: 0 },
  live: Boolean
}, { collection: 'languages' })

const model = mongoose.model<language>('Language', LangSchema)
export default model