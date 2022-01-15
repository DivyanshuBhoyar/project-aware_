import express from 'express'
// import { User } from '../../entities/User'


export const httpRouter = express.Router()
httpRouter.use(express.json())

httpRouter.get('/', (_, res) => {
    res.send('hello dev')
})

httpRouter.get('/activate/:token', async (req, res) => {
    const { token } = req.params
    return res.status(200).json({
        message: 'activated',
        token
    })

})