import { asynchandler } from "../utils/asynchandler.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { ApiError } from "../utils/apierror.js"
import { Tweet } from '../models/tweet.model.js'


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
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}