const model = require('./model');

async function findOrCreateUser({ auth0Id }) {
  const user = await model.findOne({ auth0Id });

  if (user) {
    return user;
  }

  const newUser = new model({
    auth0Id,
  });

  newUser.save();

  return newUser;
}

module.exports = {
  findOrCreateUser,
};
