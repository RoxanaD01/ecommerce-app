import orderModel from "../models/orderModel.js"
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'
import Stripe from 'stripe'

// global variables 
const currency = 'ron'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function: recompute total from DB prices to prevent client-side price tampering
const computeAmount = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await productModel.findById(item._id)
        if(!product) throw new Error (`Product ${item._id} not found`)
        total += product.price * item.quantity
    }
    return total + deliveryCharge
}

// Placing orders using COD (Cash on Delivery) Method
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

        // We have to clear the cart data of this user because using this cart data, we have already placed the order
        await userModel.findByIdAndUpdate(userId, {cartData: {}})
        // 201 Created — comandă nouă creată cu succes
        res.status(201).json({ success: true, message: "Order Placed" })

    } catch (error) { next(error) }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res, next) => {
    try {

        const {items, address} = req.body;
        const userId = req.userId;
        const origin = req.headers.origin || "http://localhost:5173"   // 'origin' is the website URL where the request came from. Stripe needs this so it knows where to send the user after payment.
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

        // After placing the order, we'll create one line items so that we can execute the Stripe Payment
        // line_items = the list of products the customer is paying for
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
                unit_amount: product.price * 100  // use DB price
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

        // create a new session. Using tha URL we can send the users on the payment gateway
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

// Verify Stripe — called after redirect from Stripe checkout page.
// We do NOT trust the "success" param from the URL (a user could fake it).
// Instead, we check the actual payment status from our own database,
// which is set authoritatively by the webhook.
const verifyStripe = async (req, res, next) => {
    const {orderId, sessionId} = req.body

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(session.metadata.userId, {cartData: {}})  // golim cosul
            return res.status(200).json({ success: true, message: "Payment processed" })
        } else {
            // Payment not confirmed yet (webhook may not have fired) — delete pending order
            await orderModel.findByIdAndDelete(orderId)
            // 400 Bad Request — plata a eșuat sau a fost anulată
            return res.status(400).json({ success: false, message: "Payment not confirmed" })
        }
    } catch (error) { next(error) }
}

// ----- WEBHOOK -----
const stripeWebhook = async (req, res, next) => {
    const signature = req.headers['stripe-signature']

    let event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,                               // raw bytes/ raw body — MUST be Buffer
            signature,                              // from header
            process.env.STRIPE_WEBHOOK_SECRET       // from .env
        )
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`)   // if Signature is invalid — reject it
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

// All Orders Data for Admin Panel
const allOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({}) // find all orders from all users
        res.status(200).json({ success: true, orders })

    } catch (error) { next(error) }
}

// User Order Data for Frontend - display orders for a particular user
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