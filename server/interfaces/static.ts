import mongoose from 'mongoose'

export interface statics extends mongoose.Document  {
	type: string,
	value: any
}