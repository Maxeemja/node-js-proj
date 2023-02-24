const express = require('express');
const router = express.Router();
const {InvalidRequestError} = require('../utils/errors');

const {
  getUserById,
  deleteUserById,
  changeUserPassword,
} = require('../services/usersService');
const {
  asyncWrapper,
} = require('../utils/apiUtils');

router.get('/me', asyncWrapper(async (req, res) => {
  const {userId} = req.user;

  const user = await getUserById(userId);

  if (!user) {
    throw new InvalidRequestError('No user was found!');
  }

  res.json({user});
}));

router.delete('/me', asyncWrapper(async (req, res) => {
  const {userId} = req.user;

  const deletedUser = await deleteUserById(userId);

  if (!deletedUser) {
    throw new InvalidRequestError('No user with such id found!');
  }

  res.json({message: 'Profile deleted successfully'});
}));

router.patch('/me', asyncWrapper(async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  const {userId} = req.user;

  await changeUserPassword({userId, oldPassword, newPassword});

  res.json({message: 'Password changed successfully'});
}));

module.exports = {usersRouter: router};
