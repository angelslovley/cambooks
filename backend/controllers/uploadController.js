exports.uploadFiles = (req, res) => {
  console.log("req", req.files['pdf'])
  try {
    

    const imageFile = req.files['image'];
    const pdfFile = req.files['pdf'];
    
    // You can perform further processing with the files here, such as saving them to a database or storage

    res.status(200).send('Files uploaded successfully');
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files', error });
  }
};
