import { Router } from 'express'
import { registerUser, loginUser, logoutUser, refreshaccessToken, changeuserpassword, updateavatar, updatecover } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/Auth.middleware.js'

const Userrouter = Router()

Userrouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
Userrouter.route("/login").post(
    loginUser
)

//secure route
Userrouter.route("/logout").post(verifyJWT, logoutUser)
Userrouter.route("/refres-token").post(refreshaccessToken)
//change password rooute
Userrouter.route("/change-password").post(verifyJWT, changeuserpassword)
Userrouter.route("/change-avatar").post(verifyJWT, upload.single('avatar'), updateavatar)
Userrouter.route("/change-coverImage").post(verifyJWT, upload.single('coverImage'), updatecover)

export default Userrouter