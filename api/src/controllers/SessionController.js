import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { User } from '../models';

const responseBuilder = new ResponseBuilder();

class SessionController {
  static async create(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && await user.checkPassword(password)) {
      req.session.userId = user.id;
      responseBuilder.setSuccess(201, 'Logged in');
    } else {
      responseBuilder.setError(401, 'Incorrect email or password');
    }
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    req.session = null;
    responseBuilder.setSuccess(200, 'Logged out');
    return responseBuilder.send(res);
  }
}

export default SessionController;
