const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

exports.uploadFiles = upload.array('files[]'), (req, res) => {
  // Handle file upload here
  // req.files contains uploaded files
  res.status(200).send('File uploaded successfully');
};
