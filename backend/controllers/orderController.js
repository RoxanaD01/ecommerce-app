import orderModel from "../models/orderModel.js"
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'
import Stripe from 'stripe'

const currency = 'ron'
const deliveryCharge = 10
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const computeAmount = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await productModel.findById(item._id)
        if(!product) throw new Error (`Product ${item._id} not found`)
        total += product.price * item.quantity
    }
    return total + deliveryCharge
}

const placeOrder = async (req, res, next) => {
    try {
        
        const {items, address} = req.body;
        const userId = req.userId;
        const amount = await computeAmount(items)

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now() 
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.status(201).json({ success: true, message: "Order Placed" })

    } catch (error) { next(error) }
}

const placeOrderStripe = async (req, res, next) => {
    try {

        const {items, address} = req.body;
        const userId = req.userId;
        const origin = req.headers.origin || "http://localhost:5173"   
        const amount = await computeAmount(items)

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now() 
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save()

        const line_items = await Promise.all(
            items.map(async (item) => {
                const product = await productModel.findById(item._id)
                 if (!product) throw new Error(`Product ${item._id} not found`)
                return {
                    price_data: {
                    currency: currency,
                    product_data: {
                    name: item.name
                },
                unit_amount: product.price * 100  
            },
            quantity: item.quantity
            }
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: deliveryCharge* 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?orderId=${newOrder._id}&sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            line_items,
            mode: 'payment',
            metadata: {
                orderId: newOrder._id.toString(),
                userId: userId.toString()
            }
        })

        res.status(200).json({ success: true, session_url: session.url })

    } catch (error) { next(error) }
}

const verifyStripe = async (req, res, next) => {
    const {orderId, sessionId} = req.body

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(session.metadata.userId, {cartData: {}})  
            return res.status(200).json({ success: true, message: "Payment processed" })

        } else {
            await orderModel.findByIdAndDelete(orderId)
            return res.status(400).json({ success: false, message: "Payment not confirmed" })
        }

    } catch (error) { next(error) }
}

// ----- WEBHOOK -----
const stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature']

    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,                               
            signature,                             
            process.env.STRIPE_WEBHOOK_SECRET      
        )
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`)  
    }

    if(event.type === 'checkout.session.completed') {
        const session = event.data.object
        const {orderId, userId} = session.metadata

        try {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        } catch (error) {
            console.error('Webhook DB error:', error.message)
        }
        
    }
    res.status(200).json({ received: true })
}

const allOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).json({ success: true, orders })

    } catch (error) { next(error) }
}

const userOrders = async (req, res, next) => {
    try {
        const userId = req.userId;

        const orders = await orderModel.find({userId});
        res.status(200).json({ success: true, orders })
        
    } catch (error) { next(error) }
}

// Update Order Status from Admin Panel
const updateStatus = async (req, res, next) => {
    try {
        const {orderId, status} = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.status(200).json({ success: true, message:"Status Updated" })
        
    } catch (error) { next(error) }
}

export {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, stripeWebhook}