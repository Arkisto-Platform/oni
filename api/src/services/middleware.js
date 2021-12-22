import { UnauthorizedError, ForbiddenError } from 'restify-errors';
import { loadConfiguration, verifyToken } from './configuration';

function route(handler) {
  return [ demandAuthenticatedUser, handler ];
}

function routeAdmin(handler) {
  return [ demandAuthenticatedUser, demandAdministrator, handler ];
}

async function demandAuthenticatedUser(req, res, next) {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError());
  }
  const configuration = await loadConfiguration();
  try {
    let user = await verifyToken({
      token: req.headers.authorization.split("Bearer ")[1],
      configuration,
    });
    req.session = {
      user,
    };
  } catch (error) {
    return next(new UnauthorizedError());
  }
  next();
}

async function demandAdministrator(req, res, next) {
  if (!req.session.user.administrator) {
    return next(new ForbiddenError());
  }
  next();
}

module.exports = {
  route,
  routeAdmin,
  demandAuthenticatedUser,
  demandAdministrator
}

