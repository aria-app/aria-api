const Admin = require('../../Admin');

module.exports = {
  firstName: (user) => user.first_name,
  isAdmin: async (user) => !!(await Admin.model.findOneByUserId(user.id)),
  lastName: (user) => user.last_name,
};
