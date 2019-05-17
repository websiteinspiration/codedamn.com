import mongoose from "mongoose"

export interface user extends mongoose.Document {
	name: string,
	fcmToken: string,
	practiceDone: string[],
	completed: string[],
	progressBar: number,
	damns: number,
	facebookID: string,
	googleID: string,
	profilepic: string,
    username: string,
	email: string,
	doj: Date,
	password: string,
	activeDates: string[],
	streak: number,
    favtags: string[],
    firstTime: boolean,
	level: string,
	civilization: number
}