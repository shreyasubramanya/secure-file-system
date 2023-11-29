const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');
const path = require('path');
const FileModel = require('./mongo');
const templatePath = path.join(__dirname, '../templates');

const fileUpload = require('express-fileupload');
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

//mongodb connection
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shreyasubramanya:Ar56YfIApVmWwLYW@cluster0.u2erbxi.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


//LDAP client configuration
const client = ldap.createClient({
  url: 'ldap://10.211.55.9', //ldap server URL
});

//LDAP authentication function
function authenticateUser(username, password, callback) {
  const userDN = `uid=${username},ou=people,dc=example,dc=com`;

  client.bind(userDN, password, (err) => {
    if (err) {
      console.error('LDAP authentication failed:', err);
      callback(false);
    } else {
      console.log('LDAP authentication successful');
      callback(true); 
      client.unbind();
    }
  });
}

//Login endpoint
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
