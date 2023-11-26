// const express = require('express');
// const multer = require('multer');
// const app = express();
// const port = 3000;
// console.log("you are running backend");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// // Serve static files from the 'uploads' folder
// app.use('/uploads', express.static('uploads'));

// app.post('/upload', upload.single('file'), (req, res) => {
//     // Handle file upload logic here
//     // You can save file metadata or perform other operations
//     res.json({ message: 'File uploaded successfully!' });
// });

// app.delete('/delete/:filename', (req, res) => {
//     const filename = req.params.filename;
//     // Handle file deletion logic here, e.g., using fs.unlink
//     res.json({ message: `File ${filename} deleted successfully!` });
// });

// app.get('/fileList', (req, res) => {
//     // Return the list of files as JSON
//     res.json([
//         // Your list of files goes here
//         // Example: { name: 'file1.txt', size: 1024, type: 'text/plain' }
//     ]);
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
