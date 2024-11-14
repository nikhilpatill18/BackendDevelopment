import mongoose from "mongoose"
import { Comment } from "../models/comments.model.js"
import { ApiError } from "../utils/apierror.js"
import { Apiresponse } from "../utils/Apieesponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video

    const { content, videoId } = req.body
    if (content == '') {
        throw new ApiError(400, "add some comment");
    }
    const commnet = await Comment.create({
        content,
        videoId,
        owner: req.user._id
    })
    if (!commnet) {
        throw new ApiError(404, "not able to add commnet")
    }
    return res.status(200).json(new Apiresponse(200, commnet, "commnet post sucessfully"))
})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    if (content = '') {
        throw new ApiError(403, "add soome comment")
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content
        }

    },
    )
    if (!updatedComment) {
        throw new ApiError(403, "unable to update comment")
    }
    return res.status(200), json(new Apiresponse(200, updateComment, "updatedComments"))
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}