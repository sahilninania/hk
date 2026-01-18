const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',                      // this is the name of the folder which will be saved in cloudinary. 
    allowedFormats: ['jpg', 'jpeg', 'png'],        // make sure to write allowedFormats if we are allowing 2 or more formats.
  },
});

module.exports = {
    cloudinary,
    storage,
};
// ab jo hamne ye dono exports kiye hai hum inhe routes wale listing.js mai use karenge.