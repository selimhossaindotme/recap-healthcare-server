import multer from 'multer';
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../config';
import crypto from 'crypto'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), '/uploads'))
  },
  filename: function (req, file, cb) {
    const  randomName = crypto.randomBytes(16).toString('hex')
    cb(null, file.fieldname + '-' + randomName)
  }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: Express.Multer.File) => {
    cloudinary.config({ 
        cloud_name: envVars.cloudinary.name as string,
        api_key: envVars.cloudinary.api_key as string,
        api_secret: envVars.cloudinary.api_secret as string
    });

    // upload an image to cloudinary
    const uploadedResult = await 
    cloudinary.uploader
    .upload(
        file.path, {
            public_id: file.filename
        }
    )
    .catch(error=>{
        console.log(error)
    })

    return uploadedResult;

}

export const fileUploader = {
    upload,
    uploadToCloudinary
}

