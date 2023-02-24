const express = require('express');
const router = express.Router();

const {
  register,
  login,
} = require('../services/authService');

const {asyncWrapper} = require('../utils/apiUtils');

const {registrationValidator} = require('../middlewares/validationMidlleware');

router.post(
    '/register',
    registrationValidator,
    asyncWrapper(async (req, res) => {
      const {
        email,
        password,
        role,
      } = req.body;
      await register({email, password, role});

      res.json({message: 'Profile created successfully'});
    }),
);

router.post('/login', asyncWrapper(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const token = await login({email, password});

  res.json({jwt_token: token});
}));

module.exports = {
  authRouter: router,
};
