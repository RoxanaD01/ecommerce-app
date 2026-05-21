import express from 'express'
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth , allOrders) // for Admin Panel - get all orders detail and display all orders in Admin Panel
orderRouter.post('/status', adminAuth , updateStatus) // for Admin panel

// Payment Features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// User Feature
orderRouter.post('/userOrders', authUser, userOrders)

// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter