import "dotenv/config"
import mongoose from "mongoose"

const connectDB=async ()=>{
    mongoose.connection.on("connected",()=>{
        console.log("Mongo DB Connected")
    })
    await mongoose.connect(process.env.MONGODB_URI as string)
}

export default connectDB;