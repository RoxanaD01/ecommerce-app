import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, default: ''},
    cartData: {type: Object, default: {}},   // whenever the new user will be created, their cart will be one empty object

    resetPasswordToken: {type: String},      // hashed token stored in DB
    resetPasswordExpires: {type: Date},      // token expiry (1 hour)

}, {minimize: false}) 

// minimize: false => whenever we create the cartData, by default we've provided the value of empty object but mongoDB nu stocheaza empty objects, and in order sa stocheze cartData even if its empty, we used minimize: false.

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;