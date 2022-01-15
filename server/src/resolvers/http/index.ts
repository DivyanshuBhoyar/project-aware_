import express from 'express'
import { VToken } from '../../utils/types/Token.model'
import { User } from '../../entities/User'


export const httpRouter = express.Router()
httpRouter.use(express.json())

httpRouter.get('/', (_, res) => {
    res.send('hello dev')
})

httpRouter.get('/activate/:token', async (req, res) => {
    const { token } = req.params
    let user;
    try {
        const foundToken = await VToken.findOne({ _id: token })
        if (foundToken)
            user = await User.findOne({ id: foundToken.userid })
        else
            return res.status(410).json({ message: 'Token invalid or not found' })

        user.is_activated = true
        await user.save()
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Something went wrong' })
    }

    return res.status(200).json({
        message: 'activated',
        token
    })

})