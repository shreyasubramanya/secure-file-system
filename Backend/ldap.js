const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const path = require('path');
const FileModel = require('./mongo');
const fs = require('fs');
const templatePath = path.join(__dirname, '../templates');

user = 'user';

const app = express();

const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.use(express.static('Frontend'));
app.use(bodyParser.json()); // for parsing application/json
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept');
  next();
});

app.set('view engine','hbs');
app.set('views', templatePath);

// app.get('/', (req, res) => {
//     res.render('login');
//   });

app.get('/', (req, res) => {
    res.render('home');
  });

//mongoDB connection
//mongoose.connect('mongodb+srv://shreyasubramanya:Ar56YfIApVmWwLYW@cluster0.u2erbxi.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(() => console.log('MongoDB connected...'))
  // .catch(err => console.error('MongoDB connection error:', err));
const mongoose = require('mongoose');
const connectionStr = 'mongodb+srv://kasiparimal:hKzLOFvPxuaGDiYg@cluster0.goqfart.mongodb.net/?retryWrites=true&w=majority';


//LDAP client configuration
// const client = ldap.createClient({
//   url: 'ldap://10.211.55.9', //ldap server URL
// });


//map out group permissions
// const groupPermissions = {
//     'upload only': ['upload'],
//     'full access': ['upload', 'download', 'delete', 'view']
// };

// function logAudit(action, username, fileName) {
//   const timestamp = new Date().toISOString();
//   const logMessage = `${timestamp} - User ${username} ${action} ${fileName}\n`;

//   fs.appendFile('audit_log.txt', logMessage, (err) => {
//     if (err) {
//       console.error('Error writing to audit log:', err);
//     }
//   });
// }

// function authenticateUser(username, password, callback) {
//   const userDN = `uid=${username},ou=people,dc=example,dc=com`;
//   user = `uid=${username},ou=people,dc=example,dc=com`;

//   client.bind(userDN, password, (err) => {
//       if (err) {
//           console.error('LDAP authentication failed:', err);
//           callback(false, null);
//       } else {
//           console.log('LDAP authentication successful');

//           // Define search base for the user and a simple filter
//           const searchBase = userDN;
//           const searchFilter = `(uid=${username})`;

//           client.search(searchBase, { filter: searchFilter, scope: 'base' }, (err, res) => {
//               if (err) {
//                   console.error('LDAP search error:', err);
//                   client.unbind();
//                   callback(false, null);
//                   return;
//               }

//               let gidNumber = null;
//               res.on('searchEntry', (entry) => {
//                 console.log('LDAP entry:', entry.object); // Additional logging
//                   if (entry.object && entry.object.gidNumber) {
//                       gidNumber = entry.object.gidNumber;
//                   }
//               });

//               res.on('end', (result) => {
//                   console.log(`User ${username} has gidNumber: ${gidNumber}`);
//                   client.unbind();
//                   callback(true, gidNumber); // Return the gidNumber
//               });
//           });
//       }
//   });
// }

// // Function to search for a user and get gidNumber
// function getGidNumber(username, callback) {
//     // Bind to LDAP server with a valid user if needed
//     client.bind('cn=admin,dc=example,dc=com', 'admin', (err) => {
//         if (err) {
//             console.error('LDAP bind failed:', err);
//             return callback(err, null);
//         }

//         // Define search base and filter
//         const searchBase = 'ou=people,dc=example,dc=com'; // Adjust based on your directory structure
//         const searchFilter = `(uid=${username})`; // Filter to search for the specific user

//         client.search(searchBase, { filter: searchFilter, scope: 'sub' }, (err, res) => {
//             if (err) {
//                 console.error('LDAP search error:', err);
//                 return callback(err, null);
//             }

//             let gidNumber = null;

//             res.on('searchEntry', (entry) => {
//                 if (entry.object && entry.object.gidNumber) {
//                     gidNumber = entry.object.gidNumber;
//                     console.log(gidNumber);
//                 }
//             });

//             res.on('end', () => {
//                 client.unbind(); // Unbind after search operation
//                 callback(null, gidNumber);
//             });
//         });
//     });
// }

// // Example usage
// getGidNumber('john', (err, gidNumber) => {
//     if (err) {
//         console.error('Error:', err);
//     } else {
//         console.log(`User john's gidNumber: ${gidNumber}`);
//     }
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   authenticateUser(username, password, (isAuthenticated, gidNumber) => {
//       if (isAuthenticated) {
//           console.log(`User: ${username}, gidNumber: ${gidNumber}`);

//           // Determine the features based on gidNumber
//           let features;
//           // Here, you need to map gidNumbers to specific features or roles
//           // For example, if gidNumber is for 'upload only' group
//           req.body.username = username;
//           if (gidNumber === 5002) {
//               features = 'uploadOnly';
//           } else {
//               features = 'fullAccess'; // Default or other specific roles
//           }

//           // Send response with appropriate features
//           res.status(200).json({ message: 'User login successful', features: features });
//       } else {
//           res.status(401).send('User login failed');
//       }
//   });
// });


app.post('/uploadFile', async (req, res) => {
    console.log(req.files);

    const username = req.body.username;

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
      //logAudit('uploaded', user, fileName);

      res.send('File uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  });
  
  app.get('/downloadFile/', async (req, res) => {
    const fileName = req.query.fileName;
  
    try {
      const file = await FileModel.findOne({ fileName: fileName });
    
      if (!file) {
        return res.status(404).send('File not found');
      }
  
      const filePath = file.filePath;
      res.download(filePath, fileName);
      //logAudit('downloaded', user, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Error downloading file');
    }
  });

  
  app.post('/list', async (req, res) => {
    console.log("hello im file");
    try {
      const files = await FileModel.find();
      console.log(files);
      res.send(files);
      // res.json(files);

    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).send('Error retrieving files');
    }
  });

  app.post('/deleteFile', async (req, res) => {
    const fileName = req.body.fileName;
  
    try {
      const result = await FileModel.deleteOne({ fileName: fileName });
  
      if (result.deletedCount === 1) {
        res.send('File deleted successfully');
        //logAudit('deleted', user, fileName);

      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send('Error deleting file');
    }
  });

  app.get('/list', async (req, res) => {
    try {
      const files = await FileModel.find();
      console.log(files);
      res.send(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).send('Error retrieving files');
    }
  });
  
app.use(express.static('Frontend'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
