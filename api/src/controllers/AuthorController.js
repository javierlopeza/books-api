import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Author } from '../models';

const responseBuilder = new ResponseBuilder();

class AuthorController {
  static async index(req, res) {
    const allAuthors = await Author.findAll();
    responseBuilder.setSuccess(200, 'Authors retrieved', allAuthors);
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
    const { author } = req.state;
    const alteredAuthor = req.body;
    try {
      await author.update(alteredAuthor);
      const updatedAuthor = await Author.findOne({ where: { id: author.id } });
      responseBuilder.setSuccess(200, 'Author updated', updatedAuthor);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { author } = req.state;
    responseBuilder.setSuccess(200, 'Found Author', author);
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    const { author } = req.state;
    await author.destroy();
    responseBuilder.setSuccess(200, 'Author deleted');
    return responseBuilder.send(res);
  }
}

export default AuthorController;
