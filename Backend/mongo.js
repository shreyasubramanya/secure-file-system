const mongoose = require('mongoose');
// const connectionStr = 'mongodb+srv://jooyu9882:ps1yBigwedwN9LFp@cluster0.wecd5ai.mongodb.net/?retryWrites=true&w=majority';
// const connectionStr = 'mongodb+srv://shreyasubramanya:Ar56YfIApVmWwLYW@cluster0.u2erbxi.mongodb.net/?retryWrites=true&w=majority';
const connectionStr = 'mongodb+srv://kasiparimal:hKzLOFvPxuaGDiYg@cluster0.goqfart.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;
