import mongoose from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asyncHandler.js"


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
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
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