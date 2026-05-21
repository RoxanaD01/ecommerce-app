// Using Mongoose Model we can store the data in DB

import mongoose from "mongoose";

// SCHEMA = a structure and using that we can create the data in the DB

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true},
    sizes: {type: Array, required: true},
    bestseller: {type: Boolean},
    date: {type: Number, required: true},
})

// Using the Schema we create one MODEL. Whenever we will run this project, the model will be created multiple times, but we can create the model only once.
// If the product schema exists: mongoose.models.product. If does NOT exist, then create mongoose.model

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;