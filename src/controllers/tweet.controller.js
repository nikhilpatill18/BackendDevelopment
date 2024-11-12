import { asynchandler } from "../utils/asynchandler.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { ApiError } from "../utils/apierror.js"
import { Tweet } from '../models/tweet.model.js'
import mongoose from "mongoose"


const createTweet = asynchandler(async (req, res) => {

    //TODO: create tweet

    const user = req.user
    console.log(user)

    const { content } = req.body;
    console.log(content)
    if (content == '') {
        throw new ApiError(400, "add some tweet")
    }
    const tweet = await Tweet.create({
        content,
        owner: user?._id
    })
    if (!tweet) {
        throw new ApiError(400, "Failed to upload the tweet")
    }
    console.log(tweet)
    return res.status(200).json(new Apiresponse(200, tweet, "success"))
    // console.log(name, username)
})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { updatedtweet } = req.body
    // console.log(tweetId, updatedtweet)
    if (!tweetId) {
        throw new ApiError(400, "tweet not found id")
    }
    if (!updatedtweet) {
        throw new ApiError(400, "Failed to update tweet")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }
    // console.log(tweet)
    const resp = await Tweet.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $set: {
                content: updatedtweet
            }
        }
    ])
    // console.log(resp)
    if (!resp) {
        throw new ApiError(400, "Failed to update tweet")
    }
    return res.status(200).json(new Apiresponse(200, resp, "tweet updated successfully"))

})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(400, "tweet id not found")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(400, "tweet not found")
    }
    const deletetweet = await Tweet.findByIdAndDelete(tweetId)
    if (!deletetweet) {
        throw new ApiError(400, "not able to delete the tweet")
    }
    return res.status(200).json(new Apiresponse(200, deleteTweet, "tweet deleted sucessfully"))


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}