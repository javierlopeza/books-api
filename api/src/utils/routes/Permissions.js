import ResponseBuilder from '../controllers/ResponseBuilder';

const responseBuilder = new ResponseBuilder();

function isLoggedIn(req, res, next) {
  if (!req.currentUser) {
    responseBuilder.setError(401, 'Please log in first');
    return responseBuilder.send(res);
  }
  return next();
}

function isSelf(req, res, next) {
  if (!req.currentUser) {
    responseBuilder.setError(401, 'Please log in first');
    return responseBuilder.send(res);
  }
  if (!req.theUser) {
    responseBuilder.setError(500, 'Permission check should only be used to compare with requested user');
    return responseBuilder.send(res);
  }
  if (req.theUser.id !== req.currentUser.id) {
    responseBuilder.setError(403, 'You are not allowed to get this user data');
    return responseBuilder.send(res);
  }
  return next();
}

export {
  isLoggedIn,
  isSelf,
};
