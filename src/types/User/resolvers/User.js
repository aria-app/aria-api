module.exports = {
  firstName: (user) => user.first_name,
  isAdmin: (user, args, { models }) =>
    models.Admin.findOneByUserId(user.id).then((admin) => !!admin),
  lastName: (user) => user.last_name,
};
