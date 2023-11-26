const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/SecureFileTransferdb')
// mongoose.connect('mongodb://localhost:27017/SecureFileTransferdb', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 })
// mongoose.connect('mongodb://localhost:27017/SecureFileTransferdb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 30000,
//   poolSize: 10, // Adjust this value based on your needs
// })

// .then(() => console.log('Connected to MongoDB...'))
// .catch(err => console.error('Could not connect to MongoDB...'))

// const mongoose = require('mongoose');

const connectionStr = 'mongodb+srv://jooyu9882:ps1yBigwedwN9LFp@cluster0.wecd5ai.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const userSchema = new mongoose.Schema({//schema is use to design structure of document
    msg:{
        type:String,
        required:true,
    }
});

const collection = new mongoose.model('new Collection',userSchema);//model is use to create collection

module.exports = collection;