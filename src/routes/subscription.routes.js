import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import multer from "multer";
import { getSubscribedChannels } from "../controllers/subscription.controller.js";

const subrouter = Router()
subrouter.use(verifyJWT)
subrouter.route('/getsubscribedchannels/:subscriberId').post(getSubscribedChannels)

export default subrouter