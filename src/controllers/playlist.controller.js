import mongoose from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body
    if (name == '') {
        throw new ApiError(404, "Invalid name")
    }
    const playlist = await Playlist.create({
        name: name,
        description: description ? description : '',
        owner: req.user?._id
    })
    if (!playlist) {
        throw new ApiError(404, "Unable to create playlist")
    }
    return res.status(200).json(new Apiresponse(200, playlist, "sucessfully created"))

    //TODO: create playlist
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    const getplaylist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
    ])
    if (!getplaylist || getplaylist.length == 0) {
        throw new ApiError(404, "Invlaid user id or user has no playlist")
    }
    return res.status(200).json(new Apiresponse(200, getplaylist, "playlist found sucessfully"))
})

const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    const getplaylistbyid = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
    ])
    if (!getplaylistbyid || getplaylistbyid.lengthbyid == 0) {
        throw new ApiError(404, "Invlaid user id or user has no playlist")
    }
    return res.status(200).json(new Apiresponse(200, getplaylistbyid, "playlist found sucessfully"))
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!playlistId) {
        throw new ApiError(404, "You must specify a playlist")
    }
    if (!videoId) {
        throw new ApiError(404, "You must specify video")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video id not found")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist id not found")
    }
    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: videoId }
        },
        { new: true }
    )
    if (!updated) {
        throw new ApiError(404, "Faild to update playlist")
    }
    return res.status(200).json(new Apiresponse(200, updated, "video added to playlist"))

})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if (!playlistId) {
        throw new ApiError(404, "You must specify a playlist")
    }
    if (!videoId) {
        throw new ApiError(404, "You must specify video")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video id not found")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist id not found")
    }
    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    )
    if (!updated) {
        throw new ApiError(404, "Faild to delete the video from playlist")
    }
    return res.status(200).json(new Apiresponse(200, updated, "video deleted from the  playlist"))

})

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!playlistId) {
        return new ApiError(404, "please enter the playlist id")
    }
    const deleteplaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deleteplaylist) {
        throw new ApiError(404, "falid to delete playlist")
    }
    return res.status(200).json(new Apiresponse(200, deletePlaylist, "playlist deleted successfully"))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    console.log(name)

    if (name == '') {
        throw new ApiError("invlaid name or description")
    }
    if (!playlistId) {
        throw new ApiError(300, "playlist id is missing")
    }
    const updatedated = await Playlist.findByIdAndUpdate(
        playlistId, {
        $set: {
            name: name,
            description: description ? description : ''
        }
    }, {
        new: true
    }
    )
    if (!updatedated) {
        throw new ApiError(301, "Falied to update the name and playlist")
    }
    return res.status(200).json(new Apiresponse(200, updatedated, "playlist updated sucessfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}