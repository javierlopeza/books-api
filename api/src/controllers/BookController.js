import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Book } from '../models';

const responseBuilder = new ResponseBuilder();

class BookController {
  static async index(req, res) {
    try {
      const allBooks = await Book.findAll();
      responseBuilder.setSuccess(200, 'Books retrieved', allBooks);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async create(req, res) {
    const newBook = req.body;
    try {
      const createdBook = await Book.create(newBook);
      responseBuilder.setSuccess(201, 'Book created', createdBook);
    } catch (error) {
      responseBuilder.setError(400, error.message);
    }
    return responseBuilder.send(res);
  }

  static async update(req, res) {
    const { theBook } = req;
    const alteredBook = req.body;
    try {
      await Book.update(alteredBook, { where: { id: theBook.id } });
      const updatedBook = await Book.findOne({ where: { id: theBook.id } });
      responseBuilder.setSuccess(200, 'Book updated', updatedBook);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { theBook } = req;
    responseBuilder.setSuccess(200, 'Found Book', theBook);
    return responseBuilder.send(res);
  }

  static async destroy(req, res) {
    const { theBook } = req;

    try {
      await Book.destroy({ where: { id: theBook.id } });
      responseBuilder.setSuccess(200, 'Book deleted');
    } catch (error) {
      responseBuilder.setError(400, error);
    }

    return responseBuilder.send(res);
  }
}

export default BookController;
