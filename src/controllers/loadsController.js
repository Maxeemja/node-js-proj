const express = require('express');
const {InvalidRequestError} = require('../utils/errors');
const {loadStatus} = require('../const');
const {grantAccess} = require('../utils/roles');
const {loadCreationValidation} = require('../middlewares/validationMidlleware');
const {
  addLoadToUser,
  getLoads,
  getActiveLoad,
  setNextLoadState,
  updateLoadById,
  getLoadById,
  deleteLoadById,
  postLoad,
  getShippingInfo,
} = require('../services/loadService');

const router = express.Router();

const {asyncWrapper} = require('../utils/apiUtils');

router.get('/', asyncWrapper(async (req, res) => {
  const {
    status=Object.keys(loadStatus),
    limit=10,
    offset=0,
  } = req.query;
  const {role, userId} = req.user;
  const {loads, count} = await getLoads({
    userId,
    status: status,
    role,
    limit: Number(limit),
    offset: Number(offset),
  });

  return res.json({loads, count});
}));

router.get('/active', asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const activeLoad = await getActiveLoad(userId);

  res.json({load: activeLoad});
}));

router.get('/:loadId', grantAccess('readOwn', 'loads'), asyncWrapper(async (req, res) => {
  const {loadId} = req.params;
  const {userId} = req.user;

  const load = await getLoadById(loadId, userId);

  if (!load) throw new InvalidRequestError('Coudn\'t find this load');

  return res.json({load});
}));

router.post('/', grantAccess('createOwn', 'loads'), loadCreationValidation, asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  await addLoadToUser(req.body, userId);

  res.json({message: 'Load created successfully'});
}));

router.patch(
    '/active/state',
    grantAccess('updateOwn', 'activeLoad'),
    asyncWrapper(async (req, res) => {
      const {userId} = req.user;

      const {newState, message} = await setNextLoadState(userId);

      if (message) throw new InvalidRequestError(message);

      res.json({message: `Load state changed to ${newState}`});
    }));

router.put('/:loadId', grantAccess('updateOwn', 'loads'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {loadId} = req.params;

  // only loads with [status: 'NEW'] can be updated
  const load = await updateLoadById({loadId, userId, payload: req.body});

  if (!load) throw new InvalidRequestError('Couldn\'t find that load');

  res.json({message: 'Load details changed successfully'});
}));

router.delete('/:loadId', grantAccess('deleteOwn', 'loads'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {loadId} = req.params;

  const deletedLoad = await deleteLoadById(loadId, userId);

  if (!deletedLoad) throw new InvalidRequestError('Couldn\'t find load to delete');

  res.json({message: 'Load deleted successfully'});
}));

router.post('/:loadId/post', grantAccess('updateOwn', 'loads'), asyncWrapper(async (req, res) => {
  const {userId} = req.user;
  const {loadId} = req.params;

  const isDriverFound = await postLoad(loadId, userId);

  res.json({
    message: isDriverFound ? 'Load posted successfully' : 'Load not posted',
    driver_found: isDriverFound,
  });
}));

router.get(
    '/:loadId/shipping_info',
    grantAccess('readOwn', 'loads'),
    asyncWrapper(async (req, res) => {
      const {userId} = req.user;
      const {loadId} = req.params;

      const {truck, load, message} = await getShippingInfo(loadId, userId);
      if (message) {
        throw new InvalidRequestError(message);
      }

      res.json({load, truck});
    }));

module.exports = {loadsRouter: router};
