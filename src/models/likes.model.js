import mongoose, { Schema } from 'mongoose';

const likeSchema = new Schema({
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    likedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }

}, {
    timestamps: true,
})

export const Like = mongoose.model('Like', likeSchema)