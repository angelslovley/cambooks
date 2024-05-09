const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dveixzfmp',
  api_key: '352642756527164',
  api_secret: 'Ua02gb4u6hhfCtYvsX2NJTSnlRE'
});


exports.uploadFiles = (req, res) => {
  console.log("req", req.files['pdf'])
  try {
    const pdfFile = req.files['pdf'][0]; // Assuming you're using multer to handle file uploads
    
    // Upload the PDF file to Cloudinary
    cloudinary.uploader.upload(pdfFile.path, function(error, result) {
      if (error) {
        console.error('Error uploading file to Cloudinary:', error);
        res.status(500).json({ message: 'Error uploading file to Cloudinary', error });
      } else {
        console.log('File uploaded to Cloudinary successfully:', result);
        // Return the URL of the uploaded file as the path
        res.status(200).json({ message: 'File uploaded successfully', path: `https://console.cloudinary.com/console/c-92035c0a95144bae5da5b7eea25e8b/media_library/search/asset/${result.asset_id}/manage?q=&view_mode=mosaic&context=manage` });
      }
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files', error });
  }
};
