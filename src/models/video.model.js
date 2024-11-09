import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchme = new Schema({
    videoFile: {
        type: String, // cloudnary url stored at diff place
        required: true,
    },
    thumnail: {
        type: String,// cloudnary url stored at diff place

        required: true,
    },
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true

    },
    duration: {
        type: Number,
        required: true
    }
    ,
    views: {
        type: Number,
        default: 0,
        required: true
    },
    ispublished: {
        type: boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

}, { timestamps: true });

videoSchme.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video', videoSchme);