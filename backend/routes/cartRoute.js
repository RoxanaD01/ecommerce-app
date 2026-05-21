import express from 'express'
import {addToCart, updateCart, getUserCart} from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

// whenever any user get the cart/ update / add products we will add this middleware: authUser

cartRouter.post('/get', authUser, getUserCart) // when we hit this endpoint we'll send the cart data through API
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)

export default cartRouter