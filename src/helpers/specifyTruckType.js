const {TRUCK_TYPES} = require('../const');
module.exports.specifyTruckType = ({dimensions, payload}) => {
  for (const type of Object.keys(TRUCK_TYPES)) {
    const typeStats = TRUCK_TYPES[type];
    if (
      typeStats.payload >= Number(payload) ||
      typeStats.width >= Number(dimensions.width) ||
      typeStats.height >= Number(dimensions.height) ||
      typeStats.length >= Number(dimensions.length)
    ) return type;
  }
};

