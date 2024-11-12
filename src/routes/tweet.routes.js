import { createTweet } from "../controllers/tweet.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import multer from "multer";

const tweetrouter = Router();
tweetrouter.use(verifyJWT)
tweetrouter.use(multer().none()) // multer middle ware used to parse the form data through the postman
tweetrouter.route("/tweets").post(createTweet)


export default tweetrouter