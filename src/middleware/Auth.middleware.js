import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export const verifyJWT = asynchandler(
    async (req, res, next) => {
        try {
            // console.log(req.headers.cookie)
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            // console.log(token)

            if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }

            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

            if (!user) {
                throw new ApiError(401, "no user found")
            }
            req.user = user
            next()
        } catch (error) {
            throw new ApiError(401, error.message)

        }
    }
)