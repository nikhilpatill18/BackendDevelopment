import { createTweet } from "../controllers/tweet.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";

const tweetrouter = Router();
tweetrouter.use(verifyJWT)
tweetrouter.route("/tweets").post(createTweet)


export default tweetrouter