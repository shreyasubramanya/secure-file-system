// // const express = require('express');
// // const app = express();
// // const path = require('path');
// // const collection = require('./mongo');
// // const templatePath = path.join(__dirname, '../templates');//giving path to html file

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));

// // app.set('view engine', 'hbs');
// // app.set('views', templatePath);

// // app.get('/', (req, res) => {
// //   res.render('home');
// // });

// // app.post('/sendMsg', async (req, res) => {
// //   const msg = req.body.msg;
// //   try {
// //     await collection.create({ msg });
// //     res.redirect('/');
// //   } catch (error) {
// //     console.error('Error sending message:', error);
// //     res.status(500).send('Error sending message');
// //   }
// // });

// // app.post('/uploadFile', async (req, res) => {
// //   try {
// //     if (!req.files || !req.files.file) {
// //       return res.status(400).send('No file uploaded');
// //     }
    
// //     const file = req.files.file;
// //     const fileName = file.name;
// //     const filePath = path.join(__dirname, '../public/uploads/', fileName);
    
// //     await file.mv(filePath);
// //     await collection.create({ fileName, filePath });
    
// //     res.send('File uploaded successfully');
// //   } catch (error) {
// //     console.error('Error uploading file:', error);
// //     res.status(500).send('Error uploading file');
// //   }
// // });

// // app.listen(3000, () => {
// //   console.log('Server is running on port http://localhost:3000/');
// // });

// const express = require('express');
// const app = express();
// const path = require('path');
// const fileUpload = require('express-fileupload'); // Import express-fileupload
// const collection = require('./mongo');
// const templatePath = path.join(__dirname, '../templates');

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(fileUpload()); // Use express-fileupload middleware

// app.set('view engine', 'hbs');
// app.set('views', templatePath);

// app.get('/', (req, res) => {
//   res.render('home');
// });

// app.post('/sendMsg', async (req, res) => {
//   const msg = req.body.msg;
//   try {
//     await collection.create({ msg });
//     res.redirect('/');
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).send('Error sending message');
//   }
// });

// app.post('/uploadFile', async (req, res) => {
//   try {
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No file uploaded');
//     }
    
//     const file = req.files.file;
//     const fileName = file.name;
//     const filePath = path.join(__dirname, '../public/uploads/', fileName);
//     const msg = 'File uploaded: ' + fileName; // Add a message for the 'msg' field

//     await file.mv(filePath);
//     await collection.create({ fileName, filePath, msg });
    
//     res.send('File uploaded successfully');
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).send('Error uploading file');
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is running on port http://localhost:3000/');
// });
const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const FileModel = require('./mongo');
const templatePath = path.join(__dirname, '../templates');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.set('view engine', 'hbs');
app.set('views', templatePath);

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/sendMsg', async (req, res) => {
  const msg = req.body.msg;
  try {
    await FileModel.create({ msg });
    res.redirect('/');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

app.post('/uploadFile', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file uploaded');
    }

    const file = req.files.file;
    const fileName = file.name;
    const filePath = path.join(__dirname, '../public/uploads/', fileName);
    const msg = 'File uploaded: ' + fileName;

    await file.mv(filePath);
    await FileModel.create({ fileName, filePath, msg });

    res.send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000/');
});

app.get('/files', async (req, res) => {
  try {
    const files = await FileModel.find();
    console.log(files);
    res.send(files);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).send('Error retrieving files');
  }
});
