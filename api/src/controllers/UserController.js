import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { User } from '../models';

const responseBuilder = new ResponseBuilder();

class UserController {
  static async index(req, res) {
    try {
      const allUsers = await User.findAll();
      responseBuilder.setSuccess(200, 'Users retrieved', allUsers);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
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
    const { theUser } = req;
    const alteredUser = req.body;
    try {
      await User.update(alteredUser, { where: { id: theUser.id } });
      const updatedUser = await User.findOne({ where: { id: theUser.id } });
      responseBuilder.setSuccess(200, 'User updated', updatedUser);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { theUser } = req;
    responseBuilder.setSuccess(200, 'Found User', theUser);
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    const { theUser } = req;

    try {
      await User.destroy({ where: { id: theUser.id } });
      responseBuilder.setSuccess(200, 'User deleted');
    } catch (error) {
      responseBuilder.setError(400, error);
    }

    return responseBuilder.send(res);
  }
}

export default UserController;
