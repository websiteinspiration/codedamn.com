import mongoose from "mongoose";

interface CommentType {
	id: string,
	author: string,
	comment: string,
	avatar: string,
	date: Date,
	upvotes: number,
	downvotes: number
}

interface flowType {
	title: string,
	slug: string,
	type: string,
	extras: any,
	score: number,
	reviews: string[],
	comments: [CommentType]
}

interface SectionType {
	title: string,
	markdown: string
}

interface TaskType {
	title: string,
	sections: [SectionType],
	rawCode: string
}

export interface language extends mongoose.Document {
    name: string,
    shortname: string,
	slug: string,
	tags: string[],
	subcategory: string,
	creator: string,
	cocreators: [string],
	icon: string,
    description: string,
	flow: [flowType],
	tasks: [TaskType],
	category: string,
	views: number,
	live: boolean
}