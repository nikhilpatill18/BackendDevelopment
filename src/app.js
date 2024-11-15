import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: process.env.CORS_ORGIN,
    Credential: true,
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import Userrouter from './routes/user.routes.js'
import videoroute from './routes/video.routes.js'
import tweetrouter from './routes/tweet.routes.js'
import subrouter from './routes/subscription.routes.js'
import playlistrouter from './routes/playlist.routes.js'
// for user register
app.use('/api/v1/users', Userrouter)  // for this the url look like this ' http://localhost:8000/api/v1/users/register
app.use('/api/v1/users', videoroute)
app.use('/api/v1/users', tweetrouter)
app.use('/api/v1/users', subrouter)
app.use('/api/v1/users', playlistrouter)

export default app