const { Schema } = require('mongoose');

module.exports = new Schema({
  auth0Id: { type: String, required: true },
  email: String,
  firstName: String,
  lastName: String,
});
