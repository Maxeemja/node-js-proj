const AccessControl = require('accesscontrol');

const ac = new AccessControl();

const roles = (function() {
  ac.grant('DRIVER')
      .createOwn('trucks')
      .readOwn('trucks')
      .updateOwn('trucks')
      .deleteOwn('trucks')
      .readOwn('activeLoad')
      .updateOwn('activeLoad');

  ac.grant('SHIPPER')
      .createOwn('loads')
      .readOwn('loads')
      .updateOwn('loads')
      .deleteOwn('loads');

  return ac;
})();

module.exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(403).json({
          error: 'You don\'t have enough permission to perform this action',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
