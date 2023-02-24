
const {Load} = require('../models/loadModel');
const {Truck} = require('../models/truckModel');
const {loadStatus, DRIVER, SHIPPER, loadStates} = require('../const');
const {specifyTruckType} = require('../helpers/specifyTruckType');
const addLoadToUser = async (loadInfo, userId) => {
  const load = new Load({...loadInfo, created_by: userId});

  load.save();
};

const getShipperLoads = async ({
  userId,
  status,
  limit,
  offset,
}) => {
  const count = await Load.count({created_by: userId, status});
  const loads = await Load
      .find({created_by: userId, status}, {__v: false})
      .skip(offset)
      .limit(limit);

  return {loads, count};
};

const getDriverLoads = async ({
  userId,
  limit,
  offset,
}) => {
  const count = await Load.count({
    assigned_to: userId,
    status: [loadStatus.ASSIGNED, loadStatus.SHIPPED],
  });
  const loads = await Load
      .find({
        assigned_to: userId,
        status: [loadStatus.ASSIGNED, loadStatus.SHIPPED],
      }, {__v: false})
      .skip(offset)
      .limit(limit);

  return {loads, count};
};

const getLoads = async ({
  userId,
  status,
  limit,
  offset,
  role,
}) => {
  switch (role) {
    case DRIVER:
      return await getDriverLoads({userId, limit, offset});
    case SHIPPER:
      return await getShipperLoads({userId, limit, offset, status});
  }
};

const getActiveLoad = async (userId) => {
  const activeLoad = await Load.findOne(
      {assigned_to: userId, status: loadStatus.ASSIGNED},
      {__v: false},
  );
  return activeLoad;
};

const setNextLoadState = async (userId) => {
  const loadToChange = await Load.findOne({
    assigned_to: userId,
    status: loadStatus.ASSIGNED,
  });
  if (!loadToChange) return {message: 'Load was not found'};

  const newState = loadStates[loadStates.indexOf(loadToChange.state)+1];

  if (!newState) return {message: `Load already has ${loadToChange.state} state`};

  if (newState === loadStates[3]) {
    loadToChange.status = loadStatus.SHIPPED;
    const truckToChange = await Truck.findOne({
      assigned_to: userId,
      status: 'WORKING'
    })
    truckToChange.status = 'IDLE'
    truckToChange.save()
  }

  loadToChange.state = newState;
  loadToChange.save();
  return {newState};
};

const updateLoadById = async ({loadId, userId, payload}) => {
  const beforeUpdatedLoad = await Load.findOneAndUpdate({
    _id: loadId,
    created_by: userId,
    status: 'NEW',
  }, payload);

  return beforeUpdatedLoad;
};

const getLoadById = async (loadId, userId) => {
  const load = await Load.findOne(
      {_id: loadId, created_by: userId},
      {__v: false},
  );

  return load;
};

const deleteLoadById = async (loadId, userId) => {
  const deletedLoad = await Load.findOneAndDelete({
    _id: loadId,
    created_by: userId,
  });

  return deletedLoad;
};

const postLoad = async (loadId, userId) => {
  const load = await getLoadById(loadId, userId);
  const truckType = specifyTruckType({
    payload: load.payload,
  });

  const truck = await Truck.findOne({
    status: 'IDLE',
    assigned_to: {$exists: true},
    type: truckType,
  });

  if (!truck) return false;

  truck.status = 'WORKING';
  truck.save();

  load.status = loadStatus.ASSIGNED;
  load.state = loadStates[0];
  load.assigned_to = truck.assigned_to;
  load.logs.push({
    message: `Load was assigned to driver with id: ${truck.assigned_to}`,
  });
  load.save();

  return true;
};

const getShippingInfo = async (loadId, userId) => {
  const load = await getLoadById(loadId, userId);

  if (load.status !== loadStatus.ASSIGNED) {
    return {
      message: `Load has status: ${load.status}`,
    };
  }

  const truck = await Truck.findOne(
      {assigned_to: load.assigned_to},
      {__v: false},
  );

  return {
    load,
    truck,
  };
};

module.exports = {
  addLoadToUser,
  getLoads,
  getActiveLoad,
  setNextLoadState,
  updateLoadById,
  getLoadById,
  deleteLoadById,
  postLoad,
  getShippingInfo,
};
