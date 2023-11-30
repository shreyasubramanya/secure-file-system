const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const path = require('path');
const FileModel = require('./mongo');
const fs = require('fs');
const templatePath = path.join(__dirname, '../templates');
const app = express();
const fileUpload = require('express-fileupload');

//mongoDB connection
//mongoose.connect('mongodb+srv://shreyasubramanya:Ar56YfIApVmWwLYW@cluster0.u2erbxi.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('MongoDB connected...'))
// .catch(err => console.error('MongoDB connection error:', err));
const mongoose = require('mongoose');
const connectionStr = 'mongodb+srv://kasiparimal:hKzLOFvPxuaGDiYg@cluster0.goqfart.mongodb.net/?retryWrites=true&w=majority';  

//declare user as global variable for auditing function
user = 'user';
passwd = 'password';

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

app.get('/', (req, res) => {
    res.render('login');
  });

app.get('/home', (req, res) => {
    res.render('home');
  });


//LDAP client configuration
const client = ldap.createClient({
  url: 'ldap://10.211.55.9', //ldap server URL
});


//map out group permissions
const groupPermissions = {
    'upload only': ['upload'],
    'full access': ['upload', 'download', 'delete', 'view']
};

//audit functionality
function logAudit(action, username, fileName) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - User ${username} ${action} ${fileName}\n`;

  fs.appendFile('audit_log.txt', logMessage, (err) => {
    if (err) {
      console.error('Error writing to audit log:', err);
    }
  });
}

function authenticateUser(username, password, callback) {
  const userDN = `uid=${username},ou=People,dc=example,dc=com`;

  user = `uid=${username},ou=People,dc=example,dc=com`;

  client.bind(userDN, password, (err) => {
      if (err) {
          console.error('LDAP authentication failed:', err);
          callback(false, 'Download Only');
      } else {
          console.log('LDAP authentication successful for user:', username);

          // Define search base for groups and filter for checking group membership
          const searchBase = 'ou=Groups,dc=example,dc=com';
          const searchFilter = `(&(objectClass=posixGroup)(cn=full access)(memberUid=${username}))`;

          console.log(`Searching in: ${searchBase} with filter: ${searchFilter}`);

          client.search(searchBase, { filter: searchFilter, scope: 'sub' }, (err, res) => {
              if (err) {
                  console.error('LDAP search error:', err);
                  client.unbind();
                  callback(false, 'Download Only');
                  return;
              }

              let isFullAccess = false;

              res.on('searchEntry', (entry) => {
                  console.log('Found LDAP entry:', entry.object);
                  if (entry.object && entry.object.cn === 'full access') {
                      console.log('Full access group found for user:', username);
                      isFullAccess = true;
                  }
              });

              res.on('end', (result) => {
                  client.unbind();
                  let accessLevel = isFullAccess ? 'Full Access' : 'Download Only';
                  console.log(`User ${username} has access level: ${accessLevel}`);
                  callback(true, accessLevel); // Return the access level
              });
          });
      }
  });
}

// Login request handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  authenticateUser(username, password, (isAuthenticated, accessLevel) => {
      if (isAuthenticated) {
          console.log(`User: ${username}, Access Level: ${accessLevel}`);

          // Send response with appropriate features based on access level
          res.status(200).json({ message: 'User login successful', features: accessLevel });
      } else {
          res.status(401).send('User login failed');
      }
  });
});

//upload file functionality
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
      logAudit('uploaded', user, fileName);

      res.send('File uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  });
  
  //download file functionality
  app.get('/downloadFile/', async (req, res) => {
    const fileName = req.query.fileName;
  
    try {
      const file = await FileModel.findOne({ fileName: fileName });
    
      if (!file) {
        return res.status(404).send('File not found');
      }
  
      const filePath = file.filePath;
      res.download(filePath, fileName);
      logAudit('downloaded', user, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).send('Error downloading file');
    }
  });

  //retrieves files from mongoDB
  app.get('/files', async (req, res) => {
    try {
      const files = await FileModel.find({}, 'fileName'); // Select only the fileName field
      res.json(files.map(file => ({ fileName: file.fileName })));
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).send('Error retrieving files');
    }
  });

  //delete file functionality
  app.post('/deleteFile', async (req, res) => {
    const fileName = req.body.fileName;
  
    try {
      const result = await FileModel.deleteOne({ fileName: fileName });
  
      if (result.deletedCount === 1) {
        res.send('File deleted successfully');
        logAudit('deleted', user, fileName);

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
