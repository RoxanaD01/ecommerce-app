import userModel from '../models/userModel.js'
// userId comes from authUser middleware set in the cartRoute

// Add products to user cart
const addToCart = async (req, res, next) => {
    try {
        // userId is from req.body / itemId is the product id that we're trying to add in the cart

        const userId = req.userId
        const {itemId, size} = req.body;

        const userData = await userModel.findById(userId)

        if (!userData) {
            // 404 Not Found — userul nu există
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if(cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }

        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.status(200).json({ success: true, message: "Added To Cart" })

    } catch (error) { next(error) }
}

// Update user cart
const updateCart = async (req, res, next) => {
    try {
        
        const userId = req.userId
        const {itemId, size, quantity} = req.body;

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
            if ( quantity <= 0 ) {
                delete cartData[itemId][size]
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];     // remove item if no sizes left
                }
            } 
        } 
        await userModel.findByIdAndUpdate(userId, {cartData})
        res.status(200).json({ success: true, message: "Cart Updated" })

    } catch (error) { next(error) }
}

// Get user cart data
const getUserCart = async (req, res, next) => {
    try {

        const userId = req.userId
        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = await userData.cartData;
        res.status(200).json({ success: true, cartData })

    } catch (error) { next(error) }
}

export {addToCart, updateCart, getUserCart}