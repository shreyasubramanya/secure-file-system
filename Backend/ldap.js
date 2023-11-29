// const ldap = require('ldapjs');

// const client = ldap.createClient({
//   url: 'ldap://10.211.55.9', //adjust the URL based on your LDAP server configuration
// });

// client.bind('uid=john,ou=people,dc=example,dc=com', 'admin', (err) => {
//   if (err) {
//     console.error('LDAP bind failed:', err);
//   } else {
//     console.log('LDAP bind successful');

//     //perform LDAP operations here
//     /**
//  * Authenticate a user against the LDAP server.
//  * @param {string} username - The username of the user.
//  * @param {string} password - The password of the user.
//  * @param {function} callback - A callback function to handle the response.
//  */
// function authenticateUser(username, password, callback) {
//   //adjust the DN (Distinguished Name) based on your LDAP server configuration
//   const userDN = `uid=${username},ou=people,dc=example,dc=com`;

//   client.bind(userDN, password, (err) => {
//     if (err) {
//       console.error('LDAP authentication failed:', err);
//       callback(false); //authentication failed
//     } else {
//       console.log('LDAP authentication successful');
//       callback(true); //authentication successful
//       client.unbind();
//     }
//   });
// }

// //example usage
// authenticateUser('john', 'admin', (isAuthenticated) => {
//   if (isAuthenticated) {
//     console.log('User login successful');
//     //handle post-login logic here
//   } else {
//     console.log('User login failed');
//     //handle login failure here
//   }
// });
//   }
// });

// ////////

const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const path = require('path');
const FileModel = require('./mongo');
const templatePath = path.join(__dirname, '../templates');

const app = express();
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

app.get('/', (req, res) => {
    res.render('login');
  });

app.get('/home', (req, res) => {
    res.render('home');
  });

// LDAP client configuration
const client = ldap.createClient({
  url: 'ldap://10.211.55.9', // adjust the URL based on your LDAP server configuration
});

// LDAP authentication function
function authenticateUser(username, password, callback) {
  const userDN = `uid=${username},ou=people,dc=example,dc=com`;

  client.bind(userDN, password, (err) => {
    if (err) {
      console.error('LDAP authentication failed:', err);
      callback(false);
      //window.location.reload();
    } else {
      console.log('LDAP authentication successful');
      callback(true); 
      client.unbind();
    }
  });
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  authenticateUser(username, password, (isAuthenticated) => {
    if (isAuthenticated) {
      res.status(200).send('User login successful');
    } else {
      res.status(401).send('User login failed');
    }
  });
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

  app.post('/deleteFile', async (req, res) => {
    const fileName = req.body.fileName;
  
    try {
      const result = await FileModel.deleteOne({ fileName: fileName });
  
      if (result.deletedCount === 1) {
        res.send('File deleted successfully');
      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).send('Error deleting file');
    }
  });

app.use(express.static('Frontend'));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
