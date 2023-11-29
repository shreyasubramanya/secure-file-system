// // const ldap = require('ldapjs');

// // const client = ldap.createClient({
// //   url: 'ldap://10.211.55.9', //adjust the URL based on your LDAP server configuration
// // });

// // client.bind('uid=john,ou=people,dc=example,dc=com', 'admin', (err) => {
// //   if (err) {
// //     console.error('LDAP bind failed:', err);
// //   } else {
// //     console.log('LDAP bind successful');

// //     //perform LDAP operations here
// //     /**
// //  * Authenticate a user against the LDAP server.
// //  * @param {string} username - The username of the user.
// //  * @param {string} password - The password of the user.
// //  * @param {function} callback - A callback function to handle the response.
// //  */
// // function authenticateUser(username, password, callback) {
// //   //adjust the DN (Distinguished Name) based on your LDAP server configuration
// //   const userDN = `uid=${username},ou=people,dc=example,dc=com`;

// //   client.bind(userDN, password, (err) => {
// //     if (err) {
// //       console.error('LDAP authentication failed:', err);
// //       callback(false); //authentication failed
// //     } else {
// //       console.log('LDAP authentication successful');
// //       callback(true); //authentication successful
// //       client.unbind();
// //     }
// //   });
// // }

// // //example usage
// // authenticateUser('john', 'admin', (isAuthenticated) => {
// //   if (isAuthenticated) {
// //     console.log('User login successful');
// //     //handle post-login logic here
// //   } else {
// //     console.log('User login failed');
// //     //handle login failure here
// //   }
// // });
// //   }
// // });

// ////////


// const express = require('express');
// const ldap = require('ldapjs');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json()); // for parsing application/json

// // LDAP client configuration
// const client = ldap.createClient({
//   url: 'ldap://10.211.55.9', //adjust the URL based on your LDAP server configuration
// });

// // LDAP authentication function
// function authenticateUser(username, password, callback) {
//   const userDN = `uid=${username},ou=people,dc=example,dc=com`;

//   client.bind(userDN, password, (err) => {
//     if (err) {
//       console.error('LDAP authentication failed:', err);
//       callback(false);
//     } else {
//       console.log('LDAP authentication successful');
//       callback(true);
//       client.unbind();
//     }
//   });
// }

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   authenticateUser(username, password, (isAuthenticated) => {
//     if (isAuthenticated) {
//       res.status(200).send('User login successful');
//     } else {
//       res.status(401).send('User login failed');
//     }
//   });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const ldap = require('ldapjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept');
  next();
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
