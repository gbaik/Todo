const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/notes`);

const db = mongoose.connection;
const Schema = mongoose.Schema;

db.on('error', (err) => console.error('connection error:', err));

db.once('open', () => console.log('Mongodb connected'));

var todoSchema = new Schema({
  // Tags: String,
});

var profileSchema = new Schema({
  first: String,
  last: String,
  email: String
});

var authSchema = new Schema({
  oauth_id: String,
  password: String,
  salt: String
});

module.exports.Todo = mongoose.model('Todo', todoSchema);
module.exports.Profile = mongoose.model('Profile', profileSchema);
module.exports.Auth = mongoose.model('Auth', authSchema);

