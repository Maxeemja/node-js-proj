const {Truck} = require('../models/truckModel');

const getTrucksByUserId = async (userId) => {
  const trucks = await Truck.find(
      {created_by: userId},
      {__v: false},
  );
  return trucks;
};

const addTruckToUser = async (userId, type) => {
  const truck = new Truck({
    type,
    created_by: userId,
  });

  truck.save();
};

const getTruckById = async (truckId, userId) => {
  const truck = await Truck.findOne(
      {created_by: userId, _id: truckId},
      {__v: false},
  );
  return truck;
};

const updateTruckById = async (truckId, userId, payload) => {
  const updatedTruck = Truck.findOneAndUpdate(
      {_id: truckId, created_by: userId},
      {...payload},
  );

  return updatedTruck;
};

const deleteTruckById = async (truckId, userId) => {
  const deletedTruck = Truck.findOneAndDelete(
      {created_by: userId, _id: truckId},
  );

  return deletedTruck;
};

const assignTruckToUser = async (truckId, userId) => {
  const assignedTrucks = await Truck.find({assigned_to: userId});
  if (assignedTrucks.length > 0) {
    return {message: 'User has already assigned truck to him'};
  }

  const assignedTruck = await Truck.findOneAndUpdate(
      {_id: truckId, created_by: userId, assigned_to: {$exists: false}},
      {assigned_to: userId},
  );

  return {assignedTruck};
};

module.exports = {
  getTrucksByUserId,
  addTruckToUser,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  assignTruckToUser,
};
