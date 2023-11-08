const express = require('express');
const multer = require('multer'); // For handling file uploads
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure file upload using Multer
const upload = multer({ dest: 'uploads/' });

// Serve the HTML and static files
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/files.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    // Store the uploaded file information as needed
    const uploadedFile = req.file;
    console.log('File uploaded:', uploadedFile.originalname);
    res.status(200).send('File uploaded successfully');
  } else {
    res.status(400).send('No file uploaded');
  }
});

// Handle file deletion
app.post('/delete', (req, res) => {
  const fileNameToDelete = req.body.file;
  if (fileNameToDelete) {
    fs.unlink(`uploads/${fileNameToDelete}`, (err) => {
      if (err) {
        console.error('Failed to delete file:', err);
        res.status(500).send('Failed to delete file');
      } else {
        console.log('File deleted:', fileNameToDelete);
        res.status(200).send('File deleted successfully');
      }
    });
  } else {
    res.status(400).send('No file selected for deletion');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
