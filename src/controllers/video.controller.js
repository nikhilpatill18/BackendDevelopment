import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/apierror.js"
import { uploadoncloudinary } from "../utils/fileupload.js";
import { Apiresponse } from '../utils/Apiresponse.js'
import { asynchandler } from '../utils/asynchandler.js';
import mongoose from 'mongoose';

const publishAVideo = asynchandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, discription } = req.body
    const { videoFile, thumnail } = req.files

    if (title == '' || discription == '') {
        throw new ApiError(400, "All feild are required")
    }
    console.log("hello")
    console.log(videoFile[0].path)
    // const videoFile = req.files?.videoFile[0]?.path
    // const thumnail = req.files?.thumnail[0]?.path

    if (!videoFile) {
        throw new ApiError(401, "please Select the video file")
    }
    if (!thumnail) {
        throw new ApiError(401, "please select the thumbnail")
    }

    const uploadvideo = await uploadoncloudinary(videoFile[0].path)
    const uploadthumbnail = await uploadoncloudinary(thumnail[0].path)
    // console.log(uploadvideo)

    if (!uploadvideo.url) {
        throw new ApiError(401, "Falied while Uploading the video")
    }
    if (!uploadthumbnail.url) {
        throw new ApiError(401, "Falied while Uploading the thumnail")
    }
    console.log("uploaing ddone")
    const video = await Video.create({
        title: title,
        discription: discription,
        videoFile: uploadvideo.url,
        thumnail: uploadthumbnail.url,
        duration: uploadvideo.duration,
        ispublished: true,
        owner: req.user?._id
    })
    // console.log(video)

    return res.status(200).json(new Apiresponse(200, video, "Video upload sucessfully"))


})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    // aggreate pipeline for video by id
    // console.log(mongoose.Types.ObjectId(videoId))
    // if (!new mongoose.Types.ObjectId.isValid(videoId)) {
    //     throw new ApiError(400, "invalid")
    // }
    // console.log(videoId)

    // console.log(new mongoose.Types.ObjectId(videoId))

    const videodetails = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                views: 1
            }
        }
    ])
    // console.log(videodetails) // todo empy video array is coming check after

    if (!videodetails || !videodetails.length) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200)
        .json(new Apiresponse(200, videodetails, "Video details found"))

})

const updateVideo = asynchandler(async (req, res) => {

    // const { id } = req.params
    const { id, utitle, discription, thumnail } = req.body


    // console.log(id, utitle)


    console.log(req.file)

    const thumnailpath = req.file?.path

    if (!thumnailpath) {
        throw new ApiError(404, "thumnail file not found")
    }

    const uploadfile = await uploadoncloudinary(thumnailpath)

    if (!uploadfile) {
        throw new ApiError(404, "Failed while Uploading in cloudinary")
    }
    const videodetails = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $set: {
                title: utitle,
                discription: discription,
                thumnail: uploadfile.url
            }
        }
    ])
    // console.log(videodetails)
    return res.status(200)
        .json(new Apiresponse(200, videodetails, "Video details found"))








})
export { publishAVideo, getVideoById, updateVideo }