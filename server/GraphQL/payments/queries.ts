import { checkAuth } from '../functions'
import Razorpay from 'razorpay'
import shortid from 'shortid'

const razorpay = new Razorpay({  
    key_id: process.env.RAZORPAY_KEY,  
    key_secret: process.env.RAZORPAY_SECRET
})

const resolvers = {
	async createOrder({ currency }, req: Request) {

		if(currency !== 'usd' && currency !== 'inr') throw 'Invalid currency'

		const options = { 
			amount: currency === 'usd' ? 5 * 100 : 5 * 70 * 100, 
			currency: currency.toUpperCase(), 
			receipt: shortid.generate(), 
			payment_capture: true 
		}

        try {
            const res = await razorpay.orders.create(options)
            return { result: true, ...res }
        } catch(error) {
			console.error(error)
			return { result: false }
        }
	},
	async addPurchasedDamns({ }, req: Request) {
		return true
	}
}

const queries = `
createOrder(currency: String!): GenerateOrder!
addPurchasedDamns(paymentID: String!, orderID: String!, signature: String!): Boolean!
`

const exportObject = {
	queries,
	resolvers
}

export default exportObject