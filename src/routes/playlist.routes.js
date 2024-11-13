import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import multer from "multer";
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, deletePlaylist } from "../controllers/playlist.controller.js";

const playlistroute = Router();
playlistroute.use(verifyJWT)

playlistroute.route("/createplaylist").post(createPlaylist)
playlistroute.route("/getuserplaylist/:userId").post(getUserPlaylists)
playlistroute.route("/getuserplaylistbyid/:playlistId").post(getPlaylistById)
playlistroute.route("/addvideotoplaylist/:playlistId/:videoId").post(addVideoToPlaylist)
playlistroute.route("/deleteplaylist/:playlistId").post(deletePlaylist)

export default playlistroute;