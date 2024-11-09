import mongoose from "mongoose";
import { db_name } from "../constant.js";

const connectdb = async () => {
    try {
        const connectionInstancd = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log(`\nMongo db connected !! DB HOST ${connectionInstancd.connection.host}`)

    }
    catch (err) {
        console.log("connection error", err)

    }
}

export default connectdb