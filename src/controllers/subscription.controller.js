import mongoose from "mongoose";
import { User } from '../models/user.model.js'
import { Apiresponse } from '../utils/Apiresponse.js'
import { ApiError } from '../utils/apierror.js'
import { asynchandler } from '../utils/asynchandler.js'
import { Subscription } from "../models/subscription.model.js";
const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const { channelId } = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(404, "id not found");
    }
    const user = await User.findById(subscriberId)
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    const tchannelist = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(subscriberId) }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as: "channellist"
            }
        },
        {
            $project: {
                username: 1,
                channellist: 1,
                // totalsubscribeschannel: 1

            }
        }
    ])
    if (!tchannelist) {
        throw new ApiError(404, "not found")
    }
    return res.status(200).json(new Apiresponse(200, tchannelist, "success"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}