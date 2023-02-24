const express = require('express');
const {InvalidRequestError} = require('../utils/errors');

const {
  getTrucksByUserId,
  addTruckToUser,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  assignTruckToUser,
} = require('../services/trucksService');

const {grantAccess} = require('../utils/roles');

const router = express.Router();

const {asyncWrapper} = require('../utils/apiUtils');

router.get('/', grantAccess('readOwn', 'trucks'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;

  const trucks = await getTrucksByUserId(userId);

  res.json({trucks});
}));

router.post('/', grantAccess('createOwn', 'trucks'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {type} = req.body;

  if (!type) {
    throw new InvalidRequestError(
        'Please, include \'type\' parameter to request body',
    );
  }
  await addTruckToUser(userId, type);

  res.json({message: 'Truck created successfully'});
}));

router.get('/:truckId', grantAccess('readOwn', 'trucks'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {truckId} = req.params;

  const truck = await getTruckById(truckId, userId);

  if (!truck) {
    return res.status(400).json({message: 'Truck was not found'});
  }

  res.json({truck});
}));

router.put('/:truckId', grantAccess('updateOwn', 'trucks'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {truckId} = req.params;
  const payload = req.body;

  const truck = await updateTruckById(truckId, userId, payload);

  if (!truck) {
    return res.status(400).json({message: 'Truck was not found'});
  }

  res.json({truck});
}));

router.delete('/:truckId', grantAccess('deleteOwn', 'trucks'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {truckId} = req.params;

  const truck = await deleteTruckById(truckId, userId);

  if (!truck) {
    return res.status(400).json({message: 'Truck was not found'});
  }


  res.json({message: 'Truck deleted successfully'});
}));

router.post(
    '/:truckId/assign',
    grantAccess('updateOwn', 'trucks'),
    asyncWrapper(async (req, res) => {
      const {userId} = req.user;
      const {truckId} = req.params;

      const {message} = await assignTruckToUser(truckId, userId);

      if (message) {
        throw new InvalidRequestError(message);
      }

      res.json({message: 'Truck assigned successfully'});
    }));

module.exports = {trucksRouter: router};
