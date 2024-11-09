// require('dotenv').config({ path: './env' })
import dotenv from 'dotenv'
import connectdb from "./db/index.js";
import app from './app.js';
dotenv.config({
    path: './env'
})
connectdb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`)
        })
        app.get('/login', (req, res) => {
            res.send('hello')
        })
        app.get('/api/jokes', (req, res) => {
            res.send("jokes")
        })
    })
    .catch((err) => {
        console.log("data base connection error", err);

    })