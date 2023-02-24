const {TRUCK_TYPES} = require('../const');
module.exports.specifyTruckType = ({payload}) => {
  for (const type of Object.keys(TRUCK_TYPES)) {
    const typeStats = TRUCK_TYPES[type];
    if (
      typeStats.payload >= Number(payload)
    ) return type;
  }
};

