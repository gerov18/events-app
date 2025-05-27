import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'events',
    transformation: [{ width: 1200, crop: 'limit' }],
    allowedFormats: ['jpeg', 'png', 'jpg'],
  }),
});

export const uploadToCloudinary = multer({ storage: cloudinaryStorage });
