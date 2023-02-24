const {User} = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {InvalidRequestError} = require('../utils/errors');

const getUserById = async (userId) => {
  const userInfo = await User.findOne(
      {_id: userId},
      {__v: false, password: false},
  );
  return userInfo;
};

const deleteUserById = async (userId) => {
  const deletedUser = await User.findOneAndDelete({_id: userId});
  return deletedUser;
};

const changeUserPassword = async ({userId, oldPassword, newPassword}) => {
  const user = await User.findOne({_id: userId}, 'password');

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new InvalidRequestError('Invalid password');
  }

  const updatedUser = await User.findOneAndUpdate(
      {_id: userId},
      {password: await bcrypt.hash(newPassword, 10)},
  );

  return updatedUser;
};

module.exports = {
  getUserById,
  deleteUserById,
  changeUserPassword,
};
