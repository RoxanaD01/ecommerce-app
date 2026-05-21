import mongoose from "mongoose";

// Add logic with which we can connect our Mongoose package from MongoDB Atlas Server

//each time we execute this function, then the mongoDB database will be connected to the project
const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('DB connected');
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
}

export default connectDB;