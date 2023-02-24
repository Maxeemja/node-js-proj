module.exports.loadStates = [
  'En route to Pick Up',
  'Arrived to Pick Up',
  'En route to delivery',
  'Arrived to delivery',
];

module.exports.loadStatus = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  SHIPPED: 'SHIPPED',
};
module.exports.DRIVER = 'DRIVER';
module.exports.SHIPPER = 'SHIPPER';

module.exports.TRUCK_TYPES = {
  'SPRINTER': {
    payload: 1700,
  },
  'SMALL STRAIGHT': {
    payload: 2500,
  },
  'LARGE STRAIGHT': {
    payload: 4000,
  },
};
