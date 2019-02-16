import DevNews from './model'

class Functions {

	static async addComment(id: string, comment) {

		await DevNews.updateOne({ id }, { $push: { comments: comment }})

		return comment
	}

	static async getComments(id: string) {
		const res = await DevNews.findOne({ id }, { _id: 0, comments: 1 })

		return res.toJSON().comments
	}

	static async setNewsLike(id: string, username: string) {
		return await DevNews.updateOne({ id }, { $addToSet: { likedBy: username } })
	}

	static async getDevNews(tags, username) {

		const _tags = tags.map(t => t.toLowerCase())

		const data = await DevNews.aggregate(
			[
				{ $project: { subset: { $setIntersection: [ _tags, "$tags" ] }, _id:0, id: 1, body: 1, image: 1, score: 1, readingTime: 1, author: 1, url: 1, title: 1, likedBy: 1, comments: 1 } },
				{ $project: { len: { $size: "$subset" }, _id:0, body: 1, image: 1, score: 1, readingTime: 1, author: 1, url: 1, title: 1, id: 1, likedBy: 1, likeCount: 1, comments: 1  } },
							{ $match: { len: { $gt: 0 } } },
				{ $sort: { score: -1 } },
				{ $sample: { size: 40 } }
			  ]
		)

		//return await DevNews.find({ id: "bJfo56NVQh" })
		

	//	return [{"title":"Writing a CRUD app with Node.js and MongoDB","body":"Since you are here, I will assume you know the following:","url":"https://medium.com/codeburst/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb","image":"https://cdn-images-1.medium.com/fit/t/1280/720/1*fJrDLOcdFPOW_5n2MPcYPA.jpeg","score":2184,"readingTime":10.524528301886793,"author":"Eslam Maged","id":"bJfo56NVQh","likedBy":0,"len":1}]
		//	  const data2 = [(await DevNews.findOne({ id: "7ytVyRxwo" })).toJSON()]

		return data.map(entry => {
			return {
				...entry,
				didILike: !!(entry.likedBy && entry.likedBy.includes(username)),
				likedBy: (entry.likedBy || []).length,
				commentCount: (entry.comments || []).length
			}
		})
	}

	static async getSingleDevNews(tags) {
		const _tags = tags.map(t => t.toLowerCase())
		const data = await DevNews.aggregate(
			[
				{ $project: { subset: { $setIntersection: [ _tags, "$tags" ] }, _id:0, body: 1, image: 1, score: 1, readingTime: 1, author: 1, url: 1, title: 1, searchTerm: 1  } },
				{ $project: { len: { $size: "$subset" }, _id:0, body: 1, image: 1, score: 1, readingTime: 1, author: 1, url: 1, title: 1, searchTerm: 1  } },
							{ $match: { len: { $gt: 0 } } },
				{ $sort: { score: -1 } },
				{ $sample: { size: 1 } }
			  ]
		)

		return data[0]
	}
}

export default Functions