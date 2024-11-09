import { v2 as cloudinary } from "cloudinary"

import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});
// let localFilePath = "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"

const uploadoncloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        //upload file on cloudinary
        let response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        // file uploaded sucessfully
        // console.log("File uploaded successfully", response.url)
        // console.log("File uploaded successfully", response)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        //deleting the file from the local server
        fs.unlinkSync(localFilePath)
    }

}
export { uploadoncloudinary }