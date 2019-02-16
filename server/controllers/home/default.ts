import express from 'express'
import * as path from 'path'

const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../views/index.html"))
})

export default router