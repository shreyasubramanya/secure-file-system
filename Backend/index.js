const express = require('express');
const app = express();
const path = require('path');
const collection = require('./mongo');
const templatePath = path.join(__dirname, '../templates');//giving path to html file

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');
app.set('views', templatePath);

app.get('/', (req, res) => {
    res.render('home');
});

// app.post('/sendMsg', async (req, res) => {
//     const msg = req.body.msg;
//     await collection.insertMany([{msg}]);
//     res.send('Message sent successfully');
// })
app.post('/sendMsg', async (req, res) => {
    const msg = req.body.msg;
    try {
      await collection.create({ msg });
      res.redirect('/');
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message');
    }
  });

  
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000/');
});