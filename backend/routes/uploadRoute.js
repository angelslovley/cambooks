const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const uploadController = require('../controllers/uploadController');

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), uploadController.uploadFiles);

module.exports = router;
