import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { User } from '../models';

const responseBuilder = new ResponseBuilder();

class UserController {
  static async index(req, res) {
    const allUsers = await User.findAll();
    responseBuilder.setSuccess(200, 'Users retrieved', allUsers);
    return responseBuilder.send(res);
  }

  static async create(req, res) {
    const newUser = req.body;
    try {
      const createdUser = await User.create(newUser);
      responseBuilder.setSuccess(201, 'User created', createdUser);
    } catch (error) {
      responseBuilder.setError(400, error.message);
    }
    return responseBuilder.send(res);
  }

  static async update(req, res) {
    const { user } = req.state;
    const alteredUser = req.body;
    try {
      await user.update(alteredUser);
      const updatedUser = await User.findOne({ where: { id: user.id } });
      responseBuilder.setSuccess(200, 'User updated', updatedUser);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { user } = req.state;
    responseBuilder.setSuccess(200, 'Found User', user);
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    const { user } = req.state;
    await user.destroy();
    responseBuilder.setSuccess(200, 'User deleted');
    return responseBuilder.send(res);
  }
}

export default UserController;
