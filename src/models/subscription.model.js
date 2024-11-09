import mongoose, { Schema } from "mongoose";

const subscriberArry = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}

const subscriptionSchme = new Schema({
    subscriber: [subscriberArry]
    ,
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    }




}, { timestamps: true })

export const Subscription = mongoose.model('Subscription', subscriptionSchme)