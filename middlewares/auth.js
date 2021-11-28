const userServices = require('../services/users');
const rolesServices = require('../services/roles');
const auth = require('../modules/auth');

const isOwnUser = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const userToken = req.headers.authorization;
    const usuarioToken = auth.decodeToken(userToken);
    const userTokenId = usuarioToken.id;

    if (userTokenId) {
      if (Number.parseInt(userId) === userTokenId) return next();
    }
    const user = await userServices.getById(userTokenId);
    if (user) {
      const adminUser = await rolesServices.getByName('Admin');
      if (user.dataValues.roleId === adminUser.id) return next();
    }
    const e = new Error('not authorized');
    throw e;
  } catch (e) {
    next(e);
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.header('auth-token');
  const adminRole = await rolesServices.getByName('Admin');

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const user = auth.decodeToken(token);

    if (user.roleId !== adminRole.id) return res.status(401).json({ error: 'Access denied' });
    next();
  } catch (error) {
    res.status(400).json({ error: 'token no es válido' });
  }
};

module.exports = {
  isAdmin,
  isOwnUser

};
