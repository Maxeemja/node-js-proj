const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const {authRouter} = require('./controllers/authController');
const {usersRouter} = require('./controllers/usersController');
const {trucksRouter} = require('./controllers/trucksController');
const {loadsRouter} = require('./controllers/loadsController');

const {authMiddleware} = require('./middlewares/authMiddleware');
const {NodeCourseError} = require('./utils/errors');

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/users', [authMiddleware], usersRouter);
app.use('/api/trucks', [authMiddleware], trucksRouter);
app.use('/api/loads', [authMiddleware], loadsRouter);

app.use((req, res, next) => {
  res.status(404).json({message: 'Not found'});
});

app.use((err, req, res, next) => {
  if (err instanceof NodeCourseError) {
    return res.status(err.status).json({message: err.message});
  }
  res.status(500).json({message: err.message});
});

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://IO-02MAX:mxmj@io-02-hrytsiuk.k5to5rp.mongodb.net/test-db?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(8080);
    console.log('...Connected');
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();
