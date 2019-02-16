import express from 'express'
import * as path from 'path'

const router = express.Router()

router.get('/instagram', (req, res) => {
    res.redirect('https://www.instagram.com/mehulmpt')
})

router.get('/twitter', (req, res) => {
    res.redirect('https://www.twitter.com/mehulmpt')
})

router.get('/react-native-course', (req, res) => {
	res.redirect('http://bit.ly/react-native-2019')
})

export default router