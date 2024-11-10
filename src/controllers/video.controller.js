import { Video } from '../models/video.model.js'
import { ApiError } from "../utils/apierror.js"
import { uploadoncloudinary } from "../utils/fileupload.js";
import { Apiresponse } from '../utils/Apiresponse.js'
import { asynchandler } from '../utils/asynchandler.js';

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
export { publishAVideo }