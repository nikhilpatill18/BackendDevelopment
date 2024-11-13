import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import multer from "multer";
import { createPlaylist, getUserPlaylists } from "../controllers/playlist.controller.js";

const playlistroute = Router();
playlistroute.use(verifyJWT)

playlistroute.route("/createplaylist").post(createPlaylist)
playlistroute.route("/getuserplaylist/:userId").post(getUserPlaylists)

export default playlistroute;