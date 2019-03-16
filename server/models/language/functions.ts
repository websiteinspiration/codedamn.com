import Language from './model'
import Quiz from 'models/quiz'
import xdebug from 'debug'
import { language } from '@interfaces/site'

const debug = xdebug('cd:LangFunctions')

class Functions {

	static async voteComment({ id, action, mainslug, creator, topicslug }, type) {

		// TODO: OPTIMIZE!!
		const doc = await Language.findOne({ slug: mainslug, creator, "flow.comments.id": id }, { "flow.$":  1 })

		if(!doc) return

		let i = 0

		for(i = 0;i<doc.flow[0].comments.length;i++) {
			if(doc.flow[0].comments[i].id === id) break;
		}

		if(i === doc.flow[0].comments.length) return

		if(action == 'upvote') {
			// optimize
			
			await Language.updateOne({ "flow.comments.id": id }, { $inc: { [`flow.$.comments.${i}.upvotes`]: type === 'positive' ? 1 : -1 } })
			//t.flow.
		}/* else {
			await Language.updateOne({ "flow.comments.id": id }, { $inc: { [`flow.$.comments.${i}.downvotes`]: type === 'positive' ? 1 : -1 } })
		}*/

		// No support for downvotes, yet ;)

	//	await doc.save()
	}

	/**
	 * 
	 * @param mainslug language slug
	 * @param creator creator username
	 * @description increments the particular timeline's view counter
	 */
	static async registerView(slug, creator) {
		await Language.updateOne({ slug, creator }, { $inc: { views: 1 } })
	}

	/**
	 * 
	 */
	static async addComment(creator, mainslug, topicslug, comment, author, avatar) {
		return await Language.updateOne({ slug: mainslug, "flow.slug": topicslug, creator }, { $push: { "flow.$.comments": { comment, author, avatar } } })
	}

	// deprecate this in v2.5.0
	static async addDotComment(parentID, slug, comment) {
		return await Language.updateOne({ _id: parentID, "flow.slug": slug }, { $push: { "flow.$.comments": comment } })
	}

	static async addDotCommentBySlug(parentSlug, slug, comment) {
		return await Language.updateOne({ slug: parentSlug, "flow.slug": slug }, { $push: { "flow.$.comments": comment } })
	}

	static async updateDotScore({ langslug, creator, dotslug, score }, username) {
		const doc = (await Language.findOne({ slug: langslug, creator, "flow.slug": dotslug }, { "flow.$": 1 })).flow[0]
		const newScore = (doc.score || 0) + score
		const newReview = doc.reviews || []
		newReview.push(username)
		const res = await Language.updateOne({ slug: langslug, creator, "flow.slug": dotslug }, { $set: { "flow.$.score": newScore, "flow.$.reviews": newReview }})
		return res
	}
	/**
	 * DEPRECATED AFTER GRAPHQL
	 * @param slug slug of timeline
	 * @param creator author of timeline
	 * @param shouldBeLive true = SHOULD BE LIVE | false = SHOULD NOT BE LIVE | null = LIVE OR NOT LIVE
	 */
	static async getLanguage(slug: string, creator: string, shouldBeLive: boolean|null): Promise<language> {
		
		if(shouldBeLive === null) {
			return await Language.findOne({slug, creator}, { _id: 0 })
		}
		
		return await Language.findOne({slug, creator, live: shouldBeLive}, { _id: 0 })
	}

	static async findTimeline(obj): Promise<language> {
		return await Language.findOne(obj)
	}

	static async findDot(parentID, slug) {
		return await Language.findOne({ _id: parentID, flow: { $elemMatch: { slug }}})
	}

	static async findDotBySlug(parentSlug, slug) {
		return await Language.findOne({ slug: parentSlug, flow: { $elemMatch: { slug }}})
	}
	
	// DEPRECATED AFTER GRAPHQL
    static async isValidTopic(langslug: string, creator: string, dotslug: string): Promise<language|boolean> {
        return await Language.findOne({slug: langslug, creator, live: true, flow: {$elemMatch: { slug: dotslug }}})
    }
	
    static async fetchAllTimelinesForAdmin(creator) {
        const data = await Language.find({ creator }, { _id: 0, name: 1, slug: 1 })
        return data
	}

	/**
	 * 
	 * @param parentID ID of timeline to be queried
	 * @param slug dot slug
	 * @returns dotInfo object [for mobile app as of now]
	 * WARNING: breaking changes compared to getTopicInfo() method
	 */
	static async getDotInfo(obj, slug: string) {

		const doc = await Language.findOne(obj)
		
		if(!doc) throw new Error("Cannot find timeline")

        var i = 0
        for(; i < doc.flow.length; i++) {
            const flow = doc.flow[i]
            if(flow.slug == slug) {
                break
            }
		}

		if(i === doc.flow.length) throw new Error("Cannot find this slug in this timeline")

		const dot = doc.flow[i]

        const reply: any = {
			type: dot.type,
            currentTitle: dot.title,
            displayLangName: doc.shortname || doc.name,
			comments: (dot.comments || []).reverse(),
			currentSlug: slug
		}

		switch(dot.type) {
			case 'video':
				reply.videoExtras = dot.extras
				break
			case 'quiz':
				const quizExtras = await Quiz.getQuizDetails({ slug: dot.slug })
				reply.quizExtras = quizExtras			
				break
		}

        if(i != doc.flow.length - 1) { // not last record
            reply.nextTitle = doc.flow[i+1].title
            reply.nextURL = doc.flow[i+1].slug
        }

        if(i != 0) { // not first record
            reply.prevTitle = doc.flow[i-1].title
            reply.prevURL = doc.flow[i-1].slug
        }

        return reply
	}
	
