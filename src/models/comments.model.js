import mongoose, { Schema } from 'mongoose';

const commentSchme = new Schema({

    content: {
        type: String,

    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

export const Comment = mongoose.model('Comment', commentSchme);