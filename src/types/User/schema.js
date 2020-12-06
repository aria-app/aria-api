const { Schema } = require('mongoose');

module.exports = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
});
