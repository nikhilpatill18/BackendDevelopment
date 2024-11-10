import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import { uploadoncloudinary } from "../utils/fileupload.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { Apiresponse } from '../utils/Apiresponse.js'
const registerUser = asynchandler(
    async (req, res) => {
        // get user detais
        // validate user
        // check user register already: username and email
        // check for images check for avatar
        // upload them to cloudnary
        // create user object -create entry in db
        //remove the pass and reftoken from the response
        // return the response
        const { username, email, fullname, password } = req.body;
        // console.log(username, email, fullname, password);

        // validate the user

        if (
            [fullname, email, fullname, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All field are required")

        }
        // checking the user already exits or not

        const exiteduser = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (exiteduser) {
            throw new ApiError(409, "Username or email is already exits")
        }

        // handeling the files through the middleware multer4
        // console.log("-------------------------------------------------------------", req.files.avatar)

        const avtarlocalpath = req.files?.avatar[0]?.path
        const coverlocalpath = req.files?.coverImage[0]?.path

        // uploading file on cloudnary

        if (!avtarlocalpath) {
            throw new ApiError(400, "Avatar image is required")
        }

        const uploadresut = await uploadoncloudinary(avtarlocalpath)
        const uploadresut2 = await uploadoncloudinary(coverlocalpath)

        if (!uploadresut) {
            throw new ApiError(400, "upload unsucessgullr")
        }


        const user = await User.create({
            fullname,
            avatar: uploadresut.url,
            coverImage: uploadresut2?.url || "",
            username,
            password,
            email,
        })

        const searchuser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!searchuser) {
            throw new ApiError(500, "someting went wrong while creating the user")

        }
        return res.status(201).json(
            new Apiresponse(200, searchuser, "user Register Sucessful ly")

        )
    }

)


// access token genreator method

const genrateaccessTokenandrefershtoken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.genrateaccessToken()

        const refreshToken = user.genraterefreshToken()

        user.refreshToken = refreshToken
        // console.log(refreshToken)

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message)

    }
}


// login user

const loginUser = asynchandler(
    //login through email and password
    // check the enter feild is empty or not
    // if empy througth the error
    // verify the email throught otp
    //
    async (req, res) => {
        const { username, email, password } = req.body;
        // if (!username && !email) {
        //     throw new ApiError(401, "no field should  be empty")
        // }
        // console.log(username)
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })
        // console.log(user, "userlogin console")
        if (!user) {
            throw new ApiError(401, "Did not find user please sign up first")
        }

        const checkpass = await user.isPasswordCorrect(password)

        if (!checkpass) {
            throw new ApiError(401, "password is incorrect")
        }
        const { accessToken, refreshToken } = await genrateaccessTokenandrefershtoken(user._id)

        // console.log(accessToken, refreshToken)


        const loggedIn = await User.findById(user._id).select("-password -refreshToken")

        const option = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option).json(
                new Apiresponse(200, {
                    user: loggedIn   //, refreshToken, accessToken
                },
                    "LoggedIn Success")
            )


    }

)

// logout user contoller

const logoutUser = asynchandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "User logout Out Sucssfully"))

})

// refresh -accessToken session

const refreshaccessToken = asynchandler(async (req, res) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedtoken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodedtoken) {
            throw new ApiError(401, "unexpected token")
        }

        const user = await User.findById(decodedtoken?._id)

        if (!user) {
            new ApiError(401, "Invalid refresh token")
        }

        if (incomingrefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh token is expired")
        }

        const option = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await genrateaccessTokenandrefershtoken(user._id)
        res
            .status(200)
            .cookie("refreshToken", refreshToken, option)
            .cookie("accessToken", accessToken, option).json(
                new Apiresponse(200, { accessToken, refreshToken }, "Acess token refresh sucessfully")
            )
    } catch (error) {
        throw new ApiError(401, error.message)

    }
})

// password change method

const changeuserpassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    // console.log(req.user)
    const user = await User.findById(req.user?._id);

    const checkpass = await user.isPasswordCorrect(oldPassword)
    // console.log(checkpass)

    if (!checkpass) {
        throw new ApiError(500, "Old password incorrect")
    }

    user.password = newPassword
    const updatesuser = await user.save({ validateBeforeSave: false })

    res.status(201).json(new Apiresponse(201, {}, "password changed successfully"))
})

const getCurrentUser = asynchandler(
    async (req, res) => {
        return res.status(200).json(new Apiresponse(200, req.user, "User fetched successfully"))
    }
)

const updateavatar = asynchandler(async (req, res) => {
    const avatar = req.file?.path

    if (!avatar) {
        throw new ApiError(400, "File not found")
    }

    const uploadAvatar = await uploadoncloudinary(avatar)

    if (!uploadAvatar.url) {
        throw new ApiError(400, "Error while uploading file on the server cloudinary")

    }
    const updatedata = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: uploadAvatar.url
            }

        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res.status(200).json(new Apiresponse(200, updatedata, "Avatar updated successfully"))
})
const updatecover = asynchandler(async (req, res) => {
    const coverImage = req.file?.path

    if (!coverImage) {
        throw new ApiError(400, "File not found")
    }

    const uploadcoverImage = await uploadoncloudinary(coverImage)

    if (!uploadcoverImage.url) {
        throw new ApiError(400, "Error while uploading file on the server cloudinary")

    }
    const updatedata = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: uploadcoverImage.url
            }

        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(new Apiresponse(200, updatedata, "coverImage updated successfully"))
})

const getUserchanneprofile = asynchandler(
    async (req, res) => {
        const username = req.params
        if (!username) {
            throw new ApiError(400, "Username not found")
        }

        const channel = await User.aggregate([
            {
                $match: {
                    username: username
                }
            }
            ,
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscriberCount: {
                        $size: "subscribers"
                    },
                    channelcount: {
                        $size: "subscribedTo"
                    },
                    issubscribed: {
                        $cond: {
                            if: { $in: [req.user?._id, "subscribers"] }
                            , then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                    coverImage: 1,
                    subscriberCount: 1,
                    channelcount: 1,
                    issubscribed: 1
                }
            }
        ])
        if (!channel) {
            throw new ApiError(400, "something went wrong")
        }
        return res.status(200)
            .json(new Apiresponse(200, channel[0, "userfetches sucessfully"]))
    }
)

const watchhistory = asynchandler(async (req, res) => {
    const user = User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchhistory"
                ,
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "owner",
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200)
        .json(new Apiresponse(200, user[0].watchhistory, "watchhistoty fetched successfully"))
})
export { loginUser, registerUser, logoutUser, refreshaccessToken, changeuserpassword, getCurrentUser, updateavatar, updatecover, getUserchanneprofile, watchhistory }