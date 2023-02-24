const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('../models/userModel');

const register = async ({email, password, role}) => {
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    role,
  });
  await user.save();
};

const login = async ({email, password}) => {
  const user = await User.findOne({email});

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  return jwt.sign({
    _id: user._id,
    email: user.email,
    role: user.role,
  }, 'secret', {expiresIn: '1d'});
};

module.exports = {
  register,
  login,
};
