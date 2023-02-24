module.exports.loadStates = [
  'En route to Pick Up',
  'Arrived to Pick Up',
  'En route to delivery',
  'Arrived to delivery',
];

module.exports.loadStatus = {
  NEW: 'NEW',
  POSTED: 'POSTED',
  ASSIGNED: 'ASSIGNED',
  SHIPPED: 'SHIPPED',
};
module.exports.DRIVER = 'DRIVER';
module.exports.SHIPPER = 'SHIPPER';

module.exports.TRUCK_TYPES = {
  'SPRINTER': {
    width: 300,
    length: 250,
    height: 170,
    payload: 1700,
  },
  'SMALL STRAIGHT': {
    width: 500,
    length: 250,
    height: 170,
    payload: 2500,
  },
  'LARGE STRAIGHT': {
    width: 700,
    length: 350,
    height: 200,
    payload: 4000,
  },
};