    static async getTopicInfo(langslug: string, creator:string, topicslug: string) {

        const doc = await Language.findOne({slug: langslug, creator, live: true}, {name: 1, flow: 1, shortname: 1, comments: 1 })
        var i = 0
        for(; i < doc.flow.length; i++) {
            const flow = doc.flow[i]
            if(flow.slug == topicslug) {
                break
            }
		}

		const dot = doc.flow[i]

        const reply: any = {
			type: dot.type,
            currentTitle: dot.title,
            displayLangName: doc.shortname || doc.name,
			mainslug: langslug,
			comments: dot.comments
		}


		switch(dot.type) {
			case 'video':
				reply.extras = dot.extras
				break
			case 'quiz':
				reply.extras = await Quiz.getQuizDetails({ slug: dot.slug })
				break
		}

        if(i != doc.flow.length - 1) { // not last record
            reply.nextTitle = doc.flow[i+1].title
            reply.nextURL = doc.flow[i+1].slug
        }

        if(i != 0) { // not first record
            reply.prevTitle = doc.flow[i-1].title
            reply.prevURL = doc.flow[i-1].slug
        }

        return reply
	}

    /*async getTopicArticle(slug: string, topicname: string) {
        const doc = await Language.findOne({slug}, { _id: 0, flow: { $elemMatch: { slug: topicname }} })
        //debug(doc.flow[0].article, "YES")
        let articleCopy = doc.flow[0].article
        //debug({...articleCopy})
        
        let article

        if(!articleCopy) { // no article found
            article = {
                title: "No Article Found! Write One?",
                authorName: "Anonymous",
                metadata: "Last Edited: 1 Jan 1970",
                content: "<p>Shh... You've arrived at a corner where it is DAMN easy to earn damns. Writing articles is one of the easiest way to gain reputation in the community and earn damns. Write this article if you want!</p>",
                authorBio: "This author does not exist",
                authorImage: "https://cdn-images-1.medium.com/fit/c/60/60/1*yWQSXi7DUTz3mnjCCTVrCw.jpeg",
                slug,
                topicname,
                contributors: []
            }
        } else {

            // TODO: Fix the contributors query to make it 1 DB call instead of 2

            const contributors = await User.find({ username: { $in: articleCopy.contributors || [] } }, { _id: 0, name: 1, picture: 1 })

            //debug(contributors)

            article = {
                title: articleCopy.title,
                authorName: articleCopy.authorName,
                metadata: articleCopy.metadata,
                content: articleCopy.content,
                authorBio: articleCopy.authorBio,
                authorImage: articleCopy.authorImage,
                slug,
                topicname,
                contributors
            }
        }
        
        return article
    },*/

    static async updateContent(slug: string, topicurl: string, title: string, markdown: string, username: string) {

        debug(markdown, title)

        return Language.update({slug, "flow.topicurl": topicurl}, { 
            $set: { 
                "flow.$.article.title": title, 
                "flow.$.article.content": markdown
            },
            $addToSet: {
                "flow.$.article.contributors": username
            }
        })
	}
	
	static async getLanguageFlow(slug: string, creator: string) {
		const res = await Language.findOne({ slug, creator, live: true }, { _id: 0, "flow.title": 1, "flow.slug": 1, "flow.type": 1 })
		return res && res.flow
	}

	static async getAllBlocks() {
		const res = await Language.find({ live: true })
		return res.map(record => ({ ...record.toJSON(), id: record.id }))
	}
	
	static async getBlockInfo(slug, creator) {
		const data = await Language.findOne({ slug, creator }, { _id: 0, name: 1, icon: 1, description: 1 })
		return data.toJSON()
	}

	static async insertTheme(data: any, update: boolean) {
		
		if(update) {
			const slug = data.oldslug
			data.oldslug = undefined
			console.log(await Language.updateOne({ slug }, { $set: { ...data } }))
			return { status: 'ok', data: 'Theme updated' }
		}
		
		const theme = new Language(data)
		await theme.save()
		return { status: 'ok', data: 'Theme saved' }
	

	}

	static async findTheme({slug, creator}) {
		let theme = await Language.findOne({ slug, creator })

		if(!theme) return null

		theme = theme.toJSON()
		
		return {
			metadata: { 
				subcategory: theme.subcategory, 
				name: theme.name, 
				category: theme.category, 
				description: theme.description, 
				shortname: theme.shortname, 
				icon: theme.icon, 
				slug: theme.slug,
				live: theme.live,
				tags: theme.tags
			},
			dots: theme.flow.map(dot => {
				const data: any = {
					type: dot.type,
					title: dot.title,
					slug: dot.slug,
					extras: dot.extras
				}
				//debugger
				if(data.type === 'video') {
					data.image = `https://img.youtube.com/vi/${dot.extras.vidid}/3.jpg`
				}
				return data
			})
		}
	}

	static async getAllThemes(creator) {
		const themes = await Language.find({creator}, { name: 1, slug: 1, _id: 0 })
		return themes
	}

	static async deleteTheme(slug) {
		return await Language.findOneAndRemove({ slug })
	}
}

export default Functions