import mongoose from "mongoose"

interface languageInfoInterface {
	language: string,
	watched: string[],
	tasksDone: string[]
}

interface taskInfoInterface {
	language: string,
	done: string[]
}

interface stackInfoInterface {
	stack: string,
	done: string[]
}

interface dataInterface {
	doneDots: any,
	watchDots: any,
	taskDoneDots: any
}

export interface user extends mongoose.Document {
	name: string,
	fcmToken: string,
	progressBar: number,
	damns: number,
	facebookID: string,
	googleID: string,
	profilepic: string,
    username: string,
	email: string,
	doj: Date,
	password: string,
    favtags: string[],
    firstTime: boolean,
	level: string,
	civilization: number,
	data: dataInterface,
}