import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/apierror.js"
import { uploadoncloudinary } from "../utils/fileupload.js";
import { Apiresponse } from '../utils/Apiresponse.js'
import { asynchandler } from '../utils/asynchandler.js';
import mongoose from 'mongoose';

//upload the video
const publishAVideo = asynchandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, discription } = req.body
    const { videoFile, thumnail } = req.files
    console.log(req.files)

    if (title == '' || discription == '') {
        throw new ApiError(400, "All feild are required")
    }
    // console.log(videoFile)
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

//to get video by id
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

// update the video details like title description , thumnail
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

// to delete a video

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    console.log(videoId)
    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        return new ApiError(404, "Video not found")
    }
    res.status(200).json(new Apiresponse(200, video, "video deleted"))
})
// toggle a video published to unpublished vise-versa
const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params

    const togglvideo = await Video.findById(videoId)
    if (!togglvideo) {
        return new ApiError(404, "Video not found")
    }
    const status = togglvideo.ispublished

    togglvideo.ispublished = !status
    const resp = await togglvideo.save({ validateBeforeSave: false })

    if (!resp) {
        throw new ApiError(404, "failed to toggle the video")
    }
    res.status(200).
        json(new Apiresponse(200, resp, "video status toggled"))
})
export { publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus }   