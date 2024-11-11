import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/Auth.middleware.js'
import { Router } from 'express'
import { publishAVideo, getVideoById, updateVideo } from '../controllers/video.controller.js'

const videoroute = Router()
videoroute.use(verifyJWT)

videoroute.route('/upload-video').post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    }, {
        name: "thumnail",
        maxCount: 1
    }
]),
    publishAVideo
)

videoroute.route('/get-videoById').get(getVideoById)
videoroute.route('/updatevideo').post(upload.single('thumnail'), updateVideo)
export default videoroute