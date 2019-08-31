import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Author } from '../models';

const responseBuilder = new ResponseBuilder();

class AuthorController {
  static async index(req, res) {
    try {
      const allAuthors = await Author.findAll();
      responseBuilder.setSuccess(200, 'Authors retrieved', allAuthors);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async create(req, res) {
    const newAuthor = req.body;
    try {
      const createdAuthor = await Author.create(newAuthor);
      responseBuilder.setSuccess(201, 'Author created', createdAuthor);
    } catch (error) {
      responseBuilder.setError(400, error.message);
    }
    return responseBuilder.send(res);
  }

  static async update(req, res) {
    const { theAuthor } = req;
    const alteredAuthor = req.body;
    try {
      await Author.update(alteredAuthor, { where: { id: theAuthor.id } });
      const updatedAuthor = await Author.findOne({ where: { id: theAuthor.id } });
      responseBuilder.setSuccess(200, 'Author updated', updatedAuthor);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { theAuthor } = req;
    responseBuilder.setSuccess(200, 'Found Author', theAuthor);
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    const { theAuthor } = req;

    try {
      await Author.destroy({ where: { id: theAuthor.id } });
      responseBuilder.setSuccess(200, 'Author deleted');
    } catch (error) {
      responseBuilder.setError(400, error);
    }

    return responseBuilder.send(res);
  }
}

export default AuthorController;
