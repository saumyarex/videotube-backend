import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploadingToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return "File not found";

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (response) {
      console.log("File has been uploaded successfully at :", response.url);
      fs.unlinkSync(localFilePath);
      return response;
    }
  } catch (error) {
    //removing file from server
    fs.unlinkSync(localFilePath);
    console.log("upload error", error);
    return error;
  }
};

export { fileUploadingToCloudinary };
